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

# FM sentez - modülasyon indeksi etkisi
print("FM sentez - modülasyon indeksi etkisi analizi...")
mod_indices = [1.0, 5.0, 10.0]
fm_mod_signals = []

for mod_index in mod_indices:
    sample_rate, signal = load_audio(f'output/fm_mod_index_{mod_index}.wav')
    fm_mod_signals.append(signal)

# Spektrogramları karşılaştır
plt.figure(figsize=(15, 10))
for i, (mod_index, signal) in enumerate(zip(mod_indices, fm_mod_signals)):
    plt.subplot(3, 1, i+1)
    D = librosa.stft(signal, n_fft=2048, hop_length=512, win_length=1024)
    S_db = librosa.amplitude_to_db(np.abs(D), ref=np.max)
    librosa.display.specshow(S_db, x_axis='time', y_axis='log', sr=sample_rate)
    plt.colorbar(format='%+2.0f dB')
    plt.title(f'FM Sentez - Modülasyon İndeksi: {mod_index}')

plt.tight_layout()
plt.savefig("output/fm_mod_index_karsilastirma.png")
plt.close()

# FM sentez - taşıyıcı/modülatör oranı etkisi
print("FM sentez - taşıyıcı/modülatör oranı etkisi analizi...")
mod_ratios = [0.5, 1.0, 2.0]
fm_ratio_signals = []

for ratio in mod_ratios:
    sample_rate, signal = load_audio(f'output/fm_ratio_{ratio}.wav')
    fm_ratio_signals.append(signal)

# Spektrogramları karşılaştır
plt.figure(figsize=(15, 10))
for i, (ratio, signal) in enumerate(zip(mod_ratios, fm_ratio_signals)):
    plt.subplot(3, 1, i+1)
    D = librosa.stft(signal, n_fft=2048, hop_length=512, win_length=1024)
    S_db = librosa.amplitude_to_db(np.abs(D), ref=np.max)
    librosa.display.specshow(S_db, x_axis='time', y_axis='log', sr=sample_rate)
    plt.colorbar(format='%+2.0f dB')
    plt.title(f'FM Sentez - Taşıyıcı/Modülatör Oranı: {ratio}')

plt.tight_layout()
plt.savefig("output/fm_ratio_karsilastirma.png")
plt.close()

# Fiziksel modelleme - sönümleme faktörü etkisi
print("Fiziksel modelleme - sönümleme faktörü etkisi analizi...")
damping_factors = [0.001, 0.005, 0.02]
physical_damp_signals = []

for damp in damping_factors:
    sample_rate, signal = load_audio(f'output/physical_damping_{damp}.wav')
    physical_damp_signals.append(signal)

# Spektrogramları karşılaştır
plt.figure(figsize=(15, 10))
for i, (damp, signal) in enumerate(zip(damping_factors, physical_damp_signals)):
    plt.subplot(3, 1, i+1)
    D = librosa.stft(signal, n_fft=2048, hop_length=512, win_length=1024)
    S_db = librosa.amplitude_to_db(np.abs(D), ref=np.max)
    librosa.display.specshow(S_db, x_axis='time', y_axis='log', sr=sample_rate)
    plt.colorbar(format='%+2.0f dB')
    plt.title(f'Fiziksel Modelleme - Sönümleme Faktörü: {damp}')

plt.tight_layout()
plt.savefig("output/physical_damping_karsilastirma.png")
plt.close()

# Fiziksel modelleme - germe faktörü etkisi
print("Fiziksel modelleme - germe faktörü etkisi analizi...")
stretch_factors = [0.8, 0.9, 1.0]
physical_stretch_signals = []

for stretch in stretch_factors:
    sample_rate, signal = load_audio(f'output/physical_stretch_{stretch}.wav')
    physical_stretch_signals.append(signal)

# Spektrogramları karşılaştır
plt.figure(figsize=(15, 10))
for i, (stretch, signal) in enumerate(zip(stretch_factors, physical_stretch_signals)):
    plt.subplot(3, 1, i+1)
    D = librosa.stft(signal, n_fft=2048, hop_length=512, win_length=1024)
    S_db = librosa.amplitude_to_db(np.abs(D), ref=np.max)
    librosa.display.specshow(S_db, x_axis='time', y_axis='log', sr=sample_rate)
    plt.colorbar(format='%+2.0f dB')
    plt.title(f'Fiziksel Modelleme - Germe Faktörü: {stretch}')

plt.tight_layout()
plt.savefig("output/physical_stretch_karsilastirma.png")
plt.close()

# Atak karakteristiği karşılaştırması
print("Atak karakteristiği karşılaştırması...")

def compare_attacks(signals, labels, title, filename):
    """Farklı seslerin atak karakteristiklerini karşılaştır"""
    plt.figure(figsize=(10, 6))
    
    for i, (signal, label) in enumerate(zip(signals, labels)):
        # İlk 500 ms'yi al
        attack_samples = int(0.5 * sample_rate)
        attack_signal = signal[:attack_samples]
        
        # RMS enerji hesapla
        frame_length = 512
        hop_length = 128
        rms = librosa.feature.rms(y=attack_signal, frame_length=frame_length, hop_length=hop_length)[0]
        rms_times = librosa.times_like(rms, sr=sample_rate, hop_length=hop_length)
        
        plt.plot(rms_times, rms, label=label)
    
    plt.title(title)
    plt.xlabel('Zaman (s)')
    plt.ylabel('RMS Enerji')
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.savefig(filename)
    plt.close()

# Temel sesleri yükle
sample_rate, fm_basic = load_audio('output/fm_basic.wav')
_, physical_basic = load_audio('output/physical_basic.wav')

# Atak karşılaştırması
compare_attacks(
    [fm_basic, physical_basic],
    ['FM Sentez', 'Fiziksel Modelleme'],
    'FM vs Fiziksel Modelleme - Atak Karakteristiği Karşılaştırması',
    'output/atak_karsilastirma.png'
)

print("Tüm parametre analizleri tamamlandı.")
