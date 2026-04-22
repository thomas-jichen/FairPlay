import { motion } from 'framer-motion'
import posterImg from '../../../assets/images/misc/poster.png'
import { staggerContainer, fadeInUp } from '../animations'

const CHIPS = [
  { label: 'Posture', value: 'Good', tone: 'emerald' },
  { label: 'Pace', value: '142 WPM', tone: 'emerald' },
  { label: 'Eye Contact', value: 'Strong', tone: 'emerald' },
  { label: 'Gestures', value: 'Moderate', tone: 'amber' },
]

const CHIP_STYLES = {
  emerald: 'bg-emerald-50 border border-emerald-200 text-emerald-700',
  amber: 'bg-amber-50 border border-amber-200 text-amber-700',
}

function CardHeader({ icon, label }) {
  return (
    <div className="flex items-center gap-1.5 mb-2">
      <div className="w-4 h-4 rounded bg-black/5 flex items-center justify-center">
        {icon}
      </div>
      <span className="type-caption text-[10px] text-text-muted">{label}</span>
    </div>
  )
}

export default function MultimodalDemo() {
  return (
    <>
      <style>{`
        @keyframes float-a { 0%,100% { transform: translateY(0) rotate(-1.5deg); } 50% { transform: translateY(-10px) rotate(-2.5deg); } }
        @keyframes float-b { 0%,100% { transform: translateY(0) rotate(1deg); } 50% { transform: translateY(8px) rotate(2deg); } }
        @keyframes float-c { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-7px) rotate(0.8deg); } }
      `}</style>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="relative h-[420px] w-full max-w-[520px] ml-auto"
      >
        {/* Abstract card — medium, top-left area */}
        <motion.div
          variants={fadeInUp}
          className="glass-panel rounded-2xl p-4 shadow-lg absolute top-0 left-[2%] w-[62%] z-10 opacity-95"
          style={{ animation: 'float-a 6s ease-in-out infinite' }}
        >
          <CardHeader
            label="Abstract"
            icon={
              <svg className="w-2.5 h-2.5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            }
          />
          <div className="text-[8px] text-text-secondary leading-snug opacity-80">
            Chiral orbital currents (COC) circulating along the edges of the crystal unit cells underpin an array of novel phenomena in ferrimagnetic Mn3Si2Te6. Two types of inductances are well known, namely, geometrical and kinetic inductance. The former arises from a changing magnetic flux inside a coil that generates an electromotive force (emf) to oppose the change; the latter results from the kinetic energy needed by each electron that contributes to a current flowing in a superconductor. Here, I report a novel type of quantum inductance that originates from coherent COC enabled by a combined effect of a rising, low frequency alternating current (AC) and a constant magnetic field applied along the magnetic hard c-axis. The coherent COC, along with induced orbital moments, rigidly couple to the lattice and act as an effective, atomic-scale &ldquo;coil&rdquo; that induces a large emf in response to decreasing AC. The COC &ldquo;coil&rdquo; is also responsible for strong diamagnetic responses, which are unprecedented in any magnets, and a distinct drop in electrical resistivity below 5 K. The phenomenon of inductance is widely used in today&rsquo;s technology. The significance of this discovery cannot be overstated, both fundamentally and technologically.
          </div>
        </motion.div>

        {/* Poster card — largest, right-center area */}
        <motion.div
          variants={fadeInUp}
          className="glass-panel rounded-2xl p-3 shadow-xl absolute top-[90px] right-0 w-[68%] z-20"
          style={{ animation: 'float-b 7s ease-in-out 1s infinite' }}
        >
          <CardHeader
            label="Poster"
            icon={
              <svg className="w-2.5 h-2.5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            }
          />
          <div className="rounded-lg overflow-hidden flex items-center justify-center border border-black/5 bg-white">
            <img src={posterImg} alt="Poster" className="w-full h-auto object-cover" />
          </div>
        </motion.div>

        {/* Analysis card — smallest, bottom-left */}
        <motion.div
          variants={fadeInUp}
          className="glass-panel rounded-xl p-3 shadow-lg absolute bottom-0 left-[8%] w-[52%] z-30"
          style={{ animation: 'float-c 5s ease-in-out 2s infinite' }}
        >
          <CardHeader
            label="Real-time Analysis"
            icon={
              <svg className="w-2.5 h-2.5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
              </svg>
            }
          />
          <div className="grid grid-cols-2 gap-1.5">
            {CHIPS.map((chip) => (
              <div
                key={chip.label}
                className="flex items-center justify-between rounded-md bg-white/40 border border-white/60 px-2 py-1"
              >
                <span className="text-[9px] text-text-muted tracking-tight">{chip.label}</span>
                <span
                  className={`type-caption rounded-full px-1.5 py-[1px] text-[8px] ${CHIP_STYLES[chip.tone]}`}
                >
                  {chip.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}
