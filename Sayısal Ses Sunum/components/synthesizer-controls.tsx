"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Play, Square, RefreshCw, Volume2, Settings, AudioWaveformIcon as Waveform, Info, Zap } from "lucide-react"
import { motion } from "framer-motion"

export function SynthesizerControls() {
  const [activeTab, setActiveTab] = useState("fm")
  const [isPlaying, setIsPlaying] = useState(false)
  const [showSpectrogram, setShowSpectrogram] = useState(true)
  const spectrogramCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const spectrogramDataRef = useRef<number[][]>([])
  const spectrogramAnimationRef = useRef<number | null>(null)

  // FM parameters
  const [carrierFreq, setCarrierFreq] = useState(440)
  const [modulatorFreq, setModulatorFreq] = useState(440)
  const [modulationIndex, setModulationIndex] = useState(5)
  const [fmPreset, setFmPreset] = useState("custom")

  // Physical modeling parameters
  const [damping, setDamping] = useState(0.005)
  const [stretching, setStretching] = useState(0.9)
  const [physicalPreset, setPhysicalPreset] = useState("custom")

  // Visualization states
  const [spectrumData, setSpectrumData] = useState<number[]>([])
  const [waveformData, setWaveformData] = useState<number[]>([])
  const [decayData, setDecayData] = useState<number[]>([])

  // Audio context
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const modulatorRef = useRef<OscillatorNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationRef = useRef<number | null>(null)

  // Enhanced presets with detailed information
  const fmPresets = {
    bell: {
      carrier: 440,
      modulator: 880,
      index: 8,
      name: "🔔 Çan Sesi",
      description: "Klasik çan tınısı - yüksek harmonik içerik",
      characteristics: ["Parlak ve metalik", "Uzun süren rezonans", "2:1 harmonik oran"],
    },
    bass: {
      carrier: 110,
      modulator: 110,
      index: 3,
      name: "🎸 Bas Gitar",
      description: "Derin bas tınısı - düşük modülasyon",
      characteristics: ["Güçlü temel frekans", "Sıcak ve dolgun", "Minimal harmonik"],
    },
    brass: {
      carrier: 330,
      modulator: 660,
      index: 12,
      name: "🎺 Brass",
      description: "Nefesli çalgı karakteri - zengin harmonik",
      characteristics: ["Güçlü orta frekanslar", "Dinamik spektrum", "Yüksek modülasyon"],
    },
    electric: {
      carrier: 220,
      modulator: 440,
      index: 15,
      name: "⚡ Elektrik",
      description: "Elektronik ses karakteri - çok yüksek modülasyon",
      characteristics: ["Keskin ve agresif", "Geniş spektrum", "Metalik tınlar"],
    },
    organ: {
      carrier: 523,
      modulator: 523,
      index: 2,
      name: "🎹 Org",
      description: "Klasik org tınısı - düşük modülasyon",
      characteristics: ["Temiz ve stabil", "Harmonik zenginlik", "Sürekli ton"],
    },
    custom: {
      carrier: 440,
      modulator: 440,
      index: 5,
      name: "🎛️ Özel",
      description: "Kullanıcı tanımlı parametreler",
      characteristics: ["Özelleştirilebilir", "Deneysel", "Esnek kontrol"],
    },
  }

  const physicalPresets = {
    guitar: {
      damping: 0.003,
      stretching: 0.95,
      name: "🎸 Gitar",
      description: "Akustik gitar teli - uzun süre, yüksek gerginlik",
      characteristics: ["Doğal rezonans", "Uzun sustain", "Parlak ton"],
    },
    piano: {
      damping: 0.008,
      stretching: 0.85,
      name: "🎹 Piyano",
      description: "Piyano teli - orta süre, orta gerginlik",
      characteristics: ["Hızlı atak", "Kontrollü sönüm", "Zengin harmonik"],
    },
    harp: {
      damping: 0.002,
      stretching: 0.98,
      name: "🪕 Arp",
      description: "Arp teli - çok uzun süre, çok yüksek gerginlik",
      characteristics: ["Kristal berraklık", "Çok uzun sustain", "Hassas ton"],
    },
    drum: {
      damping: 0.015,
      stretching: 0.75,
      name: "🥁 Davul",
      description: "Davul derisi - kısa süre, düşük gerginlik",
      characteristics: ["Hızlı sönüm", "Perküsif karakter", "Geniş spektrum"],
    },
    violin: {
      damping: 0.004,
      stretching: 0.92,
      name: "🎻 Keman",
      description: "Keman teli - uzun süre, yüksek gerginlik",
      characteristics: ["Ekspresif ton", "Doğal vibrato", "Sıcak karakter"],
    },
    custom: {
      damping: 0.005,
      stretching: 0.9,
      name: "🎛️ Özel",
      description: "Kullanıcı tanımlı parametreler",
      characteristics: ["Özelleştirilebilir", "Deneysel", "Esnek kontrol"],
    },
  }

  // Real-time spectrum calculation for FM
  const calculateFMSpectrum = useCallback(() => {
    const spectrum = new Array(32).fill(0)
    const ratio = modulatorFreq / carrierFreq

    // Bessel function approximation for FM spectrum
    for (let n = 0; n < 32; n++) {
      const harmonicFreq = carrierFreq * (1 + n * ratio)
      if (harmonicFreq < 4000) {
        const besselArg = modulationIndex
        const amplitude = Math.abs(Math.sin(besselArg + (n * Math.PI) / 4) * Math.exp(-n * 0.1))
        spectrum[n] = amplitude * (1 - n * 0.02)
      }
    }

    return spectrum.map((val) => Math.max(0, Math.min(1, val)))
  }, [carrierFreq, modulatorFreq, modulationIndex])

  // Real-time waveform calculation
  const calculateWaveform = useCallback(() => {
    const waveform = []
    const samples = 200

    if (activeTab === "fm") {
      for (let i = 0; i < samples; i++) {
        const t = i / samples
        const modulator = Math.sin(2 * Math.PI * modulatorFreq * t * 0.01)
        const carrier = Math.sin(2 * Math.PI * carrierFreq * t * 0.01 + modulationIndex * modulator)
        waveform.push(carrier * 0.8)
      }
    } else {
      // Physical modeling waveform simulation
      for (let i = 0; i < samples; i++) {
        const t = i / samples
        const decay = Math.exp(-t * damping * 50)
        const noise = (Math.random() - 0.5) * 0.1
        const fundamental = Math.sin(2 * Math.PI * 440 * t * 0.01) * decay
        waveform.push((fundamental + noise) * stretching)
      }
    }

    return waveform
  }, [activeTab, carrierFreq, modulatorFreq, modulationIndex, damping, stretching])

  // Real-time decay curve calculation
  const calculateDecayCurve = useCallback(() => {
    const curve = []
    const samples = 100

    for (let i = 0; i < samples; i++) {
      const t = i / samples
      const decay = Math.exp(-t * damping * 30)
      const modulation = 1 + Math.sin(t * Math.PI * 4) * 0.1 * stretching
      curve.push(decay * modulation)
    }

    return curve
  }, [damping, stretching])

  // Update visualizations
  useEffect(() => {
    if (activeTab === "fm") {
      setSpectrumData(calculateFMSpectrum())
    }
    setWaveformData(calculateWaveform())
    if (activeTab === "physical") {
      setDecayData(calculateDecayCurve())
    }
  }, [
    activeTab,
    carrierFreq,
    modulatorFreq,
    modulationIndex,
    damping,
    stretching,
    calculateFMSpectrum,
    calculateWaveform,
    calculateDecayCurve,
  ])

  useEffect(() => {
    return () => {
      stopAllSounds()
    }
  }, [])

  const stopAllSounds = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop()
      oscillatorRef.current = null
    }
    if (modulatorRef.current) {
      modulatorRef.current.stop()
      modulatorRef.current = null
    }
    if (sourceRef.current) {
      sourceRef.current.stop()
      sourceRef.current = null
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    if (spectrogramAnimationRef.current) {
      cancelAnimationFrame(spectrogramAnimationRef.current)
      spectrogramAnimationRef.current = null
    }
  }

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }
    return audioContextRef.current
  }

  const playFM = () => {
    const audioContext = initAudioContext()
    stopAllSounds()

    // Create carrier oscillator
    const carrier = audioContext.createOscillator()
    carrier.type = "sine"
    carrier.frequency.value = carrierFreq

    // Create modulator oscillator
    const modulator = audioContext.createOscillator()
    modulator.type = "sine"
    modulator.frequency.value = modulatorFreq

    // Create gain for modulation index
    const modulationGain = audioContext.createGain()
    modulationGain.gain.value = modulationIndex * modulatorFreq

    // Create output gain with envelope
    const outputGain = audioContext.createGain()
    outputGain.gain.setValueAtTime(0, audioContext.currentTime)
    outputGain.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1)
    outputGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 3)

    // Analyser node oluştur
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 1024
    analyser.smoothingTimeConstant = 0.8
    analyserRef.current = analyser

    // Connect modulator -> modulationGain -> carrier.frequency
    modulator.connect(modulationGain)
    modulationGain.connect(carrier.frequency)

    // Connect carrier -> outputGain -> speakers
    carrier.connect(outputGain)
    outputGain.connect(analyser)
    analyser.connect(audioContext.destination)

    // Start oscillators
    carrier.start()
    modulator.start()

    // Stop after 3 seconds
    carrier.stop(audioContext.currentTime + 3)
    modulator.stop(audioContext.currentTime + 3)

    // Save references
    oscillatorRef.current = carrier
    modulatorRef.current = modulator
    gainRef.current = outputGain

    setIsPlaying(true)
    setTimeout(() => setIsPlaying(false), 3000)
  }

  const playPhysical = () => {
    const audioContext = initAudioContext()
    stopAllSounds()

    // Create buffer for Karplus-Strong algorithm
    const bufferSize = Math.floor(audioContext.sampleRate / 440)
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)

    // Fill buffer with noise
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    // Create source node
    const source = audioContext.createBufferSource()
    source.buffer = buffer
    source.loop = true

    // Create feedback loop with delay and filter
    const delay = audioContext.createDelay()
    delay.delayTime.value = 1 / 440

    const filter = audioContext.createBiquadFilter()
    filter.type = "lowpass"
    filter.frequency.value = 5000 * stretching

    const feedback = audioContext.createGain()
    feedback.gain.value = 0.98 - damping * 100

    // Create output gain
    const outputGain = audioContext.createGain()
    outputGain.gain.setValueAtTime(0.3, audioContext.currentTime)
    outputGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 4)

    // Analyser node oluştur
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 1024
    analyser.smoothingTimeConstant = 0.8
    analyserRef.current = analyser

    // Connect nodes
    source.connect(delay)
    delay.connect(filter)
    filter.connect(feedback)
    feedback.connect(delay)
    filter.connect(outputGain)
    outputGain.connect(analyser)
    analyser.connect(audioContext.destination)

    // Start source
    source.start()
    sourceRef.current = source

    setIsPlaying(true)
    setTimeout(() => {
      source.stop()
      setIsPlaying(false)
    }, 4000)
  }

  const handlePlay = () => {
    if (isPlaying) {
      stopAllSounds()
      setIsPlaying(false)
      return
    }

    if (activeTab === "fm") {
      playFM()
    } else {
      playPhysical()
    }
    if (showSpectrogram) {
      updateSpectrogram()
    }
  }

  const applyFmPreset = (presetName: string) => {
    if (presetName === "custom") return
    const preset = fmPresets[presetName as keyof typeof fmPresets]
    setCarrierFreq(preset.carrier)
    setModulatorFreq(preset.modulator)
    setModulationIndex(preset.index)
    setFmPreset(presetName)
  }

  const applyPhysicalPreset = (presetName: string) => {
    if (presetName === "custom") return
    const preset = physicalPresets[presetName as keyof typeof physicalPresets]
    setDamping(preset.damping)
    setStretching(preset.stretching)
    setPhysicalPreset(presetName)
  }

  const resetParameters = () => {
    if (activeTab === "fm") {
      setCarrierFreq(440)
      setModulatorFreq(440)
      setModulationIndex(5)
      setFmPreset("custom")
    } else {
      setDamping(0.005)
      setStretching(0.9)
      setPhysicalPreset("custom")
    }

    // Clear spectrogram data
    spectrogramDataRef.current = []

    // Clear the canvas if it exists
    if (spectrogramCanvasRef.current) {
      const canvas = spectrogramCanvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
  }

  const getFrequencyNote = (freq: number) => {
    const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
    const a4 = 440
    const c0 = a4 * Math.pow(2, -4.75)
    const h = Math.round(12 * Math.log2(freq / c0))
    const octave = Math.floor(h / 12)
    const n = h % 12
    return notes[n] + octave
  }

  const currentFmPreset = fmPresets[fmPreset as keyof typeof fmPresets]
  const currentPhysicalPreset = physicalPresets[physicalPreset as keyof typeof physicalPresets]

  const updateSpectrogram = () => {
    if (!analyserRef.current || !spectrogramCanvasRef.current) return

    const analyser = analyserRef.current
    const canvas = spectrogramCanvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      spectrogramAnimationRef.current = requestAnimationFrame(draw)

      analyser.getByteFrequencyData(dataArray)

      // Mevcut spektrogram verilerini kaydır
      if (spectrogramDataRef.current.length > 100) {
        spectrogramDataRef.current.shift()
      }

      // Yeni veri satırını ekle
      const newRow = Array.from(dataArray.slice(0, 128)).map((val) => val / 255)
      spectrogramDataRef.current.push(newRow)

      // Canvas'ı temizle
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 3D spektrogram çiz
      drawSpectrogram(ctx, canvas.width, canvas.height)
    }

    draw()
  }

  // drawSpectrogram fonksiyonu
  const drawSpectrogram = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const data = spectrogramDataRef.current
    if (!data.length) return

    const rowCount = data.length
    const colCount = data[0].length

    // 3D perspektif için parametreler
    const xScale = width / colCount
    const yScale = height / rowCount
    const maxHeight = height * 0.5
    const perspective = 0.3
    const rotation = Math.PI * 0.3

    // Renk gradyanı
    const getColor = (value: number) => {
      const hue = (1 - value) * 240 // 240 (mavi) -> 0 (kırmızı)
      const saturation = 80 + value * 20
      const lightness = 20 + value * 30
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`
    }

    // Her zaman dilimi için
    for (let z = 0; z < rowCount; z++) {
      const rowData = data[rowCount - z - 1]
      const depth = z / rowCount
      const scale = 1 - depth * perspective

      // Her frekans için
      for (let x = 0; x < colCount - 1; x++) {
        const value = rowData[x]
        const nextValue = rowData[x + 1]

        // 3D koordinat dönüşümleri
        const x1 = width * 0.5 + (x - colCount * 0.5) * xScale * scale
        const x2 = width * 0.5 + (x + 1 - colCount * 0.5) * xScale * scale
        const y1 = height - depth * height * 0.8

        const barHeight1 = value * maxHeight * scale
        const barHeight2 = nextValue * maxHeight * scale

        // Çizgi çiz
        ctx.beginPath()
        ctx.moveTo(x1, y1 - barHeight1)
        ctx.lineTo(x2, y1 - barHeight2)
        ctx.strokeStyle = getColor(value)
        ctx.lineWidth = 2 * scale
        ctx.stroke()

        // Dikey çizgiler (3D efekti için)
        if (z < rowCount - 1 && z % 3 === 0) {
          const prevRowData = data[rowCount - z - 2]
          const prevValue = prevRowData[x]
          const prevDepth = (z + 1) / rowCount
          const prevScale = 1 - prevDepth * perspective
          const prevY = height - prevDepth * height * 0.8
          const prevBarHeight = prevValue * maxHeight * prevScale

          ctx.beginPath()
          ctx.moveTo(x1, y1 - barHeight1)
          ctx.lineTo(x1, prevY - prevBarHeight)
          ctx.strokeStyle = `rgba(${activeTab === "fm" ? "139, 92, 246" : "99, 102, 241"}, ${0.3 * scale})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }
    }

    // Grid çizgileri
    ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`
    ctx.lineWidth = 1

    // Yatay grid çizgileri
    for (let z = 0; z < rowCount; z += 10) {
      const depth = z / rowCount
      const y = height - depth * height * 0.8

      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Dikey grid çizgileri
    for (let x = 0; x < colCount; x += 16) {
      const xPos = width * 0.5 + (x - colCount * 0.5) * xScale

      ctx.beginPath()
      ctx.moveTo(xPos, height)
      ctx.lineTo(xPos, 0)
      ctx.stroke()
    }
  }

  useEffect(() => {
    // Canvas boyutunu ayarla
    if (spectrogramCanvasRef.current) {
      const resizeCanvas = () => {
        const canvas = spectrogramCanvasRef.current
        if (canvas) {
          canvas.width = canvas.offsetWidth
          canvas.height = canvas.offsetHeight
        }
      }

      resizeCanvas()
      window.addEventListener("resize", resizeCanvas)

      return () => {
        window.removeEventListener("resize", resizeCanvas)
      }
    }
  }, [])

  return (
    <TooltipProvider>
      <section className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Gerçek Zamanlı Sentezleyici</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Parametreleri gerçek zamanlı olarak ayarlayarak farklı sentez yöntemlerini görsel olarak deneyimleyin
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <Tabs
            defaultValue="fm"
            className="w-full"
            onValueChange={(value) => {
              setActiveTab(value)
              stopAllSounds()
              setIsPlaying(false)
            }}
          >
            <div className="flex justify-center mb-8">
              <TabsList className="bg-zinc-800/50 border border-zinc-700">
                <TabsTrigger value="fm" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white">
                  <Waveform className="mr-2 h-4 w-4" />
                  FM Sentezleyici
                </TabsTrigger>
                <TabsTrigger
                  value="physical"
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                >
                  <Volume2 className="mr-2 h-4 w-4" />
                  Fiziksel Model
                </TabsTrigger>
              </TabsList>
            </div>

            {/* FM Sentezleyici */}
            <TabsContent value="fm" className="mt-0">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Sol Panel - Görselleştirme */}
                  <div className="lg:col-span-1 space-y-6">
                    {/* 3D Spektrogram */}
                    <Card className="bg-zinc-900/50 border-violet-900/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-violet-400 flex items-center justify-between">
                          <div className="flex items-center">
                            <Zap className="mr-2 h-4 w-4" />
                            3D Spektrogram
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setShowSpectrogram(!showSpectrogram)}
                          >
                            {showSpectrogram ? "2D" : "3D"}
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-48 bg-black/50 rounded-lg overflow-hidden">
                          <canvas ref={spectrogramCanvasRef} className="w-full h-full" />
                        </div>
                        <div className="mt-2 text-xs text-zinc-500 text-center">
                          Frekans-Zaman-Amplitüd Görselleştirmesi
                        </div>
                      </CardContent>
                    </Card>
                    {/* Dalga Formu */}
                    <Card className="bg-zinc-900/50 border-violet-900/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-violet-400 flex items-center">
                          <Waveform className="mr-2 h-4 w-4" />
                          Dalga Formu
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-24 bg-black/30 rounded-lg p-2 flex items-center justify-center">
                          <svg width="100%" height="100%" viewBox="0 0 200 80" className="overflow-visible">
                            <path
                              d={`M 0 40 ${waveformData
                                .map((value, i) => `L ${(i / waveformData.length) * 200} ${40 - value * 30}`)
                                .join(" ")}`}
                              stroke="rgb(139 92 246)"
                              strokeWidth="1.5"
                              fill="none"
                              style={{
                                filter: isPlaying ? `drop-shadow(0 0 3px rgb(139 92 246))` : "none",
                              }}
                            />
                            <line
                              x1="0"
                              y1="40"
                              x2="200"
                              y2="40"
                              stroke="rgb(113 113 122)"
                              strokeWidth="0.5"
                              strokeDasharray="2,2"
                            />
                          </svg>
                        </div>
                        <div className="mt-2 text-xs text-zinc-500 text-center">Zaman Domeninde Dalga Şekli</div>
                      </CardContent>
                    </Card>

                    {/* Preset Bilgi Kartı */}
                    <Card className="bg-violet-900/20 border-violet-900/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-violet-400 flex items-center">
                          <Info className="mr-2 h-4 w-4" />
                          {currentFmPreset.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-zinc-300">{currentFmPreset.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {currentFmPreset.characteristics.map((char, i) => (
                            <Badge key={i} variant="outline" className="text-xs border-violet-700 text-violet-300">
                              {char}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Orta Panel - Kontroller */}
                  <div className="lg:col-span-1">
                    <Card className="bg-zinc-900/50 border-violet-900/30 overflow-hidden">
                      <div className="h-1 bg-gradient-to-r from-violet-500 to-violet-700"></div>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl text-violet-400 flex items-center">
                            <Settings className="mr-2 h-5 w-5" />
                            FM Sentez Parametreleri
                          </CardTitle>
                          <Select value={fmPreset} onValueChange={applyFmPreset}>
                            <SelectTrigger className="w-48 bg-zinc-800 border-zinc-700">
                              <SelectValue placeholder="Preset Seç" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(fmPresets).map(([key, preset]) => (
                                <SelectItem key={key} value={key}>
                                  {preset.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Parametreler */}
                        <div className="space-y-4">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <label className="text-sm text-zinc-300 font-medium">Taşıyıcı Frekans</label>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3 w-3 text-zinc-500" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Algılanan temel frekans. Sesin perdesini belirler.</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <div className="text-right">
                                <span className="text-violet-400 font-mono text-lg">{carrierFreq} Hz</span>
                                <div className="text-xs text-zinc-500">{getFrequencyNote(carrierFreq)}</div>
                              </div>
                            </div>
                            <Slider
                              value={[carrierFreq]}
                              min={110}
                              max={880}
                              step={1}
                              onValueChange={(value) => {
                                setCarrierFreq(value[0])
                                setFmPreset("custom")
                              }}
                              className="cursor-pointer"
                            />
                          </div>

                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <label className="text-sm text-zinc-300 font-medium">Modülatör Frekans</label>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3 w-3 text-zinc-500" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Taşıyıcı frekansı modüle eden sinyal. Harmonik yapıyı etkiler.</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <div className="text-right">
                                <span className="text-violet-400 font-mono text-lg">{modulatorFreq} Hz</span>
                                <div className="text-xs text-zinc-500">
                                  Oran: {(modulatorFreq / carrierFreq).toFixed(2)}
                                </div>
                              </div>
                            </div>
                            <Slider
                              value={[modulatorFreq]}
                              min={55}
                              max={1760}
                              step={1}
                              onValueChange={(value) => {
                                setModulatorFreq(value[0])
                                setFmPreset("custom")
                              }}
                              className="cursor-pointer"
                            />
                          </div>

                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <label className="text-sm text-zinc-300 font-medium">Modülasyon İndeksi</label>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3 w-3 text-zinc-500" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Modülasyonun derinliği. Yüksek değerler daha zengin harmonik içerik üretir.</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <div className="text-right">
                                <span className="text-violet-400 font-mono text-lg">{modulationIndex.toFixed(1)}</span>
                                <div className="text-xs text-zinc-500">
                                  {modulationIndex > 10 ? "Çok Zengin" : modulationIndex > 5 ? "Zengin" : "Basit"}
                                </div>
                              </div>
                            </div>
                            <Slider
                              value={[modulationIndex]}
                              min={0}
                              max={20}
                              step={0.1}
                              onValueChange={(value) => {
                                setModulationIndex(value[0])
                                setFmPreset("custom")
                              }}
                              className="cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* Açıklama */}
                        <div className="bg-violet-900/20 p-4 rounded-lg border border-violet-900/30">
                          <p className="text-sm text-zinc-300">
                            <span className="font-medium text-violet-400">FM Sentezi:</span> Taşıyıcı dalganın
                            frekansını modülatör dalga ile değiştirerek karmaşık sesler üretir. Modülasyon indeksi
                            arttıkça harmonik içerik zenginleşir ve daha metalik sesler elde edilir.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    {/* Kontrol Butonları */}
                    <div className="flex flex-col gap-4 mt-6">
                      <Button
                        onClick={handlePlay}
                        size="lg"
                        className={
                          activeTab === "fm"
                            ? isPlaying
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "bg-violet-600 hover:bg-violet-700 text-white"
                            : isPlaying
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "bg-indigo-600 hover:bg-indigo-700 text-white"
                        }
                      >
                        {isPlaying ? (
                          <>
                            <Square className="mr-2 h-5 w-5" />
                            Durdur
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-5 w-5" />
                            Çal ({activeTab === "fm" ? "3s" : "4s"})
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={resetParameters}
                        size="lg"
                        className="border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                      >
                        <RefreshCw className="mr-2 h-5 w-5" />
                        Varsayılana Sıfırla
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Fiziksel Modelleme */}
            <TabsContent value="physical" className="mt-0">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Sol Panel - Görselleştirme */}
                  <div className="lg:col-span-1 space-y-6">
                    {/* 3D Spektrogram */}
                    <Card className="bg-zinc-900/50 border-indigo-900/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-indigo-400 flex items-center justify-between">
                          <div className="flex items-center">
                            <Zap className="mr-2 h-4 w-4" />
                            3D Spektrogram
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setShowSpectrogram(!showSpectrogram)}
                          >
                            {showSpectrogram ? "2D" : "3D"}
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-48 bg-black/50 rounded-lg overflow-hidden">
                          <canvas ref={spectrogramCanvasRef} className="w-full h-full" />
                        </div>
                        <div className="mt-2 text-xs text-zinc-500 text-center">
                          Frekans-Zaman-Amplitüd Görselleştirmesi
                        </div>
                      </CardContent>
                    </Card>

                    {/* Dalga Formu */}
                    <Card className="bg-zinc-900/50 border-indigo-900/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-indigo-400 flex items-center">
                          <Waveform className="mr-2 h-4 w-4" />
                          Dalga Formu
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-24 bg-black/30 rounded-lg p-2 flex items-center justify-center">
                          <svg width="100%" height="100%" viewBox="0 0 200 80" className="overflow-visible">
                            <path
                              d={`M 0 40 ${waveformData
                                .map((value, i) => `L ${(i / waveformData.length) * 200} ${40 - value * 30}`)
                                .join(" ")}`}
                              stroke="rgb(99 102 241)"
                              strokeWidth="1.5"
                              fill="none"
                              style={{
                                filter: isPlaying ? `drop-shadow(0 0 3px rgb(99 102 241))` : "none",
                              }}
                            />
                            <line
                              x1="0"
                              y1="40"
                              x2="200"
                              y2="40"
                              stroke="rgb(113 113 122)"
                              strokeWidth="0.5"
                              strokeDasharray="2,2"
                            />
                          </svg>
                        </div>
                        <div className="mt-2 text-xs text-zinc-500 text-center">Fiziksel Model Dalga Şekli</div>
                      </CardContent>
                    </Card>

                    {/* Preset Bilgi Kartı */}
                    <Card className="bg-indigo-900/20 border-indigo-900/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-indigo-400 flex items-center">
                          <Info className="mr-2 h-4 w-4" />
                          {currentPhysicalPreset.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-zinc-300">{currentPhysicalPreset.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {currentPhysicalPreset.characteristics.map((char, i) => (
                            <Badge key={i} variant="outline" className="text-xs border-indigo-700 text-indigo-300">
                              {char}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Orta Panel - Kontroller */}
                  <div className="lg:col-span-1">
                    <Card className="bg-zinc-900/50 border-indigo-900/30 overflow-hidden">
                      <div className="h-1 bg-gradient-to-r from-indigo-500 to-indigo-700"></div>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl text-indigo-400 flex items-center">
                            <Settings className="mr-2 h-5 w-5" />
                            Fiziksel Model Parametreleri
                          </CardTitle>
                          <Select value={physicalPreset} onValueChange={applyPhysicalPreset}>
                            <SelectTrigger className="w-48 bg-zinc-800 border-zinc-700">
                              <SelectValue placeholder="Preset Seç" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(physicalPresets).map(([key, preset]) => (
                                <SelectItem key={key} value={key}>
                                  {preset.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Parametreler */}
                        <div className="space-y-4">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <label className="text-sm text-zinc-300 font-medium">Sönümleme Faktörü</label>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3 w-3 text-zinc-500" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Sesin ne kadar hızlı söneceğini belirler. Düşük değerler uzun sustain sağlar.</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <div className="text-right">
                                <span className="text-indigo-400 font-mono text-lg">{damping.toFixed(3)}</span>
                                <div className="text-xs text-zinc-500">
                                  {damping < 0.005 ? "Uzun Sustain" : damping < 0.01 ? "Orta Sustain" : "Kısa Sustain"}
                                </div>
                              </div>
                            </div>
                            <Slider
                              value={[damping]}
                              min={0.001}
                              max={0.02}
                              step={0.001}
                              onValueChange={(value) => {
                                setDamping(value[0])
                                setPhysicalPreset("custom")
                              }}
                              className="cursor-pointer"
                            />
                          </div>

                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <label className="text-sm text-zinc-300 font-medium">Germe Faktörü</label>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3 w-3 text-zinc-500" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Tel gerginliğini simüle eder. Yüksek değerler daha parlak ve keskin sesler üretir.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <div className="text-right">
                                <span className="text-indigo-400 font-mono text-lg">{stretching.toFixed(2)}</span>
                                <div className="text-xs text-zinc-500">
                                  {stretching > 0.95 ? "Çok Gergin" : stretching > 0.85 ? "Gergin" : "Esnek"}
                                </div>
                              </div>
                            </div>
                            <Slider
                              value={[stretching]}
                              min={0.7}
                              max={0.99}
                              step={0.01}
                              onValueChange={(value) => {
                                setStretching(value[0])
                                setPhysicalPreset("custom")
                              }}
                              className="cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* Açıklama */}
                        <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-900/30">
                          <p className="text-sm text-zinc-300">
                            <span className="font-medium text-indigo-400">Fiziksel Modelleme:</span> Gerçek
                            enstrümanların davranışlarını simüle eder. Sönümleme faktörü sesin süresini, germe faktörü
                            ise harmonik yapısını ve parlaklığını etkiler. Karplus-Strong algoritması kullanılır.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    {/* Kontrol Butonları */}
                    <div className="flex flex-col gap-4 mt-6">
                      <Button
                        onClick={handlePlay}
                        size="lg"
                        className={
                          activeTab === "fm"
                            ? isPlaying
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "bg-violet-600 hover:bg-violet-700 text-white"
                            : isPlaying
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "bg-indigo-600 hover:bg-indigo-700 text-white"
                        }
                      >
                        {isPlaying ? (
                          <>
                            <Square className="mr-2 h-5 w-5" />
                            Durdur
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-5 w-5" />
                            Çal ({activeTab === "fm" ? "3s" : "4s"})
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={resetParameters}
                        size="lg"
                        className="border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                      >
                        <RefreshCw className="mr-2 h-5 w-5" />
                        Varsayılana Sıfırla
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </TooltipProvider>
  )
}
