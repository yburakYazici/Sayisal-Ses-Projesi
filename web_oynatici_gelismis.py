import os
import webbrowser
import shutil

def create_html_player(directory="output"):
    """Ses dosyalarını oynatmak için geliştirilmiş HTML sayfası oluştur"""
    # Çıktı dizinini kontrol et ve gerekirse oluştur
    if not os.path.exists(directory):
        print(f"'{directory}' dizini bulunamadı. Oluşturuluyor...")
        os.makedirs(directory)
    
    # Ses dosyalarını kontrol et
    audio_files = [f for f in os.listdir(directory) if f.endswith('.wav')]
    
    if not audio_files:
        print("Hiç ses dosyası bulunamadı. Önce ses_sentezi.py dosyasını çalıştırın.")
        return
    
    # Tam dosya yollarını al
    audio_file_paths = [os.path.abspath(os.path.join(directory, f)) for f in audio_files]
    
    # Dosya boyutlarını kontrol et
    empty_files = []
    for file_path in audio_file_paths:
        if os.path.getsize(file_path) == 0:
            empty_files.append(os.path.basename(file_path))
    
    if empty_files:
        print(f"Dikkat: Aşağıdaki dosyalar boş görünüyor: {', '.join(empty_files)}")
    
    # HTML içeriğini oluştur
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>FM ve Fiziksel Modelleme Ses Örnekleri</title>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #333; }
            .audio-container { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
            .audio-title { font-weight: bold; margin-bottom: 10px; }
            audio { width: 100%; }
            .description { font-size: 0.9em; color: #666; margin-top: 10px; }
            .file-info { font-size: 0.8em; color: #999; margin-top: 5px; }
            .error { color: red; font-weight: bold; }
        </style>
    </head>
    <body>
        <h1>FM ve Fiziksel Modelleme Ses Örnekleri</h1>
        <p>Bu sayfa, FM sentezi ve fiziksel modelleme sentezi ile üretilen ses örneklerini içermektedir.</p>
    """
    
    # Ses dosyalarını HTML'e ekle
    for file, file_path in zip(audio_files, audio_file_paths):
        title = file.replace(".wav", "").replace("_", " ").title()
        file_size = os.path.getsize(file_path) / 1024  # KB cinsinden
        
        # Dosya adına göre açıklama ekle
        if "fm_basic" in file:
            description = "Temel FM sentez parametreleri ile üretilen ses"
        elif "physical_basic" in file:
            description = "Karplus-Strong algoritması ile üretilen tel modeli sesi"
        elif "fm_mod_index" in file:
            mod_index = file.split("_")[-1].replace(".wav", "")
            description = f"FM sentez, modülasyon indeksi: {mod_index}"
        elif "fm_ratio" in file:
            ratio = file.split("_")[-1].replace(".wav", "")
            description = f"FM sentez, taşıyıcı/modülatör oranı: {ratio}"
        elif "physical_damping" in file:
            damp = file.split("_")[-1].replace(".wav", "")
            description = f"Fiziksel modelleme, sönümleme faktörü: {damp}"
        elif "physical_stretch" in file:
            stretch = file.split("_")[-1].replace(".wav", "")
            description = f"Fiziksel modelleme, germe faktörü: {stretch}"
        else:
            description = ""
        
        html_content += f"""
        <div class="audio-container">
            <div class="audio-title">{title}</div>
            <audio controls>
                <source src="file://{file_path}" type="audio/wav">
                Tarayıcınız audio elementini desteklemiyor.
            </audio>
            <div class="description">{description}</div>
            <div class="file-info">Dosya: {file} ({file_size:.2f} KB)</div>
        </div>
        """
    
    # Sorun giderme bilgilerini ekle
    html_content += """
        <h2>Ses Dosyaları Çalışmıyorsa</h2>
        <p>Eğer ses dosyaları çalışmıyorsa, aşağıdaki adımları deneyin:</p>
        <ol>
            <li>Tarayıcınızın yerel dosyalara erişim izni olduğundan emin olun.</li>
            <li>Chrome kullanıyorsanız, güvenlik kısıtlamaları nedeniyle yerel dosyalara erişim engellenmiş olabilir. Firefox veya Safari gibi alternatif bir tarayıcı deneyin.</li>
            <li>Ses dosyalarının gerçekten oluşturulduğundan emin olun. Önce <code>ses_sentezi.py</code> dosyasını çalıştırın.</li>
            <li>Alternatif olarak, aşağıdaki Python kodunu kullanarak sesleri dinleyebilirsiniz.</li>
        </ol>
        
        <h3>Python ile Ses Dosyalarını Dinleme</h3>
        <pre>
import os
from scipy.io.wavfile import read
import numpy as np
import simpleaudio as sa  # pip install simpleaudio

def play_wav(file_path):
    sample_rate, data = read(file_path)
    # Stereo ise mono'ya çevir
    if len(data.shape) > 1:
        data = data[:, 0]
    # int16 formatına çevir
    data = data.astype(np.int16)
    # Çal
    play_obj = sa.play_buffer(data, 1, 2, sample_rate)
    # Ses bitene kadar bekle
    play_obj.wait_done()

# Örnek kullanım
play_wav('output/fm_basic.wav')
        </pre>
    </body>
    </html>
    """
    
    # HTML dosyasını oluştur
    html_file = os.path.join(directory, "audio_player.html")
    with open(html_file, "w", encoding="utf-8") as f:
        f.write(html_content)
    
    print(f"HTML oynatıcı oluşturuldu: {html_file}")
    
    # Tarayıcıda aç
    webbrowser.open('file://' + os.path.abspath(html_file))
    
    return html_file

if __name__ == "__main__":
    create_html_player()
