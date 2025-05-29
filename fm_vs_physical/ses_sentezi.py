import numpy as np
import matplotlib.pyplot as plt
from scipy.io.wavfile import write
import time
import os

# Çıktı klasörünü oluştur
if not os.path.exists('output'):
    os.makedirs('output')

# Temel parametreler
sample_rate = 44100  # Hz
duration = 3.0  # saniye
t = np.linspace(0, duration, int(sample_rate * duration), False)
fundamental_freq = 440.0  # Hz (A4 notası)

# ADSR zarf fonksiyonu
def adsr_envelope(attack, decay, sustain, release, duration, sample_rate):
    """ADSR zarf oluşturur"""
    total_samples = int(duration * sample_rate)
    attack_samples = int(attack * sample_rate)
    decay_samples = int(decay * sample_rate)
    release_samples = int(release * sample_rate)
    sustain_samples = total_samples - attack_samples - decay_samples - release_samples
    
    envelope = np.zeros(total_samples)
    
    # Atak fazı
    envelope[:attack_samples] = np.linspace(0, 1, attack_samples)
    
    # Decay fazı
    envelope[attack_samples:attack_samples+decay_samples] = np.linspace(1, sustain, decay_samples)
    
    # Sustain fazı
    envelope[attack_samples+decay_samples:attack_samples+decay_samples+sustain_samples] = sustain
    
    # Release fazı
    envelope[attack_samples+decay_samples+sustain_samples:] = np.linspace(sustain, 0, release_samples)
    
    return envelope

# ADSR parametreleri
attack = 0.05  # saniye
decay = 0.1    # saniye
sustain = 0.7  # genlik seviyesi (0-1 arası)
release = 0.3  # saniye

# Zarf oluştur
envelope = adsr_envelope(attack, decay, sustain, release, duration, sample_rate)

# 1. FM SENTEZ
def fm_synthesis(carrier_freq, modulator_freq, modulation_index, envelope, duration, sample_rate):
    """FM sentez ile ses oluşturma"""
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    
    # FM sentez formülü
    modulator = np.sin(2 * np.pi * modulator_freq * t)
    carrier = np.sin(2 * np.pi * carrier_freq * t + modulation_index * modulator)
    
    # Zarfı uygula
    signal = carrier * envelope
    
    # Normalize et
    signal = signal / np.max(np.abs(signal)) * 0.9
    return signal

# 2. FİZİKSEL MODELLEME - Karplus-Strong String Model
def karplus_strong(freq, damping, stretch_factor, envelope, duration, sample_rate):
    """Karplus-Strong tel modeli"""
    N = int(sample_rate / freq)
    buffer_size = int(N * stretch_factor)  # Germe faktörü
    
    # Beyaz gürültü ile başlangıç durumu
    buffer = np.random.uniform(-1, 1, buffer_size)
    
    # Çıkış sinyali
    output = np.zeros(int(duration * sample_rate))
    
    # Karplus-Strong algoritması
    for i in range(len(output)):
        # Çıkış değerini hesapla
        output[i] = buffer[0]
        
        # Yeni değeri hesapla - alçak geçiren filtre ve gecikme
        new_value = ((1 - damping) * (buffer[0] + buffer[1])) / 2
        
        # Buffer'ı güncelle
        buffer = np.roll(buffer, -1)
        buffer[-1] = new_value
    
    # Zarfı uygula
    output = output * envelope
    
    # Normalize et
    output = output / np.max(np.abs(output)) * 0.9
    return output

# Farklı parametrelerle FM sentez sesleri oluştur
print("FM sentez sesleri oluşturuluyor...")

# Temel FM sesi
carrier_freq = fundamental_freq
modulator_freq = fundamental_freq  # 1:1 oranı (harmonik)
modulation_index = 5.0

start_time = time.time()
fm_basic = fm_synthesis(carrier_freq, modulator_freq, modulation_index, envelope, duration, sample_rate)
fm_time = time.time() - start_time
print(f"FM sentez hesaplama süresi: {fm_time:.6f} saniye")

# Farklı modülasyon indeksleri
mod_indices = [1.0, 5.0, 10.0]
fm_mod_signals = []

for idx, mod_index in enumerate(mod_indices):
    signal = fm_synthesis(carrier_freq, modulator_freq, mod_index, envelope, duration, sample_rate)
    fm_mod_signals.append(signal)
    write(f'output/fm_mod_index_{mod_index}.wav', sample_rate, (signal * 32767).astype(np.int16))
    print(f"FM sentez (mod_index={mod_index}) kaydedildi.")

# Farklı taşıyıcı/modülatör oranları
mod_ratios = [0.5, 1.0, 2.0]  # 2:1, 1:1, 1:2 oranları
fm_ratio_signals = []

for ratio in mod_ratios:
    signal = fm_synthesis(carrier_freq, carrier_freq * ratio, modulation_index, envelope, duration, sample_rate)
    fm_ratio_signals.append(signal)
    write(f'output/fm_ratio_{ratio}.wav', sample_rate, (signal * 32767).astype(np.int16))
    print(f"FM sentez (mod_ratio={ratio}) kaydedildi.")

# Farklı parametrelerle fiziksel modelleme sesleri oluştur
print("\nFiziksel modelleme sesleri oluşturuluyor...")

# Temel Karplus-Strong sesi
string_freq = fundamental_freq
damping_factor = 0.005
stretch_factor = 0.9

start_time = time.time()
physical_basic = karplus_strong(string_freq, damping_factor, stretch_factor, envelope, duration, sample_rate)
physical_time = time.time() - start_time
print(f"Fiziksel modelleme hesaplama süresi: {physical_time:.6f} saniye")

# Farklı sönümleme faktörleri
damping_factors = [0.001, 0.005, 0.02]
physical_damp_signals = []

for damp in damping_factors:
    signal = karplus_strong(string_freq, damp, stretch_factor, envelope, duration, sample_rate)
    physical_damp_signals.append(signal)
    write(f'output/physical_damping_{damp}.wav', sample_rate, (signal * 32767).astype(np.int16))
    print(f"Fiziksel modelleme (damping={damp}) kaydedildi.")

# Farklı germe faktörleri
stretch_factors = [0.8, 0.9, 1.0]
physical_stretch_signals = []

for stretch in stretch_factors:
    signal = karplus_strong(string_freq, damping_factor, stretch, envelope, duration, sample_rate)
    physical_stretch_signals.append(signal)
    write(f'output/physical_stretch_{stretch}.wav', sample_rate, (signal * 32767).astype(np.int16))
    print(f"Fiziksel modelleme (stretch={stretch}) kaydedildi.")

# Temel sesleri kaydet
write('output/fm_basic.wav', sample_rate, (fm_basic * 32767).astype(np.int16))
write('output/physical_basic.wav', sample_rate, (physical_basic * 32767).astype(np.int16))

print("\nTüm ses dosyaları başarıyla oluşturuldu.")

# Dalga formlarını görselleştir
plt.figure(figsize=(12, 6))

plt.subplot(2, 1, 1)
plt.plot(t[:2000], fm_basic[:2000])
plt.title('FM Sentez Dalga Formu (ilk 2000 örnek)')
plt.xlabel('Zaman (s)')
plt.ylabel('Genlik')
plt.grid(True)

plt.subplot(2, 1, 2)
plt.plot(t[:2000], physical_basic[:2000])
plt.title('Fiziksel Modelleme Dalga Formu (ilk 2000 örnek)')
plt.xlabel('Zaman (s)')
plt.ylabel('Genlik')
plt.grid(True)

plt.tight_layout()
plt.savefig("output/dalga_formlari.png")
print("Dalga formları grafiği kaydedildi.")

# Performans karşılaştırması
print(f"\nPerformans Karşılaştırması:")
print(f"FM Sentez: {fm_time:.6f} saniye")
print(f"Fiziksel Modelleme: {physical_time:.6f} saniye")
print(f"Oran: {physical_time/fm_time:.2f}x (Fiziksel modelleme / FM)")
