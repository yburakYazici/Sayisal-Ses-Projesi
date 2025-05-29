"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, ZoomIn, AudioWaveformIcon as Waveform } from "lucide-react"

export function ParameterAnalysis() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [physicalSlide, setPhysicalSlide] = useState(0)

  const fmAnalysisData = [
    {
      id: "mod-index",
      title: "Modülasyon İndeksi Karşılaştırması",
      image: "/images/fm-analysis/fm-mod-index-karsilastirma.png",
      description: "Farklı modülasyon indeksi değerlerinin (1.0, 5.0, 10.0) spektral içeriğe etkisi",
      details:
        "Modülasyon indeksi arttıkça harmonik içerik zenginleşir ve yan bantlar belirginleşir. Düşük değerlerde temiz ses, yüksek değerlerde metalik karakter elde edilir.",
      category: "Spektral Analiz",
    },
    {
      id: "ratio",
      title: "Taşıyıcı/Modülatör Oranı Karşılaştırması",
      image: "/images/fm-analysis/fm-ratio-karsilastirma.png",
      description: "Farklı taşıyıcı/modülatör frekans oranlarının (0.5, 1.0, 2.0) spektral içeriğe etkisi",
      details:
        "Oran 1.0'da harmonik spektrum, 0.5'te harmonik olmayan spektrum oluşur. 2.0 oranında oktav ilişkisi ile daha parlak sesler elde edilir.",
      category: "Frekans Analizi",
    },
    {
      id: "harmonics",
      title: "Harmonik İçerik Analizi",
      image: "/images/fm-analysis/fm-harmonics.png",
      description: "FM sentezinin harmonik bileşenlerinin dağılımı ve güç spektrumu",
      details:
        "4. harmonik en güçlü bileşen olarak öne çıkıyor. 3. ve 6. harmonikler de belirgin enerji içeriyor. 10. harmonikten sonra enerji hızla azalıyor.",
      category: "Harmonik Analiz",
    },
    {
      id: "centroid",
      title: "Spektral Merkezoid Analizi",
      image: "/images/fm-analysis/fm-centroid.png",
      description: "Spektral ağırlık merkezinin zamanla değişimi ve spektrogram görünümü",
      details:
        "FM sentezinde spektral merkezoid oldukça sabit kalıyor. Bu, zamanla değişmeyen harmonik yapıyı gösterir. Başlangıç ve bitişteki değişimler atak/sönüm fazlarını yansıtır.",
      category: "Temporal Analiz",
    },
    {
      id: "attack",
      title: "Atak Karakteristiği",
      image: "/images/fm-analysis/fm-attack.png",
      description: "FM sentezinin atak davranışı ve RMS enerji değişimi",
      details:
        "Hızlı bir atak fazı görülüyor. Yaklaşık 0.05 saniyede maksimum seviyeye ulaşıyor ve sabit seviyede devam ediyor. Bu, FM sentezinin keskin atak karakteristiğini gösterir.",
      category: "Temporal Analiz",
    },
    {
      id: "waveform",
      title: "Dalga Formu Karşılaştırması",
      image: "/images/fm-analysis/dalga-formlari.png",
      description: "FM ve fiziksel modelleme sentez yöntemlerinin zaman domenindeki dalga formu karakteristikleri",
      details:
        "FM sentezinin dalga formu düzenli ve periyodik. Fiziksel modellemeye kıyasla daha az gürültülü ve öngörülebilir. Bu, matematiksel kontrol edilebilirliği yansıtır.",
      category: "Dalga Formu",
    },
    {
      id: "spectrogram",
      title: "Spektrogram Analizi",
      image: "/images/fm-analysis/fm-spectrogram.png",
      description: "FM sentezinin zaman-frekans analizi ve harmonik yapının görselleştirilmesi",
      details:
        "Belirgin ve sabit harmonik çizgiler FM sentezinin karakteristik özelliği. Harmonikler arası mesafe eşit ve zamanla değişmez. Yüksek frekanslarda bile enerji kaybı minimal.",
      category: "Spektral Analiz",
    },
  ]

  const physicalAnalysisData = [
    {
      id: "damping",
      title: "Sönümleme Faktörü Karşılaştırması",
      image: "/images/physical-analysis/physical-damping-karsilastirma.png",
      description: "Farklı sönümleme faktörlerinin (0.001, 0.005, 0.02) spektral içeriğe etkisi",
      details:
        "Sönümleme faktörü arttıkça ses daha hızlı söner ve harmonik içerik azalır. Düşük sönümleme uzun süren rezonans, yüksek sönümleme kısa ve keskin ses üretir.",
      category: "Parametre Analizi",
    },
    {
      id: "stretch",
      title: "Germe Faktörü Karşılaştırması",
      image: "/images/physical-analysis/physical-stretch-karsilastirma.png",
      description: "Farklı germe faktörlerinin (0.8, 0.9, 1.0) spektral içeriğe etkisi",
      details:
        "Germe faktörü tel gerginliğini simüle eder. Yüksek değerler daha gergin tel, düşük değerler daha esnek tel karakteristiği verir. Harmonik yapıyı doğrudan etkiler.",
      category: "Fiziksel Parametre",
    },
    {
      id: "harmonics",
      title: "Harmonik İçerik Analizi",
      image: "/images/physical-analysis/physical-harmonics.png",
      description: "Fiziksel modellemenin harmonik bileşenlerinin dağılımı ve güç spektrumu",
      details:
        "9. harmonik en güçlü bileşen olarak öne çıkıyor. FM'den farklı olarak daha doğal bir harmonik dağılım gösterir. Gerçek enstrüman karakteristiğini yansıtır.",
      category: "Harmonik Analiz",
    },
    {
      id: "centroid",
      title: "Spektral Merkezoid Analizi",
      image: "/images/physical-analysis/physical-centroid.png",
      description: "Spektral ağırlık merkezinin zamanla değişimi ve spektrogram görünümü",
      details:
        "Başlangıçta yüksek spektral merkezoid, sonra hızla düşüyor ve tekrar yükseliyor. Bu, doğal enstrüman davranışını yansıtan karakteristik bir özellik.",
      category: "Temporal Analiz",
    },
    {
      id: "attack",
      title: "Atak Karakteristiği",
      image: "/images/physical-analysis/physical-attack.png",
      description: "Fiziksel modellemenin atak davranışı ve RMS enerji değişimi",
      details:
        "Doğal sönümlenme karakteristiği gösterir. FM'den farklı olarak hızlı atak sonrası sürekli azalan enerji. Gerçek tel davranışını simüle eder.",
      category: "Temporal Analiz",
    },
    {
      id: "spectrogram",
      title: "Spektrogram Analizi",
      image: "/images/physical-analysis/physical-spectrogram.png",
      description: "Fiziksel modellemenin zaman-frekans analizi ve harmonik yapının görselleştirilmesi",
      details:
        "Doğal sönümlenme ile harmonik enerji zamanla azalır. FM'ye kıyasla daha organik ve değişken spektral yapı. Yüksek frekanslarda hızlı sönümlenme.",
      category: "Spektral Analiz",
    },
  ]

  const downloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % fmAnalysisData.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + fmAnalysisData.length) % fmAnalysisData.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const nextPhysicalSlide = () => {
    setPhysicalSlide((prev) => (prev + 1) % physicalAnalysisData.length)
  }

  const prevPhysicalSlide = () => {
    setPhysicalSlide((prev) => (prev - 1 + physicalAnalysisData.length) % physicalAnalysisData.length)
  }

  const goToPhysicalSlide = (index: number) => {
    setPhysicalSlide(index)
  }

  const currentData = fmAnalysisData[currentSlide]
  const currentPhysicalData = physicalAnalysisData[physicalSlide]

  return (
    <section className="py-16">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Parametre Analizi</h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          FM ve fiziksel modelleme sentez yöntemlerinin farklı parametrelerle detaylı analizi
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="fm" className="w-full">
          <div className="flex justify-center mb-8 overflow-x-auto pb-2">
            <TabsList className="bg-zinc-800/50 border border-zinc-700">
              <TabsTrigger
                value="fm"
                className="data-[state=active]:bg-violet-600 data-[state=active]:text-white flex items-center gap-2"
              >
                <Waveform className="h-4 w-4" />
                FM Sentezi
              </TabsTrigger>
              <TabsTrigger
                value="physical"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white flex items-center gap-2"
              >
                <Waveform className="h-4 w-4" />
                Fiziksel Modelleme
              </TabsTrigger>
            </TabsList>
          </div>

          {/* FM Sentezi Carousel */}
          <TabsContent value="fm">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-violet-400 flex items-center gap-2">
                      <Waveform className="h-6 w-6" />
                      FM Sentezi Analiz Galerisi
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Farklı parametrelerin spektral ve temporal etkilerinin detaylı analizi
                    </CardDescription>
                  </div>
                  <div className="text-sm text-zinc-400">
                    {currentSlide + 1} / {fmAnalysisData.length}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Ana Görsel Alanı */}
                <div className="relative">
                  <div className="aspect-video relative bg-black/30 rounded-lg overflow-hidden border border-zinc-700 group">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentSlide}
                        src={currentData.image}
                        alt={currentData.title}
                        className="w-full h-full object-contain cursor-pointer bg-white"
                        onClick={() => setSelectedImage(currentData.image)}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                      />
                    </AnimatePresence>

                    {/* Görsel Kontrolleri */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-black/50 border-zinc-600 text-white hover:bg-black/70"
                        onClick={() => setSelectedImage(currentData.image)}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-black/50 border-zinc-600 text-white hover:bg-black/70"
                        onClick={() => downloadImage(currentData.image, `${currentData.id}.png`)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Görsel Bilgileri */}
                  <div className="mt-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-violet-400 mb-2">{currentData.title}</h3>
                      <p className="text-zinc-300 mb-3">{currentData.description}</p>
                      <p className="text-sm text-zinc-400 leading-relaxed">{currentData.details}</p>
                    </div>
                  </div>

                  {/* Thumbnail Navigasyon */}
                  <div className="mt-8">
                    <h4 className="text-lg font-medium text-zinc-300 mb-4">Tüm Analizler</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                      {fmAnalysisData.map((item, index) => (
                        <motion.div
                          key={item.id}
                          className={`relative aspect-video rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                            currentSlide === index
                              ? "border-violet-400 shadow-lg shadow-violet-400/20"
                              : "border-zinc-700 hover:border-zinc-500"
                          }`}
                          onClick={() => goToSlide(index)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            className="w-full h-full object-cover bg-white"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-1 left-1 right-1">
                            <p className="text-xs text-white font-medium truncate">{item.title}</p>
                          </div>
                          {currentSlide === index && (
                            <div className="absolute inset-0 bg-violet-400/20 border-2 border-violet-400 rounded-md" />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Nokta Navigasyonu */}
                  <div className="flex justify-center mt-6 space-x-2">
                    {fmAnalysisData.map((_, index) => (
                      <button
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          currentSlide === index ? "bg-violet-400" : "bg-zinc-600 hover:bg-zinc-500"
                        }`}
                        onClick={() => goToSlide(index)}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fiziksel Modelleme Carousel */}
          <TabsContent value="physical">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-indigo-400 flex items-center gap-2">
                      <Waveform className="h-6 w-6" />
                      Fiziksel Modelleme Analiz Galerisi
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Karplus-Strong algoritması ve parametre etkilerinin detaylı analizi
                    </CardDescription>
                  </div>
                  <div className="text-sm text-zinc-400">
                    {physicalSlide + 1} / {physicalAnalysisData.length}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Ana Görsel Alanı */}
                <div className="relative">
                  <div className="aspect-video relative bg-black/30 rounded-lg overflow-hidden border border-zinc-700 group">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={physicalSlide}
                        src={currentPhysicalData.image}
                        alt={currentPhysicalData.title}
                        className="w-full h-full object-contain cursor-pointer bg-white"
                        onClick={() => setSelectedImage(currentPhysicalData.image)}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                      />
                    </AnimatePresence>

                    {/* Görsel Kontrolleri */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-black/50 border-zinc-600 text-white hover:bg-black/70"
                        onClick={() => setSelectedImage(currentPhysicalData.image)}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-black/50 border-zinc-600 text-white hover:bg-black/70"
                        onClick={() => downloadImage(currentPhysicalData.image, `${currentPhysicalData.id}.png`)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Görsel Bilgileri */}
                  <div className="mt-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-indigo-400 mb-2">{currentPhysicalData.title}</h3>
                      <p className="text-zinc-300 mb-3">{currentPhysicalData.description}</p>
                      <p className="text-sm text-zinc-400 leading-relaxed">{currentPhysicalData.details}</p>
                    </div>
                  </div>

                  {/* Thumbnail Navigasyon */}
                  <div className="mt-8">
                    <h4 className="text-lg font-medium text-zinc-300 mb-4">Tüm Analizler</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      {physicalAnalysisData.map((item, index) => (
                        <motion.div
                          key={item.id}
                          className={`relative aspect-video rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                            physicalSlide === index
                              ? "border-indigo-400 shadow-lg shadow-indigo-400/20"
                              : "border-zinc-700 hover:border-zinc-500"
                          }`}
                          onClick={() => goToPhysicalSlide(index)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            className="w-full h-full object-cover bg-white"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-1 left-1 right-1">
                            <p className="text-xs text-white font-medium truncate">{item.title}</p>
                          </div>
                          {physicalSlide === index && (
                            <div className="absolute inset-0 bg-indigo-400/20 border-2 border-indigo-400 rounded-md" />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Nokta Navigasyonu */}
                  <div className="flex justify-center mt-6 space-x-2">
                    {physicalAnalysisData.map((_, index) => (
                      <button
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          physicalSlide === index ? "bg-indigo-400" : "bg-zinc-600 hover:bg-zinc-500"
                        }`}
                        onClick={() => goToPhysicalSlide(index)}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Büyütülmüş Görsel Modal */}
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-w-6xl max-h-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Büyütülmüş analiz görseli"
                className="w-full h-full object-contain rounded-lg bg-white"
              />
              <Button
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70"
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
