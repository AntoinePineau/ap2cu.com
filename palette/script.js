Object.prototype.$=function(s){let e=this instanceof Element?this:document;return Array.from(e.querySelectorAll(s))}
var luminanceThreshold = 0.3;
var wcag = 'AAA';
function getColorComposite(rgb, index) {
  if(rgb.charAt(0)=='#') rgb = rgb.substring(1);
  var r = parseInt(rgb.substring(index, index + 2), 16) / 255;
  return r <= 0.03928 ? r / 12.92 : ((r + 0.055) / 1.055)**2.4;
}
function getRelativeLuminance(rgb) {
  if(rgb.charAt(0)=='#') rgb = rgb.substring(1);
  var R = getColorComposite(rgb, 0);
  var G = getColorComposite(rgb, 2);
  var B = getColorComposite(rgb, 4);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}
function getContrastRatio(rgb1, rgb2) {
  var L1 = getRelativeLuminance(rgb1);
  var L2 = getRelativeLuminance(rgb2);
  var L = (L1 + 0.05) / (L2 + 0.05);
  if(L<1) L=1/L;
  return L;
}
const Accessibility = {
  VERY_POOR : "Very Poor", // < 3
  POOR : "Poor", // >= 3
  GOOD : "Good", // >= 4.5
  VERY_GOOD : "Very Good", // >= 7
  SUPER : "Super" // >= 14
}
function getAccessibility(contrast) {
  if(contrast >= 12) return Accessibility.SUPER;
  if(contrast >= 7) return Accessibility.VERY_GOOD;
  if(contrast >= 4.5) return Accessibility.GOOD;
  if(contrast >= 3) return Accessibility.POOR;
  return Accessibility.VERY_POOR;
}
function getRating(contrast) {
  if(contrast >= 12) return 5;
  if(contrast >= 7) return 4;
  if(contrast >= 4.5) return 3;
  if(contrast >= 3) return 2;
  return 1;
}
function randomIntFromInterval(min, max) { // min and max included 
  var n = Math.floor(Math.random() * (max - min + 1) + min);
  n = n.toString(16);
  if(n.length==1) n = '0'+n;
  return n;
}
function generateRandomColor() {
  var r = randomIntFromInterval(0, 255);
  var g = randomIntFromInterval(0, 255);
  var b = randomIntFromInterval(0, 255);
  return '#'+r+g+b;
}

const colorSchemes = {
  technology: { hues: [200, 240, 280], saturation: [60, 80], lightness: [20, 80] },
  healthcare: { hues: [120, 180, 200], saturation: [40, 70], lightness: [30, 85] },
  finance: { hues: [210, 240, 30], saturation: [30, 60], lightness: [25, 75] },
  education: { hues: [45, 200, 280], saturation: [50, 80], lightness: [35, 80] },
  food: { hues: [15, 45, 120], saturation: [60, 90], lightness: [40, 85] },
  fashion: { hues: [300, 350, 60], saturation: [40, 85], lightness: [20, 90] },
  'real-estate': { hues: [25, 60, 200], saturation: [30, 70], lightness: [30, 80] },
  creative: { hues: [280, 320, 60], saturation: [70, 95], lightness: [25, 85] },
  travel: { hues: [180, 200, 30], saturation: [50, 80], lightness: [35, 85] },
  sports: { hues: [0, 120, 240], saturation: [70, 90], lightness: [30, 80] },
  beauty: { hues: [300, 350, 30], saturation: [40, 80], lightness: [40, 90] },
  automotive: { hues: [0, 210, 240], saturation: [40, 70], lightness: [20, 70] },
  concierge: { hues: [210, 280, 320], saturation: [40, 70], lightness: [30, 85] },
  consulting: { hues: [200, 240, 300], saturation: [35, 65], lightness: [25, 75] },
  hospitality: { hues: [30, 60, 180], saturation: [50, 80], lightness: [35, 85] },
  legal: { hues: [210, 240, 270], saturation: [25, 55], lightness: [20, 70] },
  retail: { hues: [0, 30, 300], saturation: [60, 85], lightness: [30, 80] },
  construction: { hues: [30, 60, 120], saturation: [50, 75], lightness: [25, 75] },
  entertainment: { hues: [280, 320, 0], saturation: [70, 95], lightness: [25, 85] },
  nonprofit: { hues: [120, 180, 240], saturation: [45, 75], lightness: [30, 80] }
};

const styleModifiers = {
  modern: { saturation: -10, lightness: 5 },
  corporate: { saturation: -20, lightness: -10 },
  creative: { saturation: 15, lightness: 10 },
  playful: { saturation: 20, lightness: 15 },
  elegant: { saturation: -15, lightness: -5 },
  bold: { saturation: 25, lightness: -15 },
  natural: { saturation: -5, lightness: 10 },
  vintage: { saturation: -10, lightness: -20 }
};

function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return [h * 360, s * 100, l * 100];
}

function isGoodContrast(color1, color2) {
  const ratio = getContrastRatio(color1, color2);
  return ratio >= (wcag === 'AAA' ? 7 : 4.5);
}

function countGoodCombinations(colors) {
  let count = 0;
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      if (isGoodContrast(colors[i], colors[j])) {
        count++;
      }
    }
  }
  return count;
}

function findComplementaryColor(baseColor, scheme, modifier, existingColors = []) {
  const minRatio = wcag === 'AAA' ? 7 : 4.5;
  
  for (let attempt = 0; attempt < 200; attempt++) {
    let hue, saturation, lightness;
    
    if (attempt < 50) {
      const baseLum = getRelativeLuminance(baseColor);
      if (baseLum > 0.5) {
        lightness = Math.random() * 30 + 10;
      } else {
        lightness = Math.random() * 30 + 60;
      }
      hue = scheme.hues[Math.floor(Math.random() * scheme.hues.length)];
      saturation = Math.max(40, Math.min(90, 
        scheme.saturation[0] + Math.random() * (scheme.saturation[1] - scheme.saturation[0]) + modifier.saturation
      ));
    } else {
      hue = Math.random() * 360;
      saturation = Math.random() * 60 + 30;
      lightness = Math.random() * 70 + 15;
    }
    
    const candidate = hslToHex(hue, saturation, lightness);
    
    if (existingColors.includes(candidate)) continue;
    
    if (getContrastRatio(baseColor, candidate) >= minRatio) {
      return candidate;
    }
  }
  
  return generateRandomColor();
}

function generateOptimalColors(count, sector, style, lockedColors = []) {
  console.log('Generating with locked colors:', lockedColors);
  
  const scheme = colorSchemes[sector] || colorSchemes.technology;
  const modifier = styleModifiers[style] || { saturation: 0, lightness: 0 };
  
  let bestColors = new Array(count);
  let bestScore = -1;
  
  lockedColors.forEach(locked => {
    if (locked.index < count) {
      bestColors[locked.index] = locked.color;
    }
  });
  
  for (let attempt = 0; attempt < 30; attempt++) {
    const colors = new Array(count);
    
    lockedColors.forEach(locked => {
      if (locked.index < count) {
        colors[locked.index] = locked.color;
      }
    });
    
    for (let i = 0; i < count; i++) {
      if (colors[i]) continue;
      
      let bestNewColor = null;
      let bestNewScore = -1;
      
      const lockedColorsInPalette = colors.filter(c => c);
      
      if (lockedColorsInPalette.length > 0) {
        for (const lockedColor of lockedColorsInPalette) {
          const candidate = findComplementaryColor(lockedColor, scheme, modifier, colors.filter(c => c));
          
          const testColors = [...colors];
          testColors[i] = candidate;
          const score = countGoodCombinations(testColors.filter(c => c));
          
          if (score > bestNewScore) {
            bestNewScore = score;
            bestNewColor = candidate;
          }
        }
      }
      
      if (!bestNewColor) {
        for (let colorAttempt = 0; colorAttempt < 150; colorAttempt++) {
          const hue = scheme.hues[Math.floor(Math.random() * scheme.hues.length)] + 
                     (Math.random() - 0.5) * 90;
          
          const saturation = Math.max(30, Math.min(95, 
            scheme.saturation[0] + Math.random() * (scheme.saturation[1] - scheme.saturation[0]) + modifier.saturation
          ));
          
          const lightness = Math.max(10, Math.min(90, 
            scheme.lightness[0] + Math.random() * (scheme.lightness[1] - scheme.lightness[0]) + modifier.lightness
          ));
          
          const candidate = hslToHex((hue + 360) % 360, saturation, lightness);
          
          if (colors.includes(candidate)) continue;
          
          const testColors = [...colors];
          testColors[i] = candidate;
          const score = countGoodCombinations(testColors.filter(c => c));
          
          if (score > bestNewScore) {
            bestNewScore = score;
            bestNewColor = candidate;
          }
        }
      }
      
      colors[i] = bestNewColor || generateRandomColor();
    }
    
    const totalScore = countGoodCombinations(colors);
    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestColors = [...colors];
    }
  }
  
  console.log('Generated colors:', bestColors);
  console.log('Score (good combinations):', bestScore);
  return bestColors;
}
function onColorChanged(event) {
  var item = event.srcElement;
  var label = document.querySelector('label[for='+item.getAttribute('id')+']');
  var color = item.value;
  label.innerHTML = color;
  label.setAttribute('class', 'color '+(getRelativeLuminance(color)>luminanceThreshold ? 'dark' : 'white'));
  updateHash();
}
function onButtonClicked(event) {
  var item = event.srcElement;
  var color = generateRandomColor();
  document.getElementById(item.getAttribute('data-input')).value = color;
  var label = document.querySelector('label[for='+item.getAttribute('data-input')+']');
  label.innerHTML = color;
  label.setAttribute('class', 'color '+(getRelativeLuminance(color)>luminanceThreshold ? 'dark' : 'white'));
  updateHash();
}
function updateHash() {
  const colors = [];
  const locks = [];
  
  document.querySelectorAll('input.color').forEach((element, index) => {
    colors.push(element.value.substring(1));
    const lockButton = document.querySelector(`[data-color-id="color${index}"]`);
    locks.push(lockButton && lockButton.classList.contains('locked') ? '1' : '0');
  });
  
  const sector = document.getElementById('sector').value || '';
  const style = document.getElementById('style').value || '';
  const wcagValue = document.querySelector('input[name="crit"]:checked').value;
  
  let hash = colors.join('-');
  hash += '~' + locks.join('');
  if (sector) hash += '~' + sector;
  else hash += '~';
  if (style) hash += '~' + style;
  else hash += '~';
  if (wcagValue !== 'AAA') hash += '~' + wcagValue;
  
  window.location.hash = hash;
  console.log('Hash updated:', window.location.hash);
  updateContrastChecker();
}
function toggleLock(event) {
  const button = event.target;
  const isLocked = button.classList.contains('locked');
  
  if (isLocked) {
    button.classList.remove('locked');
    button.classList.add('unlocked');
    button.innerHTML = '🔓';
    button.title = 'Click to lock this color';
  } else {
    button.classList.remove('unlocked');
    button.classList.add('locked');
    button.innerHTML = '🔒';
    button.title = 'Color is locked - click to unlock';
  }
  updateHash();
}

function addNewColorInput(color, nb) {
  console.log('Adding color input:', color, 'at position', nb);
  var div = document.createElement('div');
  div.setAttribute('class', 'color');
  div.setAttribute('data-input', 'color'+nb);
  
  var label = document.createElement('label');
  label.setAttribute('for', 'color'+nb);
  label.innerHTML = color.toUpperCase();
  label.setAttribute('class', 'color '+(getRelativeLuminance(color)>luminanceThreshold ? 'dark' : 'white'));
  
  var input = document.createElement('input');
  input.setAttribute('type', 'color');
  input.setAttribute('name', 'color'+nb);
  input.setAttribute('id', 'color'+nb);
  input.setAttribute('class', 'color');
  input.value = color.toUpperCase();
  input.addEventListener('input', onColorChanged);
  
  var controlsDiv = document.createElement('div');
  controlsDiv.setAttribute('class', 'color-controls');
  
  var randomButton = document.createElement('button');
  randomButton.setAttribute('data-input', 'color'+nb);
  randomButton.setAttribute('class', 'color');
  randomButton.innerHTML = 'Random';
  randomButton.addEventListener('click', onButtonClicked);
  
  var lockButton = document.createElement('button');
  lockButton.setAttribute('class', 'lock-button unlocked');
  lockButton.setAttribute('data-color-id', 'color'+nb);
  lockButton.innerHTML = '🔓';
  lockButton.title = 'Click to lock this color';
  lockButton.addEventListener('click', toggleLock);
  
  controlsDiv.append(randomButton);
  controlsDiv.append(lockButton);
  
  div.append(label);
  div.append(input);
  div.append(controlsDiv);
  document.querySelector('#colors').append(div);
}
function changeInputValue() {
  try {
    this.attributes.class.value = 'n'+this.value;
  }
  catch(e) {
    document.getElementById('nb').classList.add('n'+document.getElementById('nb').value)
  }
}
function onNumberColorsChanged(){
  var nb = document.querySelectorAll('#colors>div.color').length;
  var newNb = this.value || document.getElementById('nb').value;
  while(nb>newNb) {
    document.querySelector('#colors').removeChild(document.querySelectorAll('#colors>div.color')[nb-1]);
    nb = document.querySelectorAll('#colors>div.color').length;
  }
  while(nb<newNb) {
    var color = generateRandomColor();
    addNewColorInput(color, nb);
    nb = document.querySelectorAll('#colors>div.color').length;
  }
  updateHash();
}
function updateContrastChecker() {
  var keep = '';
  var drop = '';
  const hash = window.location.hash.substring(1);
  let rgb = [];
  
  if (hash.includes('~')) {
    const hashParts = hash.split('~');
    rgb = hashParts[0].split('-').filter(c => /^[0-9A-Fa-f]{6}$/.test(c));
  } else {
    rgb = hash.split('-').filter(c => /^[0-9A-Fa-f]{6}$/.test(c));
  }
  for(i=0;i<rgb.length;i++) {
    var rgb1 = rgb[i];
    for(j=i+1;j<rgb.length;j++) {
      var rgb2 = rgb[j];
      var l1 = getRelativeLuminance('#'+rgb1), l2 = getRelativeLuminance('#'+rgb2);
      var c1 = rgb1+';color:#'+rgb2, c2 = rgb2+';color:#'+rgb1;
      var ratio = getContrastRatio('#'+rgb1, '#'+rgb2);
      var accessibility = getAccessibility(ratio);
      var rating = getRating(ratio);
      var html = '';
      html += '<table class="colors" data-rating="'+rating+'"><tr><td colspan="2">\n';
      html += '  <span class="color" style="background:#'+c1+'">\n';
      html += '    <h3>#'+rgb1+'</h3>\n';
      html += '    Relative Luminance: <span title="'+l1+'">'+Math.round(l1*10000000)/10000000+'</span>';
      html += '  </span>\n';
      html += '  <span class="color" style="background:#'+c2+'">\n';
      html += '    <h3>#'+rgb2+'</h3>\n';
      html += '    Relative Luminance: <span title="'+l2+'">'+Math.round(l2*10000000)/10000000+'</span>';
      html += '  </span>\n';
      html += '</td></tr>\n';
      html += '<tr>\n';
      html += '  <td class="contrast">Contrast : <span title="'+ratio+'">'+Math.round(100*ratio)/100+'</span></td>\n';
      html += '  <td class="accessibility"><div>'+accessibility+'</div>\n';
      for(a=rating;a>0;a--) html += '&#9733;';
      for(a=rating;a<5;a++) html += '&#9734;';
      html += '  </td>\n';
      html += '</tr></table>\n';
      const minRating = wcag === 'AAA' ? 4 : 3;
  if(rating >= minRating) { keep += html; } else { drop += html; }
    }
  }
  document.querySelector('#keep').innerHTML = keep;
  document.querySelector('#drop').innerHTML = drop;
}
const fontSuggestions = {
  technology: [
    { name: 'Inter', category: 'Sans-serif', description: 'Modern, highly readable', url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' },
    { name: 'JetBrains Mono', category: 'Monospace', description: 'Perfect for tech companies', url: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&display=swap' }
  ],
  healthcare: [
    { name: 'Source Sans Pro', category: 'Sans-serif', description: 'Professional and trustworthy', url: 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap' },
    { name: 'Lato', category: 'Sans-serif', description: 'Friendly and approachable', url: 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap' }
  ],
  finance: [
    { name: 'Roboto', category: 'Sans-serif', description: 'Reliable and professional', url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap' },
    { name: 'Merriweather', category: 'Serif', description: 'Traditional and trustworthy', url: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap' }
  ],
  creative: [
    { name: 'Montserrat', category: 'Sans-serif', description: 'Modern and versatile', url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap' },
    { name: 'Playfair Display', category: 'Serif', description: 'Elegant and distinctive', url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap' }
  ],
  concierge: [
    { name: 'Crimson Text', category: 'Serif', description: 'Elegant and sophisticated', url: 'https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&display=swap' },
    { name: 'Open Sans', category: 'Sans-serif', description: 'Friendly and professional', url: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap' }
  ],
  consulting: [
    { name: 'IBM Plex Sans', category: 'Sans-serif', description: 'Professional and modern', url: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&display=swap' },
    { name: 'Libre Baskerville', category: 'Serif', description: 'Classic and authoritative', url: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap' }
  ],
  hospitality: [
    { name: 'Nunito', category: 'Sans-serif', description: 'Warm and welcoming', url: 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap' },
    { name: 'Cormorant Garamond', category: 'Serif', description: 'Luxurious and elegant', url: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&display=swap' }
  ]
};

const logoSuggestions = {
  technology: [
    { concept: 'Abstract geometric shapes with clean lines', icons: ['⚡', '🔧', '⚙️', '💻'] },
    { concept: 'Minimalist icon with company initials', icons: ['◉', '◢', '▲', '●'] },
    { concept: 'Circuit-inspired design elements', icons: ['⚡', '🔗', '⚙️', '📡'] },
    { concept: 'Modern typography with subtle tech elements', icons: ['💾', '🖥️', '📱', '⌨️'] }
  ],
  healthcare: [
    { concept: 'Medical cross or plus symbol variations', icons: ['✚', '⚕️', '🏥', '💊'] },
    { concept: 'Heart or pulse line incorporated design', icons: ['💗', '❤️', '💓', '🫀'] },
    { concept: 'Circular logo representing wholeness', icons: ['⭕', '🔵', '⚪', '🟢'] },
    { concept: 'Clean typography with health-focused icon', icons: ['🩺', '💉', '🧬', '🔬'] }
  ],
  finance: [
    { concept: 'Arrow pointing upward for growth', icons: ['📈', '⬆️', '📊', '💹'] },
    { concept: 'Shield symbol for security and trust', icons: ['🛡️', '🔒', '🏛️', '💰'] },
    { concept: 'Graph or chart elements', icons: ['📊', '📈', '📉', '💱'] },
    { concept: 'Solid, geometric shapes for stability', icons: ['🏛️', '💼', '⚖️', '💎'] }
  ],
  creative: [
    { concept: 'Artistic brush stroke or paint splash', icons: ['🎨', '🖌️', '🖍️', '✏️'] },
    { concept: 'Camera aperture or lens inspiration', icons: ['📷', '📸', '🎬', '🎭'] },
    { concept: 'Colorful, dynamic geometric patterns', icons: ['🌈', '🎪', '🎨', '🎯'] },
    { concept: 'Hand-drawn or script-style typography', icons: ['✍️', '📝', '🖋️', '📜'] }
  ],
  concierge: [
    { concept: 'Key or door-related symbols for access', icons: ['🗝️', '🔑', '🚪', '🏨'] },
    { concept: 'Bell or service-oriented icons', icons: ['🔔', '🛎️', '👔', '🎩'] },
    { concept: 'Elegant monogram or crest design', icons: ['👑', '🏆', '💎', '⭐'] },
    { concept: 'Handshake or personal service symbols', icons: ['🤝', '👥', '🎯', '🌟'] }
  ],
  consulting: [
    { concept: 'Lightbulb or innovation symbols', icons: ['💡', '🧠', '⚡', '🎯'] },
    { concept: 'Arrow or direction-focused elements', icons: ['➡️', '🧭', '📊', '🎯'] },
    { concept: 'Professional initials in sophisticated frame', icons: ['📋', '💼', '🎓', '📈'] },
    { concept: 'Network or connection-themed design', icons: ['🔗', '🌐', '🤝', '💭'] }
  ],
  hospitality: [
    { concept: 'Roof or house-inspired welcoming shapes', icons: ['🏠', '🏨', '🏡', '🛏️'] },
    { concept: 'Star or quality rating symbols', icons: ['⭐', '🌟', '✨', '🏆'] },
    { concept: 'Heart or care-focused imagery', icons: ['❤️', '🤗', '😊', '🌺'] },
    { concept: 'Crown or premium service indicators', icons: ['👑', '💎', '🥇', '🌟'] }
  ]
};

function getFontFallbacks(category, fontName) {
  const fallbackMap = {
    'Sans-serif': ['Helvetica Neue', 'Helvetica', 'Arial', 'Segoe UI', 'Roboto', 'sans-serif'],
    'Serif': ['Times New Roman', 'Times', 'Georgia', 'Merriweather', 'serif'],
    'Monospace': ['Courier New', 'Courier', 'Monaco', 'Consolas', 'monospace'],
    'Display': ['Arial Black', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
    'Handwritten': ['Comic Sans MS', 'cursive', 'sans-serif']
  };
  
  const baseFallbacks = fallbackMap[category] || fallbackMap['Sans-serif'];
  
  // Supprime la police principale pour éviter les doublons
  const uniqueFallbacks = baseFallbacks.filter(fallback => 
    fallback.toLowerCase() !== fontName.toLowerCase()
  );
  
  // Reconstitue la chaîne CSS avec quotes appropriées
  return uniqueFallbacks.map(font => 
    font.includes(' ') && !['sans-serif', 'serif', 'monospace', 'cursive'].includes(font) 
      ? `'${font}'` 
      : font
  ).join(', ');
}

const styleBasedFonts = {
  modern: [
    { name: 'Inter', category: 'Sans-serif', description: 'Ultra-modern, clean geometric design' },
    { name: 'Poppins', category: 'Sans-serif', description: 'Friendly modern with rounded edges' },
    { name: 'Space Grotesk', category: 'Sans-serif', description: 'Contemporary tech-inspired' }
  ],
  corporate: [
    { name: 'Roboto', category: 'Sans-serif', description: 'Professional and reliable' },
    { name: 'IBM Plex Sans', category: 'Sans-serif', description: 'Corporate standard' },
    { name: 'Source Sans Pro', category: 'Sans-serif', description: 'Business-focused clarity' }
  ],
  creative: [
    { name: 'Montserrat', category: 'Sans-serif', description: 'Artistic and versatile' },
    { name: 'Playfair Display', category: 'Serif', description: 'Creative elegance' },
    { name: 'Oswald', category: 'Sans-serif', description: 'Bold creative expression' }
  ],
  playful: [
    { name: 'Nunito', category: 'Sans-serif', description: 'Rounded and friendly' },
    { name: 'Comfortaa', category: 'Sans-serif', description: 'Playful geometric curves' },
    { name: 'Quicksand', category: 'Sans-serif', description: 'Light and approachable' }
  ],
  elegant: [
    { name: 'Playfair Display', category: 'Serif', description: 'Sophisticated serif elegance' },
    { name: 'Crimson Text', category: 'Serif', description: 'Classical refined beauty' },
    { name: 'Cormorant Garamond', category: 'Serif', description: 'Luxury editorial style' }
  ],
  bold: [
    { name: 'Oswald', category: 'Sans-serif', description: 'Strong impactful headlines' },
    { name: 'Raleway', category: 'Sans-serif', description: 'Bold yet sophisticated' },
    { name: 'Roboto Condensed', category: 'Sans-serif', description: 'Condensed power' }
  ],
  natural: [
    { name: 'Merriweather', category: 'Serif', description: 'Organic reading experience' },
    { name: 'Lora', category: 'Serif', description: 'Natural flowing text' },
    { name: 'Open Sans', category: 'Sans-serif', description: 'Humanist and warm' }
  ],
  vintage: [
    { name: 'Libre Baskerville', category: 'Serif', description: 'Classic newspaper heritage' },
    { name: 'Old Standard TT', category: 'Serif', description: 'Traditional academic style' },
    { name: 'EB Garamond', category: 'Serif', description: 'Historical Renaissance' }
  ],
  luxury: [
    { name: 'Cormorant Garamond', category: 'Serif', description: 'Premium editorial luxury' },
    { name: 'Crimson Text', category: 'Serif', description: 'Sophisticated high-end' },
    { name: 'Playfair Display', category: 'Serif', description: 'Exclusive elegance' }
  ],
  friendly: [
    { name: 'Nunito', category: 'Sans-serif', description: 'Warm and welcoming' },
    { name: 'Open Sans', category: 'Sans-serif', description: 'Approachable and clear' },
    { name: 'Lato', category: 'Sans-serif', description: 'Friendly professionalism' }
  ]
};

function findGoodColorPairs(colors) {
  const goodPairs = [];
  
  for (let i = 0; i < colors.length; i++) {
    for (let j = 0; j < colors.length; j++) {
      if (i !== j && isGoodContrast(colors[i], colors[j])) {
        const ratio = getContrastRatio(colors[i], colors[j]);
        goodPairs.push({
          background: colors[i],
          text: colors[j],
          ratio: ratio
        });
      }
    }
  }
  
  return goodPairs.sort((a, b) => b.ratio - a.ratio);
}

function getValidColorForText(bgColor, availableColors) {
  for (const color of availableColors) {
    if (isGoodContrast(bgColor, color)) {
      return color;
    }
  }
  return null; // Aucune couleur valide trouvée
}

function getValidColorForBackground(textColor, availableColors) {
  for (const color of availableColors) {
    if (isGoodContrast(color, textColor)) {
      return color;
    }
  }
  return null; // Aucune couleur valide trouvée
}

function getValidPairsFromKeepSection() {
  const validPairs = [];
  const keepSection = document.querySelector('#keep');
  
  if (!keepSection) return validPairs;
  
  const colorTables = keepSection.querySelectorAll('table.colors');
  
  colorTables.forEach(table => {
    const colorSpans = table.querySelectorAll('span.color');
    
    if (colorSpans.length >= 2) {
      const firstSpan = colorSpans[0];
      const secondSpan = colorSpans[1];
      
      const bgStyle1 = firstSpan.getAttribute('style');
      const bgStyle2 = secondSpan.getAttribute('style');
      
      // Parse les couleurs des styles
      const bg1Match = bgStyle1 ? bgStyle1.match(/background:#([0-9a-fA-F]{6})/i) : null;
      const text1Match = bgStyle1 ? bgStyle1.match(/color:#([0-9a-fA-F]{6})/i) : null;
      const bg2Match = bgStyle2 ? bgStyle2.match(/background:#([0-9a-fA-F]{6})/i) : null;
      const text2Match = bgStyle2 ? bgStyle2.match(/color:#([0-9a-fA-F]{6})/i) : null;
      
      if (bg1Match && text1Match) {
        validPairs.push({
          background: '#' + bg1Match[1].toUpperCase(),
          text: '#' + text1Match[1].toUpperCase(),
          ratio: getContrastRatio('#' + bg1Match[1], '#' + text1Match[1])
        });
      }
      
      if (bg2Match && text2Match) {
        validPairs.push({
          background: '#' + bg2Match[1].toUpperCase(),
          text: '#' + text2Match[1].toUpperCase(),
          ratio: getContrastRatio('#' + bg2Match[1], '#' + text2Match[1])
        });
      }
    }
  });
  
  return validPairs.sort((a, b) => b.ratio - a.ratio);
}

function getColorUsageRecommendations(colors, sector, style) {
  if (!colors.length) return '';
  
  // Utilise les associations déjà validées par l'outil
  const validPairs = getValidPairsFromKeepSection();
  
  if (validPairs.length === 0) {
    return {
      headers: { background: '#000000', text: '#FFFFFF', description: 'Aucune association valide trouvée' },
      wcagCompliant: '⚠️ Aucune paire WCAG trouvée dans votre palette'
    };
  }
  
  // Utilise TOUTES les paires validées de la section "Associate the following colors"
  const allPairs = [...validPairs];
  
  // Trouve les couleurs uniques utilisées
  const allColorsUsed = new Set();
  validPairs.forEach(pair => {
    allColorsUsed.add(pair.background.toUpperCase());
    allColorsUsed.add(pair.text.toUpperCase());
  });
  
  // Trouve un fond clair parmi les paires validées pour le fond principal
  const lightBgPair = validPairs.find(pair => getRelativeLuminance(pair.background) > 0.7) || validPairs[0];
  
  // Attribution sécurisée : utilise les paires dans l'ordre des meilleurs contrastes
  function safePair(index, fallback = validPairs[0]) {
    return validPairs[index] || fallback;
  }
  
  // Trouve une paire pour bouton qui ne soit PAS la même que le fond principal
  function findButtonPair(exclude) {
    return validPairs.find(pair => 
      pair.background.toUpperCase() !== exclude.background.toUpperCase()
    ) || validPairs[0];
  }
  
  const usageGuide = {
    headers: {
      background: safePair(0).background,
      text: safePair(0).text,
      description: `Meilleur contraste: ${Math.round(safePair(0).ratio * 100) / 100}`
    },
    navigation: {
      background: safePair(1).background,
      text: safePair(1).text,
      description: `Navigation: ${Math.round(safePair(1).ratio * 100) / 100}`
    },
    buttons: {
      primary: (() => {
        const buttonPair = findButtonPair(lightBgPair);
        const hoverPair = validPairs.find(p => 
          p.background !== buttonPair.background && p.background !== lightBgPair.background
        ) || safePair(1);
        return {
          background: buttonPair.background,
          text: buttonPair.text,
          hover: hoverPair.background,
          hoverText: hoverPair.text
        };
      })(),
      secondary: (() => {
        const usedColors = [lightBgPair.background];
        const primaryButton = findButtonPair(lightBgPair);
        usedColors.push(primaryButton.background);
        
        const secondaryPair = validPairs.find(p => 
          !usedColors.includes(p.background.toUpperCase())
        ) || safePair(2);
        
        const hoverPair = validPairs.find(p => 
          !usedColors.includes(p.background.toUpperCase()) && 
          p.background !== secondaryPair.background
        ) || safePair(3);
        
        return {
          background: secondaryPair.background,
          text: secondaryPair.text,
          border: secondaryPair.background,
          hover: hoverPair.background,
          hoverText: hoverPair.text
        };
      })()
    },
    links: {
      normal: lightBgPair.text, // Couleur qui fonctionne sur le fond principal
      hover: safePair(1).text,  // Alternative validée 
      visited: safePair(2).text // Autre alternative validée
    },
    text: {
      primary: lightBgPair.text,
      secondary: safePair(9).text,
      muted: safePair(10).text
    },
    backgrounds: {
      main: lightBgPair.background,
      mainText: lightBgPair.text,
      alternate: safePair(6).background,  // Différent du main
      alternateText: safePair(6).text,
      accent: safePair(7).background,      // Différent des deux autres
      accentText: safePair(7).text
    },
    accent: safePair(4).text,
    allColorsUsed: `Toutes les couleurs utilisées: ${Array.from(allColorsUsed).join(', ')}`,
    wcagCompliant: `✅ ${validPairs.length} associations WCAG validées utilisées`,
    totalValidPairs: validPairs.length
  };
  
  return usageGuide;
}

function adjustColorBrightness(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + 
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function generateColorUsageGuide() {
  const colors = Array.from(document.querySelectorAll('input.color')).map(input => input.value);
  const sector = document.getElementById('sector').value;
  const style = document.getElementById('style').value;
  
  if (!colors.length) return;
  
  const usage = getColorUsageRecommendations(colors, sector, style);
  const container = document.getElementById('color-usage-suggestions');
  
  container.innerHTML = `
    <div class="usage-category">
      <h4>📊 Analyse WCAG</h4>
      <p style="font-size: 0.9em; background: #f0f0f0; padding: 10px; border-radius: 5px;">
        ${usage.wcagCompliant}<br>
        ${usage.allColorsUsed}
      </p>
    </div>
    
    <div class="usage-category">
      <h4>🎯 Headers & Titles</h4>
      <div class="color-demo" style="background: ${usage.headers.background}; color: ${usage.headers.text}; padding: 15px; border-radius: 5px; margin: 10px 0;">
        <strong>Your Brand Title Here</strong>
        <div style="font-size: 0.9em; margin-top: 5px;">Background: ${usage.headers.background} • Text: ${usage.headers.text}</div>
      </div>
      <p>${usage.headers.description}</p>
    </div>
    
    <div class="usage-category">
      <h4>🔗 Links & Navigation</h4>
      <div style="padding: 15px; background: ${usage.backgrounds.main}; border-radius: 5px; margin: 10px 0;">
        <a href="#" style="color: ${usage.links.normal}; text-decoration: none; margin-right: 20px;">Normal Link</a>
        <a href="#" style="color: ${usage.links.hover}; text-decoration: underline; margin-right: 20px;">Hover State</a>
        <a href="#" style="color: ${usage.links.visited}; text-decoration: none;">Visited Link</a>
        <div style="font-size: 0.8em; margin-top: 8px; color: ${usage.text.secondary};">
          Normal: ${usage.links.normal} • Hover: ${usage.links.hover} • Visited: ${usage.links.visited}
        </div>
      </div>
    </div>
    
    <div class="usage-category">
      <h4>🔘 Buttons</h4>
      <div style="padding: 15px; background: ${usage.backgrounds.main}; color: ${usage.backgrounds.mainText}; border-radius: 5px; margin: 10px 0;">
        <button onmouseover="this.style.background='${usage.buttons.primary.hover}'; this.style.color='${usage.buttons.primary.hoverText}'" 
                onmouseout="this.style.background='${usage.buttons.primary.background}'; this.style.color='${usage.buttons.primary.text}'"
                style="background: ${usage.buttons.primary.background}; color: ${usage.buttons.primary.text}; border: none; padding: 10px 20px; border-radius: 5px; margin-right: 10px; cursor: pointer; transition: all 0.3s;">Primary Button</button>
        <button onmouseover="this.style.background='${usage.buttons.secondary.hover}'; this.style.color='${usage.buttons.secondary.hoverText}'" 
                onmouseout="this.style.background='${usage.buttons.secondary.background}'; this.style.color='${usage.buttons.secondary.text}'"
                style="background: ${usage.buttons.secondary.background}; color: ${usage.buttons.secondary.text}; border: 2px solid ${usage.buttons.secondary.border}; padding: 8px 18px; border-radius: 5px; cursor: pointer; transition: all 0.3s;">Secondary Button</button>
        <div style="font-size: 0.8em; margin-top: 8px; color: ${usage.backgrounds.mainText};">
          Primary: ${usage.buttons.primary.background} → ${usage.buttons.primary.hover} • Secondary: ${usage.buttons.secondary.background} → ${usage.buttons.secondary.hover}
        </div>
      </div>
    </div>
    
    <div class="usage-category">
      <h4>📝 Text Hierarchy</h4>
      <div style="padding: 15px; background: ${usage.backgrounds.main}; border-radius: 5px; margin: 10px 0;">
        <h3 style="color: ${usage.text.primary}; margin: 0 0 8px 0;">Primary Text (Headings)</h3>
        <p style="color: ${usage.text.secondary}; margin: 0 0 8px 0;">Secondary text for body content and descriptions</p>
        <p style="color: ${usage.text.muted}; margin: 0; font-size: 0.9em;">Muted text for footnotes and less important information</p>
        <div style="font-size: 0.8em; margin-top: 8px; color: ${usage.text.muted};">
          Primary: ${usage.text.primary} • Secondary: ${usage.text.secondary} • Muted: ${usage.text.muted}
        </div>
      </div>
    </div>
    
    <div class="usage-category">
      <h4>🎨 Backgrounds & Sections</h4>
      <div style="margin: 10px 0;">
        <div style="background: ${usage.backgrounds.main}; color: ${usage.backgrounds.mainText}; padding: 15px; border-radius: 5px; margin-bottom: 5px;">
          <strong>Main Background</strong> (${usage.backgrounds.main} • Text: ${usage.backgrounds.mainText})
        </div>
        <div style="background: ${usage.backgrounds.alternate}; color: ${usage.backgrounds.alternateText}; padding: 15px; border-radius: 5px; margin-bottom: 5px;">
          <strong>Alternate Section</strong> (${usage.backgrounds.alternate} • Text: ${usage.backgrounds.alternateText})
        </div>
        <div style="background: ${usage.backgrounds.accent}; color: ${usage.backgrounds.accentText}; padding: 15px; border-radius: 5px;">
          <strong>Accent Highlight</strong> (${usage.backgrounds.accent} • Text: ${usage.backgrounds.accentText})
        </div>
      </div>
    </div>
    
    <div class="usage-category">
      <h4>✨ Accent & Highlights</h4>
      <div style="padding: 15px; background: ${usage.backgrounds.main}; border-radius: 5px; margin: 10px 0; border-left: 4px solid ${usage.accent};">
        <div style="color: ${usage.accent}; font-weight: bold;">Accent Color Usage</div>
        <p style="color: ${usage.text.secondary}; margin: 5px 0 0 0;">Use ${usage.accent} for highlights, badges, and call-to-action elements</p>
      </div>
    </div>
  `;
}

function generateBrandRecommendations() {
  const sector = document.getElementById('sector').value;
  const style = document.getElementById('style').value;
  
  if (!sector || !style) return;
  
  const fontContainer = document.getElementById('font-suggestions');
  const logoContainer = document.getElementById('logo-suggestions');
  const recommendationsSection = document.getElementById('brand-recommendations');
  
  let fonts = styleBasedFonts[style] || styleBasedFonts.modern;
  
  const sectorFonts = fontSuggestions[sector];
  if (sectorFonts && sectorFonts.length > 0) {
    fonts = [...fonts.slice(0, 2), ...sectorFonts.slice(0, 1)];
  }
  
  fontContainer.innerHTML = fonts.map(font => {
    const fallbacks = getFontFallbacks(font.category, font.name);
    return `
    <div class="font-suggestion">
      <h4>${font.name} (${font.category})</h4>
      <p>${font.description}</p>
      <div class="font-example" style="font-family: '${font.name}', ${fallbacks};">The quick brown fox jumps over the lazy dog</div>
      <div class="font-fallback" style="font-size: 0.8em; color: #666; margin-top: 5px;">
        <strong>CSS:</strong> font-family: '${font.name}', ${fallbacks};
      </div>
    </div>
    `;
  }).join('');
  
  const logos = logoSuggestions[sector] || logoSuggestions.technology;
  
  const styleModifier = {
    modern: ' with clean, minimalist execution',
    corporate: ' with professional, trustworthy approach',
    creative: ' with artistic, unique interpretation',
    playful: ' with fun, engaging elements',
    elegant: ' with sophisticated, refined details',
    bold: ' with strong, impactful design',
    natural: ' with organic, earthy feeling',
    vintage: ' with retro, classic styling',
    luxury: ' with premium, exclusive treatment',
    friendly: ' with warm, approachable design'
  };
  
  logoContainer.innerHTML = logos.map(item => `
    <div class="logo-suggestion">
      <h4>${item.concept}${styleModifier[style] || ''}</h4>
      <div class="logo-icons">
        ${item.icons.map(icon => `<span class="logo-icon">${icon}</span>`).join('')}
      </div>
    </div>
  `).join('');
  
  generateColorUsageGuide();
  recommendationsSection.style.display = 'block';
}

function getLockedColors() {
  const lockedColors = [];
  const lockButtons = document.querySelectorAll('.lock-button.locked');
  
  lockButtons.forEach(button => {
    const colorId = button.getAttribute('data-color-id');
    const colorInput = document.getElementById(colorId);
    if (colorInput) {
      lockedColors.push({
        index: parseInt(colorId.replace('color', '')),
        color: colorInput.value.toUpperCase()
      });
    }
  });
  
  console.log('Locked colors:', lockedColors);
  return lockedColors;
}

function generateHarmoniousPalette() {
  const count = parseInt(document.getElementById('nb').value);
  const sector = document.getElementById('sector').value || 'technology';
  const style = document.getElementById('style').value || 'modern';
  
  const lockedColors = getLockedColors();
  const colors = generateOptimalColors(count, sector, style, lockedColors);
  
  document.querySelector('#colors').innerHTML = '';
  
  colors.forEach((color, index) => {
    addNewColorInput(color, index);
  });
  
  lockedColors.forEach(lockedColor => {
    const lockButton = document.querySelector(`[data-color-id="color${lockedColor.index}"]`);
    if (lockButton) {
      lockButton.classList.remove('unlocked');
      lockButton.classList.add('locked');
      lockButton.innerHTML = '🔒';
      lockButton.title = 'Color is locked - click to unlock';
    }
  });
  
  updateHash();
  generateBrandRecommendations();
}

document.addEventListener('DOMContentLoaded', function () {
  $('input[type=radio]').forEach(r=>{r.addEventListener('change',function(){wcag=this.value;updateContrastChecker();updateHash()})})
  let nb = document.getElementById('nb');
  nb.addEventListener('input', changeInputValue)
  nb.addEventListener('change', onNumberColorsChanged);
  
  const generateBtn = document.getElementById('generate-palette');
  if (generateBtn) {
    generateBtn.addEventListener('click', generateHarmoniousPalette);
  }
  document.getElementById('sector').addEventListener('change', function() {
    generateBrandRecommendations();
    updateHash();
  });
  document.getElementById('style').addEventListener('change', function() {
    generateBrandRecommendations();
    updateHash();
  });
  
  if(window.location.hash.length>1) {
    const hashParts = window.location.hash.substring(1).split('~');
    
    if (hashParts.length > 1) {
      const colors = hashParts[0].split('-').filter(c => /^[0-9A-Fa-f]{6}$/.test(c));
      const locks = hashParts[1] || '';
      const sector = hashParts[2] || '';
      const style = hashParts[3] || '';
      const wcagValue = hashParts[4] || 'AAA';
      
      if (colors.length > 0) {
        nb.classList.add('n'+colors.length);
        nb.value = colors.length;
        
        if (sector) {
          document.getElementById('sector').value = sector;
          console.log('Sector restored:', sector);
        }
        if (style) {
          document.getElementById('style').value = style;
          console.log('Style restored:', style);
        }
        
        const wcagRadio = document.querySelector(`input[name="crit"][value="${wcagValue}"]`);
        if (wcagRadio) {
          wcagRadio.checked = true;
          wcag = wcagValue;
          console.log('WCAG restored:', wcagValue);
        }
        
        for(let i=0; i<colors.length; i++) {
          addNewColorInput('#'+colors[i], i);
          
          if (locks[i] === '1') {
            setTimeout(() => {
              const lockButton = document.querySelector(`[data-color-id="color${i}"]`);
              if (lockButton) {
                lockButton.classList.remove('unlocked');
                lockButton.classList.add('locked');
                lockButton.innerHTML = '🔒';
                lockButton.title = 'Color is locked - click to unlock';
                console.log('Lock restored for color', i);
              }
            }, 100);
          }
        }
        
        setTimeout(() => {
          generateBrandRecommendations();
        }, 200);
      } else {
        changeInputValue();
        onNumberColorsChanged();
      }
    } else {
      const colors = window.location.hash.substring(1).split('-').filter(c => /^[0-9A-Fa-f]{6}$/.test(c));
      if (colors.length > 0) {
        nb.classList.add('n'+colors.length);
        nb.value = colors.length;
        for(i=0;i<colors.length;i++) {
          addNewColorInput('#'+colors[i], i);
        }
      } else {
        changeInputValue();
        onNumberColorsChanged();
      }
    }
  }
  else {
    changeInputValue();
    onNumberColorsChanged();
  }
  updateContrastChecker();
});