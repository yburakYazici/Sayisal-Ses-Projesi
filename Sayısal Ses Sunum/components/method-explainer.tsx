"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AudioWaveformIcon as WaveformIcon, Music, Calculator } from "lucide-react"

export function MethodExplainer() {
  const [activeTab, setActiveTab] = useState("fm")

  return (
    <section id="methods" className="py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Sentez Yöntemleri</h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          İki farklı ses sentez yönteminin temel prensipleri ve matematiksel temelleri
        </p>
        <div className="flex items-center justify-center mt-6">
          <div className="h-1 w-16 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"></div>
        </div>
      </div>

      <Tabs defaultValue="fm" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-center mb-12">
          <TabsList className="bg-zinc-800/50 border border-zinc-700">
            <TabsTrigger
              value="fm"
              className="data-[state=active]:bg-violet-600 data-[state=active]:text-white px-8 py-3"
            >
              FM Sentezi
            </TabsTrigger>
            <TabsTrigger
              value="physical"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-8 py-3"
            >
              Fiziksel Modelleme
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* FM Sentezi İçeriği */}
          <TabsContent value="fm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              {/* Tanım ve Tarihçe */}
              <div className="text-center">
                <WaveformIcon className="h-12 w-12 text-violet-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-violet-400 mb-3">Frekans Modülasyonu Sentezi</h3>
                <p className="text-zinc-300 max-w-2xl mx-auto">
                  Bir taşıyıcı dalganın frekansını başka bir dalga ile modüle ederek karmaşık harmonik spektrumlar
                  oluşturan bir ses sentezi tekniğidir. 1973'te John Chowning tarafından geliştirilmiş ve 1983'te Yamaha
                  DX7 ile popülerlik kazanmıştır.
                </p>
              </div>

              {/* Ana Kart */}
              <Card className="bg-zinc-900/50 border-violet-900/30 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-violet-500 to-violet-700"></div>
                <CardHeader>
                  <CardTitle className="flex items-center text-violet-400">
                    <Calculator className="mr-2 h-5 w-5" />
                    Matematiksel Temel
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Formül */}
                  <div className="bg-black/30 p-6 rounded-md border border-violet-900/30 text-center">
                    <p className="text-violet-300 mb-4">Temel FM Denklemi:</p>
                    <div className="text-xl md:text-2xl text-white font-mono">
                      y(t) = A × sin(2πf<sub>c</sub>t + I × sin(2πf<sub>m</sub>t))
                    </div>
                  </div>

                  {/* İki Sütunlu Bilgi */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3 text-violet-400">Temel Parametreler</h4>
                      <ul className="space-y-3 text-zinc-300 text-sm">
                        <li>
                          <span className="font-medium text-violet-300 block">
                            Taşıyıcı Frekans (f<sub>c</sub>):
                          </span>
                          Algılanan temel frekans, sesin perdesi ile ilişkilidir.
                        </li>
                        <li>
                          <span className="font-medium text-violet-300 block">
                            Modülatör Frekans (f<sub>m</sub>):
                          </span>
                          Taşıyıcı frekansı modüle eden sinyal frekansı.
                        </li>
                        <li>
                          <span className="font-medium text-violet-300 block">Modülasyon İndeksi (I):</span>
                          Modülasyonun derinliğini belirler. Yüksek değerler daha zengin harmonik içerik üretir.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3 text-violet-400">Karakteristik Özellikler</h4>
                      <ul className="space-y-2 text-zinc-300 text-sm">
                        <li className="flex items-start">
                          <span className="text-violet-400 mr-2">•</span>
                          <span>Hesaplama açısından verimli</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-violet-400 mr-2">•</span>
                          <span>Zengin harmonik içerik üretebilme</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-violet-400 mr-2">•</span>
                          <span>Metalik ve çan benzeri sesler için ideal</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-violet-400 mr-2">•</span>
                          <span>Parametrik kontrol ile hassas ayarlama</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-violet-400 mr-2">•</span>
                          <span>Gerçekçi akustik sesler üretmekte zorluk</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Görsel Örnek */}
              <div className="aspect-[2/1] bg-gradient-to-br from-violet-900/20 to-violet-900/5 rounded-lg border border-violet-900/30 p-6 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-violet-400 mb-4">FM Sentezi Spektral Görünümü</p>
                  <div className="h-24 flex items-end justify-center gap-1">
                    {[...Array(32)].map((_, i) => {
                      const height = Math.sin(i * 0.3) * 0.5 + 0.5
                      return (
                        <div
                          key={i}
                          className="w-2 bg-gradient-to-t from-violet-600 to-violet-400"
                          style={{ height: `${height * 100}%` }}
                        ></div>
                      )
                    })}
                  </div>
                  <p className="text-xs text-zinc-500 mt-4">Belirgin harmonik tepeler ve düzenli spektral yapı</p>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Fiziksel Modelleme İçeriği */}
          <TabsContent value="physical">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              {/* Tanım ve Tarihçe */}
              <div className="text-center">
                <Music className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-indigo-400 mb-3">Fiziksel Modelleme Sentezi</h3>
                <p className="text-zinc-300 max-w-2xl mx-auto">
                  Gerçek enstrümanların fiziksel özelliklerini ve davranışlarını matematiksel denklemler kullanarak
                  simüle eden bir ses sentezi tekniğidir. 1983'te Karplus-Strong algoritması ile başlamış, sonrasında
                  Julius Smith'in dalga kılavuzu sentezi ile gelişmiştir.
                </p>
              </div>

              {/* Ana Kart */}
              <Card className="bg-zinc-900/50 border-indigo-900/30 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-indigo-500 to-indigo-700"></div>
                <CardHeader>
                  <CardTitle className="flex items-center text-indigo-400">
                    <Calculator className="mr-2 h-5 w-5" />
                    Matematiksel Temel
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Formül */}
                  <div className="bg-black/30 p-6 rounded-md border border-indigo-900/30 text-center">
                    <p className="text-indigo-300 mb-4">Dalga Denklemi (1 Boyutlu):</p>
                    <div className="text-xl md:text-2xl text-white font-mono">∂²y/∂t² = c² × ∂²y/∂x²</div>
                  </div>

                  {/* İki Sütunlu Bilgi */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3 text-indigo-400">Karplus-Strong Algoritması</h4>
                      <p className="text-sm text-zinc-300 mb-3">
                        Telli çalgıları modellemek için kullanılan basit ve etkili bir fiziksel modelleme tekniğidir.
                        Gecikme hattı ve alçak geçiren filtre kullanarak titreşen bir telin davranışını simüle eder.
                      </p>
                      <div className="text-xs text-zinc-400 bg-black/30 p-3 rounded border border-zinc-800">
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Gecikme hattını rastgele gürültü ile başlat</li>
                          <li>Gecikme hattının çıkışını ses çıkışı olarak kullan</li>
                          <li>Çıkışı alçak geçiren filtreden geçir</li>
                          <li>Filtrelenmiş sinyali gecikme hattının girişine geri besle</li>
                        </ol>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3 text-indigo-400">Karakteristik Özellikler</h4>
                      <ul className="space-y-2 text-zinc-300 text-sm">
                        <li className="flex items-start">
                          <span className="text-indigo-400 mr-2">•</span>
                          <span>Doğal ve gerçekçi sesler</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-indigo-400 mr-2">•</span>
                          <span>Gerçek enstrüman davranışlarını simüle eder</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-indigo-400 mr-2">•</span>
                          <span>Doğal atak ve sönüm karakteristikleri</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-indigo-400 mr-2">•</span>
                          <span>Yüksek hesaplama gücü gerektirir</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-indigo-400 mr-2">•</span>
                          <span>Sezgisel parametre kontrolü</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Görsel Örnek */}
              <div className="aspect-[2/1] bg-gradient-to-br from-indigo-900/20 to-indigo-900/5 rounded-lg border border-indigo-900/30 p-6 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-indigo-400 mb-4">Fiziksel Modelleme Spektral Görünümü</p>
                  <div className="h-24 flex items-end justify-center gap-1">
                    {[...Array(32)].map((_, i) => {
                      const height = Math.exp(-i * 0.15) * 0.9 + Math.random() * 0.1
                      return (
                        <div
                          key={i}
                          className="w-2 bg-gradient-to-t from-indigo-600 to-indigo-400"
                          style={{ height: `${height * 100}%` }}
                        ></div>
                      )
                    })}
                  </div>
                  <p className="text-xs text-zinc-500 mt-4">Doğal sönümlenme ve organik spektral yapı</p>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </div>
      </Tabs>
    </section>
  )
}
