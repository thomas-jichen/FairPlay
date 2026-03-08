function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export class PaceAnalyzer {
  constructor(options = {}) {
    this.options = {
      envelopeTauMs: options.envelopeTauMs ?? 32,
      noiseFloorRiseTauMs: options.noiseFloorRiseTauMs ?? 2200,
      noiseFloorDropTauMs: options.noiseFloorDropTauMs ?? 220,
      thresholdOffset: options.thresholdOffset ?? 0.016,
      floorMin: options.floorMin ?? 0.004,
      speechRange: options.speechRange ?? 0.03,
      speechLevelTauMs: options.speechLevelTauMs ?? 110,
      speechOnThreshold: options.speechOnThreshold ?? 0.3,
      speechOffThreshold: options.speechOffThreshold ?? 0.13,
      pauseSpeechLevel: options.pauseSpeechLevel ?? 0.035,
      speechAttackMs: options.speechAttackMs ?? 90,
      speechReleaseMs: options.speechReleaseMs ?? 360,
      peakMargin: options.peakMargin ?? 0.006,
      peakRefractoryMs: options.peakRefractoryMs ?? 120,
      shortRateTauMs: options.shortRateTauMs ?? 820,
      longRateTauMs: options.longRateTauMs ?? 3600,
      targetSyllableRate: options.targetSyllableRate ?? 3.25,
      personalRateTauMs: options.personalRateTauMs ?? 12000,
      personalRateWeight: options.personalRateWeight ?? 0.12,
      speedRangeScale: options.speedRangeScale ?? 1.6,
      absRateSpan: options.absRateSpan ?? 0.95,
      trendSpan: options.trendSpan ?? 1.0,
      scoreTauMs: options.scoreTauMs ?? 1100,
      pauseScoreTauMs: options.pauseScoreTauMs ?? 500,
      silenceSlowStartMs: options.silenceSlowStartMs ?? 300,
      silenceSlowFullMs: options.silenceSlowFullMs ?? 1300
    };

    this.reset();
  }

  reset() {
    this.envelope = 0;
    this.prevEnvelope = 0;
    this.prevSlope = 0;
    this.noiseFloor = 0.008;
    this.speechLevel = 0;
    this.speaking = false;
    this.speechOnForMs = 0;
    this.speechOffForMs = 0;
    this.shortRate = 0;
    this.longRate = 0;
    this.personalRate = this.options.targetSyllableRate;
    this.lastPeakAtMs = -Infinity;
    this.lastVoiceAtMs = -Infinity;
    this.score = -1;
    this.lastUpdateAtMs = null;
  }

  alphaForMs(deltaMs, tauMs) {
    return 1 - Math.exp(-deltaMs / Math.max(1, tauMs));
  }

  update(rms, nowMs = performance.now()) {
    const value = clamp(Number.isFinite(rms) ? rms : 0, 0, 1);
    const deltaMs =
      this.lastUpdateAtMs == null ? 16.67 : Math.max(1, nowMs - this.lastUpdateAtMs);

    const envAlpha = this.alphaForMs(deltaMs, this.options.envelopeTauMs);
    this.envelope += envAlpha * (value - this.envelope);

    const floorTauMs =
      this.envelope < this.noiseFloor
        ? this.options.noiseFloorDropTauMs
        : this.options.noiseFloorRiseTauMs;
    const floorAlpha = this.alphaForMs(deltaMs, floorTauMs);
    this.noiseFloor += floorAlpha * (this.envelope - this.noiseFloor);

    const speechThreshold = Math.max(
      this.options.floorMin,
      this.noiseFloor + this.options.thresholdOffset
    );
    const speechRaw = clamp(
      (this.envelope - speechThreshold) / Math.max(0.001, this.options.speechRange),
      0,
      1
    );
    const speechAlpha = this.alphaForMs(deltaMs, this.options.speechLevelTauMs);
    this.speechLevel += speechAlpha * (speechRaw - this.speechLevel);

    if (this.speechLevel >= this.options.speechOnThreshold) {
      this.speechOnForMs += deltaMs;
      this.speechOffForMs = 0;
    } else if (this.speechLevel <= this.options.speechOffThreshold) {
      this.speechOffForMs += deltaMs;
      this.speechOnForMs = 0;
    } else {
      this.speechOnForMs = 0;
      this.speechOffForMs = 0;
    }

    if (!this.speaking && this.speechOnForMs >= this.options.speechAttackMs) {
      this.speaking = true;
      this.speechOnForMs = 0;
    } else if (this.speaking && this.speechOffForMs >= this.options.speechReleaseMs) {
      this.speaking = false;
      this.speechOffForMs = 0;
    }

    if (this.speechLevel > this.options.speechOffThreshold) {
      this.lastVoiceAtMs = nowMs;
    }

    const shortDecay = Math.exp(-deltaMs / this.options.shortRateTauMs);
    const longDecay = Math.exp(-deltaMs / this.options.longRateTauMs);
    this.shortRate *= shortDecay;
    this.longRate *= longDecay;

    // Peak detector: count syllable-like nuclei when the envelope turns downward above threshold.
    const slope = this.envelope - this.prevEnvelope;
    const peakThreshold = speechThreshold + this.options.peakMargin;
    const peakDetected =
      this.prevSlope > 0 &&
      slope <= 0 &&
      this.prevEnvelope >= peakThreshold &&
      nowMs - this.lastPeakAtMs >= this.options.peakRefractoryMs &&
      this.speechLevel > this.options.speechOffThreshold;

    if (peakDetected) {
      this.lastPeakAtMs = nowMs;
      this.shortRate += 1000 / this.options.shortRateTauMs;
      this.longRate += 1000 / this.options.longRateTauMs;
    }

    if (this.speechLevel > this.options.speechOnThreshold && this.longRate > 0.5) {
      const personalAlpha = this.alphaForMs(deltaMs, this.options.personalRateTauMs);
      this.personalRate += personalAlpha * (this.longRate - this.personalRate);
    }

    const effectiveTarget =
      (1 - this.options.personalRateWeight) * this.options.targetSyllableRate +
      this.options.personalRateWeight * this.personalRate;

    const scaledAbsSpan = this.options.absRateSpan * this.options.speedRangeScale;
    const scaledTrendSpan = this.options.trendSpan * this.options.speedRangeScale;
    const absScore = clamp(
      (this.shortRate - effectiveTarget) / scaledAbsSpan,
      -1,
      1
    );
    const trendScore = clamp(
      (this.shortRate - this.longRate) / scaledTrendSpan,
      -1,
      1
    );
    const rawScore = clamp(0.78 * absScore + 0.22 * trendScore, -1, 1);

    const silenceMs = nowMs - this.lastVoiceAtMs;
    const silenceStart = this.options.silenceSlowStartMs;
    const silenceFull = this.options.silenceSlowFullMs;
    const silenceProgress = clamp(
      (silenceMs - silenceStart) / Math.max(1, silenceFull - silenceStart),
      0,
      1
    );
    const pauseLike =
      this.speechLevel < this.options.pauseSpeechLevel ||
      (!this.speaking && silenceMs > silenceStart);
    const pauseAdjusted = pauseLike
      ? rawScore * (1 - silenceProgress) + -1 * silenceProgress
      : rawScore;

    const scoreTauMs = pauseLike ? this.options.pauseScoreTauMs : this.options.scoreTauMs;
    const scoreAlpha = this.alphaForMs(deltaMs, scoreTauMs);
    this.score += scoreAlpha * (pauseAdjusted - this.score);

    this.prevSlope = slope;
    this.prevEnvelope = this.envelope;
    this.lastUpdateAtMs = nowMs;

    return {
      score: this.score,
      speaking: this.speaking,
      speechLevel: this.speechLevel,
      shortRate: this.shortRate,
      longRate: this.longRate,
      effectiveTarget,
      rawScore: pauseAdjusted
    };
  }
}
