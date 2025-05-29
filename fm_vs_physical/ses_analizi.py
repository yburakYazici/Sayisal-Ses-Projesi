import numpy as np
import matplotlib.pyplot as plt
from scipy.io.wavfile import read
import librosa
import librosa.display
import os

# Çıktı klasörünü kontrol et
if not os.path.exists('output'):
    os.makedirs('output')

# Ses dosyalarını yükle
def load_audio(filename):
    """Ses dosyasını yükle ve normalize et"""
    sample_rate, signal = read(filename)
    signal = signal / 32767.0  # 16-bit ses için normalize et
    return sample_rate, signal

print("Ses dosyaları yükleniyor...")
sample_rate, fm_basic = load_audio('output/fm_basic.wav')
_, physical_basic = load_audio('output/physical_basic.wav')

# Spektrogram analizi
def create_spectrogram(signal, sample_rate, title, filename):
    """Spektrogram oluştur ve kaydet"""
    plt.figure(figsize=(10, 4))
    
    # STFT (Short-Time Fourier Transform)
    D = librosa.stft(signal, n_fft=2048, hop_length=512, win_length=1024)
    
    # Spektrogram
    S_db = librosa.amplitude_to_db(np.abs(D), ref=np.max)
    
    # Görselleştir
    img = librosa.display.specshow(S_db, x_axis='time', y_axis='log', sr=sample_rate)
    plt.colorbar(format='%+2.0f dB')
    plt.title(title)
    plt.tight_layout()
    plt.savefig(filename)
    plt.close()
    
    return S_db

print("Spektrogramlar oluşturuluyor...")
fm_spec = create_spectrogram(fm_basic, sample_rate, "FM Sentez Spektrogramı", "output/fm_spectrogram.png")
physical_spec = create_spectrogram(physical_basic, sample_rate, "Fiziksel Modelleme Spektrogramı", "output/physical_spectrogram.png")

# Harmonik içerik analizi
def harmonic_analysis(signal, sample_rate, fundamental_freq, title, filename, max_harmonic=20):
    """Harmonik içeriği analiz et"""
    # FFT hesapla
    n = len(signal)
    yf = np.abs(np.fft.rfft(signal))
    xf = np.fft.rfftfreq(n, 1 / sample_rate)
    
    # Harmonik güçlerini bul
    harmonic_powers = []
    harmonic_indices = []
    
    for i in range(1, max_harmonic + 1):
        harmonic_freq = fundamental_freq * i
        idx = np.argmin(np.abs(xf - harmonic_freq))
        harmonic_indices.append(idx)
        harmonic_powers.append(yf[idx])
    
    # Normalize et
    harmonic_powers = np.array(harmonic_powers) / np.max(harmonic_powers)
    
    # Harmonik içeriği görselleştir
    plt.figure(figsize=(10, 4))
    plt.stem(range(1, max_harmonic + 1), harmonic_powers, use_line_collection=True)
    plt.title(title)
    plt.xlabel('Harmonik Sayısı')
    plt.ylabel('Normalize Genlik')
    plt.grid(True)
    plt.tight_layout()
    plt.savefig(filename)
    plt.close()
    
    return harmonic_powers

print("Harmonik analizler yapılıyor...")
fundamental_freq = 440.0
fm_harm = harmonic_analysis(fm_basic, sample_rate, fundamental_freq, 
                           "FM Sentez - Harmonik İçerik", "output/fm_harmonics.png")
physical_harm = harmonic_analysis(physical_basic, sample_rate, fundamental_freq, 
                                 "Fiziksel Modelleme - Harmonik İçerik", "output/physical_harmonics.png")

# Spektral merkezoid analizi
def spectral_centroid(signal, sample_rate, title, filename):
    """Spektral merkezoid hesapla ve görselleştir"""
    # Spektral merkezoid hesapla
    cent = librosa.feature.spectral_centroid(y=signal, sr=sample_rate)
    
    # Zaman ekseni
    times = librosa.times_like(cent)
    
    # Görselleştir
    plt.figure(figsize=(10, 4))
    plt.subplot(2, 1, 1)
    plt.plot(times, cent.T)
    plt.title(f"{title} - Spektral Merkezoid")
    plt.xlabel('Zaman (s)')
    plt.ylabel('Frekans (Hz)')
    plt.grid(True)
    
    # Spektrogramın üzerine merkezoidi çiz
    plt.subplot(2, 1, 2)
    D = librosa.stft(signal)
    S_db = librosa.amplitude_to_db(np.abs(D), ref=np.max)
    img = librosa.display.specshow(S_db, x_axis='time', y_axis='log', sr=sample_rate)
    plt.plot(times, cent.T, color='w', linewidth=2)
    plt.colorbar(format='%+2.0f dB')
    plt.title(f"{title} - Spektrogram ve Merkezoid")
    
    plt.tight_layout()
    plt.savefig(filename)
    plt.close()
    
    return cent

print("Spektral merkezoid analizleri yapılıyor...")
fm_cent = spectral_centroid(fm_basic, sample_rate, "FM Sentez", "output/fm_centroid.png")
physical_cent = spectral_centroid(physical_basic, sample_rate, "Fiziksel Modelleme", "output/physical_centroid.png")

# Atak analizi
def attack_analysis(signal, sample_rate, title, filename):
    """Atak karakteristiğini analiz et"""
    # İlk 500 ms'yi al
    attack_samples = int(0.5 * sample_rate)
    attack_signal = signal[:attack_samples]
    attack_time = np.linspace(0, 0.5, attack_samples)
    
    # RMS enerji hesapla
    frame_length = 512
    hop_length = 128
    rms = librosa.feature.rms(y=attack_signal, frame_length=frame_length, hop_length=hop_length)[0]
    rms_times = librosa.times_like(rms, sr=sample_rate, hop_length=hop_length)
    
    # Görselleştir
    plt.figure(figsize=(10, 4))
    plt.plot(rms_times, rms)
    plt.title(f"{title} - Atak Karakteristiği")
    plt.xlabel('Zaman (s)')
    plt.ylabel('RMS Enerji')
    plt.grid(True)
    plt.tight_layout()
    plt.savefig(filename)
    plt.close()
    
    return rms

print("Atak analizleri yapılıyor...")
fm_attack = attack_analysis(fm_basic, sample_rate, "FM Sentez", "output/fm_attack.png")
physical_attack = attack_analysis(physical_basic, sample_rate, "Fiziksel Modelleme", "output/physical_attack.png")

# Karşılaştırmalı harmonik analizi
plt.figure(figsize=(10, 6))
plt.stem(range(1, len(fm_harm) + 1), fm_harm, 'r', use_line_collection=True, label='FM Sentez')
plt.stem(range(1, len(physical_harm) + 1), physical_harm, 'b', use_line_collection=True, label='Fiziksel Modelleme')
plt.title('Harmonik İçerik Karşılaştırması')
plt.xlabel('Harmonik Sayısı')
plt.ylabel('Normalize Genlik')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.savefig("output/harmonik_karsilastirma.png")

print("Tüm analizler tamamlandı.")
