import os
import subprocess
import time
import sys

def run_script(script_name, description):
    """Bir Python scriptini çalıştır"""
    print(f"\n{'='*80}")
    print(f"  {description} çalıştırılıyor...")
    print(f"{'='*80}\n")
    
    try:
        subprocess.run([sys.executable, script_name], check=True)
        print(f"\n✅ {script_name} başarıyla çalıştırıldı.\n")
        return True
    except subprocess.CalledProcessError as e:
        print(f"\n❌ {script_name} çalıştırılırken hata oluştu: {e}\n")
        return False
    except FileNotFoundError:
        print(f"\n❌ {script_name} dosyası bulunamadı.\n")
        return False

def main():
    """Ana fonksiyon - tüm adımları sırayla çalıştır"""
    # Çıktı klasörünü kontrol et
    if not os.path.exists("output"):
        os.makedirs("output")
        print("'output' klasörü oluşturuldu.")
    
    # 1. Ses sentezi
    if not run_script("ses_sentezi.py", "Ses sentezi"):
        print("Ses sentezi adımı başarısız oldu. İşlem durduruluyor.")
        return
    
    # 2. Spektral analiz
    if not run_script("spektral_analiz.py", "Spektral analiz"):
        print("Spektral analiz adımı başarısız oldu. İşlem durduruluyor.")
        return
    
    # 3. Rapor oluşturma
    if not run_script("rapor_olustur.py", "Rapor oluşturma"):
        print("Rapor oluşturma adımı başarısız oldu. İşlem durduruluyor.")
        return
    
    # 4. Web oynatıcı
    if not run_script("web_oynatici_gelismis.py", "Web oynatıcı"):
        print("Web oynatıcı adımı başarısız oldu.")
    
    print("\n" + "="*80)
    print("  PROJE BAŞARIYLA TAMAMLANDI!")
    print("="*80)
    print("\nÇıktılar 'output' klasöründe bulunabilir:")
    print("  - Ses dosyaları (.wav)")
    print("  - Analiz grafikleri (output/analysis/*.png)")
    print("  - Rapor (FM_vs_Fiziksel_Modelleme_Raporu.md ve .html)")
    print("  - Web oynatıcı (audio_player.html)")

if __name__ == "__main__":
    start_time = time.time()
    main()
    end_time = time.time()
    print(f"\nToplam çalışma süresi: {end_time - start_time:.2f} saniye")
