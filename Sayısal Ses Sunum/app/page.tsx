import { SynthesizerControls } from "@/components/synthesizer-controls"
import { ComparisonSection } from "@/components/comparison-section"
import { MethodExplainer } from "@/components/method-explainer"
import { SoundGallery } from "@/components/sound-gallery"
import { HeroSection } from "@/components/hero-section"
import { ParameterAnalysis } from "@/components/parameter-analysis"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
      <HeroSection />

      <div className="container mx-auto px-4 py-12 space-y-24">
        <MethodExplainer />

        <SynthesizerControls />

        <ParameterAnalysis />

        <ComparisonSection />

        <SoundGallery />

        {/* Hipotezler */}
        <section className="py-8 border-t border-zinc-800">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-medium text-zinc-400 mb-4">Araştırma Hipotezleri</h3>
            <div className="space-y-3 text-sm text-zinc-500">
              <p>
                <span className="font-medium text-zinc-400">Ana Hipotez:</span> Fiziksel modelleme, akustik
                enstrümanları simüle etmede FM sentezden daha gerçekçi sonuçlar verir, ancak daha fazla hesaplama gücü
                gerektirir.
              </p>
              <p>
                <span className="font-medium text-zinc-400">Alt Hipotez 1:</span> FM sentez, daha az parametre
                kullanarak daha çeşitli ses tınıları üretebilir.
              </p>
              <p>
                <span className="font-medium text-zinc-400">Alt Hipotez 2:</span> Fiziksel modelleme, seslerin geçiş
                karakteristiklerini ve artikülasyonlarını daha doğal şekilde üretir.
              </p>
              <p>
                <span className="font-medium text-zinc-400">Alt Hipotez 3:</span> Kullanıcılar, yaylı çalgı ve vurmalı
                çalgı seslerinde fiziksel modellemeyi, elektronik ve metalik seslerde ise FM sentezi daha başarılı
                bulacaktır.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
