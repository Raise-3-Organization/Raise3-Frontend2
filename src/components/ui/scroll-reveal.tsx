"use client"

import type React from "react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

export const ScrollReveal = ({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.5,
  once = true,
  distance = 50,
}: {
  children: React.ReactNode
  className?: string
  direction?: "up" | "down" | "left" | "right"
  delay?: number
  duration?: number
  once?: boolean
  distance?: number
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: "-100px 0px" })

  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  }

  const initial = { opacity: 0, ...directionMap[direction] }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : initial}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  )
}
