"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, ZoomIn } from "lucide-react"

export function ComparisonSection() {
  const [activeTab, setActiveTab] = useState("waveform")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const analysisData = {
    waveform: {
      title: "Dalga Formu Karşılaştırması",
      image: "/images/dalga-formlari.png",
      description: "FM ve fiziksel modelleme sentez yöntemlerinin zaman domenindeki dalga formları",
      insights: {
        fm: ["Düzenli ve periyodik dalga yapısı", "Matematiksel olarak öngörülebilir", "Sabit genlik karakteristiği"],
        physical: ["Doğal ve organik dalga formu", "Gerçek enstrüman davranışı", "Zamanla değişen genlik"],
      },
      conclusion:
        "FM sentezi düzenli ve matematiksel dalga formları üretirken, fiziksel modelleme daha doğal ve organik dalga formları oluşturur.",
    },
    spectrum: {
      title: "Frekans Spektrumu Karşılaştırması",
      image: "/images/frekans-spektrumu.png",
      description: "Frekans domeninde her iki yöntemin spektral özellikleri",
      insights: {
        fm: ["Belirgin ve keskin harmonik tepeler", "Modülasyon indeksine bağlı zenginlik", "Düzenli harmonik dağılım"],
        physical: [
          "Yumuşak ve doğal spektral dağılım",
          "Yüksek frekanslarda doğal sönümlenme",
          "Gerçek enstrüman rezonansları",
        ],
      },
      conclusion:
        "FM sentezi belirgin harmonik tepeler gösterirken, fiziksel modelleme daha yumuşak ve doğal bir spektral dağılım sergiler.",
    },
    harmonics: {
      title: "Harmonik İçerik Analizi",
      image: "/images/harmonik-icerik.png",
      description: "Her iki yöntemin harmonik yapısı ve dağılımı",
      insights: {
        fm: [
          "Modülasyon indeksine bağlı harmonik dağılım",
          "Bessel fonksiyonları ile öngörülebilir",
          "Matematiksel olarak hesaplanabilir",
        ],
        physical: [
          "Doğal harmonik sönümlenme",
          "Gerçek enstrüman harmonik yapısı",
          "Malzeme özelliklerine bağlı dağılım",
        ],
      },
      conclusion:
        "FM sentezi matematiksel olarak öngörülebilir harmonik dağılım gösterirken, fiziksel modelleme doğal enstrüman harmonik yapısını sergiler.",
    },
    attack: {
      title: "Atak Karakteristiği Analizi",
      image: "/images/atak-karsilastirma.png",
      description: "Ses başlangıç karakteristikleri ve zarf davranışları",
      insights: {
        fm: ["Hızlı yükseliş, sabit amplitüd", "Anında oluşan harmonik içerik", "Keskin ve belirgin atak"],
        physical: ["Doğal sönümlenme karakteristiği", "Zamanla azalan enerji", "Organik ve yumuşak atak geçişi"],
      },
      conclusion:
        "FM sentezi hızlı ve keskin bir atak karakteristiği gösterirken, fiziksel modelleme doğal ve organik bir sönümlenme sergiler.",
    },
    spectral: {
      title: "Spektral Merkezoid Analizi",
      image: "/images/spektral-merkezoid.png",
      description: "Spektral ağırlık merkezinin zamanla değişimi",
      insights: {
        fm: ["Genellikle sabit spektral merkezoid", "Modülasyon parametrelerine bağlı", "Öngörülebilir değişim"],
        physical: ["Doğal sönümlenme eğrisi", "Zamanla azalan spektral enerji", "Yüksek frekanslarda hızlı sönüm"],
      },
      conclusion:
        "FM sentezi genellikle sabit spektral merkezoid gösterirken, fiziksel modelleme doğal bir sönümlenme eğrisi sergiler.",
    },
    spectrogram: {
      title: "Spektrogram Karşılaştırması",
      image: "/images/spektrogramlar.png",
      description: "Zaman-frekans analizi ve spektral değişim",
      insights: {
        fm: ["Sabit harmonik çizgiler", "Zamanla değişmeyen spektrum", "Belirgin spektral çizgiler"],
        physical: ["Zamanla sönümlenme karakteristiği", "Doğal rezonans davranışı", "Değişen spektral içerik"],
      },
      conclusion:
        "FM sentezi sabit harmonik çizgiler gösterirken, fiziksel modelleme zamanla değişen ve sönümlenen bir spektral yapı sergiler.",
    },
  }

  const downloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Karşılaştırmalı Analiz</h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">FM ve fiziksel modelleme sentez yöntemlerinin grafik analizi</p>
      </div>

      <div className="max-w-5xl mx-auto">
        <Tabs defaultValue="waveform" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-center mb-8 overflow-x-auto pb-2">
            <TabsList className="bg-zinc-800/50 border border-zinc-700">
              {Object.entries(analysisData).map(([key, data]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  {data.title.split(" ")[0]}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {Object.entries(analysisData).map(([key, data]) => (
            <TabsContent key={key} value={key} className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Ana Kart */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl text-emerald-400">{data.title}</CardTitle>
                    <p className="text-zinc-400 text-sm">{data.description}</p>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Ana Görsel */}
                    <div className="relative group">
                      <div className="aspect-video relative bg-black/30 rounded-md overflow-hidden border border-zinc-700">
                        <img
                          src={data.image || "/placeholder.svg"}
                          alt={data.title}
                          className="w-full h-full object-contain cursor-pointer bg-white"
                          onClick={() => setSelectedImage(data.image)}
                        />

                        {/* Görsel Kontrolleri */}
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-black/50 border-zinc-600 text-white hover:bg-black/70 h-8 w-8 p-0"
                            onClick={() => setSelectedImage(data.image)}
                          >
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-black/50 border-zinc-600 text-white hover:bg-black/70 h-8 w-8 p-0"
                            onClick={() => downloadImage(data.image, `${key}-analysis.png`)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Analiz Sonuçları */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* FM Sentezi */}
                      <Card className="bg-zinc-800/50 border-violet-900/30">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base text-violet-400">FM Sentezi</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-1 text-zinc-300">
                            {data.insights.fm.map((insight, index) => (
                              <li key={index} className="flex items-start text-sm">
                                <span className="text-violet-400 mr-2">•</span>
                                <span>{insight}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      {/* Fiziksel Modelleme */}
                      <Card className="bg-zinc-800/50 border-indigo-900/30">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base text-indigo-400">Fiziksel Modelleme</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-1 text-zinc-300">
                            {data.insights.physical.map((insight, index) => (
                              <li key={index} className="flex items-start text-sm">
                                <span className="text-indigo-400 mr-2">•</span>
                                <span>{insight}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Sonuç */}
                    <div className="bg-zinc-800/30 p-4 rounded-md border border-zinc-700">
                      <h4 className="font-medium mb-2 text-emerald-400 text-sm">Sonuç</h4>
                      <p className="text-zinc-300 text-sm">{data.conclusion}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          ))}
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
