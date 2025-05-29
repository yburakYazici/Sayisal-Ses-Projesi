import os
import webbrowser

def create_html_player(directory="output"):
    """Ses dosyalarını oynatmak için HTML sayfası oluştur"""
    if not os.path.exists(directory):
        print(f"Hata: {directory} dizini bulunamadı.")
        return
    
    audio_files = [f for f in os.listdir(directory) if f.endswith('.wav')]
    
    if not audio_files:
        print("Hiç ses dosyası bulunamadı. Önce ses_sentezi.py dosyasını çalıştırın.")
        return
    
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>FM ve Fiziksel Modelleme Ses Örnekleri</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #333; }
            .audio-container { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
            .audio-title { font-weight: bold; margin-bottom: 10px; }
            audio { width: 100%; }
            .description { font-size: 0.9em; color: #666; margin-top: 10px; }
        </style>
    </head>
    <body>
        <h1>FM ve Fiziksel Modelleme Ses Örnekleri</h1>
    """
    
    # FM ve Fiziksel Modelleme temel seslerini önce ekle
    priority_files = ["fm_basic.wav", "physical_basic.wav"]
    for file in priority_files:
        if file in audio_files:
            file_path = os.path.join(directory, file)
            title = "FM Sentez Temel Ses" if file == "fm_basic.wav" else "Fiziksel Modelleme Temel Ses"
            description = "Temel FM sentez parametreleri ile üretilen ses" if file == "fm_basic.wav" else "Karplus-Strong algoritması ile üretilen tel modeli sesi"
            
            html_content += f"""
            <div class="audio-container">
                <div class="audio-title">{title}</div>
                <audio controls>
                    <source src="{file_path}" type="audio/wav">
                    Tarayıcınız audio elementini desteklemiyor.
                </audio>
                <div class="description">{description}</div>
            </div>
            """
    
    # Diğer ses dosyalarını ekle
    for file in audio_files:
        if file not in priority_files:
            file_path = os.path.join(directory, file)
            title = file.replace(".wav", "").replace("_", " ").title()
            
            # Dosya adına göre açıklama ekle
            if "fm_mod_index" in file:
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
                    <source src="{file_path}" type="audio/wav">
                    Tarayıcınız audio elementini desteklemiyor.
                </audio>
                <div class="description">{description}</div>
            </div>
            """
    
    html_content += """
    </body>
    </html>
    """
    
    # HTML dosyasını oluştur
    html_file = os.path.join(directory, "audio_player.html")
    with open(html_file, "w") as f:
        f.write(html_content)
    
    print(f"HTML oynatıcı oluşturuldu: {html_file}")
    
    # Tarayıcıda aç
    webbrowser.open('file://' + os.path.abspath(html_file))

if __name__ == "__main__":
    create_html_player()
