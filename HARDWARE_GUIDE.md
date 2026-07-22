# Panduan Pembuatan Alat: APRS LoRa Tracker (ESP32 + LoRa E22 + GPS L86 + OLED)

Dokumen ini berisi panduan lengkap untuk merakit perangkat keras (hardware) dan menulis kode program mikrokontroler (firmware) menggunakan Arduino IDE untuk Tugas Akhir Anda.

---

## 🛠️ 1. Daftar Komponen Elektronik
1. **Mikrokontroler:** ESP32 Development Board (ESP-WROOM-32).
2. **Modul LoRa:** Ebyte E22 400M30S (Frekuensi 410-493 MHz, Daya Pancar 30dBm / 1 Watt).
3. **Modul GPS:** Quectel L86 (GPS multiband dengan antena patch bawaan).
4. **Layar Display:** OLED 0.96 inci (I2C SSD1306, 128x64 piksel).
5. **Aksesori:** Regulator tegangan (bila perlu, karena E22 30dBm membutuhkan arus puncak hingga 600mA saat memancarkan sinyal), kapasitor filter 1000uF pada jalur VCC LoRa, antena patch/monopole frekuensi 433 MHz.

---

## 🔌 2. Skema Pengkabelan (Wiring Diagram)

Hubungkan pin-pin komponen ke ESP32 sesuai dengan tabel pemetaan pin berikut:

### A. Modul GPS Quectel L86 ke ESP32
* Gunakan Hardware Serial 2 pada ESP32.
| Pin GPS L86 | Pin ESP32 | Keterangan |
| :--- | :--- | :--- |
| **VCC** | **3.3V** | Catu daya |
| **GND** | **GND** | Ground |
| **TXD** | **GPIO 16 (RX2)** | Jalur Transmit data GPS ke ESP32 |
| **RXD** | **GPIO 17 (TX2)** | Jalur Receive konfigurasi dari ESP32 |

### B. Modul OLED SSD1306 ke ESP32
* Menggunakan protokol I2C default.
| Pin OLED | Pin ESP32 | Keterangan |
| :--- | :--- | :--- |
| **VCC** | **3.3V** | Catu daya |
| **GND** | **GND** | Ground |
| **SCL** | **GPIO 22 (SCL)** | Serial Clock |
| **SDA** | **GPIO 21 (SDA)** | Serial Data |

### C. Modul LoRa Ebyte E22 400M30S ke ESP32
* Modul LoRa E22 400M30S menggunakan komunikasi serial (UART).
* **PENTING:** Modul E22 memiliki pin kontrol M0 dan M1 untuk menentukan mode operasi (Normal, Worst, Configuration, Sleep). Hubungkan M0 dan M1 ke GND untuk **Mode Normal (Transmisi data)**.
* **PENTING:** E22 400M30S bekerja pada level tegangan logik 3.3V. Namun, pastikan pin VCC LoRa mendapat suplai arus yang cukup (3.3V - 5.5V, disarankan regulator eksternal 5V yang terpisah dari 3.3V internal ESP32 jika modul sering restart saat transmit).

| Pin LoRa E22 | Pin ESP32 / Lainnya | Keterangan |
| :--- | :--- | :--- |
| **VCC** | **VCC 5V (Eksternal / Pin Vin ESP32)** | Suplai daya pemancar (butuh arus puncak 600mA) |
| **GND** | **GND (Hubungkan semua GND jadi satu)**| Ground bersama |
| **RXD** | **GPIO 27 (TX)** | Komunikasi UART (ESP32 TX ke LoRa RX) |
| **TXD** | **GPIO 25 (RX)** | Komunikasi UART (ESP32 RX ke LoRa TX) |
| **M0** | **GND** | Set ke Ground untuk Mode Normal |
| **M1** | **GND** | Set ke Ground untuk Mode Normal |
| **AUX** | **GPIO 26 (Input)** | Indikator status internal LoRa (Busy/Idle) |

---

## 💻 3. Kode Program Firmware ESP32 (Arduino C++)

Berikut adalah kode firmware lengkap. Sebelum mengunggah kode ini melalui Arduino IDE, pastikan Anda telah menginstal pustaka (libraries) berikut melalui **Library Manager**:
1. **TinyGPS++** (oleh Mikal Hart) - Untuk parsing data GPS NMEA.
2. **Adafruit SSD1306** & **Adafruit GFX Library** - Untuk mengontrol layar OLED.

```cpp
#include <Arduino.h>
#include <HardwareSerial.h>
#include <TinyGPS++.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// --- KONFIGURASI PIN ---
#define RX_GPS 16
#define TX_GPS 17

#define RX_LORA 25
#define TX_LORA 27
#define PIN_AUX 26

#define OLED_SDA 21
#define OLED_SCL 22

// --- SPESIFIKASI DISPLAY ---
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// --- GPS & SERIAL INSTANCES ---
TinyGPSPlus gps;
HardwareSerial SerialGPS(2);   // Hardware Serial 2 untuk GPS
HardwareSerial SerialLoRa(1);  // Hardware Serial 1 untuk LoRa E22

// --- PARAMETER TELEMETRI ---
const char* CALLSIGN = "YD2CLX-4";
unsigned long lastTxTime = 0;
const unsigned long txInterval = 30000; // Kirim paket koordinat setiap 30 detik

void initOLED() {
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { 
    Serial.println(F("OLED SSD1306 gagal diinisialisasi!"));
    for(;;); // Hentikan program jika OLED gagal
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0,0);
  display.println("APRS LORA TRACKER");
  display.println("Initializing...");
  display.display();
}

void setup() {
  Serial.begin(115200);
  
  // Inisialisasi Serial untuk GPS (L86 baudrate default adalah 9600)
  SerialGPS.begin(9600, SERIAL_8N1, RX_GPS, TX_GPS);
  
  // Inisialisasi Serial untuk LoRa E22 (Baudrate default 9600)
  SerialLoRa.begin(9600, SERIAL_8N1, RX_LORA, TX_LORA);
  pinMode(PIN_AUX, INPUT);
  
  initOLED();
  
  Serial.println("Hardware Init Selesai. Menunggu GPS lock...");
}

// Fungsi menunggu LoRa siap mengirim data (memeriksa pin AUX)
void waitLoRaReady() {
  while (digitalRead(PIN_AUX) == LOW) {
    delay(10); // Menunggu jika AUX bernilai LOW (LoRa sedang sibuk)
  }
}

// Fungsi mengirimkan paket data koordinat format APRS melalui LoRa
void transmitAPRS(double lat, double lon, double alt, double speedKnots) {
  waitLoRaReady();
  
  // Format Payload APRS Sederhana:
  // Callsign > AP-Destination : Latitude, Longitude, Altitude, Speed
  String aprsPacket = String(CALLSIGN) + ">APLRT1:";
  aprsPacket += String(lat, 5) + ",";
  aprsPacket += String(lon, 5) + ",";
  aprsPacket += "A=" + String((int)alt) + ",";
  aprsPacket += "S=" + String((int)speedKnots) + "knots";
  
  Serial.print("Memancarkan data APRS: ");
  Serial.println(aprsPacket);
  
  // Mengirim data ke Serial Modul LoRa E22
  SerialLoRa.println(aprsPacket);
  
  // Tampilkan notifikasi transmit di OLED
  display.clearDisplay();
  display.setCursor(0, 0);
  display.println(">> TRANSMITTING <<");
  display.print("Packet: ");
  display.println(CALLSIGN);
  display.print("Alt: ");
  display.print(alt);
  display.println(" m");
  display.display();
  delay(1500); // Tahan pesan transmit sebentar di layar
}

void updateOLEDDisplay(double lat, double lon, double alt, int satellites, double speedKmh) {
  display.clearDisplay();
  display.setCursor(0, 0);
  
  display.print("Call: ");
  display.println(CALLSIGN);
  
  display.print("Lat : ");
  display.println(lat, 4);
  
  display.print("Lon : ");
  display.println(lon, 4);
  
  display.print("Alt : ");
  display.print(alt, 1);
  display.println(" m");
  
  display.print("Spd : ");
  display.print(speedKmh, 1);
  display.println(" km/h");
  
  display.print("Sat : ");
  display.print(satellites);
  display.println(" Lock");
  
  display.display();
}

void loop() {
  // Membaca data masuk dari GPS
  while (SerialGPS.available() > 0) {
    gps.encode(SerialGPS.read());
  }

  // Jika GPS mendapatkan data koordinat yang valid (GPS Lock)
  if (gps.location.isValid()) {
    double lat = gps.location.lat();
    double lon = gps.location.lng();
    double alt = gps.altitude.meters();
    double speedKmh = gps.speed.kmph();
    double speedKnots = gps.speed.knots();
    int satellites = gps.satellites.value();
    
    // Perbarui Tampilan OLED secara berkala
    updateOLEDDisplay(lat, lon, alt, satellites, speedKmh);
    
    // Cek apakah waktu interval transmit data sudah terpenuhi
    if (millis() - lastTxTime >= txInterval) {
      transmitAPRS(lat, lon, alt, speedKnots);
      lastTxTime = millis();
    }
  } else {
    // Jika GPS belum mengunci koordinat (No GPS Lock)
    display.clearDisplay();
    display.setCursor(0, 0);
    display.println("WAITING GPS LOCK...");
    display.print("Sats Detected: ");
    display.println(gps.satellites.value());
    display.print("Uptime: ");
    display.print(millis() / 1000);
    display.println("s");
    display.display();
    delay(1000);
  }
}
```

---

## 🧭 4. Cara Uji Coba Alat di Lapangan
1. **Lakukan di Luar Ruangan (Open Sky):** Modul GPS membutuhkan visualisasi langit langsung untuk mengunci satelit. Biasanya membutuhkan waktu 1-3 menit pada *cold start* pertama kali dinyalakan.
2. **Pantau Layar OLED:** Layar OLED akan menunjukkan koordinat, ketinggian, dan kecepatan secara dinamis setelah GPS lock.
3. **Penerimaan Sinyal di Gateway:** Sinyal yang dipancarkan oleh LoRa E22 akan diterima oleh IGate/Gateway terdekat (yang terhubung ke server APRS-IS) dan data perjalanan Anda akan langsung terplot secara otomatis pada peta global di situs seperti `aprs.fi` atau dashboard visual yang akan kita bangun.
