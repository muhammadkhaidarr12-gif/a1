// --- GLOBAL VARIABLES & DATA CONFIG ---
let map;
let hikerMarker;
let activeGatewayMarker;
let allMountainsMarkers = []; // Array to track other mountain markers
let checkpointMarkers = [];
let gatewayMarkers = [];
let registrationMarkers = [];
let allMountains = [];
let geLabelMarkers = [];
let simulationInterval = null;
let currentPathIndex = 0;
let isPlaying = false;
let isSosActive = false;
let simSpeed = 1; // Speed multiplier (1x, 2x, 5x, 10x)
let audioContext = null;
let alarmOscillator = null;
let mapRotationAngle = 0;
let isMapRotating = false;
let mapRotationInterval = null;
let is3DMode = false;
let isPegmanActive = false;

// Hiker Call Sign & Initial Settings
const callSign = "YD2CLX-4";

// Floating geographical labels for Gunung Rinjani (disabled)
const geographicLabels = [];

// Mountain & Trail Database across Indonesia
let mountainDatabase = {};

// Initial hard‑coded mountains (preserve existing ones)
mountainDatabase = {
  merbabu_selo: {
    name: "Gunung Merbabu - Selo",
    title: "APRS LoRa Tracker",
    peakName: "Puncak Kenteng Songo",
    trailName: "Jalur Selo",
    registrationOffices: [
      { name: "Basecamp Merbabu via Genting Selo", lat: -7.4859, lon: 110.4614 },
      { name: "Pos Pendakian Gn. Merbabu via Suwanting", lat: -7.4742, lon: 110.3986 },
      { name: "Pos TPR Merbabu via Wekas", lat: -7.4326, lon: 110.4136 },
      { name: "Basecamp Manggala Cuntel", lat: -7.4210, lon: 110.4204 },
      { name: "Basecamp Pendakian Gn. Merbabu via Thekelan", lat: -7.4120, lon: 110.4262 }
    ],
    hudLabel: "Altitude:",
    checkpoints: [
      { name: "Basecamp Selo", lat: -7.4528, lon: 110.4192, alt: 1560 },
      { name: "Pos 1 (Dok Malang)", lat: -7.4501, lon: 110.4255, alt: 1850 },
      { name: "Pos 2 (Pancuran)", lat: -7.4475, lon: 110.4302, alt: 2170 },
      { name: "Pos 3 (Watu Tulis)", lat: -7.4452, lon: 110.4338, alt: 2590 },
      { name: "Sabana 1", lat: -7.4428, lon: 110.4371, alt: 2870 },
      { name: "Sabana 2", lat: -7.4412, lon: 110.4395, alt: 3020 },
      { name: "Puncak Kenteng Songo (G. Merbabu)", lat: -7.4430, lon: 110.4380, alt: 3142 }
    ],
    gateways: [
      { call: "YE2YE-12", lat: -7.7956, lon: 110.3695, alt: 113, rssi: -94, snr: -8, count: 48 },
      { call: "YD2SNK", lat: -7.3125, lon: 110.1524, alt: 720, rssi: -86, snr: 4, count: 112 },
      { call: "YD2CFW", lat: -7.5583, lon: 110.8271, alt: 95, rssi: -108, snr: -14, count: 12 }
    ]
  },
  sindoro_kledung: {
    name: "Gunung Sindoro - Kledung",
    title: "APRS LoRa Tracker",
    peakName: "Puncak Sindoro",
    trailName: "Jalur Kledung",
    hudLabel: "Altitude:",
    checkpoints: [
      { name: "Basecamp Kledung", lat: -7.3180, lon: 109.9970, alt: 1400 },
      { name: "Pos 1", lat: -7.3120, lon: 109.9980, alt: 1700 },
      { name: "Pos 2", lat: -7.3060, lon: 109.9985, alt: 2120 },
      { name: "Pos 3", lat: -7.3025, lon: 109.9988, alt: 2530 },
      { name: "Pos 4", lat: -7.2990, lon: 109.9992, alt: 2930 },
      { name: "Puncak Sindoro", lat: -7.3014, lon: 109.9989, alt: 3136 }
    ],
    gateways: [
      { call: "YE2YE-12", lat: -7.7956, lon: 110.3695, alt: 113, rssi: -94, snr: -8, count: 48 },
      { call: "YD2SNK", lat: -7.3125, lon: 110.1524, alt: 720, rssi: -86, snr: 4, count: 112 },
      { call: "YD2CFW", lat: -7.5583, lon: 110.8271, alt: 95, rssi: -108, snr: -14, count: 12 }
    ]
  },
  slamet_bambangan: {
    name: "Gunung Slamet - Bambangan",
    title: "APRS LoRa Tracker",
    peakName: "Puncak Slamet",
    trailName: "Jalur Bambangan",
    hudLabel: "Altitude:",
    checkpoints: [
      { name: "Basecamp Bambangan", lat: -7.2710, lon: 109.2510, alt: 1500 },
      { name: "Pos 1 (Pondok Gembirung)", lat: -7.2650, lon: 109.2450, alt: 1930 },
      { name: "Pos 2 (Pondok Walang)", lat: -7.2590, lon: 109.2380, alt: 2250 },
      { name: "Pos 3 (Pondok Cemara)", lat: -7.2530, lon: 109.2310, alt: 2510 },
      { name: "Pos 4 (Samarantu)", lat: -7.2480, lon: 109.2250, alt: 2900 },
      { name: "Puncak Slamet", lat: -7.2422, lon: 109.2192, alt: 3428 }
    ],
    gateways: [
      { call: "YE2YE-12", lat: -7.7956, lon: 110.3695, alt: 113, rssi: -94, snr: -8, count: 48 },
      { call: "YD2SNK", lat: -7.3125, lon: 110.1524, alt: 720, rssi: -86, snr: 4, count: 112 },
      { call: "YD2CFW", lat: -7.5583, lon: 110.8271, alt: 95, rssi: -108, snr: -14, count: 12 }
    ]
  },
  rinjani: {
    name: "Gunung Rinjani",
    title: "APRS LoRa Tracker",
    peakName: "Puncak Rinjani",
    trailName: "Jalur Sembalun",
    hudLabel: "Altitude:",
    registrationOffice: { name: "Taman Nasional Gunung Rinjani", lat: -8.35968, lon: 116.52440 },
    checkpoints: [
      { name: "Sembalun Lawang", lat: -8.3610, lon: 116.5290, alt: 1156 },
      { name: "Pos 1 (Pemantauan)", lat: -8.3680, lon: 116.5180, alt: 1300 },
      { name: "Pos 2 (Tengengean)", lat: -8.3750, lon: 116.5050, alt: 1500 },
      { name: "Pos 3 (Pada Balong)", lat: -8.3850, lon: 116.4920, alt: 1800 },
      { name: "Sembalun Crater Rim", lat: -8.3980, lon: 116.4750, alt: 2639 },
      { name: "Puncak Rinjani", lat: -8.4110, lon: 116.4580, alt: 3726 }
    ],
    detailedPath: [
      { lat: -8.3610, lon: 116.5290, alt: 1156 },
      { lat: -8.3630, lon: 116.5250, alt: 1200 },
      { lat: -8.3650, lon: 116.5210, alt: 1250 },
      { lat: -8.3680, lon: 116.5180, alt: 1300 },
      { lat: -8.3705, lon: 116.5135, alt: 1380 },
      { lat: -8.3725, lon: 116.5090, alt: 1440 },
      { lat: -8.3750, lon: 116.5050, alt: 1500 },
      { lat: -8.3785, lon: 116.5005, alt: 1620 },
      { lat: -8.3815, lon: 116.4960, alt: 1710 },
      { lat: -8.3850, lon: 116.4920, alt: 1800 },
      { lat: -8.3890, lon: 116.4865, alt: 2100 },
      { lat: -8.3935, lon: 116.4815, alt: 2350 },
      { lat: -8.3980, lon: 116.4750, alt: 2639 },
      { lat: -8.3995, lon: 116.4748, alt: 2750 },
      { lat: -8.4010, lon: 116.4738, alt: 2880 },
      { lat: -8.4020, lon: 116.4745, alt: 2980 },
      { lat: -8.4030, lon: 116.4730, alt: 3080 },
      { lat: -8.4042, lon: 116.4740, alt: 3180 },
      { lat: -8.4052, lon: 116.4720, alt: 3280 },
      { lat: -8.4065, lon: 116.4730, alt: 3380 },
      { lat: -8.4075, lon: 116.4705, alt: 3450 },
      { lat: -8.4085, lon: 116.4680, alt: 3520 },
      { lat: -8.4095, lon: 116.4645, alt: 3620 },
      { lat: -8.4110, lon: 116.4580, alt: 3726 }
    ],
    gateways: [
      { call: "YE9YE", lat: -8.6500, lon: 116.3200, alt: 150, rssi: -94, snr: -8, count: 32 },
      { call: "YD9SNK", lat: -8.5000, lon: 116.1500, alt: 50, rssi: -86, snr: 4, count: 64 }
    ]
  },
  kerinci_kersiktua: {
    name: "Gunung Kerinci - Kersik Tua",
    title: "APRS LoRa Tracker",
    peakName: "Puncak Kerinci",
    trailName: "Jalur Kersik Tua",
    hudLabel: "Altitude:",
    checkpoints: [
      { name: "Pintu Rimba", lat: -1.7220, lon: 101.2580, alt: 1600 },
      { name: "Pos 1 (Bangku Panjang)", lat: -1.7160, lon: 101.2590, alt: 1890 },
      { name: "Pos 2 (Batu Lumut)", lat: -1.7100, lon: 101.2600, alt: 2200 },
      { name: "Shelter 1", lat: -1.7040, lon: 101.2610, alt: 2505 },
      { name: "Shelter 2", lat: -1.7000, lon: 101.2620, alt: 3005 },
      { name: "Puncak Kerinci", lat: -1.6970, lon: 101.2640, alt: 3805 }
    ],
    gateways: [
      { call: "YE1YE", lat: -1.6000, lon: 101.4000, alt: 100, rssi: -94, snr: -8, count: 18 },
      { call: "YD1SNK", lat: -1.8000, lon: 101.1000, alt: 50, rssi: -86, snr: 4, count: 24 }
    ]
  },
  latimojong_karangan: {
    name: "Gunung Latimojong - Karangan",
    title: "APRS LoRa Tracker",
    peakName: "Puncak Rantemario",
    trailName: "Jalur Karangan",
    hudLabel: "Altitude:",
    checkpoints: [
      { name: "Basecamp Karangan", lat: -3.4210, lon: 120.0430, alt: 1450 },
      { name: "Pos 1 (Buntu Bolong)", lat: -3.4110, lon: 120.0380, alt: 1800 },
      { name: "Pos 2 (Gowa)", lat: -3.4020, lon: 120.0340, alt: 2200 },
      { name: "Pos 3 (Buntu Labu)", lat: -3.3950, lon: 120.0300, alt: 2600 },
      { name: "Pos 4 (Kolong)", lat: -3.3880, lon: 120.0270, alt: 3000 },
      { name: "Puncak Rantemario (Latimojong)", lat: -3.3830, lon: 120.0250, alt: 3478 }
    ],
    gateways: [
      { call: "YE8YE", lat: -3.5000, lon: 119.8000, alt: 120, rssi: -94, snr: -8, count: 12 },
      { call: "YD8SNK", lat: -3.2000, lon: 120.2000, alt: 80, rssi: -86, snr: 4, count: 30 }
    ]
  },
  semeru_ranupane: {
    name: "Gunung Semeru - Ranu Pane",
    title: "APRS LoRa Tracker",
    peakName: "Puncak Mahameru",
    hudLabel: "Altitude:",
    checkpoints: [
      { name: "Ranu Pane", lat: -8.0160, lon: 112.9520, alt: 2100 },
      { name: "Watu Rejeng", lat: -8.0430, lon: 112.9480, alt: 2300 },
      { name: "Ranu Kumbolo", lat: -8.0620, lon: 112.9250, alt: 2400 },
      { name: "Kalimati", lat: -8.0890, lon: 112.9240, alt: 2700 },
      { name: "Arcopodo", lat: -8.0980, lon: 112.9230, alt: 2900 },
      { name: "Puncak Mahameru", lat: -8.1077, lon: 112.9224, alt: 3676 }
    ],
    gateways: [
      { call: "YE3YE", lat: -7.9000, lon: 112.6000, alt: 400, rssi: -94, snr: -8, count: 78 },
      { call: "YD3SNK", lat: -8.2000, lon: 113.1000, alt: 120, rssi: -86, snr: 4, count: 154 }
    ]
  },
  agung_pasaragung: {
    name: "Gunung Agung - Pasar Agung",
    title: "APRS LoRa Tracker",
    peakName: "Puncak Agung",
    registrationOffices: [
      { name: "Besakih Trailhead (1,100 m)", lat: -8.3695, lon: 115.4520 },
      { name: "Pura Pasar Agung Trailhead (1,600 m)", lat: -8.3670, lon: 115.5050 },
      { name: "Pucang Trailhead (900 m)", lat: -8.2950, lon: 115.4620 },
      { name: "Kedampal Trailhead (750 m)", lat: -8.3470, lon: 115.5580 }
    ],
    hudLabel: "Altitude:",
    checkpoints: [
      { name: "Pura Pasar Agung", lat: -8.3670, lon: 115.5050, alt: 1500 },
      { name: "Pos 1", lat: -8.3590, lon: 115.5060, alt: 1850 },
      { name: "Pos 2", lat: -8.3520, lon: 115.5070, alt: 2300 },
      { name: "Puncak Agung", lat: -8.3420, lon: 115.5080, alt: 3031 }
    ],
    gateways: [
      { call: "YE9YE-B", lat: -8.4000, lon: 115.2000, alt: 150, rssi: -94, snr: -8, count: 45 },
      { call: "YD9SNK-B", lat: -8.6000, lon: 115.6000, alt: 80, rssi: -86, snr: 4, count: 88 }
    ]
  },
  raung_sumberwringin: {
    name: "Gunung Raung - Sumber Wringin",
    title: "APRS LoRa Tracker",
    peakName: "Puncak Sejati Raung",
    hudLabel: "Altitude:",
    checkpoints: [
      { name: "Basecamp Sumber Wringin", lat: -8.0380, lon: 114.0280, alt: 1400 },
      { name: "Pondok Motor", lat: -8.0650, lon: 114.0320, alt: 1850 },
      { name: "Pondok Sumur", lat: -8.0850, lon: 114.0380, alt: 2300 },
      { name: "Pondok Angin", lat: -8.1150, lon: 114.0420, alt: 2900 },
      { name: "Puncak Sejati Raung", lat: -8.1250, lon: 114.0450, alt: 3332 }
    ],
    gateways: [
      { call: "YE3YE-R", lat: -8.0000, lon: 113.8000, alt: 200, rssi: -94, snr: -8, count: 28 },
      { call: "YD3SNK-R", lat: -8.2000, lon: 114.2000, alt: 100, rssi: -86, snr: 4, count: 74 }
    ]
  }
};

let activeMountainKey = "merbabu_selo";
let basecampGateways = [];
let checkpoints = [];
let pathCoordinates = [];

// Track map markers dynamically
let basecampMarkers = [];

// Generate smooth path interpolation between checkpoints (25 steps per segment)
function generateSmoothPath() {
  const mountain = mountainDatabase[activeMountainKey];
  
  if (mountain.detailedPath) {
    // High-accuracy detailed path interpolation (5 steps per detailed segment)
    for (let i = 0; i < mountain.detailedPath.length - 1; i++) {
      const start = mountain.detailedPath[i];
      const end = mountain.detailedPath[i + 1];
      const steps = 5;
      
      for (let j = 0; j < steps; j++) {
        const t = j / steps;
        const lat = start.lat + (end.lat - start.lat) * t;
        const lon = start.lon + (end.lon - start.lon) * t;
        const alt = start.alt + (end.alt - start.alt) * t;
        
        pathCoordinates.push({
          lat: lat,
          lon: lon,
          alt: alt,
          name: t === 0 ? (start.name || "") : ""
        });
      }
    }
    pathCoordinates.push(mountain.detailedPath[mountain.detailedPath.length - 1]);
  } else {
    // Standard linear fallback path interpolation
    for (let i = 0; i < checkpoints.length - 1; i++) {
      const start = checkpoints[i];
      const end = checkpoints[i + 1];
      const steps = 25;
      
      for (let j = 0; j < steps; j++) {
        const t = j / steps;
        const lat = start.lat + (end.lat - start.lat) * t;
        const lon = start.lon + (end.lon - start.lon) * t;
        const alt = start.alt + (end.alt - start.alt) * t;
        
        pathCoordinates.push({
          lat: lat,
          lon: lon,
          alt: alt,
          name: t === 0 ? start.name : `Rute Jalur ${start.name.split(" ")[0]} -> ${end.name.split(" ")[0]}`
        });
      }
    }
    pathCoordinates.push(checkpoints[checkpoints.length - 1]);
  }
}

// Helper to calculate distance in km using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// -----------------------------------------
// --- INITIALIZATION ---
// -----------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Initially blur dashboard components until entry mountain is chosen
  const header = document.getElementById('headerArea');
  const mainBody = document.querySelector('.dashboard-body');
  
  if (header) header.classList.add('blur-background');
  if (mainBody) mainBody.classList.add('blur-background');

  // Load initial mountain dataset
  const initialData = mountainDatabase[activeMountainKey];
  checkpoints = initialData.checkpoints;
  basecampGateways = initialData.gateways;
  
  generateSmoothPath();
  initDashboardClock();
  initMap();
  setupEventListeners();
  updateTelemetryUI(pathCoordinates[0]);
  
  // Show all mountains on map on load if checked
  const toggleCheckbox = document.getElementById('toggleAllMountains');
  if (toggleCheckbox && toggleCheckbox.checked) {
    showAllMountainsOnMap();
  }
  
  // Seed initial APRS message logs
  addFeedItem("SYSTEM", "Mission Control APRS Gateway initialized.", false, "08:00:00");
  addFeedItem("YD2CLX-4", "System boot complete. ESP32 & LoRa E22 online.", false, "08:00:15");
  addFeedItem("SYSTEM", `Monitoring aktif untuk ${initialData.name}.`, false, "08:00:30");

  // Handle Landing Page search selection & entry
  const landingSearchInput = document.getElementById('landingMountainInput');
  const landingSuggestions = document.getElementById('landingSuggestions');
  const btnLandingEnter = document.getElementById('btnLandingEnter');
  const overlay = document.getElementById('landingOverlay');
  
  let selectedMountainKey = "";

  if (landingSearchInput && landingSuggestions && btnLandingEnter && overlay) {
    landingSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      landingSuggestions.innerHTML = '';
      selectedMountainKey = "";
      btnLandingEnter.classList.remove('active-btn');
      
      if (!query) {
        landingSuggestions.style.display = 'none';
        return;
      }
      
      // Filter from mountainDatabase keys by checking mountain name
      const matches = Object.keys(mountainDatabase).filter(key => {
        return mountainDatabase[key].name.toLowerCase().includes(query);
      });
      
      if (matches.length === 0) {
        landingSuggestions.innerHTML = '<div class="landing-suggestion-item empty-item">Gunung tidak ditemukan</div>';
        landingSuggestions.style.display = 'block';
        return;
      }
      
      matches.forEach(key => {
        const item = document.createElement('div');
        item.className = 'landing-suggestion-item';
        item.innerHTML = `🏔️ <strong>${mountainDatabase[key].name}</strong>`;
        item.addEventListener('click', () => {
          landingSearchInput.value = mountainDatabase[key].name;
          selectedMountainKey = key;
          landingSuggestions.style.display = 'none';
          
          // Enable active state of dashboard enter button
          btnLandingEnter.classList.add('active-btn');
        });
        landingSuggestions.appendChild(item);
      });
      
      landingSuggestions.style.display = 'block';
    });

    // Close suggestions dropdown on click outside
    document.addEventListener('click', (e) => {
      if (!landingSearchInput.contains(e.target) && !landingSuggestions.contains(e.target)) {
        landingSuggestions.style.display = 'none';
      }
    });

    // Submit handler to unlock dashboard
    btnLandingEnter.addEventListener('click', () => {
      if (!selectedMountainKey) {
        // Fallback: match first mountain that contains the query text
        const query = landingSearchInput.value.toLowerCase().trim();
        if (query) {
          const matches = Object.keys(mountainDatabase).filter(key => 
            mountainDatabase[key].name.toLowerCase().includes(query)
          );
          if (matches.length > 0) {
            selectedMountainKey = matches[0];
          }
        }
      }

      if (!selectedMountainKey) return;
      
      // Load the selected mountain data dynamically into dashboard
      changeMountain(selectedMountainKey);
      
      // Remove dashboard blur effect
      if (header) header.classList.remove('blur-background');
      if (mainBody) mainBody.classList.remove('blur-background');
      
      // Smooth fade out landing overlay
      overlay.classList.add('fade-out');
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 500);
    });

    // Enter key press listener for convenience
    landingSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        btnLandingEnter.click();
      }
    });
  }
});

function initDashboardClock() {
  const clockElement = document.getElementById('utcClock');
  const tftTime = document.getElementById('tftTime');
  setInterval(() => {
    const now = new Date();
    clockElement.textContent = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    if (tftTime) {
      tftTime.textContent = now.toTimeString().substring(0, 5);
    }
  }, 1000);
}

// -----------------------------------------
// --- MAP LOGIC ---
// -----------------------------------------
function initMap() {
  // Initialize MapLibre GL JS
  map = new maplibregl.Map({
    container: 'map',
    style: {
      version: 8,
      sources: {
        'esri-satellite': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          ],
          tileSize: 256
        },
        'terrain-source': {
          type: 'raster-dem',
          tiles: [
            'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
          ],
          tileSize: 256,
          encoding: 'terrarium'
        }
      },
      layers: [
        {
          id: 'satellite-layer',
          type: 'raster',
          source: 'esri-satellite',
          minzoom: 0,
          maxzoom: 20
        }
      ]
    },
    center: [116.4589, -8.4204], // Center on Lombok/Rinjani initially
    zoom: 11.5,
    pitch: 0,
    bearing: 0,
    attributionControl: false
  });

  // Enable 3D Terrain on map load
  map.on('load', () => {
    map.setTerrain({
      source: 'terrain-source',
      exaggeration: 1.5
    });

    setupMapLayers();
  });
}

function setupMapLayers() {
  if (!map.getSource('route')) {
    // Planned route line
    map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: pathCoordinates.map(p => [p.lon, p.lat])
        }
      }
    });
    
    map.addLayer({
      id: 'route-line',
      type: 'line',
      source: 'route',
      paint: {
        'line-color': 'rgba(255, 255, 255, 0.4)',
        'line-width': 3,
        'line-dasharray': [3, 3]
      }
    });
  }

  if (!map.getSource('progress')) {
    // Progressive traversed trail path
    map.addSource('progress', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: []
        }
      }
    });

    // Outer glow
    map.addLayer({
      id: 'progress-glow',
      type: 'line',
      source: 'progress',
      paint: {
        'line-color': '#FC4C02',
        'line-width': 18,
        'line-opacity': 0.2
      }
    });

    // Mid glow
    map.addLayer({
      id: 'progress-mid',
      type: 'line',
      source: 'progress',
      paint: {
        'line-color': '#FF6B35',
        'line-width': 7,
        'line-opacity': 0.6
      }
    });

    // Bright core
    map.addLayer({
      id: 'progress-core',
      type: 'line',
      source: 'progress',
      paint: {
        'line-color': '#FF8C61',
        'line-width': 2.5,
        'line-opacity': 1.0
      }
    });
  }

  checkpointMarkers.forEach(m => m.remove());
  checkpointMarkers = [];
  gatewayMarkers.forEach(m => m.remove());
  gatewayMarkers = [];

  drawCheckpointMarkers();
  drawGatewayMarkers();
  drawHikerMarker();
  drawRegistrationMarker();
  drawAllRinjaniRoutes(activeMountainKey);
  drawGeographicLabels();
  updateRouteLinesVisibility();
}

function updateRouteLinesVisibility() {
  if (!map) return;
  // Always hide the dashed route-line for all mountains
  if (map.getLayer('route-line')) map.setLayoutProperty('route-line', 'visibility', 'none');
  
  const isRinjani = activeMountainKey.startsWith('rinjani');
  const visibility = isRinjani ? 'none' : 'visible';
  
  if (map.getLayer('progress-glow')) map.setLayoutProperty('progress-glow', 'visibility', visibility);
  if (map.getLayer('progress-mid')) map.setLayoutProperty('progress-mid', 'visibility', visibility);
  if (map.getLayer('progress-core')) map.setLayoutProperty('progress-core', 'visibility', visibility);
}

function drawCheckpointMarkers() {
  checkpointMarkers.forEach(m => m.remove());
  checkpointMarkers = [];

  checkpoints.forEach((cp, idx) => {
    const isSummit = cp.name.toLowerCase().includes("puncak") || (idx === checkpoints.length - 1);
    if (!isSummit) return; // Skip non-summit checkpoints (orange dots, labels, and popups)
    
    // Extract clean mountain name (e.g. "Gunung Merbabu")
    const rawName = mountainDatabase[activeMountainKey].name;
    const cleanName = rawName.split(' - ')[0];

    const el = document.createElement('div');
    el.className = 'summit-marker-icon';

    if (activeMountainKey === 'rinjani') {
      // Custom Summit View Bubble design
      el.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; transform: translateY(-10px);">
          <!-- Glossy bubble round image -->
          <div style="position: relative; width: 80px; height: 80px; border-radius: 50%; border: 3px solid rgba(255, 255, 255, 0.9); box-shadow: 0 8px 24px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.4); overflow: hidden;">
            <img src="rinjani_summit.png" style="width: 100%; height: 100%; object-fit: cover;" alt="Rinjani Summit View">
            <!-- Glossy overlay reflection -->
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%); pointer-events: none;"></div>
          </div>
          <!-- Text Label -->
          <div style="margin-top: 8px; display: flex; flex-direction: column; align-items: center; text-shadow: 0 2px 4px rgba(0,0,0,0.95); white-space: nowrap;">
            <span style="font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700; color: #4fa5f7; letter-spacing: 0.5px;">Puncak Dewi Anjani</span>
            <span style="font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700; color: #ffffff; letter-spacing: 0.5px; margin-top: 2px;">Gunung Rinjani</span>
            <span style="font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700; color: #ffffff; letter-spacing: 0.5px; margin-top: 1px;">3.726 mdpl</span>
          </div>
        </div>
      `;
    } else {
      // Default Red Flag marker for other mountains
      el.innerHTML = `
        <div class="summit-marker-pulse"></div>
        <div class="summit-marker-inner">🚩</div>
        <div class="summit-label-badge">
          <span class="summit-label-name">${cleanName}</span>
          <span class="summit-label-alt">${cp.alt} mdpl</span>
        </div>
      `;
    }
    
    const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat([cp.lon, cp.lat])
      .addTo(map);
      
    checkpointMarkers.push(marker);
  });
}

function drawGatewayMarkers() {
  gatewayMarkers.forEach(m => m.remove());
  gatewayMarkers = [];

  basecampGateways.forEach(gw => {
    const el = document.createElement('div');
    el.className = 'gateway-marker-icon';
    el.innerHTML = '<div class="gw-ping"></div><div class="gw-dot"></div>';

    const popup = new maplibregl.Popup({ offset: 10, closeButton: false })
      .setHTML(`<div style="color:#fff;font-family:sans-serif;font-size:0.75rem;"><b>Gateway: ${gw.call}</b><br>Tinggi: ${gw.alt}m<br>Paket: ${gw.count}</div>`);

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([gw.lon, gw.lat])
      .setPopup(popup)
      .addTo(map);

    gatewayMarkers.push(marker);
  });
}

function drawHikerMarker() {
  if (hikerMarker) hikerMarker.remove();

  const el = document.createElement('div');
  el.className = 'gps-marker-icon';
  el.innerHTML = '<div class="gps-marker-pulse"></div><div class="gps-marker-dot"></div>';

  const startPoint = pathCoordinates[0];

  hikerMarker = new maplibregl.Marker({ element: el })
    .setLngLat([startPoint.lon, startPoint.lat])
    .addTo(map);
}

function drawRegistrationMarker() {
  registrationMarkers.forEach(m => m.remove());
  registrationMarkers = [];
  
  const mountain = mountainDatabase[activeMountainKey];
  if (!mountain) return;
  
  const offices = [];
  if (mountain.registrationOffice) {
    offices.push(mountain.registrationOffice);
  }
  if (mountain.registrationOffices) {
    offices.push(...mountain.registrationOffices);
  }
  
  offices.forEach(office => {
    const el = document.createElement('div');
    el.className = 'registration-marker';
    if (activeMountainKey === 'rinjani' && office.name.includes("Taman Nasional Gunung Rinjani")) {
      el.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; transform: translateY(-10px);">
          <!-- Glossy bubble round image -->
          <div style="position: relative; width: 80px; height: 80px; border-radius: 50%; border: 3px solid rgba(255, 255, 255, 0.9); box-shadow: 0 8px 24px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.4); overflow: hidden;">
            <img src="rinjani_gate.png?v=117" style="width: 100%; height: 100%; object-fit: cover;" alt="Rinjani Entrance Gate">
            <!-- Glossy overlay reflection -->
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%); pointer-events: none;"></div>
          </div>
          <!-- Text Label -->
          <div style="margin-top: 8px; display: flex; flex-direction: column; align-items: center; text-shadow: 0 2px 4px rgba(0,0,0,0.95); white-space: nowrap;">
            <span style="font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700; color: #4fa5f7; letter-spacing: 0.5px;">Taman Nasional Gunung Rinjani</span>
            <span style="font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700; color: #ffffff; letter-spacing: 0.5px; margin-top: 2px;">Tempat Registrasi</span>
          </div>
        </div>
      `;
    } else {
      el.innerHTML = `
        <div class="registration-marker-pulse"></div>
        <div class="registration-marker-inner">📝</div>
        <div class="registration-label-badge">
          <span class="registration-label-title">${office.name}</span>
          <span class="registration-label-sub">Tempat Registrasi</span>
        </div>
      `;
    }
    
    const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat([office.lon, office.lat])
      .addTo(map);
      
    registrationMarkers.push(marker);
  });
}


// -----------------------------------------
// --- MOUNTAIN & ROUTE DYNAMIC SWITCHER ---
// -----------------------------------------
function changeMountain(key) {
  try {
    if (!mountainDatabase[key]) return;
    
    // Pause simulation and reset tracking indexes
    pauseSimulation();
    currentPathIndex = 0;
    
    // Reset map orientation, rotation, and 3D mode on mountain change
    isMapRotating = false;
    const btnGeTilt = document.getElementById('btnGeTilt');
    if (btnGeTilt) btnGeTilt.classList.remove('active');
    stopMapRotation();
    if (is3DMode) {
      toggle3DMode();
    }
    
    // Uncheck 'All Mountains' toggle to ensure the active tracker path and markers are visible
    const toggleCheckbox = document.getElementById('toggleAllMountains');
    if (toggleCheckbox && toggleCheckbox.checked) {
      toggleCheckbox.checked = false;
      hideAllMountainsOnMap();
    }
    
    activeMountainKey = key;
    const mountain = mountainDatabase[key];
    checkpoints = mountain.checkpoints;
    basecampGateways = mountain.gateways;
    
    // Re-generate path array
    pathCoordinates = [];
    generateSmoothPath();
    
    // Update titles, controls, HUD layout
    document.getElementById('mainTitle').textContent = mountain.title;
    document.getElementById('btnReset').innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></svg>
      RESET ${mountain.name.toUpperCase()}
    `;
    document.getElementById('hudAltLabel').textContent = mountain.hudLabel;
    
    // Sync the Select Dropdown option element
    const select = document.getElementById('mountainSelect');
    if (select && select.value !== key) {
      select.value = key;
    }
    
    // Clear dynamic animated trails
    if (map.getSource('progress')) {
      map.getSource('progress').setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: []
        }
      });
    }

    // Redraw active checkpoint pins, gateways, hiker
    drawCheckpointMarkers();
    drawGatewayMarkers();
    drawHikerMarker();
    drawRegistrationMarker();
    
    // Redraw the main ghost path line
    if (map.getSource('route')) {
      map.getSource('route').setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: pathCoordinates.map(p => [p.lon, p.lat])
        }
      });
    }
    

    

    // Adjust map view to encompass the new path
    if (map) {
      if (key.startsWith('rinjani')) {

        map.fitBounds([
          [116.3800, -8.5100], // Southwest corner
          [116.5400, -8.2900]  // Northeast corner
        ], { padding: 40 });
      } else {

        const lats = pathCoordinates.map(p => p.lat);
        const lons = pathCoordinates.map(p => p.lon);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLon = Math.min(...lons);
        const maxLon = Math.max(...lons);
        map.fitBounds([
          [minLon, minLat],
          [maxLon, maxLat]
        ], { padding: 40 });
      }

    }
    
    // Update dashboard telemetries
    const startPoint = pathCoordinates[0];
    if (startPoint) {
      updateTelemetryUI(startPoint);
    }
    
    // Draw custom mountain route layers
    drawAllRinjaniRoutes(key);
    drawMerbabuRoutes(key);
    drawAgungRoutes(key);
    
    // Draw floating geographic labels
    drawGeographicLabels();
    
    // Auto-enable 3D Mode when entering Rinjani
    if (key.startsWith('rinjani')) {
      if (!is3DMode) {
        toggle3DMode();
      }
    }
    
    // Add a log entry notifying the mission control crew
    addFeedItem("SYSTEM", `Memuat Jalur: ${mountain.name}. Rute berhasil dimutakhirkan.`, false);
  } catch (error) {
    console.error("Error in changeMountain:", error);
    alert("Error in changeMountain: " + error.message);
  }
}

// -----------------------------------------
// --- TELEMETRY ENGINE & SIMULATOR ---
// -----------------------------------------
function startSimulation() {
  if (isPlaying) return;
  isPlaying = true;
  document.getElementById('btnPlay').classList.add('active');
  document.getElementById('btnPause').classList.remove('active');
  
  const tickDuration = Math.round(1000 / simSpeed);
  
  simulationInterval = setInterval(() => {
    if (currentPathIndex < pathCoordinates.length - 1) {
      currentPathIndex++;
      const currentPoint = pathCoordinates[currentPathIndex];
      if (hikerMarker) hikerMarker.setLngLat([currentPoint.lon, currentPoint.lat]);
      if (map) map.panTo([currentPoint.lon, currentPoint.lat]);
      
      // Update UI Telemetry
      updateTelemetryUI(currentPoint);
      
      // Check if checkpoint reached, log it
      const cp = checkpoints.find(c => Math.abs(c.lat - currentPoint.lat) < 0.0001 && Math.abs(c.lon - currentPoint.lon) < 0.0001);
      if (cp) {
        addFeedItem(callSign, `Checkpoint reached: ${cp.name}. Altitude: ${Math.round(cp.alt)}m. Sinyal LoRa stabil.`, isSosActive);
      } else if (currentPathIndex % 8 === 0) {
        addFeedItem(callSign, `Paket APRS terkirim pada koordinat ${currentPoint.lat.toFixed(5)}, ${currentPoint.lon.toFixed(5)}. Tinggi: ${Math.round(currentPoint.alt)}m.`, isSosActive);
      }
    } else {
      // Finished path
      pauseSimulation();
      const mountain = mountainDatabase[activeMountainKey];
      const peak = checkpoints[checkpoints.length - 1];
      addFeedItem(callSign, `Pendakian selesai. Telah mencapai ${mountain.peakName} ${mountain.name} ${Math.round(peak.alt)}m!`, isSosActive);
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
  if (hikerMarker) hikerMarker.setLngLat([startPoint.lon, startPoint.lat]);
  if (map) map.jumpTo({ center: [startPoint.lon, startPoint.lat], zoom: 14 });

  // Clear progressive trail
  if (map.getSource('progress')) {
    map.getSource('progress').setData({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: []
      }
    });
  }

  updateTelemetryUI(startPoint);
  const mountain = mountainDatabase[activeMountainKey];
  addFeedItem(callSign, `Simulasi di-reset ke basecamp: ${checkpoints[0].name}.`, false);
}

function updateTelemetryUI(point) {
  // Update Latitude / Longitude
  document.getElementById('telLat').textContent = point.lat.toFixed(5);
  document.getElementById('telLon').textContent = point.lon.toFixed(5);
  document.getElementById('hudCoords').textContent = `${point.lat.toFixed(4)}, ${point.lon.toFixed(4)}`;
  const altitudeRounded = Math.round(point.alt);
  document.getElementById('telAlt').textContent = `${altitudeRounded} m`;
  document.getElementById('hudAlt').textContent = `${altitudeRounded} m`;
  const popupAlt = document.getElementById('popupAlt');
  if (popupAlt) popupAlt.textContent = altitudeRounded;

  // Speed

  const isMoving = isPlaying && currentPathIndex < pathCoordinates.length - 1;
  const speed = isMoving ? (3.5 + Math.random() * 1.5).toFixed(1) : "0.0";
  document.getElementById('telSpeed').textContent = `${speed} km/h`;

  // Satellites


  const satellites = 14 + Math.floor(Math.sin(currentPathIndex / 10) * 3) + (Math.random() > 0.8 ? 1 : 0);
  document.getElementById('telSats').textContent = `${satellites}+`;

  // Battery (drain slowly over path progress)
  const battery = Math.max(42, 99 - Math.floor(currentPathIndex / 5));


  document.getElementById('telBattery').textContent = `${battery}%`;

  // Telemetry diagnostics calculations based on closest gateway dynamically


  let currentGateway = basecampGateways[0];
  let minDistToGateway = 999999;
  basecampGateways.forEach(gw => {


    const d = calculateDistance(point.lat, point.lon, gw.lat, gw.lon);
    if (d < minDistToGateway) {
      minDistToGateway = d;
      currentGateway = gw;
    }
  });
  const distToGateway = minDistToGateway;
  document.getElementById('telGatewayDist').textContent = `${distToGateway.toFixed(1)} km`;

  const hudThirdLabel = document.getElementById('hudThirdLabel');


  const hudThirdValue = document.getElementById('hudThirdValue');
  if (hudThirdLabel && hudThirdValue) {
    if (activeMountainKey.startsWith('rinjani')) {
      hudThirdLabel.textContent = 'Status:';
      hudThirdValue.textContent = 'Aktif';
      hudThirdValue.style.color = '#10b981';
      hudThirdValue.style.fontWeight = '800';
    } else {
      hudThirdLabel.textContent = 'Ke Gateway:';
      hudThirdValue.textContent = `${distToGateway.toFixed(1)} km`;
      hudThirdValue.style.color = '';
      hudThirdValue.style.fontWeight = '';
    }
  }

  // RSSI & SNR calculations (Line of Sight increases at higher altitudes)
  // Closer or higher altitude = stronger RSSI
  const minAlt = checkpoints[0].alt;
  const maxAlt = checkpoints[checkpoints.length - 1].alt;
  const altitudeRatio = (point.alt - minAlt) / (maxAlt - minAlt || 1); // 0 at basecamp, 1 at peak
  const distanceFactor = Math.min(distToGateway / 20, 1.0); // normalize distance up to 20km
  
  // Base RSSI around -85dBm at basecamp, improves up to -68dBm on high ridges due to clear LOS, or degrades to -98dBm in deep valleys
  const baseRssi = -88 + (altitudeRatio * 20) - (distanceFactor * 10);
  const rssiVal = Math.round(baseRssi + (Math.random() * 4 - 2));
  const snrVal = (12 * altitudeRatio - 8 * distanceFactor + (Math.random() * 2 - 1)).toFixed(1);

  document.getElementById('rssiVal').textContent = `${rssiVal} dBm`;
  document.getElementById('snrVal').textContent = `${snrVal} dB`;

  // Update signal progress bars
  const rssiPct = Math.min(Math.max((rssiVal + 120) * 1.25, 0), 100); // map -120..-40 to 0..100%
  const snrPct = Math.min(Math.max((parseFloat(snrVal) + 15) * 3.33, 0), 100); // map -15..15 to 0..100%

  const rssiFill = document.getElementById('rssiFill');
  const snrFill = document.getElementById('snrFill');
  
  rssiFill.style.width = `${rssiPct}%`;
  snrFill.style.width = `${snrPct}%`;

  // Apply colors to progress bars
  rssiFill.className = 'progress-bar-fill ' + (rssiVal > -85 ? 'rssi-strong' : rssiVal > -100 ? 'rssi-medium' : 'rssi-weak');
  snrFill.className = 'progress-bar-fill ' + (snrVal > 2 ? 'rssi-strong' : snrVal > -6 ? 'rssi-medium' : 'rssi-weak');

  // === STRAVA PROGRESSIVE TRAIL DRAWING ===
  if (map && map.getSource('progress')) {
    map.getSource('progress').setData({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: pathCoordinates.slice(0, currentPathIndex + 1).map(p => [p.lon, p.lat])
      }
    });
  }

  // Update Gateway List Telemetries
  updateGatewayTelemetryList(distToGateway, rssiVal);

  // Update TFT Screen Simulator Telemetries
  document.getElementById('tftLat').textContent = point.lat.toFixed(4);
  document.getElementById('tftLon').textContent = point.lon.toFixed(4);
  document.getElementById('tftAlt').textContent = `${Math.round(point.alt)} m`;
  document.getElementById('tftSpeed').textContent = `${speed} km/h`;
  document.getElementById('tftRssi').textContent = `${rssiVal} dBm`;
  document.getElementById('tftSnr').textContent = `${snrVal} dB`;
  document.getElementById('tftGateway').textContent = `${distToGateway.toFixed(1)} km`;

  // Update signal strength bars on TFT Simulator
  const tftBars = document.querySelectorAll('.tft-signal-strength-indicator .tft-signal-bar');
  const tftSignalStrength = rssiVal > -85 ? 4 : rssiVal > -95 ? 3 : rssiVal > -105 ? 2 : 1;
  tftBars.forEach((bar, idx) => {
    if (idx < tftSignalStrength) {
      bar.style.backgroundColor = 'var(--success)';
    } else {
      bar.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    }
  });

  // Rotate virtual compass arrow
  const tftCompassArrow = document.getElementById('tftCompassArrow');
  if (tftCompassArrow) {
    const rotation = (currentPathIndex * 7) % 360;
    tftCompassArrow.style.transform = `rotate(${rotation}deg)`;
  }

  // Calculate distance to peak for TFT Simulator
  const peakPoint = checkpoints[checkpoints.length - 1];
  const peakDist = calculateDistance(point.lat, point.lon, peakPoint.lat, peakPoint.lon);
  document.getElementById('tftPeakDist').textContent = `${peakDist.toFixed(1)} km`;

  // Update TFT Header Stats
  document.getElementById('tftSatIcon').textContent = `🛰️ ${satellites}`;
  document.getElementById('tftBatIcon').textContent = `🔋 ${battery}%`;
}

function updateGatewayTelemetryList(hikerDistToClosest, hikerRssi) {
  const gList = document.getElementById('gatewayList');
  gList.innerHTML = '';
  
  basecampGateways.forEach((gw, idx) => {
    let dist, rssi;
    const currentPoint = pathCoordinates[currentPathIndex];
    dist = calculateDistance(currentPoint.lat, currentPoint.lon, gw.lat, gw.lon);
    
    // Simulate RSSI based on distance to that specific gateway
    const minAlt = checkpoints[0].alt;
    const maxAlt = checkpoints[checkpoints.length - 1].alt;
    const altitudeRatio = (currentPoint.alt - minAlt) / (maxAlt - minAlt || 1);
    rssi = Math.round(-85 - (dist * 0.8) + (altitudeRatio * 18) + (idx === 1 ? 5 : 0));
    
    // Packet increments
    if (isPlaying && currentPathIndex % 4 === 0) gw.count += Math.floor(Math.random() * 2);

    const div = document.createElement('div');
    div.className = 'gateway-item';
    div.innerHTML = `
      <div class="gw-info">
        <span class="gw-call">
          <span class="gw-status-indicator" style="background-color: ${rssi > -105 ? '#10b981' : '#ef4444'}"></span>
          ${gw.call}
        </span>
        <span class="gw-dist">Jarak: ${dist.toFixed(1)} km</span>
      </div>
      <div class="gw-metrics">
        <span class="gw-rssi">${rssi} dBm</span>
        <div class="gw-packets">Packets: ${gw.count}</div>
      </div>
    `;
    gList.appendChild(div);
  });
}

// -----------------------------------------
// --- SOS ALARM SYSTEM (WEB AUDIO) ---
// -----------------------------------------
function toggleSosAlarm() {
  const btnSos = document.getElementById('btnSos');
  const overlay = document.getElementById('sosOverlay');
  const hikerEl = document.querySelector('.gps-marker-icon');
  const tftBtnSos = document.getElementById('tftBtnSos');
  const tftLoraMode = document.getElementById('tftLoraMode');
  
  isSosActive = !isSosActive;

  if (isSosActive) {
    btnSos.classList.add('triggered');
    btnSos.textContent = "CANCEL SOS";
    overlay.classList.add('active');
    if (hikerEl) hikerEl.classList.add('sos');
    
    if (tftBtnSos) tftBtnSos.classList.add('active-sos');
    if (tftLoraMode) {
      tftLoraMode.textContent = "🚨 SOS ACTIVE";
      tftLoraMode.className = "tft-val highlight-magenta";
    }
    
    // Add critical log
    addFeedItem(callSign, "🚨 EMERGENCY SOS SIGNAL ACTIVATED! Pendaki memerlukan bantuan segera!", true);
    
    // Start Audio Beep
    startAlarmSound();
  } else {
    btnSos.classList.remove('triggered');
    btnSos.textContent = "TRIGGER SOS ALARM";
    overlay.classList.remove('active');
    if (hikerEl) hikerEl.classList.remove('sos');
    
    if (tftBtnSos) tftBtnSos.classList.remove('active-sos');
    if (tftLoraMode) {
      tftLoraMode.textContent = "NORMAL";
      tftLoraMode.className = "tft-val highlight-cyan";
    }
    
    // Add resolved log
    addFeedItem(callSign, "✅ Emergency SOS signal canceled / resolved.", false);
    
    // Stop Audio Beep
    stopAlarmSound();
  }
}

function startAlarmSound() {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Double pulse siren beep
    alarmOscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    alarmOscillator.type = 'sine';
    alarmOscillator.frequency.setValueAtTime(880, audioContext.currentTime); // Pitch
    
    // Modulation volume LFO
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    
    alarmOscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    alarmOscillator.start();
    
    // Siren sound loop
    let high = true;
    alarmInterval = setInterval(() => {
      if (alarmOscillator) {
        const nextFreq = high ? 1200 : 880;
        alarmOscillator.frequency.setValueAtTime(nextFreq, audioContext.currentTime);
        high = !high;
      }
    }, 400);

  } catch(e) {
    console.error("Audio Context not supported or interaction required: ", e);
  }
}

function stopAlarmSound() {
  if (alarmOscillator) {
    try {
      alarmOscillator.stop();
      alarmOscillator.disconnect();
    } catch(e){}
    alarmOscillator = null;
  }
  if (typeof alarmInterval !== 'undefined') {
    clearInterval(alarmInterval);
  }
}

// -----------------------------------------
// --- MESSAGE BOARD / LOGS FEED ---
// -----------------------------------------
function addFeedItem(sender, message, isSos = false, customTime = null) {
  const container = document.getElementById('feedContainer');
  
  const now = new Date();
  const timestamp = customTime || now.toTimeString().split(' ')[0];
  
  const div = document.createElement('div');
  div.className = 'feed-item' + (isSos ? ' sos' : '');
  div.innerHTML = `
    <div class="feed-item-header">
      <span class="feed-call">${sender}</span>
      <span class="feed-time">${timestamp}</span>
    </div>
    <div class="feed-text">${message}</div>
  `;
  
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function sendCustomMessage() {
  const input = document.getElementById('msgInput');
  const text = input.value.trim();
  
  if (!text) return;
  
  addFeedItem("YD2CLX-4 (Hiker)", text, isSosActive);
  input.value = '';
}

// -----------------------------------------
// --- EVENT LISTENERS ---
// -----------------------------------------
function setupEventListeners() {
  document.getElementById('btnPlay').addEventListener('click', () => {
    startSimulation();
  });
  
  document.getElementById('btnPause').addEventListener('click', () => {
    pauseSimulation();
  });
  
  document.getElementById('btnReset').addEventListener('click', () => {
    resetSimulation();
  });

  document.getElementById('btnSos').addEventListener('click', () => {
    toggleSosAlarm();
  });

  // Speed selector slider
  const speedRange = document.getElementById('speedRange');
  const speedVal = document.getElementById('speedVal');
  speedRange.addEventListener('input', (e) => {
    simSpeed = parseInt(e.target.value);
    speedVal.textContent = `${simSpeed}x`;
    
    // Adjust speed on-the-fly if playing
    if (isPlaying) {
      clearInterval(simulationInterval);
      isPlaying = false;
      startSimulation();
    }
  });

  // Send message submit
  document.getElementById('btnSendMsg').addEventListener('click', () => {
    sendCustomMessage();
  });
  
  document.getElementById('msgInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendCustomMessage();
    }
  });

  // TFT Emulator Tab Navigation
  const btnTele = document.getElementById('tftBtnTele');
  const btnSignal = document.getElementById('tftBtnSignal');
  const btnNav = document.getElementById('tftBtnNav');
  const btnTftSos = document.getElementById('tftBtnSos');

  const tabTele = document.getElementById('tftTabTelemetry');
  const tabSignal = document.getElementById('tftTabSignal');
  const tabNav = document.getElementById('tftTabNavigation');

  function selectTab(activeBtn, activeTab) {
    [btnTele, btnSignal, btnNav].forEach(btn => btn.classList.remove('active'));
    [tabTele, tabSignal, tabNav].forEach(tab => tab.classList.remove('active'));
    activeBtn.classList.add('active');
    activeTab.classList.add('active');
  }

  if (btnTele && tabTele) btnTele.addEventListener('click', () => selectTab(btnTele, tabTele));
  if (btnSignal && tabSignal) btnSignal.addEventListener('click', () => selectTab(btnSignal, tabSignal));
  if (btnNav && tabNav) btnNav.addEventListener('click', () => selectTab(btnNav, tabNav));

  // Sync virtual SOS button
  if (btnTftSos) {
    btnTftSos.addEventListener('click', () => {
      toggleSosAlarm();
    });
  }

  // Mountain / Trail Selection Dropdown Event Listener
  const mSelect = document.getElementById('mountainSelect');
  if (mSelect) {
    mSelect.addEventListener('change', (e) => {
      changeMountain(e.target.value);
    });
  }

  // Toggle All Indonesian Mountains Checkbox Event Listener
  const toggleCheckbox = document.getElementById('toggleAllMountains');
  if (toggleCheckbox) {
    toggleCheckbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        showAllMountainsOnMap();
      } else {
        hideAllMountainsOnMap();
      }
    });
  }

  // Mountain Search Functionality Setup
  const searchInput = document.getElementById('mountainSearchInput');
  const resultsDiv = document.getElementById('mountainSearchResults');
  
  if (searchInput && resultsDiv) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      resultsDiv.innerHTML = '';
      
      if (!query) {
        resultsDiv.style.display = 'none';
        return;
      }
      
      // Load the dataset if not loaded yet
      if (allMountains.length === 0) {
        loadAllMountainsDataset();
      }
      
      // Filter mountains by name
      const matches = allMountains.filter(m => m.name.toLowerCase().includes(query)).slice(0, 15);
      
      if (matches.length === 0) {
        resultsDiv.innerHTML = '<div style="padding: 8px 10px; font-size: 0.7rem; color: rgba(255,255,255,0.4);">Tidak ada hasil</div>';
        resultsDiv.style.display = 'block';
        return;
      }
      
      matches.forEach(m => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        const isVolcano = m.type === 'active_volcano';
        item.innerHTML = `
          <span>${isVolcano ? '🌋' : '⛰️'} ${m.name}</span>
          <span style="font-size: 0.6rem; color: rgba(255,255,255,0.5);">${m.alt}m</span>
        `;
        item.addEventListener('click', () => {
          // If 600+ mountains checkbox is not checked, check it and draw them
          if (toggleCheckbox && !toggleCheckbox.checked) {
            toggleCheckbox.checked = true;
            showAllMountainsOnMap();
          } else if (allMountainsMarkers.length === 0) {
            showAllMountainsOnMap();
          }
          
          // Pan and zoom the map to the selected mountain
          if (map) {
            map.jumpTo({ center: [m.lon, m.lat], zoom: 12 });
          }
          
          // Open the popup for that marker
          if (m.markerRef) {
            m.markerRef.togglePopup();
          }
          searchInput.value = m.name;
          resultsDiv.style.display = 'none';
        });
        
        resultsDiv.appendChild(item);
      });
      
      resultsDiv.style.display = 'block';
    });
    
    // Close results when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !resultsDiv.contains(e.target)) {
        resultsDiv.style.display = 'none';
      }
    });
  }

  // Google Earth-style Zoom Controls
  const btnGeZoomIn = document.getElementById('btnGeZoomIn');
  const btnGeZoomOut = document.getElementById('btnGeZoomOut');
  if (btnGeZoomIn) {
    btnGeZoomIn.addEventListener('click', () => {
      if (map) map.zoomIn();
    });
  }
  if (btnGeZoomOut) {
    btnGeZoomOut.addEventListener('click', () => {
      if (map) map.zoomOut();
    });
  }

  // Google Earth 2D/3D Mode Toggle
  const btnGe3D = document.getElementById('btnGe3D');
  if (btnGe3D) {
    btnGe3D.addEventListener('click', () => {
      toggle3DMode();
    });
  }

  // Google Earth Tilt / Auto Rotation Toggle
  const btnGeTilt = document.getElementById('btnGeTilt');
  if (btnGeTilt) {
    btnGeTilt.addEventListener('click', () => {
      toggleMapRotation();
    });
  }

  // Google Earth Compass North Reset
  const btnGeCompass = document.getElementById('btnGeCompass');
  if (btnGeCompass) {
    btnGeCompass.addEventListener('click', () => {
      resetNorth();
    });
  }

  // Google Earth Pegman (Highlight Trails Mode)
  const btnGePegman = document.getElementById('btnGePegman');
  if (btnGePegman) {
    btnGePegman.addEventListener('click', () => {
      togglePegmanMode();
    });
  }
}

// --- ALL INDONESIAN MOUNTAINS FEATURE (600+) ---


function generateAllIndonesianMountains() {
  return [
    {
      name: "Gunung Merbabu",
      lat: -7.4430,
      lon: 110.4380,
      alt: 3142,
      type: 'inactive_mountain',
      description: 'Gunung Non-Aktif Terpopuler Jawa Tengah'
    },
    {
      name: "Gunung Sindoro",
      lat: -7.3014,
      lon: 109.9989,
      alt: 3136,
      type: 'active_volcano',
      description: 'Gunung Api Aktif Tipe A Jawa Tengah'
    },
    {
      name: "Gunung Slamet",
      lat: -7.2422,
      lon: 109.2192,
      alt: 3428,
      type: 'active_volcano',
      description: 'Gunung Api Aktif Tertinggi Jawa Tengah'
    },
    {
      name: "Gunung Rinjani",
      lat: -8.4110,
      lon: 116.4580,
      alt: 3726,
      type: 'active_volcano',
      description: 'Gunung Api Rinjani Nusa Tenggara Barat'
    },
    {
      name: "Gunung Kerinci",
      lat: -1.6970,
      lon: 101.2640,
      alt: 3805,
      type: 'active_volcano',
      description: 'Gunung Api Aktif Tertinggi Sumatra'
    },
    {
      name: "Gunung Latimojong",
      lat: -3.3830,
      lon: 120.0250,
      alt: 3478,
      type: 'inactive_mountain',
      description: 'Atap Tertinggi Sulawesi Selatan (Rantemario)'
    },
    {
      name: "Gunung Semeru",
      lat: -8.1077,
      lon: 112.9224,
      alt: 3676,
      type: 'active_volcano',
      description: 'Gunung Api Aktif Tertinggi Jawa Timur'
    },
    {
      name: "Gunung Agung",
      lat: -8.3420,
      lon: 115.5080,
      alt: 3031,
      type: 'active_volcano',
      description: 'Gunung Api Aktif Tertinggi Bali'
    },
    {
      name: "Gunung Raung",
      lat: -8.1250,
      lon: 114.0450,
      alt: 3332,
      type: 'active_volcano',
      description: 'Gunung Api Aktif Tipe A Jawa Timur'
    }
  ];
}


function getRegionName(lat, lon) {
  if (lon > 134.0) return "Papua";
  if (lon > 126.0) return "Maluku / Maluku Utara";
  if (lon > 118.5 && lat < -0.5) return "Nusa Tenggara Timur";
  if (lon > 118.5 && lat >= -0.5) return "Sulawesi";
  if (lon > 115.6 && lat < -5.5) return "Nusa Tenggara Barat";
  if (lon > 114.3 && lat < -5.5) return "Bali";
  if (lon > 105.0 && lon <= 114.3 && lat < -5.5 && lat > -9.0) {
    if (lon > 112.4) return "Jawa Timur";
    if (lon > 108.8) return "Jawa Tengah";
    return "Jawa Barat";
  }
  if (lon > 108.0 && lat > -5.0) return "Kalimantan";
  if (lon > 110.0 && lat > -5.0) return "Kalimantan";
  return "Sumatra";
}

function loadAllMountainsDataset() {
  allMountains = generateAllIndonesianMountains();
}

function showAllMountainsOnMap() {
  if (!map) return;

  checkpointMarkers.forEach(m => m.remove());
  gatewayMarkers.forEach(m => m.remove());
  geLabelMarkers.forEach(m => m.remove());
  if (hikerMarker) hikerMarker.remove();
  registrationMarkers.forEach(m => m.remove());
  registrationMarkers = [];

  if (map.getLayer('route-line')) map.setLayoutProperty('route-line', 'visibility', 'none');
  if (map.getLayer('progress-glow')) map.setLayoutProperty('progress-glow', 'visibility', 'none');
  if (map.getLayer('progress-mid')) map.setLayoutProperty('progress-mid', 'visibility', 'none');
  if (map.getLayer('progress-core')) map.setLayoutProperty('progress-core', 'visibility', 'none');
  if (map.getLayer('rinjani-routes-layer')) map.setLayoutProperty('rinjani-routes-layer', 'visibility', 'none');
  if (map.getLayer('rinjani-hiking-layer')) map.setLayoutProperty('rinjani-hiking-layer', 'visibility', 'none');
  if (window.rinjaniLandmarkMarkers) window.rinjaniLandmarkMarkers.forEach(m => m.remove());
  if (map.getLayer('merbabu-hiking-layer')) map.setLayoutProperty('merbabu-hiking-layer', 'visibility', 'none');
  if (window.merbabuLandmarkMarkers) window.merbabuLandmarkMarkers.forEach(m => m.remove());
  if (map.getLayer('agung-routes-layer')) map.setLayoutProperty('agung-routes-layer', 'visibility', 'none');
  if (map.getLayer('agung-hiking-layer')) map.setLayoutProperty('agung-hiking-layer', 'visibility', 'none');
  if (window.agungLandmarkMarkers) window.agungLandmarkMarkers.forEach(m => m.remove());
  if (map.getLayer('ge-labels-layer')) map.setLayoutProperty('ge-labels-layer', 'visibility', 'none');




  if (allMountainsMarkers.length === 0) {

    if (allMountains.length === 0) {
      loadAllMountainsDataset();
    }

    allMountains.forEach(m => {
      const isVolcano = m.type === 'active_volcano';
      const color = isVolcano ? '#FF3B30' : '#34C759';
      const region = getRegionName(m.lat, m.lon);

      const el = document.createElement('div');




      el.style.width = '8px';
      el.style.height = '8px';
      el.style.backgroundColor = color;
      el.style.border = '1px solid #fff';


      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';

      const popup = new maplibregl.Popup({ offset: 6, closeButton: false })

        .setHTML(`
          <div style="font-family: 'Outfit', sans-serif; font-size: 0.75rem; color: #ffffff; padding: 2px;">
            <strong style="font-size: 0.85rem; display: block; margin-bottom: 4px; color: ${isVolcano ? '#DC2626' : '#16A34A'}">
              ${isVolcano ? '🌋' : '⛰️'} ${m.name}
            </strong>
            <div style="margin-bottom: 2px;"><b>Kawasan Wilayah:</b> ${region}</div>
            <div style="margin-bottom: 2px;"><b>Tinggi:</b> ${m.alt} mdpl</div>
            <div style="margin-bottom: 2px;"><b>Tipe:</b> ${m.description}</div>
            <div><b>Luas Estimasi:</b> Lingkup Area 5 Km</div>
          </div>
        `);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([m.lon, m.lat])
        .setPopup(popup)
        .addTo(map);



      allMountainsMarkers.push(marker);
    });
  } else {
    allMountainsMarkers.forEach(m => m.addTo(map));
  }

  // Set national view
  map.jumpTo({ center: [118.0, -2.0], zoom: 5, pitch: 0, bearing: 0 });
}

function hideAllMountainsOnMap() {


  if (!map) return;

  // Hide all mountains
  allMountainsMarkers.forEach(m => m.remove());

  // Show active route elements back
  checkpointMarkers.forEach(m => m.addTo(map));
  gatewayMarkers.forEach(m => m.addTo(map));
  geLabelMarkers.forEach(m => m.addTo(map));
  if (hikerMarker) hikerMarker.addTo(map);
  registrationMarkers.forEach(m => m.addTo(map));
  if (map.getLayer('rinjani-hiking-layer')) map.setLayoutProperty('rinjani-hiking-layer', 'visibility', 'visible');
  if (window.rinjaniLandmarkMarkers) window.rinjaniLandmarkMarkers.forEach(m => m.addTo(map));
  if (map.getLayer('merbabu-hiking-layer')) map.setLayoutProperty('merbabu-hiking-layer', 'visibility', 'visible');
  if (window.merbabuLandmarkMarkers) window.merbabuLandmarkMarkers.forEach(m => m.addTo(map));
  if (map.getLayer('agung-hiking-layer')) map.setLayoutProperty('agung-hiking-layer', 'visibility', 'visible');
  if (window.agungLandmarkMarkers) window.agungLandmarkMarkers.forEach(m => m.addTo(map));
  updateRouteLinesVisibility();

  // Fit bounds back to active route
  const lats = pathCoordinates.map(p => p.lat);
  const lons = pathCoordinates.map(p => p.lon);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  map.fitBounds([
    [minLon, minLat],
    [maxLon, maxLat]
  ], { padding: 40 });
}



function drawAllRinjaniRoutes(key) {
  if (!map) return;
  
  if (map.getLayer('rinjani-hiking-layer')) map.removeLayer('rinjani-hiking-layer');
  if (map.getSource('rinjani-hiking-source')) map.removeSource('rinjani-hiking-source');
  
  if (window.rinjaniLandmarkMarkers) {
    window.rinjaniLandmarkMarkers.forEach(m => m.remove());
  }
  window.rinjaniLandmarkMarkers = [];

  if (!key || !key.startsWith('rinjani')) return;

  // 1. Add Waymarked Trails Hiking Overlay Tile Source
  map.addSource('rinjani-hiking-source', {
    type: 'raster',
    tiles: ['https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png'],
    tileSize: 256,
    maxzoom: 18
  });

  map.addLayer({
    id: 'rinjani-hiking-layer',
    type: 'raster',
    source: 'rinjani-hiking-source',
    paint: {
      'raster-opacity': 0.85
    }
  });

  // 2. Add Landmark Markers from rute gunung rinjani.txt
  const landmarks = [
    { name: "🌊 Danau Segara Anak", sub: "Spot kamping utama & air panas", lat: -8.4069, lon: 116.4178 }
  ];

  landmarks.forEach(spot => {
    const el = document.createElement('div');
    el.className = 'rinjani-landmark-marker';
    
    if (spot.name.includes("Danau Segara Anak")) {
      el.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; transform: translateY(-10px);">
          <!-- Glossy bubble round image -->
          <div style="position: relative; width: 80px; height: 80px; border-radius: 50%; border: 3px solid rgba(255, 255, 255, 0.9); box-shadow: 0 8px 24px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.4); overflow: hidden;">
            <img src="segara_anak.png" style="width: 100%; height: 100%; object-fit: cover;" alt="Segara Anak">
            <!-- Glossy overlay reflection -->
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%); pointer-events: none;"></div>
          </div>
          <!-- Text Label -->
          <div style="margin-top: 8px; display: flex; flex-direction: column; align-items: center; text-shadow: 0 2px 4px rgba(0,0,0,0.95); white-space: nowrap;">
            <span style="font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700; color: #4fa5f7; letter-spacing: 0.5px;">Danau Segara Anak</span>
            <span style="font-family: 'Inter', sans-serif; font-size: 9px; font-weight: 800; color: #ffffff; letter-spacing: 0.8px; margin-top: 2px; text-transform: uppercase;">PRIMARY CAMPING SPOT & HOT SPRINGS</span>
          </div>
        </div>
      `;
    } else {
      el.innerHTML = `
        <div class="registration-label-badge" style="position: relative; top: 0; border-color: rgba(59, 130, 246, 0.8); box-shadow: 0 4px 12px rgba(0,0,0,0.6), 0 0 10px rgba(59,130,246,0.4);">
          <span class="registration-label-title">${spot.name}</span>
          <span class="registration-label-sub" style="color: #60a5fa;">${spot.sub}</span>
        </div>
      `;
    }

    const marker = new maplibregl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat([spot.lon, spot.lat])
      .addTo(map);

    window.rinjaniLandmarkMarkers.push(marker);
  });
}

function drawMerbabuRoutes(key) {
  if (!map) return;
  
  if (map.getLayer('merbabu-hiking-layer')) map.removeLayer('merbabu-hiking-layer');
  if (map.getSource('merbabu-hiking-source')) map.removeSource('merbabu-hiking-source');
  
  if (window.merbabuLandmarkMarkers) {
    window.merbabuLandmarkMarkers.forEach(m => m.remove());
  }
  window.merbabuLandmarkMarkers = [];

  if (!key || !key.startsWith('merbabu')) return;

  // 1. Add Waymarked Trails Hiking Overlay Tile Source
  map.addSource('merbabu-hiking-source', {
    type: 'raster',
    tiles: ['https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png'],
    tileSize: 256,
    maxzoom: 18
  });

  map.addLayer({
    id: 'merbabu-hiking-layer',
    type: 'raster',
    source: 'merbabu-hiking-source',
    paint: {
      'raster-opacity': 0.85
    }
  });

  // 2. Add Landmark Markers from rute gunung merbabu.txt
  const landmarks = [
    { name: "⛺ Sabana 1 & 2", sub: "Spot kamping ikonik padang rumput Merbabu", lat: -7.4655, lon: 110.4442 }
  ];

  landmarks.forEach(spot => {
    const el = document.createElement('div');
    el.className = 'merbabu-landmark-marker';
    el.innerHTML = `
      <div class="registration-label-badge" style="position: relative; top: 0; border-color: rgba(139, 92, 246, 0.8); box-shadow: 0 4px 12px rgba(0,0,0,0.6), 0 0 10px rgba(139,92,246,0.4);">
        <span class="registration-label-title">${spot.name}</span>
        <span class="registration-label-sub" style="color: #a78bfa;">${spot.sub}</span>
      </div>
    `;

    const marker = new maplibregl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat([spot.lon, spot.lat])
      .addTo(map);

    window.merbabuLandmarkMarkers.push(marker);
  });
}

function drawAgungRoutes(key) {
  if (!map) return;

  if (map.getLayer('agung-hiking-layer')) map.removeLayer('agung-hiking-layer');
  if (map.getSource('agung-hiking-source')) map.removeSource('agung-hiking-source');
  if (map.getLayer('agung-routes-layer')) map.removeLayer('agung-routes-layer');
  if (map.getSource('agung-routes-source')) map.removeSource('agung-routes-source');

  if (window.agungLandmarkMarkers) {
    window.agungLandmarkMarkers.forEach(m => m.remove());
  }
  window.agungLandmarkMarkers = [];
}

function drawGeographicLabels() {
  // Clear any existing ones first
  geLabelMarkers.forEach(m => m.remove());
  geLabelMarkers = [];
  if (!activeMountainKey.startsWith('rinjani')) return;



  geographicLabels.forEach(label => {

    const el = document.createElement('div');
    el.className = `ge-floating-label ${label.cssClass}`;
    el.textContent = label.text;
    el.style.color = '#ffffff';
    el.style.textShadow = '0 0 4px #000000';
    el.style.fontSize = '11px';
    el.style.fontWeight = 'bold';
    el.style.whiteSpace = 'nowrap';
    el.style.pointerEvents = 'none';

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([label.coords[1], label.coords[0]])
      .addTo(map);
      
    geLabelMarkers.push(marker);
  });
}

// -----------------------------------------
// --- GOOGLE EARTH MAP CONTROLS ---
// -----------------------------------------
function toggle3DMode() {
  const btn = document.getElementById('btnGe3D');
  const span = document.getElementById('txtGe3D');
  if (!map || !btn) return;
  
  is3DMode = !is3DMode;
  
  if (is3DMode) {
    btn.classList.add('active');
    if (span) span.textContent = '2D';
    
    // Smoothly tilt MapLibre map to 65 degrees and zoom closer to mountains
    map.easeTo({
      pitch: 65,
      zoom: map.getZoom() > 11 ? map.getZoom() : 12.5,
      duration: 1000
    });
  } else {
    btn.classList.remove('active');
    if (span) span.textContent = '3D';
    
    // Stop rotation first
    if (isMapRotating) {
      isMapRotating = false;
      const btnGeTilt = document.getElementById('btnGeTilt');
      if (btnGeTilt) btnGeTilt.classList.remove('active');
      stopMapRotation();
    }
    
    // Reset tilt and bearing
    map.easeTo({
      pitch: 0,
      bearing: 0,
      duration: 1000
    });
    
    // Reset compass needle
    const needle = document.getElementById('compassNeedle');
    if (needle) {
      needle.style.transform = 'rotate(0deg)';
    }
    mapRotationAngle = 0;
  }
}

function toggleMapRotation() {
  const btnGeTilt = document.getElementById('btnGeTilt');
  if (!btnGeTilt) return;
  
  if (!is3DMode) {
    toggle3DMode();
  }
  
  isMapRotating = !isMapRotating;
  
  if (isMapRotating) {
    btnGeTilt.classList.add('active');
    startMapRotation();
  } else {
    btnGeTilt.classList.remove('active');
    stopMapRotation();
  }
}

function startMapRotation() {
  if (!map) return;
  
  // Disable user panning/zooming during auto rotation
  map.dragPan.disable();
  map.scrollZoom.disable();
  map.boxZoom.disable();
  map.doubleClickZoom.disable();
  
  function animate() {
    if (!isMapRotating) return;
    mapRotationAngle = (mapRotationAngle + 0.1) % 360;
    
    // Natively set bearing
    map.setBearing(mapRotationAngle);
    
    // Rotate compass needle
    const needle = document.getElementById('compassNeedle');
    if (needle) {
      needle.style.transform = `rotate(${-mapRotationAngle}deg)`;
    }
    
    mapRotationInterval = requestAnimationFrame(animate);
  }
  
  mapRotationInterval = requestAnimationFrame(animate);
}

function stopMapRotation() {
  if (mapRotationInterval) {
    cancelAnimationFrame(mapRotationInterval);
    mapRotationInterval = null;
  }
  
  if (map) {
    map.dragPan.enable();
    map.scrollZoom.enable();
    map.boxZoom.enable();
    map.doubleClickZoom.enable();
  }
}

function resetNorth() {
  if (isMapRotating) {
    isMapRotating = false;
    const btnGeTilt = document.getElementById('btnGeTilt');
    if (btnGeTilt) btnGeTilt.classList.remove('active');
    stopMapRotation();
  }
  
  if (map) {
    map.easeTo({
      bearing: 0,
      duration: 500
    });
  }
  
  const needle = document.getElementById('compassNeedle');
  if (needle) {
    needle.style.transform = 'rotate(0deg)';
  }
  mapRotationAngle = 0;
}

function togglePegmanMode() {
  const btn = document.getElementById('btnGePegman');
  if (!btn || !map) return;
  
  isPegmanActive = !isPegmanActive;
  if (isPegmanActive) {
    btn.classList.add('active');
    if (map.getLayer('progress-core')) {
      map.setPaintProperty('progress-core', 'line-color', '#39FF14'); // Neon green glow
      map.setPaintProperty('progress-mid', 'line-color', '#00FF00');
    }
  } else {
    btn.classList.remove('active');
    if (map.getLayer('progress-core')) {
      map.setPaintProperty('progress-core', 'line-color', '#FF8C61');
      map.setPaintProperty('progress-mid', 'line-color', '#FF6B35');
    }
  }
}

function applyPegmanGlow(polyline) {
  // Unused in MapLibre implementation
}



