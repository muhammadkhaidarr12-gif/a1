// APRS LoRa Handheld Tracker Simulator - Core Application Script

// --- MOUNTAIN ROUTE DATABASE ---
const mountainDatabase = {
  merbabu_selo: {
    name: "G. Merbabu - Selo",
    peakName: "Puncak Kenteng Songo",
    checkpoints: [
      { name: "Basecamp Selo", lat: -7.4528, lon: 110.4192, alt: 1560 },
      { name: "Pos 1 (Dok Malang)", lat: -7.4475, lon: 110.4285, alt: 1850 },
      { name: "Pos 2 (Kupang)", lat: -7.4430, lon: 110.4350, alt: 2200 },
      { name: "Pos 3 (Batu Tulis)", lat: -7.4380, lon: 110.4410, alt: 2575 },
      { name: "Sabana 1", lat: -7.4330, lon: 110.4455, alt: 2775 },
      { name: "Sabana 2", lat: -7.4285, lon: 110.4468, alt: 2860 },
      { name: "Puncak Kenteng Songo", lat: -7.4255, lon: 110.4428, alt: 3142 }
    ],
    gateways: [
      { call: "YE2YE-12", lat: -7.7956, lon: 110.3695, alt: 113 }, // Jogja Gateway
      { call: "YD2SNK", lat: -7.3125, lon: 110.1524, alt: 720 }  // Temanggung Gateway
    ]
  },
  sindoro_kledung: {
    name: "G. Sindoro - Kledung",
    peakName: "Puncak Sindoro",
    checkpoints: [
      { name: "Basecamp Kledung", lat: -7.3275, lon: 109.9995, alt: 1400 },
      { name: "Pos 1 (Peninjauan)", lat: -7.3210, lon: 109.9994, alt: 1670 },
      { name: "Pos 2 (Batu Tatah)", lat: -7.3120, lon: 109.9992, alt: 2120 },
      { name: "Pos 3 (Cacing)", lat: -7.3050, lon: 109.9993, alt: 2565 },
      { name: "Pos 4", lat: -7.2990, lon: 109.9992, alt: 2930 },
      { name: "Puncak Sindoro", lat: -7.3014, lon: 109.9989, alt: 3136 }
    ],
    gateways: [
      { call: "YE2YE-12", lat: -7.7956, lon: 110.3695, alt: 113 },
      { call: "YD2SNK", lat: -7.3125, lon: 110.1524, alt: 720 }
    ]
  },
  slamet_bambangan: {
    name: "G. Slamet - Bambangan",
    peakName: "Puncak Slamet",
    checkpoints: [
      { name: "Basecamp Bambangan", lat: -7.2710, lon: 109.2510, alt: 1500 },
      { name: "Pos 1 (Pondok Gembirung)", lat: -7.2650, lon: 109.2450, alt: 1930 },
      { name: "Pos 2 (Pondok Walang)", lat: -7.2590, lon: 109.2380, alt: 2250 },
      { name: "Pos 3 (Pondok Cemara)", lat: -7.2530, lon: 109.2310, alt: 2510 },
      { name: "Pos 4 (Samarantu)", lat: -7.2480, lon: 109.2250, alt: 2900 },
      { name: "Puncak Slamet", lat: -7.2422, lon: 109.2192, alt: 3428 }
    ],
    gateways: [
      { call: "YE2YE-12", lat: -7.7956, lon: 110.3695, alt: 113 },
      { call: "YD2SNK", lat: -7.3125, lon: 110.1524, alt: 720 }
    ]
  },
  rinjani: {
    name: "Gunung Rinjani",
    peakName: "Puncak Rinjani",
    checkpoints: [
      { name: "Sembalun Entrance", lat: -8.3610, lon: 116.5290, alt: 1156 },
      { name: "Pos 1 (Pemantauan)", lat: -8.3680, lon: 116.5180, alt: 1300 },
      { name: "Pos 2 (Tengengean)", lat: -8.3750, lon: 116.5050, alt: 1500 },
      { name: "Pos 3 (Pada Balong)", lat: -8.3850, lon: 116.4920, alt: 1800 },
      { name: "Sembalun Crater Rim", lat: -8.3980, lon: 116.4750, alt: 2639 },
      { name: "Puncak Rinjani", lat: -8.4110, lon: 116.4580, alt: 3726 }
    ],
    gateways: [
      { call: "YE9YE", lat: -8.6500, lon: 116.3200, alt: 150 },
      { call: "YD9SNK", lat: -8.5000, lon: 116.1500, alt: 50 }
    ]
  },
  kerinci_kersiktua: {
    name: "G. Kerinci - Kersik Tua",
    peakName: "Puncak Kerinci",
    checkpoints: [
      { name: "Pintu Rimba", lat: -1.7220, lon: 101.2580, alt: 1600 },
      { name: "Pos 1 (Bangku Panjang)", lat: -1.7160, lon: 101.2590, alt: 1890 },
      { name: "Pos 2 (Batu Lumut)", lat: -1.7100, lon: 101.2600, alt: 2200 },
      { name: "Shelter 1", lat: -1.7040, lon: 101.2610, alt: 2505 },
      { name: "Shelter 2", lat: -1.7000, lon: 101.2620, alt: 3005 },
      { name: "Puncak Kerinci", lat: -1.6970, lon: 101.2640, alt: 3805 }
    ],
    gateways: [
      { call: "YE5YE", lat: -1.6000, lon: 101.5000, alt: 120 },
      { call: "YD5SNK", lat: -1.8000, lon: 101.0000, alt: 80 }
    ]
  },
  latimojong_karangan: {
    name: "G. Latimojong - Karangan",
    peakName: "Puncak Rante Mario",
    checkpoints: [
      { name: "Desa Karangan", lat: -3.4290, lon: 120.0240, alt: 1450 },
      { name: "Pos 1", lat: -3.4230, lon: 120.0250, alt: 1800 },
      { name: "Pos 2 (Gua Sarung)", lat: -3.4180, lon: 120.0270, alt: 2140 },
      { name: "Pos 5 (Gondrong Nene)", lat: -3.4100, lon: 120.0280, alt: 2690 },
      { name: "Pos 7 (Kolam)", lat: -3.4030, lon: 120.0290, alt: 3120 },
      { name: "Puncak Rante Mario", lat: -3.3989, lon: 120.0244, alt: 3478 }
    ],
    gateways: [
      { call: "YE8YE", lat: -3.3000, lon: 119.8000, alt: 300 },
      { call: "YD8SNK", lat: -3.6000, lon: 120.2000, alt: 110 }
    ]
  },
  semeru_ranupane: {
    name: "G. Semeru - Ranu Pane",
    peakName: "Puncak Mahameru",
    checkpoints: [
      { name: "Ranu Pane", lat: -8.0120, lon: 112.9520, alt: 2100 },
      { name: "Ranu Kumbolo", lat: -8.0420, lon: 112.9230, alt: 2400 },
      { name: "Kalimati", lat: -8.0820, lon: 112.9230, alt: 2700 },
      { name: "Arcopodo", lat: -8.0980, lon: 112.9230, alt: 2900 },
      { name: "Puncak Mahameru", lat: -8.1077, lon: 112.9224, alt: 3676 }
    ],
    gateways: [
      { call: "YE3YE", lat: -7.9000, lon: 112.6000, alt: 400 },
      { call: "YD3SNK", lat: -8.2000, lon: 113.1000, alt: 120 }
    ]
  },
  agung_pasaragung: {
    name: "G. Agung - Pasar Agung",
    peakName: "Puncak Agung",
    checkpoints: [
      { name: "Pura Pasar Agung", lat: -8.3670, lon: 115.5050, alt: 1500 },
      { name: "Pos 1", lat: -8.3590, lon: 115.5060, alt: 1850 },
      { name: "Pos 2", lat: -8.3520, lon: 115.5070, alt: 2300 },
      { name: "Puncak Agung", lat: -8.3420, lon: 115.5080, alt: 3031 }
    ],
    gateways: [
      { call: "YE9YE-B", lat: -8.4000, lon: 115.2000, alt: 150 },
      { call: "YD9SNK-B", lat: -8.6000, lon: 115.6000, alt: 80 }
    ]
  },
  raung_sumberwringin: {
    name: "G. Raung - Sumber Wringin",
    peakName: "Puncak Sejati Raung",
    checkpoints: [
      { name: "Sumber Wringin", lat: -8.0120, lon: 113.9850, alt: 900 },
      { name: "Pos 1", lat: -8.0350, lon: 114.0150, alt: 1430 },
      { name: "Pos 2", lat: -8.0650, lon: 114.0250, alt: 1860 },
      { name: "Pos 3", lat: -8.0950, lon: 114.0350, alt: 2280 },
      { name: "Puncak Sejati Raung", lat: -8.1250, lon: 114.0450, alt: 3332 }
    ],
    gateways: [
      { call: "YE3YE-R", lat: -8.0000, lon: 113.8000, alt: 200 },
      { call: "YD3SNK-R", lat: -8.2000, lon: 114.2000, alt: 100 }
    ]
  }
};

// --- SIMULATOR CONFIGURATION & VARIABLES ---
let activeMountainKey = "merbabu_selo";
let checkpoints = [];
let gateways = [];
let pathCoordinates = [];

let currentPathIndex = 0;
let isPlaying = false;
let isSosActive = false;
let isPowerOn = true; // State of the virtual device screen
let simSpeed = 1;

let satellitesCount = 12;
let gpsLock = true;
let batteryPercent = 99;
let signalHurdle = "excellent"; // excellent, medium, poor, none

// Time update interval
let timeClockInterval = null;
// Hike simulation tick interval
let simulationInterval = null;

// Sound Synthesizer variables
let audioContext = null;
let sirenOscillator = null;
let sirenInterval = null;
let isMuted = false;

// Leaflet Map objects
let map = null;
let routeLine = null;
let progressLine = null;
let hikerIconMarker = null;
let basecampMarkers = [];
let checkpointMarkers = [];
let gatewayMarkers = [];

// --- HELPER FUNCTION: Calculate distance in km (Haversine) ---
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  // Load initial mountain config
  loadMountainData(activeMountainKey);
  
  // Set up leaf map
  initMiniMap();
  
  // Connect panel handlers
  setupParamDeck();
  
  // Connect device screen handlers
  setupTouchscreen();
  
  // Connect physical casing buttons
  setupCasingButtons();
  
  // Run simulated device startup boot sequence
  runBootSequence();
  
  // Start clock
  initTimeClock();
});

// Load checkpoints & gateways
function loadMountainData(key) {
  const data = mountainDatabase[key];
  checkpoints = data.checkpoints;
  gateways = data.gateways;
  
  // Reconstruct paths
  pathCoordinates = [];
  for (let i = 0; i < checkpoints.length - 1; i++) {
    const start = checkpoints[i];
    const end = checkpoints[i + 1];
    const steps = 25; // Interpolation steps
    
    for (let j = 0; j < steps; j++) {
      const t = j / steps;
      pathCoordinates.push({
        lat: start.lat + (end.lat - start.lat) * t,
        lon: start.lon + (end.lon - start.lon) * t,
        alt: start.alt + (end.alt - start.alt) * t
      });
    }
  }
  pathCoordinates.push(checkpoints[checkpoints.length - 1]);
}

// Initialize clock
function initTimeClock() {
  const tftTime = document.getElementById('tftTime');
  timeClockInterval = setInterval(() => {
    if (!isPowerOn) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    tftTime.textContent = `${hh}:${mm}`;
  }, 1000);
}

// Boot sequence animations
function runBootSequence() {
  const bootPage = document.getElementById('tftBootPage');
  const bootBar = document.getElementById('bootLoadingBar');
  const bootStatusText = document.getElementById('bootStatusText');
  const liveContent = document.getElementById('tftLiveContent');
  
  // Reset elements
  bootPage.style.display = 'flex';
  bootPage.style.opacity = '1';
  liveContent.style.display = 'none';
  bootBar.style.width = '0%';
  bootStatusText.textContent = "Booting...";
  
  playBootChime();
  
  // Progress bar animation
  let pct = 0;
  const statuses = [
    { limit: 20, text: "System check..." },
    { limit: 50, text: "GPS L86 initializing..." },
    { limit: 80, text: "LoRa E22 connecting..." },
    { limit: 100, text: "Loading checkpoints..." }
  ];
  
  const timer = setInterval(() => {
    if (pct < 100) {
      pct += 4;
      bootBar.style.width = `${pct}%`;
      const current = statuses.find(s => pct <= s.limit);
      if (current) bootStatusText.textContent = current.text;
    } else {
      clearInterval(timer);
      
      // Hide boot overlay
      bootPage.style.opacity = '0';
      setTimeout(() => {
        bootPage.style.display = 'none';
        liveContent.style.display = 'flex';
        updateTftUI();
        const tabMap = document.getElementById('tftTabMap');
        if (tabMap && tabMap.classList.contains('active')) {
          startMapAnimationLoop();
        }
      }, 500);
    }
  }, 100);
}

// --- WEB AUDIO API: SYNTH EFFECTS ---
function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

// Normal click sound
function playKeypressBeep() {
  if (isMuted) return;
  try {
    initAudioContext();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, audioContext.currentTime); // high pitch beep
    
    gain.gain.setValueAtTime(0.06, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05); // quick decay
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.start();
    osc.stop(audioContext.currentTime + 0.06);
  } catch(e){}
}

// Boot chime
function playBootChime() {
  if (isMuted) return;
  try {
    initAudioContext();
    const now = audioContext.currentTime;
    
    const playTone = (freq, start, duration) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.08, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start(start);
      osc.stop(start + duration + 0.1);
    };
    
    // Play arpeggio
    playTone(523.25, now, 0.15); // C5
    playTone(659.25, now + 0.12, 0.15); // E5
    playTone(783.99, now + 0.24, 0.15); // G5
    playTone(1046.50, now + 0.36, 0.4); // C6
  } catch(e){}
}

// SOS siren sound loop
function startSirenAlarm() {
  if (isMuted) return;
  try {
    initAudioContext();
    sirenOscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    sirenOscillator.type = 'sine';
    sirenOscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    
    sirenOscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    sirenOscillator.start();
    
    let high = true;
    sirenInterval = setInterval(() => {
      if (sirenOscillator && audioContext) {
        const nextFreq = high ? 1200 : 800;
        sirenOscillator.frequency.setValueAtTime(nextFreq, audioContext.currentTime);
        high = !high;
      }
    }, 450);
  } catch(e){}
}

// Mute/stop SOS alarm
function stopSirenAlarm() {
  if (sirenOscillator) {
    try {
      sirenOscillator.stop();
      sirenOscillator.disconnect();
    } catch(e){}
    sirenOscillator = null;
  }
  if (sirenInterval) {
    clearInterval(sirenInterval);
    sirenInterval = null;
  }
}

// --- LEAFLET MINI MAP TRACKER ---
function initMiniMap() {
  // Center on Indonesia
  map = L.map('miniMap', {
    zoomControl: false,
    attributionControl: false
  }).setView([-2.0, 118.0], 4);
  
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 18
  }).addTo(map);
  
  // Set up path polylines (hidden by default)
  routeLine = L.polyline([], {
    color: 'transparent',
    weight: 0,
    opacity: 0,
  }).addTo(map);
  
  progressLine = L.polyline([], {
    color: '#FC4C02',
    weight: 3.5,
  }).addTo(map);
  
  // Marker tracker
  const trackerIcon = L.divIcon({
    className: 'mini-tracker-marker',
    html: '<div style="width:12px;height:12px;background:#00d2ff;border:2px solid #fff;border-radius:50%;box-shadow:0 0 6px #00d2ff;"></div>',
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
  
  hikerIconMarker = L.marker([0, 0], { icon: trackerIcon }).addTo(map);
  
  updateMiniMapRoute();
}

function updateMiniMapRoute() {
  if (!map) return;
  
  // Clear old checkpoints & gateways
  checkpointMarkers.forEach(m => map.removeLayer(m));
  gatewayMarkers.forEach(m => map.removeLayer(m));
  checkpointMarkers = [];
  gatewayMarkers = [];
  
  // Render route line path
  const latlngs = pathCoordinates.map(p => [p.lat, p.lon]);
  routeLine.setLatLngs(latlngs);
  
  // Plot checkpoints
  const cpIcon = L.divIcon({
    className: 'mini-cp-marker',
    html: '<div style="width:6px;height:6px;background:#d946ef;border:1px solid #fff;border-radius:50%;"></div>',
    iconSize: [6, 6],
    iconAnchor: [3, 3]
  });
  
  checkpoints.forEach(cp => {
    const marker = L.marker([cp.lat, cp.lon], { icon: cpIcon }).addTo(map);
    checkpointMarkers.push(marker);
  });
  
  // Plot gateways
  const gwIcon = L.divIcon({
    className: 'mini-gw-marker',
    html: '<div style="width:8px;height:8px;background:#10b981;border:1px solid #fff;transform:rotate(45deg);"></div>',
    iconSize: [8, 8],
    iconAnchor: [4, 4]
  });
  
  gateways.forEach(gw => {
    const marker = L.marker([gw.lat, gw.lon], { icon: gwIcon }).addTo(map);
    gatewayMarkers.push(marker);
  });
  
  // Fit map
  map.fitBounds(routeLine.getBounds(), { padding: [15, 15] });
  
  // Sync tracker marker position
  const currentPoint = pathCoordinates[currentPathIndex];
  hikerIconMarker.setLatLng([currentPoint.lat, currentPoint.lon]);
  progressLine.setLatLngs(latlngs.slice(0, currentPathIndex + 1));
}

// --- SIMULATION TICK RUNNER ---
function startSimulation() {
  if (isPlaying) return;
  isPlaying = true;
  document.getElementById('btnPlay').classList.add('active');
  document.getElementById('btnPause').classList.remove('active');
  
  const tickDuration = 1000 / simSpeed;
  
  simulationInterval = setInterval(() => {
    if (currentPathIndex < pathCoordinates.length - 1) {
      currentPathIndex++;
      
      const currentPoint = pathCoordinates[currentPathIndex];
      hikerIconMarker.setLatLng([currentPoint.lat, currentPoint.lon]);
      progressLine.setLatLngs(pathCoordinates.slice(0, currentPathIndex + 1).map(p => [p.lat, p.lon]));
      
      updateTftUI();
    } else {
      pauseSimulation();
    }
  }, tickDuration);
}

function pauseSimulation() {
  isPlaying = false;
  document.getElementById('btnPlay').classList.remove('active');
  document.getElementById('btnPause').classList.add('active');
  clearInterval(simulationInterval);
}

function resetSimulation() {
  pauseSimulation();
  currentPathIndex = 0;
  
  const startPoint = pathCoordinates[0];
  hikerIconMarker.setLatLng([startPoint.lat, startPoint.lon]);
  progressLine.setLatLngs([]);
  
  updateTftUI();
}

// --- PARAMETER DECK LOGIC (LEFT SIDEBAR) ---
function setupParamDeck() {
  // Mountain Select
  const mSelect = document.getElementById('mountainSelect');
  mSelect.addEventListener('change', (e) => {
    activeMountainKey = e.target.value;
    loadMountainData(activeMountainKey);
    updateMiniMapRoute();
    resetSimulation();
  });
  
  // Start / Pause buttons
  document.getElementById('btnPlay').addEventListener('click', startSimulation);
  document.getElementById('btnPause').addEventListener('click', pauseSimulation);
  document.getElementById('btnReset').addEventListener('click', resetSimulation);
  
  // Speed slider
  const sRange = document.getElementById('speedRange');
  const sVal = document.getElementById('speedVal');
  sRange.addEventListener('input', (e) => {
    simSpeed = parseInt(e.target.value);
    sVal.textContent = `${simSpeed}x`;
    if (isPlaying) {
      pauseSimulation();
      startSimulation();
    }
  });
  
  // Satellites slider
  const satRange = document.getElementById('satRange');
  const satVal = document.getElementById('satVal');
  satRange.addEventListener('input', (e) => {
    satellitesCount = parseInt(e.target.value);
    satVal.textContent = satellitesCount;
    updateTftUI();
  });
  
  // GPS Lock Switch
  const gpsToggle = document.getElementById('gpsLockToggle');
  gpsToggle.addEventListener('change', (e) => {
    gpsLock = e.target.checked;
    updateTftUI();
  });
  
  // Battery Level slider
  const batRange = document.getElementById('batRange');
  const batVal = document.getElementById('batVal');
  batRange.addEventListener('input', (e) => {
    batteryPercent = parseInt(e.target.value);
    batVal.textContent = `${batteryPercent}%`;
    updateTftUI();
  });
  
  // Signal quality
  const sigQual = document.getElementById('signalQuality');
  sigQual.addEventListener('change', (e) => {
    signalHurdle = e.target.value;
    updateTftUI();
  });
}

// --- UPDATE TFT SCREEN PARAMETERS ---
function updateTftUI() {
  if (!isPowerOn) return;
  
  const currentPoint = pathCoordinates[currentPathIndex];
  
  // Header icons
  document.getElementById('tftSatIcon').textContent = gpsLock ? `🛰️ ${satellitesCount}` : "🛰️ --";
  document.getElementById('tftBatIcon').textContent = `🔋 ${batteryPercent}%`;
  
  // Update DATA tab UI
  document.getElementById('tftLat').textContent = gpsLock ? currentPoint.lat.toFixed(4) : "---.----";
  document.getElementById('tftLon').textContent = gpsLock ? currentPoint.lon.toFixed(4) : "---.----";
  document.getElementById('tftAlt').textContent = gpsLock ? `${Math.round(currentPoint.alt)} m` : "--- m";
  
  const speedVal = isPlaying && currentPathIndex < pathCoordinates.length - 1 ? (3.2 + Math.random()).toFixed(1) : "0.0";
  document.getElementById('tftSpeed').textContent = gpsLock ? `${speedVal} km/h` : "--- km/h";
  
  // Calculate environment diagnostics
  const closestGateway = gateways[0];
  let distToGw = calculateDistance(currentPoint.lat, currentPoint.lon, closestGateway.lat, closestGateway.lon);
  document.getElementById('tftGateway').textContent = `${distToGw.toFixed(1)} km`;
  
  // Compute Signal Values (RSSI / SNR) based on environmental qualities & distance
  let rssi = -80, snr = 9;
  if (signalHurdle === "excellent") {
    rssi = Math.round(-70 - distToGw * 1.2);
    snr = (12 - distToGw * 0.2).toFixed(1);
  } else if (signalHurdle === "medium") {
    rssi = Math.round(-85 - distToGw * 1.5);
    snr = (8 - distToGw * 0.3).toFixed(1);
  } else if (signalHurdle === "poor") {
    rssi = Math.round(-98 - distToGw * 1.8);
    snr = (3 - distToGw * 0.5).toFixed(1);
  } else if (signalHurdle === "none") {
    rssi = -120;
    snr = -15;
  }
  
  document.getElementById('tftRssi').textContent = `${rssi} dBm`;
  document.getElementById('tftSnr').textContent = `${snr} dB`;
  
  // Update signal bars
  const sigBars = document.querySelectorAll('.tft-signal-strength-indicator .tft-signal-bar');
  const level = rssi > -80 ? 4 : rssi > -95 ? 3 : rssi > -110 ? 2 : rssi > -118 ? 1 : 0;
  sigBars.forEach((bar, idx) => {
    if (idx < level) {
      bar.classList.add('active');
      bar.style.backgroundColor = 'var(--success)';
    } else {
      bar.classList.remove('active');
      bar.style.backgroundColor = 'rgba(255,255,255,0.1)';
    }
  });
  
  // Update LED Indicator status based on hardware
  const led = document.getElementById('ledStatus');
  led.className = "status-led";
  if (isSosActive) {
    led.classList.add('blink-red');
  } else if (!gpsLock) {
    led.classList.add('blink-orange');
  } else {
    led.classList.add('blink-green');
  }
  
  // Rotate compass arrow towards target
  const arrow = document.getElementById('tftCompassArrow');
  if (arrow) {
    const rotation = (currentPathIndex * 8) % 360;
    arrow.style.transform = `rotate(${rotation}deg)`;
  }
  
  // Distance to summit target
  const peak = checkpoints[checkpoints.length - 1];
  const distToPeak = calculateDistance(currentPoint.lat, currentPoint.lon, peak.lat, peak.lon);
  document.getElementById('tftPeakName').textContent = `MENUJU ${mountainDatabase[activeMountainKey].peakName.toUpperCase()}`;
  document.getElementById('tftPeakDist').textContent = `${distToPeak.toFixed(1)} km`;
}

// --- TFT SCREEN VECTOR MAP DRAWING ENGINE ---
let mapAnimationId = null;

function drawTftVectorMap() {
  const canvas = document.getElementById('tftMapCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set physical drawing size to match layout bounding box
  const rect = canvas.getBoundingClientRect();
  if (canvas.width !== rect.width || canvas.height !== rect.height) {
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  const w = canvas.width;
  const h = canvas.height;

  // Background clear
  ctx.fillStyle = '#040406';
  ctx.fillRect(0, 0, w, h);

  // Draw grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 0.8;
  const gridSpacing = 16;
  for (let x = 0; x < w; x += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Draw subtle circular radar rings as decorative background elements
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.38, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.18, 0, 2 * Math.PI);
  ctx.stroke();

  if (pathCoordinates.length === 0) return;

  // Bounding box mapping for route coordinates
  let minLat = Infinity, maxLat = -Infinity;
  let minLon = Infinity, maxLon = -Infinity;

  pathCoordinates.forEach(p => {
    if (p.lat < minLat) minLat = p.lat;
    if (p.lat > maxLat) maxLat = p.lat;
    if (p.lon < minLon) minLon = p.lon;
    if (p.lon > maxLon) maxLon = p.lon;
  });

  const padding = 15;
  const mapWidth = maxLon - minLon;
  const mapHeight = maxLat - minLat;

  // Projection logic
  function project(lat, lon) {
    const x = padding + ((lon - minLon) / (mapWidth || 1)) * (w - 2 * padding);
    const y = h - padding - ((lat - minLat) / (mapHeight || 1)) * (h - 2 * padding);
    return { x, y };
  }

  // 1. Draw planned path as dashed line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 4]);
  ctx.beginPath();
  pathCoordinates.forEach((p, idx) => {
    const pt = project(p.lat, p.lon);
    if (idx === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  });
  ctx.stroke();
  ctx.setLineDash([]); // Reset line dash

  // 2. Draw traversed progress path (cyan neon breadcrumbs with shadow glow)
  const traversedLen = Math.min(currentPathIndex + 1, pathCoordinates.length);
  if (traversedLen > 1) {
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#06b6d4';
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i < traversedLen; i++) {
      const p = pathCoordinates[i];
      const pt = project(p.lat, p.lon);
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0; // Clear shadow
  }

  // 3. Draw checkpoint nodes
  checkpoints.forEach((cp, idx) => {
    const pt = project(cp.lat, cp.lon);
    const isReached = pathCoordinates.slice(0, traversedLen).some(p => calculateDistance(p.lat, p.lon, cp.lat, cp.lon) < 0.05);

    ctx.fillStyle = isReached ? '#d946ef' : '#52525b';
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 3, 0, 2 * Math.PI);
    ctx.fill();

    // Checkpoint label overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '500 6.5px Inter';
    const cleanName = cp.name.replace("Basecamp ", "BC ").replace("Puncak ", "PK ");
    ctx.fillText(cleanName, pt.x + 5, pt.y + 2);
  });

  // 4. Draw hiker position
  const currentPt = pathCoordinates[currentPathIndex];
  if (currentPt) {
    const pt = project(currentPt.lat, currentPt.lon);

    if (gpsLock) {
      // Pulsing glow circle
      const pulseRadius = 4.5 + (Date.now() % 1000) / 120;
      ctx.strokeStyle = 'rgba(252, 76, 2, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pulseRadius, 0, 2 * Math.PI);
      ctx.stroke();

      // Solid inner core
      ctx.fillStyle = '#FC4C02';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3, 0, 2 * Math.PI);
      ctx.fill();

      // White boundary
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3.6, 0, 2 * Math.PI);
      ctx.stroke();
    } else {
      // Disconnected warning dot
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  // 5. Draw overlay text HUD
  ctx.fillStyle = '#10b981';
  ctx.font = '700 7.5px "Share Tech Mono"';
  ctx.fillText("SYS: RUNNING", 8, 12);

  ctx.fillStyle = gpsLock ? '#06b6d4' : '#f59e0b';
  ctx.fillText(gpsLock ? "GPS: ACTIVE" : "GPS: SEARCHING", 8, 21);

  // Active mountain name HUD
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '600 6.5px Inter';
  const nameLabel = mountainDatabase[activeMountainKey]?.name.toUpperCase() || "ROUTE";
  ctx.fillText(nameLabel, 8, h - 8);

  // Progress metrics HUD
  const pct = Math.round((currentPathIndex / (pathCoordinates.length - 1)) * 100);
  ctx.fillStyle = '#d946ef';
  ctx.fillText(`DIST: ${pct}%`, w - 46, h - 8);
}

function startMapAnimationLoop() {
  if (mapAnimationId) cancelAnimationFrame(mapAnimationId);

  function loop() {
    const tabMap = document.getElementById('tftTabMap');
    if (tabMap && tabMap.classList.contains('active') && isPowerOn) {
      drawTftVectorMap();
      mapAnimationId = requestAnimationFrame(loop);
    } else {
      mapAnimationId = null;
    }
  }

  loop();
}

// --- TOUCHSCREEN BUTTON TABS NAVIGATION ---
function setupTouchscreen() {
  const btnTele = document.getElementById('tftBtnTele');
  const btnSignal = document.getElementById('tftBtnSignal');
  const btnNav = document.getElementById('tftBtnNav');
  const btnMap = document.getElementById('tftBtnMap');
  const btnTftSos = document.getElementById('tftBtnSos');
  const btnTftSosCancel = document.getElementById('btnTftSosCancel');
  
  const tabTele = document.getElementById('tftTabTelemetry');
  const tabSignal = document.getElementById('tftTabSignal');
  const tabNav = document.getElementById('tftTabNavigation');
  const tabMap = document.getElementById('tftTabMap');
  const sosOverlay = document.getElementById('tftSosOverlay');
  const loraMode = document.getElementById('tftLoraMode');
  const statusOverlay = document.getElementById('sosOverlay');
  
  function selectTab(activeBtn, activeTab) {
    playKeypressBeep();
    [btnTele, btnSignal, btnNav, btnMap].forEach(btn => btn.classList.remove('active'));
    [tabTele, tabSignal, tabNav, tabMap].forEach(tab => tab.classList.remove('active'));
    
    activeBtn.classList.add('active');
    activeTab.classList.add('active');

    if (activeTab === tabMap) {
      startMapAnimationLoop();
    } else {
      if (mapAnimationId) {
        cancelAnimationFrame(mapAnimationId);
        mapAnimationId = null;
      }
    }
  }
  
  btnTele.addEventListener('click', () => selectTab(btnTele, tabTele));
  btnSignal.addEventListener('click', () => selectTab(btnSignal, tabSignal));
  btnNav.addEventListener('click', () => selectTab(btnNav, tabNav));
  btnMap.addEventListener('click', () => selectTab(btnMap, tabMap));
  
  // Trigger SOS beacon
  btnTftSos.addEventListener('click', () => {
    playKeypressBeep();
    isSosActive = true;
    
    btnTftSos.classList.add('active-sos');
    sosOverlay.classList.add('active');
    statusOverlay.classList.add('active');
    loraMode.textContent = "🚨 SOS ACTIVE";
    loraMode.className = "tft-val highlight-magenta";
    
    startSirenAlarm();
    updateTftUI();
  });
  
  // Cancel SOS beacon
  btnTftSosCancel.addEventListener('click', () => {
    playKeypressBeep();
    isSosActive = false;
    
    btnTftSos.classList.remove('active-sos');
    sosOverlay.classList.remove('active');
    statusOverlay.classList.remove('active');
    loraMode.textContent = "NORMAL";
    loraMode.className = "tft-val highlight-cyan";
    
    stopSirenAlarm();
    updateTftUI();
  });
}

// --- PHYSICAL CASING SIDE/BOTTOM BUTTONS ---
function setupCasingButtons() {
  // Physical power button
  const btnPower = document.getElementById('btnPhysicalPower');
  const tftScreen = document.getElementById('tftScreen');
  
  if (btnPower) {
    btnPower.addEventListener('click', () => {
      isPowerOn = !isPowerOn;
      playKeypressBeep();
      
      if (isPowerOn) {
        tftScreen.style.background = 'var(--bg-dark)';
        runBootSequence();
      } else {
        // Shutdown device
        stopSirenAlarm();
        pauseSimulation();
        isSosActive = false;
        if (mapAnimationId) {
          cancelAnimationFrame(mapAnimationId);
          mapAnimationId = null;
        }
        document.getElementById('tftBootPage').style.display = 'none';
        document.getElementById('tftLiveContent').style.display = 'none';
        document.getElementById('tftSosOverlay').classList.remove('active');
        document.getElementById('sosOverlay').classList.remove('active');
        document.getElementById('tftBtnSos').classList.remove('active-sos');
        
        tftScreen.style.background = '#000000'; // pitch black screen
        document.getElementById('ledStatus').className = "status-led led-off";
      }
    });
  }
  
  // Sound controls (Volume Up / Down beeps)
  const btnVolUp = document.getElementById('btnPhysicalVolUp');
  const btnVolDown = document.getElementById('btnPhysicalVolDown');
  
  if (btnVolUp) {
    btnVolUp.addEventListener('click', () => {
      isMuted = false;
      playKeypressBeep();
    });
  }
  
  if (btnVolDown) {
    btnVolDown.addEventListener('click', () => {
      isMuted = true;
      stopSirenAlarm();
    });
  }
}
