"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowDown, AudioWaveformIcon as Waveform } from "lucide-react"

export function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [oscillator, setOscillator] = useState<OscillatorNode | null>(null)

  useEffect(() => {
    return () => {
      if (oscillator) {
        oscillator.stop()
      }
    }
  }, [oscillator])

  const handlePlayDemo = () => {
    if (isPlaying && oscillator) {
      oscillator.stop()
      setIsPlaying(false)
      return
    }

    const context = audioContext || new AudioContext()
    if (!audioContext) {
      setAudioContext(context)
    }

    const osc = context.createOscillator()
    const gain = context.createGain()

    osc.type = "sine"
    osc.frequency.value = 440

    gain.gain.value = 0.1

    osc.connect(gain)
    gain.connect(context.destination)

    osc.start()
    setOscillator(osc)
    setIsPlaying(true)

    // Stop after 2 seconds
    setTimeout(() => {
      osc.stop()
      setIsPlaying(false)
    }, 2000)
  }

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/20 to-indigo-900/20" />
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-violet-500/10 to-indigo-500/10"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, Math.random() + 0.5, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex items-center justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <Waveform size={64} className="text-violet-400" />
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Dijital Ses Sentezi
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            FM ve Fiziksel Modelleme sentez yöntemlerini keşfedin, karşılaştırın ve interaktif olarak deneyimleyin.
          </motion.p>

          <motion.p
            className="text-md md:text-lg text-zinc-400 max-w-3xl mx-auto mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Bu proje <span className="text-violet-400 font-medium">Yiğit Burak Yazıcı</span> ve{" "}
            <span className="text-indigo-400 font-medium">Kaan Özyurt</span> tarafından geliştirilmiştir.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <Button
              size="lg"
              variant="outline"
              className="border-violet-500 text-violet-400 hover:bg-violet-950/50"
              onClick={() => {
                document.getElementById("methods")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Keşfet
              <ArrowDown className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
        <ArrowDown className="h-6 w-6 text-zinc-500" />
      </div>
    </div>
  )
}
