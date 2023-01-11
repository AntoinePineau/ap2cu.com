var luminanceThreshold = 0.3;
if(this.wcag===undefined) wcag = 'AAA';
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
  return Math.floor(Math.random() * (max - min + 1) + min)
}
function generateRandomColor() {
  var r = randomIntFromInterval(0, 255).toString(16); if(r.length==1)r='0'+r;
  var g = randomIntFromInterval(0, 255).toString(16); if(g.length==1)g='0'+g;
  var b = randomIntFromInterval(0, 255).toString(16); if(b.length==1)b='0'+b;
  return '#'+r+g+b;
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
  var h = '';
  [].slice.call(document.querySelectorAll('input.color')).forEach(element => {
    h += '-'+element.value.substring(1);
  });
  window.location.hash = h.substring(1);
  updateContrastChecker();
}
function addNewColorInput(color, nb) {
  var div = document.createElement('div');
  div.setAttribute('class', 'color');
  div.setAttribute('data-input', 'color'+nb);
  var input = document.createElement('input');
  input.setAttribute('type', 'color');
  input.setAttribute('name', 'color'+nb);
  input.setAttribute('id', 'color'+nb);
  input.setAttribute('class', 'color');
  input.value = color;
  input.addEventListener('input', onColorChanged);
  var label = document.createElement('label');
  label.setAttribute('for', 'color'+nb);
  label.innerHTML = color;
  label.setAttribute('class', 'color '+(getRelativeLuminance(color)>luminanceThreshold ? 'dark' : 'white'));
  var button = document.createElement('button');
  button.setAttribute('data-input', 'color'+nb);
  button.setAttribute('class', 'color');
  button.innerHTML = 'Random';
  button.addEventListener('click', onButtonClicked);
  div.append(label);
  div.append(input);
  div.append(button);
  document.querySelector('#colors').append(div);
}
function onNumberColorsChanged(){
  var nb = document.querySelectorAll('#colors>div.color').length;
  var newNb = this.value;
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
  var rgb = window.location.hash.substring(1).split('-');
  for(i=0;i<rgb.length;i++) {
    var rgb1 = rgb[i];
    for(j=i+1;j<rgb.length;j++) {
      var rgb2 = rgb[j];
      var l1 = getRelativeLuminance(rgb1), l2 = getRelativeLuminance(rgb2);
      var c1 = rgb1+';color:#'+rgb2, c2 = rgb2+';color:#'+rgb1;
      var ratio = getContrastRatio(rgb1, rgb2);
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
      html += '    Relative L½"½"uminance: <span title="'+l2+'">'+Math.round(l2*10000000)/10000000+'</span>';
      html += '  </span>\n';
      html += '</td></tr>\n';
      html += '<tr>\n';
      html += '  <td class="contrast">Contrast : <span title="'+ratio+'">'+Math.round(100*ratio)/100+'</span></td>\n';
      html += '  <td class="accessibility"><div>'+accessibility+'</div>\n';
      for(a=rating;a>0;a--) html += '&#9733;';
      for(a=rating;a<5;a++) html += '&#9734;';
      html += '  </td>\n';
      html += '</tr></table>\n';
      if(rating > wcag.length) { keep += html; } else { drop += html; }
    }
  }
  document.querySelector('#keep').innerHTML = keep;
  document.querySelector('#drop').innerHTML = drop;
}
document.querySelector('#nb').addEventListener('change', onNumberColorsChanged);
document.addEventListener('DOMContentLoaded', function () {
  if(window.location.hash.length>1) {
    var colors = window.location.hash.substring(1).split('-');
    document.querySelector('#nb').value = colors.length;
    for(i=0;i<colors.length;i++) {
      addNewColorInput('#'+colors[i], i);
    }
  }
  else {
    document.getElementById('nb').dispatchEvent(new Event("change"));
  }
  updateContrastChecker();
});
