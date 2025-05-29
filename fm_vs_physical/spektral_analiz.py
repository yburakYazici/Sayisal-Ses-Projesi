import numpy as np
import matplotlib.pyplot as plt
from scipy.io.wavfile import read
import librosa
import librosa.display
import os

def analyze_audio_files(directory="output"):
    """Ses dosyalarının spektral analizini yap"""
    # Çıktı klasörünü kontrol et
    if not os.path.exists(directory):
        print(f"Hata: {directory} dizini bulunamadı.")
        return
    
    # Analiz sonuçları için klasör oluştur
    analysis_dir = os.path.join(directory, "analysis")
    if not os.path.exists(analysis_dir):
        os.makedirs(analysis_dir)
    
    # Temel ses dosyalarını bul
    fm_basic_file = None
    physical_basic_file = None
    
    for file in os.listdir(directory):
        if file.endswith('.wav'):
            if 'fm_basic' in file:
                fm_basic_file = file
            elif 'physical_basic' in file:
                physical_basic_file = file
    
    if not fm_basic_file or not physical_basic_file:
        print("Temel ses dosyaları bulunamadı.")
        return
    
    # Ses dosyalarını yükle
    print(f"FM sentez dosyası: {fm_basic_file}")
    print(f"Fiziksel modelleme dosyası: {physical_basic_file}")
    
    fm_path = os.path.join(directory, fm_basic_file)
    physical_path = os.path.join(directory, physical_basic_file)
    
    fm_sr, fm_audio = read(fm_path)
    physical_sr, physical_audio = read(physical_path)
    
    # Normalize et
    fm_audio = fm_audio / 32767.0
    physical_audio = physical_audio / 32767.0
    
    # 1. Dalga Formları Karşılaştırması
    plt.figure(figsize=(12, 6))
    
    # İlk 1000 örneği göster (yaklaşık 23 ms @ 44.1kHz)
    samples = 1000
    time_axis = np.linspace(0, samples/fm_sr, samples)
    
    plt.subplot(2, 1, 1)
    plt.plot(time_axis, fm_audio[:samples])
    plt.title('FM Sentez - Dalga Formu')
    plt.xlabel('Zaman (s)')
    plt.ylabel('Genlik')
    plt.grid(True)
    
    plt.subplot(2, 1, 2)
    plt.plot(time_axis, physical_audio[:samples])
    plt.title('Fiziksel Modelleme - Dalga Formu')
    plt.xlabel('Zaman (s)')
    plt.ylabel('Genlik')
    plt.grid(True)
    
    plt.tight_layout()
    plt.savefig(os.path.join(analysis_dir, "dalga_formlari_karsilastirma.png"))
    plt.close()
    
    # 2. Spektrogramlar
    plt.figure(figsize=(12, 8))
    
    plt.subplot(2, 1, 1)
    D_fm = librosa.stft(fm_audio, n_fft=2048, hop_length=512)
    S_db_fm = librosa.amplitude_to_db(np.abs(D_fm), ref=np.max)
    librosa.display.specshow(S_db_fm, sr=fm_sr, x_axis='time', y_axis='log')
    plt.colorbar(format='%+2.0f dB')
    plt.title('FM Sentez - Spektrogram')
    
    plt.subplot(2, 1, 2)
    D_physical = librosa.stft(physical_audio, n_fft=2048, hop_length=512)
    S_db_physical = librosa.amplitude_to_db(np.abs(D_physical), ref=np.max)
    librosa.display.specshow(S_db_physical, sr=physical_sr, x_axis='time', y_axis='log')
    plt.colorbar(format='%+2.0f dB')
    plt.title('Fiziksel Modelleme - Spektrogram')
    
    plt.tight_layout()
    plt.savefig(os.path.join(analysis_dir, "spektrogramlar.png"))
    plt.close()
    
    # 3. Harmonik İçerik Analizi
    fundamental_freq = 440.0  # A4 notası
    max_harmonic = 15
    
    # FFT hesapla
    n_fm = len(fm_audio)
    n_physical = len(physical_audio)
    
    yf_fm = np.abs(np.fft.rfft(fm_audio))
    xf_fm = np.fft.rfftfreq(n_fm, 1 / fm_sr)
    
    yf_physical = np.abs(np.fft.rfft(physical_audio))
    xf_physical = np.fft.rfftfreq(n_physical, 1 / physical_sr)
    
    # Harmonik güçlerini bul
    fm_harmonics = []
    physical_harmonics = []
    
    for i in range(1, max_harmonic + 1):
        harmonic_freq = fundamental_freq * i
        
        # FM için en yakın frekans indeksini bul
        idx_fm = np.argmin(np.abs(xf_fm - harmonic_freq))
        fm_harmonics.append(yf_fm[idx_fm])
        
        # Fiziksel modelleme için en yakın frekans indeksini bul
        idx_physical = np.argmin(np.abs(xf_physical - harmonic_freq))
        physical_harmonics.append(yf_physical[idx_physical])
    
    # Normalize et
    fm_harmonics = np.array(fm_harmonics) / np.max(fm_harmonics)
    physical_harmonics = np.array(physical_harmonics) / np.max(physical_harmonics)
    
    # Harmonik içeriği görselleştir
    plt.figure(figsize=(10, 6))
    
    x = np.arange(1, max_harmonic + 1)
    width = 0.35
    
    plt.bar(x - width/2, fm_harmonics, width, label='FM Sentez')
    plt.bar(x + width/2, physical_harmonics, width, label='Fiziksel Modelleme')
    
    plt.xlabel('Harmonik Sayısı')
    plt.ylabel('Normalize Genlik')
    plt.title('Harmonik İçerik Karşılaştırması')
    plt.xticks(x)
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(os.path.join(analysis_dir, "harmonik_icerik.png"))
    plt.close()
    
    # 4. Spektral Merkezoid Analizi
    plt.figure(figsize=(12, 6))
    
    # FM için spektral merkezoid
    cent_fm = librosa.feature.spectral_centroid(y=fm_audio, sr=fm_sr)
    times_fm = librosa.times_like(cent_fm, sr=fm_sr)
    
    plt.subplot(2, 1, 1)
    plt.semilogy(times_fm, cent_fm.T, label='Spektral Merkezoid')
    plt.ylabel('Frekans (Hz)')
    plt.title('FM Sentez - Spektral Merkezoid')
    plt.legend()
    
    # Fiziksel modelleme için spektral merkezoid
    cent_physical = librosa.feature.spectral_centroid(y=physical_audio, sr=physical_sr)
    times_physical = librosa.times_like(cent_physical, sr=physical_sr)
    
    plt.subplot(2, 1, 2)
    plt.semilogy(times_physical, cent_physical.T, label='Spektral Merkezoid')
    plt.xlabel('Zaman (s)')
    plt.ylabel('Frekans (Hz)')
    plt.title('Fiziksel Modelleme - Spektral Merkezoid')
    plt.legend()
    
    plt.tight_layout()
    plt.savefig(os.path.join(analysis_dir, "spektral_merkezoid.png"))
    plt.close()
    
    # 5. Atak Analizi
    plt.figure(figsize=(10, 6))
    
    # İlk 500 ms'yi al
    attack_samples = int(0.5 * fm_sr)
    attack_time = np.linspace(0, 0.5, attack_samples)
    
    # RMS enerji hesapla
    frame_length = 512
    hop_length = 128
    
    rms_fm = librosa.feature.rms(y=fm_audio[:attack_samples], frame_length=frame_length, hop_length=hop_length)[0]
    rms_physical = librosa.feature.rms(y=physical_audio[:attack_samples], frame_length=frame_length, hop_length=hop_length)[0]
    
    rms_times = librosa.times_like(rms_fm, sr=fm_sr, hop_length=hop_length)
    
    plt.plot(rms_times, rms_fm, label='FM Sentez')
    plt.plot(rms_times, rms_physical, label='Fiziksel Modelleme')
    plt.title('Atak Karakteristiği Karşılaştırması')
    plt.xlabel('Zaman (s)')
    plt.ylabel('RMS Enerji')
    plt.legend()
    plt.grid(True)
    
    plt.tight_layout()
    plt.savefig(os.path.join(analysis_dir, "atak_karsilastirma.png"))
    plt.close()
    
    # 6. Frekans Spektrumu Karşılaştırması
    plt.figure(figsize=(12, 6))
    
    # İlk 5000 Hz'i göster
    max_freq = 5000
    max_idx_fm = np.where(xf_fm > max_freq)[0][0] if len(np.where(xf_fm > max_freq)[0]) > 0 else len(xf_fm)
    max_idx_physical = np.where(xf_physical > max_freq)[0][0] if len(np.where(xf_physical > max_freq)[0]) > 0 else len(xf_physical)
    
    plt.plot(xf_fm[:max_idx_fm], yf_fm[:max_idx_fm], label='FM Sentez')
    plt.plot(xf_physical[:max_idx_physical], yf_physical[:max_idx_physical], label='Fiziksel Modelleme')
    plt.title('Frekans Spektrumu Karşılaştırması')
    plt.xlabel('Frekans (Hz)')
    plt.ylabel('Genlik')
    plt.legend()
    plt.grid(True)
    
    plt.tight_layout()
    plt.savefig(os.path.join(analysis_dir, "frekans_spektrumu.png"))
    plt.close()
    
    print(f"Analiz tamamlandı. Sonuçlar {analysis_dir} klasörüne kaydedildi.")
    return analysis_dir

if __name__ == "__main__":
    analyze_audio_files()
