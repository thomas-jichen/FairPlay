import { useState, useEffect, useCallback } from 'react'

export default function useCountdown(from = 3) {
  const [count, setCount] = useState(null)
  const [isActive, setIsActive] = useState(false)

  const start = useCallback(() => {
    setCount(from)
    setIsActive(true)
  }, [from])

  useEffect(() => {
    if (!isActive || count === null || count <= 0) {
      if (count === 0) setIsActive(false)
      return
    }

    const timeout = setTimeout(() => {
      setCount((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [isActive, count])

  return {
    count,
    isActive,
    isDone: count === 0,
    start,
  }
}
