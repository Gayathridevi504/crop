/**
 * AgriPulse - Smart Crop Disease & Plant Health Monitor
 * Interactive Logic, Telemetry Simulator, AI Scanner & Chart.js Integration
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. THEME TOGGLING (DARK / LIGHT)
  // ==========================================
  const themeToggleBtn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const htmlRoot = document.documentElement;

  const savedTheme = localStorage.getItem('agripulse_theme') || 'light';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
      showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
    });
  }

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('agripulse_theme', theme);
    if (themeIcon) {
      if (theme === 'dark') {
        themeIcon.className = 'ri-sun-line';
      } else {
        themeIcon.className = 'ri-moon-line';
      }
    }
    // Update Chart.js themes if charts are initialized
    updateChartTheme(theme);
  }

  // ==========================================
  // 2. MOBILE NAVIGATION MENU
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isOpen = navMenu.classList.contains('active');
      mobileMenuBtn.innerHTML = isOpen ? '<i class="ri-close-line"></i>' : '<i class="ri-menu-4-line"></i>';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="ri-menu-4-line"></i>';
      });
    });
  }

  // Active navigation highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);
      if (matchingLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(l => l.classList.remove('active'));
          matchingLink.classList.add('active');
        }
      }
    });
  });

  // ==========================================
  // 3. SENSOR TELEMETRY SIMULATOR
  // ==========================================
  const valTemp = document.getElementById('valTemp');
  const valHumidity = document.getElementById('valHumidity');
  const valSoil = document.getElementById('valSoil');
  const valSun = document.getElementById('valSun');

  const fillTemp = document.getElementById('fillTemp');
  const fillHumidity = document.getElementById('fillHumidity');
  const fillSoil = document.getElementById('fillSoil');
  const fillSun = document.getElementById('fillSun');

  const tempStatus = document.getElementById('tempStatus');
  const humStatus = document.getElementById('humStatus');
  const soilStatus = document.getElementById('soilStatus');
  const sunStatus = document.getElementById('sunStatus');

  const overallScoreVal = document.getElementById('overallScoreVal');
  const healthProgressCircle = document.getElementById('healthProgressCircle');
  const overallHealthBadge = document.getElementById('overallHealthBadge');
  const riskLevelPill = document.getElementById('riskLevelPill');
  const healthSummaryText = document.getElementById('healthSummaryText');
  const lastSyncTime = document.getElementById('lastSyncTime');
  const refreshSensorsBtn = document.getElementById('refreshSensorsBtn');

  // Baseline sensor state
  let sensorData = {
    temp: 24.5,
    humidity: 65,
    soil: 44,
    sun: 7.8
  };

  function updateSensors(customData = null) {
    if (!customData) {
      // Simulate minor fluctuation
      sensorData.temp = +(22 + Math.random() * 5).toFixed(1);
      sensorData.humidity = Math.floor(55 + Math.random() * 22);
      sensorData.soil = Math.floor(38 + Math.random() * 20);
      sensorData.sun = +(5.0 + Math.random() * 4.5).toFixed(1);
    } else {
      sensorData = { ...customData };
    }

    // Render values
    if (valTemp) valTemp.textContent = sensorData.temp;
    if (valHumidity) valHumidity.textContent = sensorData.humidity;
    if (valSoil) valSoil.textContent = sensorData.soil;
    if (valSun) valSun.textContent = sensorData.sun;

    // Render Progress Bars
    if (fillTemp) fillTemp.style.width = `${Math.min(100, Math.max(10, (sensorData.temp / 40) * 100))}%`;
    if (fillHumidity) fillHumidity.style.width = `${sensorData.humidity}%`;
    if (fillSoil) fillSoil.style.width = `${sensorData.soil}%`;
    if (fillSun) fillSun.style.width = `${Math.min(100, (sensorData.sun / 11) * 100)}%`;

    // Status Badges
    if (tempStatus) {
      if (sensorData.temp >= 20 && sensorData.temp <= 28) {
        tempStatus.className = 'status-pill pill-success';
        tempStatus.textContent = 'Optimal';
      } else if (sensorData.temp > 28) {
        tempStatus.className = 'status-pill pill-warning';
        tempStatus.textContent = 'Warm';
      } else {
        tempStatus.className = 'status-pill pill-warning';
        tempStatus.textContent = 'Cool';
      }
    }

    if (humStatus) {
      if (sensorData.humidity >= 50 && sensorData.humidity <= 75) {
        humStatus.className = 'status-pill pill-success';
        humStatus.textContent = 'Ideal';
      } else if (sensorData.humidity > 75) {
        humStatus.className = 'status-pill pill-warning';
        humStatus.textContent = 'High';
      } else {
        humStatus.className = 'status-pill pill-danger';
        humStatus.textContent = 'Dry Air';
      }
    }

    if (soilStatus) {
      if (sensorData.soil >= 40 && sensorData.soil <= 60) {
        soilStatus.className = 'status-pill pill-success';
        soilStatus.textContent = 'Moist';
      } else if (sensorData.soil < 40) {
        soilStatus.className = 'status-pill pill-warning';
        soilStatus.textContent = 'Needs Water';
      } else {
        soilStatus.className = 'status-pill pill-warning';
        soilStatus.textContent = 'Saturated';
      }
    }

    if (sunStatus) {
      if (sensorData.sun < 6) {
        sunStatus.className = 'status-pill pill-success';
        sunStatus.textContent = 'Moderate';
      } else if (sensorData.sun <= 8.5) {
        sunStatus.className = 'status-pill pill-warning';
        sunStatus.textContent = 'High UV';
      } else {
        sunStatus.className = 'status-pill pill-danger';
        sunStatus.textContent = 'Extreme UV';
      }
    }

    // Compute Overall Health Score
    calculateHealthIndex();

    // Timestamp
    if (lastSyncTime) {
      const now = new Date();
      lastSyncTime.textContent = `Last updated: ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    }
  }

  function calculateHealthIndex() {
    let score = 100;
    // Temp penalty
    if (sensorData.temp < 18 || sensorData.temp > 30) score -= 10;
    // Humidity penalty
    if (sensorData.humidity < 45 || sensorData.humidity > 80) score -= 12;
    // Soil penalty
    if (sensorData.soil < 35) score -= 15;
    if (sensorData.soil > 68) score -= 8;

    score = Math.max(45, Math.min(98, score));

    if (overallScoreVal) overallScoreVal.textContent = score;

    // Circle SVG (Circumference = 2 * PI * 58 = ~364.4)
    const circumference = 364.4;
    const offset = circumference - (score / 100) * circumference;
    if (healthProgressCircle) {
      healthProgressCircle.style.strokeDashoffset = offset;
      if (score >= 85) {
        healthProgressCircle.style.stroke = '#10b981';
      } else if (score >= 70) {
        healthProgressCircle.style.stroke = '#f59e0b';
      } else {
        healthProgressCircle.style.stroke = '#ef4444';
      }
    }

    if (overallHealthBadge) {
      if (score >= 85) {
        overallHealthBadge.className = 'status-badge-lg status-optimal-badge';
        overallHealthBadge.innerHTML = '<i class="ri-heart-pulse-fill"></i> Plant Condition: Optimal & Healthy';
      } else if (score >= 70) {
        overallHealthBadge.className = 'status-badge-lg status-warning-badge';
        overallHealthBadge.innerHTML = '<i class="ri-alert-fill"></i> Plant Condition: Minor Stress Detected';
      } else {
        overallHealthBadge.className = 'status-badge-lg status-danger-badge';
        overallHealthBadge.innerHTML = '<i class="ri-alarm-warning-fill"></i> Plant Condition: Critical Attention';
      }
    }

    if (riskLevelPill) {
      const riskVal = Math.round(100 - score);
      if (riskVal < 20) {
        riskLevelPill.className = 'risk-pill low-risk';
        riskLevelPill.textContent = `Fungal Risk: Minimal (${riskVal}%)`;
      } else if (riskVal < 40) {
        riskLevelPill.className = 'risk-pill';
        riskLevelPill.style.background = 'rgba(245, 158, 11, 0.15)';
        riskLevelPill.style.color = '#d97706';
        riskLevelPill.textContent = `Fungal Risk: Moderate (${riskVal}%)`;
      } else {
        riskLevelPill.className = 'risk-pill';
        riskLevelPill.style.background = 'rgba(244, 63, 94, 0.15)';
        riskLevelPill.style.color = '#e11d48';
        riskLevelPill.textContent = `Fungal Risk: Elevated (${riskVal}%)`;
      }
    }
  }

  if (refreshSensorsBtn) {
    refreshSensorsBtn.addEventListener('click', () => {
      refreshSensorsBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Updating...';
      setTimeout(() => {
        updateSensors();
        refreshSensorsBtn.innerHTML = '<i class="ri-refresh-line"></i> Simulate Live Updates';
        showToast('Field sensor telemetry synced successfully!');
      }, 500);
    });
  }

  // Periodically fluctuate subtly to feel like live telemetry
  setInterval(() => {
    updateSensors();
  }, 12000);

  // Initialize sensors
  updateSensors(sensorData);

  // ==========================================
  // 4. AI LEAF DISEASE SCANNER & PRESETS
  // ==========================================
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const browseFileBtn = document.getElementById('browseFileBtn');
  const dropZoneContent = document.getElementById('dropZoneContent');
  const previewContainer = document.getElementById('previewContainer');
  const previewImage = document.getElementById('previewImage');
  const removeImgBtn = document.getElementById('removeImgBtn');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const analyzeBtnIcon = document.getElementById('analyzeBtnIcon');
  const analyzeBtnText = document.getElementById('analyzeBtnText');
  const sampleChips = document.querySelectorAll('.chip[data-sample]');
  const previewBadge = document.getElementById('previewBadge');

  // Result Elements
  const resultPlaceholder = document.getElementById('resultPlaceholder');
  const resultContent = document.getElementById('resultContent');
  const resCropName = document.getElementById('resCropName');
  const resDiseaseName = document.getElementById('resDiseaseName');
  const resPathogen = document.getElementById('resPathogen');
  const resSeverityBadge = document.getElementById('resSeverityBadge');
  const resConfidenceVal = document.getElementById('resConfidenceVal');
  const resConfidenceBar = document.getElementById('resConfidenceBar');
  const resSymptoms = document.getElementById('resSymptoms');
  const resOrganicList = document.getElementById('resOrganicList');
  const resChemicalList = document.getElementById('resChemicalList');
  const saveLogBtn = document.getElementById('saveLogBtn');
  const printReportBtn = document.getElementById('printReportBtn');

  // Demo Presets Database with high-quality crop leaves
  const leafSampleDatabase = {
    'tomato-blight': {
      crop: 'Tomato (Solanum lycopersicum)',
      disease: 'Early Blight (Target Spot)',
      pathogen: 'Alternaria solani',
      severity: 'Moderate',
      severityClass: 'sev-moderate',
      confidence: 96.8,
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d69106a49?auto=format&fit=crop&w=700&q=80',
      symptoms: 'Concentric dark rings (target-like brown lesions) with surrounding yellow chlorotic halos on lower foliage. Early stem spots detected.',
      organic: [
        'Prune lower infected foliage and dispose safely off-site.',
        'Apply copper-based bio-fungicide or Bacillus subtilis liquid spray.',
        'Avoid overhead sprinkler watering; keep leaf canopy dry.'
      ],
      chemical: [
        'Apply Chlorothalonil or Mancozeb preventative spray at 7-10 day intervals.',
        'Rotate fungicide classes (FRAC group 7 & 11) to mitigate pathogen resistance.'
      ]
    },
    'corn-rust': {
      crop: 'Sweet Corn (Zea mays)',
      disease: 'Common Leaf Rust',
      pathogen: 'Puccinia sorghi',
      severity: 'Mild',
      severityClass: 'sev-mild',
      confidence: 94.2,
      image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=700&q=80',
      symptoms: 'Small, elongated powdery cinnamon-brown pustules (uredinia) scattered over both upper and lower leaf surfaces.',
      organic: [
        'Introduce resistant hybrid cultivars in next crop rotation.',
        'Apply neem oil or potassium bicarbonate upon first sign of pustules.',
        'Ensure wide crop row spacing to maximize sunlight penetration.'
      ],
      chemical: [
        'Apply Pyraclostrobin or Azoxystrobin (strobilurin group) if lesions appear before tasseling.',
        'Maintain spray thresholds when weather is humid and temperatures are 16-25°C.'
      ]
    },
    'apple-scab': {
      crop: 'Apple (Malus domestica)',
      disease: 'Apple Scab Foliar Lesions',
      pathogen: 'Venturia inaequalis',
      severity: 'Mild',
      severityClass: 'sev-mild',
      confidence: 92.5,
      image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=700&q=80',
      symptoms: 'Olive-green to velvety dark brown lesions with indistinct margins on leaf surface; slight puckering and yellowing of margins.',
      organic: [
        'Rake and compost or burn fallen leaves in autumn to eradicate overwintering ascospores.',
        'Apply sulfur-based bio-spray during early bud-break and petal-fall.',
        'Prune dense canopy branches for improved airflow.'
      ],
      chemical: [
        'Apply Captan or Myclobutanil fungicidal sprays on a preventative 10-day schedule.',
        'Ensure full leaf surface coverage before prolonged rainfall periods.'
      ]
    },
    'potato-late-blight': {
      crop: 'Potato (Solanum tuberosum)',
      disease: 'Late Blight (Irish Potato Blight)',
      pathogen: 'Phytophthora infestans',
      severity: 'Severe',
      severityClass: 'sev-severe',
      confidence: 98.4,
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=80',
      symptoms: 'Rapidly expanding water-soaked dark lesions on foliage and stems with delicate white fungal mold on leaf undersides under high humidity.',
      organic: [
        'Immediately destroy heavily blighted plants to prevent field-wide airborne spore dispersion.',
        'Keep soil hilled around potato hills to prevent spores washing into tubers.',
        'Ensure certified disease-free seed tubers are used exclusively.'
      ],
      chemical: [
        'Urgent curative application: Fluopicolide, Cymoxanil, or Dimethomorph systemic fungicides.',
        'Destroy volunteer potato plants and nightshade family weeds around field perimeter.'
      ]
    },
    'healthy-bell-pepper': {
      crop: 'Bell Pepper (Capsicum annuum)',
      disease: 'Healthy Specimen (No Foliar Pathology)',
      pathogen: 'None Detected - Healthy Chlorophyll Density',
      severity: 'Healthy',
      severityClass: 'sev-healthy',
      confidence: 99.1,
      image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=700&q=80',
      symptoms: 'Vibrant deep-green leaf tissue with optimal turgidity. Uniform vein structure with zero necrotic spotting, mildew, or chlorosis.',
      organic: [
        'Continue regular organic compost tea foliar feeding.',
        'Maintain consistent drip moisture at 45% soil capacity.',
        'Apply preventative beneficial microbial inoculants to root zone.'
      ],
      chemical: [
        'No chemical interventions or fungicides required.',
        'Continue standard micronutrient (Magnesium & Zinc) fertilization routine.'
      ]
    }
  };

  let currentActiveSampleKey = 'tomato-blight';
  let activeDiagnosisData = leafSampleDatabase['tomato-blight'];

  // Preset Sample selection
  sampleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const sampleKey = chip.getAttribute('data-sample');
      if (leafSampleDatabase[sampleKey]) {
        sampleChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentActiveSampleKey = sampleKey;
        loadSampleImage(sampleKey);
      }
    });
  });

  function loadSampleImage(sampleKey) {
    const data = leafSampleDatabase[sampleKey];
    activeDiagnosisData = data;
    previewImage.src = data.image;
    previewBadge.textContent = `${data.crop.split(' ')[0]} Sample`;
    dropZoneContent.style.display = 'none';
    previewContainer.style.display = 'block';
  }

  // Load initial demo image
  loadSampleImage('tomato-blight');

  // File Upload Handlers
  if (browseFileBtn) {
    browseFileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.click();
    });
  }

  if (dropZone) {
    dropZone.addEventListener('click', () => {
      if (previewContainer.style.display !== 'block') {
        fileInput.click();
      }
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('drag-over');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('drag-over');
      }, false);
    });

    dropZone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files.length > 0) {
        handleCustomFile(files[0]);
      }
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleCustomFile(e.target.files[0]);
      }
    });
  }

  function handleCustomFile(file) {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file (JPG, PNG, WEBP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      previewImage.src = event.target.result;
      dropZoneContent.style.display = 'none';
      previewContainer.style.display = 'block';
      previewBadge.textContent = 'Custom Upload';
      sampleChips.forEach(c => c.classList.remove('active'));

      // Create a simulated diagnosis for custom file
      activeDiagnosisData = {
        crop: 'Custom Field Specimen (Field Log #90)',
        disease: 'Bacterial Leaf Spot',
        pathogen: 'Xanthomonas campestris',
        severity: 'Moderate',
        severityClass: 'sev-moderate',
        confidence: 93.7,
        image: event.target.result,
        symptoms: 'Small angular brown lesions surrounded by yellow halos; water-soaked appearance on abaxial leaf surface.',
        organic: [
          'Remove infected leaves immediately to stop bacterial propagation.',
          'Avoid overhead sprinkler irrigation and working with wet plants.',
          'Apply organic copper octanoate spray as a protective barrier.'
        ],
        chemical: [
          'Apply Streptomycin sulfate or fixed copper bactericide formulation.',
          'Sterilize field harvesting shears between consecutive plants.'
        ]
      };
      showToast('Leaf photo uploaded successfully!');
    };
    reader.readAsDataURL(file);
  }

  if (removeImgBtn) {
    removeImgBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      previewImage.src = '';
      previewContainer.style.display = 'none';
      dropZoneContent.style.display = 'flex';
      fileInput.value = '';
      resultContent.style.display = 'none';
      resultPlaceholder.style.display = 'flex';
    });
  }

  // Analyze Button Action
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
      if (!previewImage.src || previewContainer.style.display === 'none') {
        showToast('Please choose or upload a leaf photo first.');
        return;
      }

      // Start Scanner Animation
      dropZone.classList.add('scanning');
      analyzeBtn.disabled = true;
      analyzeBtnIcon.className = 'ri-loader-4-line ri-spin';
      analyzeBtnText.textContent = 'Analyzing Leaf Biomass & Pathology...';

      setTimeout(() => {
        dropZone.classList.remove('scanning');
        analyzeBtn.disabled = false;
        analyzeBtnIcon.className = 'ri-scan-2-line';
        analyzeBtnText.textContent = 'Run AI Disease Analysis';

        renderDiagnosisResult(activeDiagnosisData);
        showToast('Pathology diagnosis complete!');
      }, 1300);
    });
  }

  function renderDiagnosisResult(data) {
    if (!data) return;

    if (resultPlaceholder) resultPlaceholder.style.display = 'none';
    if (resultContent) resultContent.style.display = 'flex';

    if (resCropName) resCropName.textContent = data.crop;
    if (resDiseaseName) resDiseaseName.textContent = data.disease;
    if (resPathogen) resPathogen.innerHTML = `Pathogen: <em>${data.pathogen}</em>`;
    
    if (resSeverityBadge) {
      resSeverityBadge.className = `severity-badge ${data.severityClass}`;
      resSeverityBadge.innerHTML = `<i class="ri-checkbox-circle-fill"></i> ${data.severity} Severity`;
    }

    if (resConfidenceVal) resConfidenceVal.textContent = `${data.confidence}%`;
    if (resConfidenceBar) resConfidenceBar.style.width = `${data.confidence}%`;

    if (resSymptoms) resSymptoms.textContent = data.symptoms;

    if (resOrganicList) {
      resOrganicList.innerHTML = data.organic.map(item => `<li>${item}</li>`).join('');
    }

    if (resChemicalList) {
      resChemicalList.innerHTML = data.chemical.map(item => `<li>${item}</li>`).join('');
    }
  }

  // Save to history log button
  if (saveLogBtn) {
    saveLogBtn.addEventListener('click', () => {
      const now = new Date();
      const timeString = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      
      const newEntry = {
        time: timeString,
        plot: 'Zone 4 - Plot B',
        crop: activeDiagnosisData.crop.split(' ')[0],
        disease: activeDiagnosisData.disease,
        severity: activeDiagnosisData.severity,
        confidence: `${activeDiagnosisData.confidence}%`,
        status: activeDiagnosisData.severity === 'Healthy' ? 'Resolved' : 'Action Required',
        raw: activeDiagnosisData
      };

      historyLogs.unshift(newEntry);
      renderHistoryTable();
      showToast('Diagnosis saved to Diagnostic History Log!');

      // Scroll smoothly to table
      const historySec = document.getElementById('history-section');
      if (historySec) {
        historySec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (printReportBtn) {
    printReportBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // ==========================================
  // 5. CHART.JS ANALYTICS & TRENDS
  // ==========================================
  let climateChartInstance = null;
  let healthChartInstance = null;

  const chartPills = document.querySelectorAll('.chart-pill[data-range]');

  // Chart datasets for 24h, 7d, 30d
  const chartDatasets = {
    '24h': {
      labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
      temp: [19.2, 18.5, 19.8, 23.4, 27.8, 28.2, 24.1, 21.0],
      soil: [52, 51, 50, 48, 45, 43, 44, 46],
      health: [94, 94, 93, 91, 89, 88, 91, 93],
      risk: [8, 9, 12, 16, 22, 24, 18, 11]
    },
    '7d': {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      temp: [23.1, 24.5, 25.8, 22.4, 26.2, 27.0, 24.8],
      soil: [46, 44, 58, 54, 49, 43, 45],
      health: [92, 90, 95, 94, 91, 88, 93],
      risk: [14, 18, 10, 12, 19, 25, 14]
    },
    '30d': {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      temp: [22.8, 24.1, 25.4, 23.9],
      soil: [48, 45, 52, 47],
      health: [90, 92, 94, 92],
      risk: [18, 15, 11, 14]
    }
  };

  let activeRange = '24h';

  function initCharts() {
    const isDark = htmlRoot.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    // Chart 1: Climate Dual Axis Chart
    const ctxClimate = document.getElementById('climateChart');
    if (ctxClimate) {
      if (climateChartInstance) climateChartInstance.destroy();

      climateChartInstance = new Chart(ctxClimate, {
        type: 'line',
        data: {
          labels: chartDatasets[activeRange].labels,
          datasets: [
            {
              label: 'Ambient Temp (°C)',
              data: chartDatasets[activeRange].temp,
              borderColor: '#f59e0b',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              borderWidth: 2.5,
              tension: 0.35,
              fill: true,
              yAxisID: 'yTemp',
              pointRadius: 4,
              pointBackgroundColor: '#f59e0b'
            },
            {
              label: 'Soil Moisture (%)',
              data: chartDatasets[activeRange].soil,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              borderWidth: 2.5,
              tension: 0.35,
              fill: true,
              yAxisID: 'ySoil',
              pointRadius: 4,
              pointBackgroundColor: '#10b981'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              titleColor: isDark ? '#f8fafc' : '#0f172a',
              bodyColor: isDark ? '#cbd5e1' : '#475569',
              borderColor: isDark ? '#334155' : '#e2e8f0',
              borderWidth: 1,
              padding: 10,
              boxPadding: 4
            }
          },
          scales: {
            x: {
              grid: { color: gridColor },
              ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11 } }
            },
            yTemp: {
              type: 'linear',
              position: 'left',
              grid: { color: gridColor },
              ticks: { color: '#f59e0b', callback: v => `${v}°C` }
            },
            ySoil: {
              type: 'linear',
              position: 'right',
              grid: { drawOnChartArea: false },
              ticks: { color: '#10b981', callback: v => `${v}%` }
            }
          }
        }
      });
    }

    // Chart 2: Vitality & Risk Progression Chart
    const ctxHealth = document.getElementById('healthChart');
    if (ctxHealth) {
      if (healthChartInstance) healthChartInstance.destroy();

      healthChartInstance = new Chart(ctxHealth, {
        type: 'line',
        data: {
          labels: chartDatasets[activeRange].labels,
          datasets: [
            {
              label: 'Crop Health Index',
              data: chartDatasets[activeRange].health,
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.12)',
              borderWidth: 2.5,
              tension: 0.35,
              fill: true,
              pointRadius: 4,
              pointBackgroundColor: '#3b82f6'
            },
            {
              label: 'Fungal Risk (%)',
              data: chartDatasets[activeRange].risk,
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              borderWidth: 2,
              borderDash: [5, 5],
              tension: 0.35,
              fill: false,
              pointRadius: 3,
              pointBackgroundColor: '#ef4444'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              titleColor: isDark ? '#f8fafc' : '#0f172a',
              bodyColor: isDark ? '#cbd5e1' : '#475569',
              borderColor: isDark ? '#334155' : '#e2e8f0',
              borderWidth: 1,
              padding: 10,
              boxPadding: 4
            }
          },
          scales: {
            x: {
              grid: { color: gridColor },
              ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11 } }
            },
            y: {
              min: 0,
              max: 100,
              grid: { color: gridColor },
              ticks: { color: textColor, callback: v => `${v}` }
            }
          }
        }
      });
    }
  }

  function updateChartTheme(theme) {
    if (climateChartInstance && healthChartInstance) {
      initCharts();
    }
  }

  // Filter Pills (24h, 7d, 30d)
  chartPills.forEach(pill => {
    pill.addEventListener('click', () => {
      chartPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeRange = pill.getAttribute('data-range');
      initCharts();
    });
  });

  // Initialize charts on load
  initCharts();

  // ==========================================
  // 6. HEALTH HISTORY TABLE & AUDIT LOG
  // ==========================================
  const initialDemoHistory = [
    {
      time: 'Today 14:20',
      plot: 'Zone 2 - Plot A',
      crop: 'Tomato',
      disease: 'Early Blight',
      severity: 'Moderate',
      confidence: '96.8%',
      status: 'Action Required',
      raw: leafSampleDatabase['tomato-blight']
    },
    {
      time: 'Today 11:45',
      plot: 'Zone 1 - Plot D',
      crop: 'Bell Pepper',
      disease: 'Healthy Leaf',
      severity: 'Healthy',
      confidence: '99.1%',
      status: 'Optimal',
      raw: leafSampleDatabase['healthy-bell-pepper']
    },
    {
      time: 'Yesterday 17:10',
      plot: 'Zone 3 - Plot C',
      crop: 'Corn',
      disease: 'Common Rust',
      severity: 'Mild',
      confidence: '94.2%',
      status: 'Sprayed',
      raw: leafSampleDatabase['corn-rust']
    },
    {
      time: 'Yesterday 09:30',
      plot: 'Zone 5 - Plot F',
      crop: 'Apple',
      disease: 'Apple Scab',
      severity: 'Mild',
      confidence: '92.5%',
      status: 'Monitored',
      raw: leafSampleDatabase['apple-scab']
    },
    {
      time: '14 Aug 16:15',
      plot: 'Zone 4 - Plot B',
      crop: 'Potato',
      disease: 'Late Blight',
      severity: 'Severe',
      confidence: '98.4%',
      status: 'Quarantined',
      raw: leafSampleDatabase['potato-late-blight']
    }
  ];

  let historyLogs = [...initialDemoHistory];

  const historyTableBody = document.getElementById('historyTableBody');
  const tableSearchInput = document.getElementById('tableSearchInput');
  const statusFilterSelect = document.getElementById('statusFilterSelect');
  const tableEmptyState = document.getElementById('tableEmptyState');
  const tableCountText = document.getElementById('tableCountText');
  const clearDemoHistoryBtn = document.getElementById('clearDemoHistoryBtn');
  const exportHistoryBtn = document.getElementById('exportHistoryBtn');

  function renderHistoryTable() {
    if (!historyTableBody) return;

    const searchTerm = (tableSearchInput?.value || '').toLowerCase().trim();
    const filterStatus = statusFilterSelect?.value || 'all';

    const filtered = historyLogs.filter(item => {
      const matchesSearch = 
        item.crop.toLowerCase().includes(searchTerm) ||
        item.disease.toLowerCase().includes(searchTerm) ||
        item.plot.toLowerCase().includes(searchTerm) ||
        item.status.toLowerCase().includes(searchTerm);

      const matchesStatus = 
        filterStatus === 'all' || 
        item.severity.toLowerCase() === filterStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    historyTableBody.innerHTML = '';

    if (filtered.length === 0) {
      if (tableEmptyState) tableEmptyState.style.display = 'block';
    } else {
      if (tableEmptyState) tableEmptyState.style.display = 'none';

      filtered.forEach((log, index) => {
        const tr = document.createElement('tr');
        
        let sevClass = 'sev-mild';
        if (log.severity === 'Healthy') sevClass = 'sev-healthy';
        if (log.severity === 'Moderate') sevClass = 'sev-moderate';
        if (log.severity === 'Severe') sevClass = 'sev-severe';

        tr.innerHTML = `
          <td class="time-cell"><i class="ri-time-line"></i> ${log.time}</td>
          <td class="crop-cell">${log.crop} &bull; <small style="color:var(--text-muted);">${log.plot}</small></td>
          <td><strong>${log.disease}</strong></td>
          <td><span class="severity-badge ${sevClass}"><i class="ri-record-circle-line"></i> ${log.severity}</span></td>
          <td class="conf-pill" style="color:var(--primary);">${log.confidence}</td>
          <td><span class="status-badge-sm" style="background:var(--bg-input);">${log.status}</span></td>
          <td>
            <button class="btn-outline-sm view-log-btn" data-index="${index}">
              <i class="ri-eye-line"></i> View
            </button>
          </td>
        `;
        historyTableBody.appendChild(tr);
      });

      // Bind View Buttons
      document.querySelectorAll('.view-log-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index'), 10);
          openDetailModal(filtered[idx]);
        });
      });
    }

    if (tableCountText) {
      tableCountText.textContent = `Showing ${filtered.length} of ${historyLogs.length} logs`;
    }
  }

  if (tableSearchInput) tableSearchInput.addEventListener('input', renderHistoryTable);
  if (statusFilterSelect) statusFilterSelect.addEventListener('change', renderHistoryTable);

  if (clearDemoHistoryBtn) {
    clearDemoHistoryBtn.addEventListener('click', () => {
      historyLogs = [...initialDemoHistory];
      if (tableSearchInput) tableSearchInput.value = '';
      if (statusFilterSelect) statusFilterSelect.value = 'all';
      renderHistoryTable();
      showToast('Demo log history reset to default values.');
    });
  }

  // Export CSV
  if (exportHistoryBtn) {
    exportHistoryBtn.addEventListener('click', () => {
      if (historyLogs.length === 0) {
        showToast('No logs available to export.');
        return;
      }
      let csvContent = "data:text/csv;charset=utf-8,Timestamp,Plot,Crop,Condition,Severity,Confidence,Status\n";
      historyLogs.forEach(e => {
        csvContent += `"${e.time}","${e.plot}","${e.crop}","${e.disease}","${e.severity}","${e.confidence}","${e.status}"\n`;
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `AgriPulse_Crop_Audit_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Diagnostic CSV report downloaded!');
    });
  }

  renderHistoryTable();

  // ==========================================
  // 7. INSPECTION MODAL DETAIL POPUP
  // ==========================================
  const detailModal = document.getElementById('detailModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalOkBtn = document.getElementById('modalOkBtn');

  function openDetailModal(item) {
    if (!detailModal || !item) return;

    if (modalTitle) modalTitle.textContent = `${item.crop} - ${item.disease}`;
    
    if (modalBody) {
      modalBody.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;">
          <span style="font-size:0.85rem; color:var(--text-muted);"><i class="ri-calendar-line"></i> ${item.time} &bull; ${item.plot}</span>
          <span class="severity-badge ${item.severity === 'Healthy' ? 'sev-healthy' : item.severity === 'Severe' ? 'sev-severe' : 'sev-moderate'}">${item.severity}</span>
        </div>
        <p style="margin-bottom:1rem; font-size:0.95rem;"><strong>Symptoms:</strong> ${item.raw?.symptoms || 'Symptoms logged and verified via optical scanning.'}</p>
        <div style="background:var(--bg-input); padding:1rem; border-radius:var(--radius-sm); margin-bottom:1rem;">
          <h5 style="margin-bottom:0.4rem; color:var(--primary);"><i class="ri-shield-check-line"></i> Primary Remedy Recommended:</h5>
          <p style="font-size:0.875rem;">${item.raw?.organic?.[0] || 'Maintain preventative foliar balance and scheduled monitoring.'}</p>
        </div>
        <div style="font-size:0.825rem; color:var(--text-muted);">
          Neural Model Confidence: <strong>${item.confidence}</strong> &bull; Pathology Status: <strong>${item.status}</strong>
        </div>
      `;
    }

    detailModal.classList.add('active');
    detailModal.setAttribute('aria-hidden', 'false');
  }

  function closeDetailModal() {
    if (detailModal) {
      detailModal.classList.remove('active');
      detailModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeDetailModal);
  if (modalOkBtn) modalOkBtn.addEventListener('click', closeDetailModal);
  if (detailModal) {
    detailModal.addEventListener('click', (e) => {
      if (e.target === detailModal) closeDetailModal();
    });
  }

  // ==========================================
  // 8. TOAST NOTIFICATION UTILITY
  // ==========================================
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="ri-checkbox-circle-fill"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

});
