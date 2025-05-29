"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2 } from "lucide-react"

export function SoundGallery() {
  const [playingSound, setPlayingSound] = useState<string | null>(null)
  const [audioElements, setAudioElements] = useState<{ [key: string]: HTMLAudioElement }>({})

  const fmSounds = [
    {
      id: "fm-basic",
      name: "FM Temel",
      description: "Temel FM sentez parametreleri ile üretilen ses",
      file: "/placeholder.svg?height=100&width=100",
      parameters: "Taşıyıcı: 440Hz, Modülatör: 440Hz, Mod. İndeksi: 5.0",
    },
    {
      id: "fm-mod-5",
      name: "FM Mod. İndeks 5",
      description: "Orta seviye modülasyon indeksi ile üretilen FM sesi",
      file: "/placeholder.svg?height=100&width=100",
      parameters: "Taşıyıcı: 440Hz, Modülatör: 440Hz, Mod. İndeksi: 5.0",
    },
    {
      id: "fm-mod-10",
      name: "FM Mod. İndeks 10",
      description: "Yüksek modülasyon indeksi ile üretilen zengin FM sesi",
      file: "/placeholder.svg?height=100&width=100",
      parameters: "Taşıyıcı: 440Hz, Modülatör: 440Hz, Mod. İndeksi: 10.0",
    },
    {
      id: "fm-ratio-2",
      name: "FM Oran 2:1",
      description: "2:1 taşıyıcı/modülatör oranı ile üretilen harmonik FM sesi",
      file: "/placeholder.svg?height=100&width=100",
      parameters: "Taşıyıcı: 440Hz, Modülatör: 220Hz, Mod. İndeksi: 5.0",
    },
  ]

  const physicalSounds = [
    {
      id: "physical-basic",
      name: "Fiziksel Temel",
      description: "Temel fiziksel modelleme parametreleri ile üretilen tel sesi",
      file: "/placeholder.svg?height=100&width=100",
      parameters: "Frekans: 440Hz, Sönümleme: 0.005, Germe: 0.9",
    },
    {
      id: "physical-damp-low",
      name: "Düşük Sönümleme",
      description: "Düşük sönümleme faktörü ile uzun süren tel sesi",
      file: "/placeholder.svg?height=100&width=100",
      parameters: "Frekans: 440Hz, Sönümleme: 0.001, Germe: 0.9",
    },
    {
      id: "physical-damp-high",
      name: "Yüksek Sönümleme",
      description: "Yüksek sönümleme faktörü ile kısa süren tel sesi",
      file: "/placeholder.svg?height=100&width=100",
      parameters: "Frekans: 440Hz, Sönümleme: 0.01, Germe: 0.9",
    },
    {
      id: "physical-stretch-low",
      name: "Düşük Germe",
      description: "Düşük germe faktörü ile esnek tel sesi",
      file: "/placeholder.svg?height=100&width=100",
      parameters: "Frekans: 440Hz, Sönümleme: 0.005, Germe: 0.8",
    },
  ]

  const playSound = (soundId: string) => {
    // Stop any currently playing sound
    if (playingSound && audioElements[playingSound]) {
      audioElements[playingSound].pause()
      audioElements[playingSound].currentTime = 0
    }

    if (playingSound === soundId) {
      setPlayingSound(null)
      return
    }

    // Create a simple tone using Web Audio API for demo purposes
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    // Different frequencies for different sounds to simulate variety
    const frequencies: { [key: string]: number } = {
      "fm-basic": 440,
      "fm-mod-5": 440,
      "fm-mod-10": 440,
      "fm-ratio-2": 440,
      "physical-basic": 440,
      "physical-damp-low": 440,
      "physical-damp-high": 440,
      "physical-stretch-low": 440,
    }

    oscillator.frequency.setValueAtTime(frequencies[soundId] || 440, audioContext.currentTime)
    oscillator.type = soundId.startsWith("fm") ? "sawtooth" : "triangle"

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2)

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.start()
    oscillator.stop(audioContext.currentTime + 2)

    setPlayingSound(soundId)

    // Reset playing state after 2 seconds
    setTimeout(() => {
      setPlayingSound(null)
    }, 2000)
  }

  return (
    <section className="py-16">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ses Galerisi</h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Farklı parametrelerle üretilen ses örneklerini dinleyin ve karşılaştırın
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-12">
        {/* FM Synthesis Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h3 className="text-2xl font-bold text-violet-400 mb-6 flex items-center">
            <Volume2 className="mr-2" />
            FM Sentezi Örnekleri
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {fmSounds.map((sound, index) => (
              <motion.div
                key={sound.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-zinc-900/50 border-violet-900/50 hover:border-violet-700/50 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-violet-400">{sound.name}</CardTitle>
                    <CardDescription className="text-zinc-400 text-sm">{sound.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-xs text-zinc-500 bg-zinc-800/50 p-2 rounded">{sound.parameters}</div>

                    <Button
                      onClick={() => playSound(sound.id)}
                      className={`w-full ${
                        playingSound === sound.id
                          ? "bg-violet-700 hover:bg-violet-800"
                          : "bg-violet-600 hover:bg-violet-700"
                      }`}
                      disabled={playingSound !== null && playingSound !== sound.id}
                    >
                      {playingSound === sound.id ? (
                        <>
                          <Pause className="mr-2 h-4 w-4" />
                          Durdur
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Çal
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Physical Modeling Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-indigo-400 mb-6 flex items-center">
            <Volume2 className="mr-2" />
            Fiziksel Modelleme Örnekleri
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {physicalSounds.map((sound, index) => (
              <motion.div
                key={sound.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-zinc-900/50 border-indigo-900/50 hover:border-indigo-700/50 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-indigo-400">{sound.name}</CardTitle>
                    <CardDescription className="text-zinc-400 text-sm">{sound.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-xs text-zinc-500 bg-zinc-800/50 p-2 rounded">{sound.parameters}</div>

                    <Button
                      onClick={() => playSound(sound.id)}
                      className={`w-full ${
                        playingSound === sound.id
                          ? "bg-indigo-700 hover:bg-indigo-800"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                      disabled={playingSound !== null && playingSound !== sound.id}
                    >
                      {playingSound === sound.id ? (
                        <>
                          <Pause className="mr-2 h-4 w-4" />
                          Durdur
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Çal
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Comparison Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6"
        >
          <h4 className="text-lg font-medium text-emerald-400 mb-4">🎧 Dinleme İpuçları</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-zinc-300">
            <div>
              <h5 className="font-medium text-violet-400 mb-2">FM Sentezi Karakteristikleri:</h5>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Daha keskin ve elektronik ses karakteri</li>
                <li>Modülasyon indeksi arttıkça zenginleşen harmonik içerik</li>
                <li>Metalik ve parlak tınılar</li>
                <li>Hızlı atak karakteristiği</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-indigo-400 mb-2">Fiziksel Modelleme Karakteristikleri:</h5>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Daha doğal ve organik ses karakteri</li>
                <li>Zamanla değişen harmonik içerik</li>
                <li>Gerçek enstrümanlara benzer davranış</li>
                <li>Doğal atak ve sönüm karakteristiği</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
