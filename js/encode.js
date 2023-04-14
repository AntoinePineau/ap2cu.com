document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('textarea').forEach(function(t) {
    var id = t.getAttribute('id');
    document.querySelector('label[for='+id+']').innerText = t.getAttribute('placeholder');
    t.addEventListener('focusout', function(){update(id, t)});
    t.addEventListener('focus', function(){this.select();});
    t.addEventListener('onmouseup', function(){return false});
  });
  var decoded = document.querySelector('#decoded');
  decoded.addEventListener('keyup', function(){update('decoded', decoded)});
  document.querySelector('#charsIgnored').addEventListener('keyup', function(){update('decoded', decoded)});
  document.querySelector('#ignore').addEventListener('change', function(){update('decoded', decoded)});
}, false);

function update(id, textarea) {
  switch(id) {
    case 'decoded':
      var decodedText = textarea.value;
      urlencode(decodedText);
      base64encode(decodedText);
      htmlentitiesencode(decodedText);
      unicodeencode(decodedText);
      byteencode(decodedText);
      hexencode(decodedText);
      binaryencode(decodedText);
      dnaencode(decodedText);
      document.querySelector('#sha1encoded').value = SHA1(decodedText);
      document.querySelector('#sha256encoded').value = sha256(decodedText);
      document.querySelector('#md5encoded').value = md5(decodedText);
      break;
    case 'urlencoded':
      var decodedText = urldecode(textarea.value);
      base64encode(decodedText);
      htmlentitiesencode(decodedText);
      unicodeencode(decodedText);
      byteencode(decodedText);
      hexencode(decodedText);
      binaryencode(decodedText);
      dnaencode(decodedText);
      document.querySelector('#sha1encoded').value = SHA1(decodedText);
      document.querySelector('#sha256encoded').value = sha256(decodedText);
      document.querySelector('#md5encoded').value = md5(decodedText);
      break;
    case 'base64encoded':
      var decodedText = base64decode(textarea.value);
      urlencode(decodedText);
      htmlentitiesencode(decodedText);
      unicodeencode(decodedText);
      byteencode(decodedText);
      hexencode(decodedText);
      binaryencode(decodedText);
      dnaencode(decodedText);
      document.querySelector('#sha1encoded').value = SHA1(decodedText);
      document.querySelector('#sha256encoded').value = sha256(decodedText);
      document.querySelector('#md5encoded').value = md5(decodedText);
      break;
    case 'htmlentitiesencoded':
      var decodedText = htmlentitiesdecode(textarea.value);
      urlencode(decodedText);
      base64encode(decodedText);
      unicodeencode(decodedText);
      byteencode(decodedText);
      hexencode(decodedText);
      binaryencode(decodedText);
      dnaencode(decodedText);
      document.querySelector('#sha1encoded').value = SHA1(decodedText);
      document.querySelector('#sha256encoded').value = sha256(decodedText);
      document.querySelector('#md5encoded').value = md5(decodedText);
      break;
    case 'unicodeencoded':
      var decodedText = unicodedecode(textarea.value);
      urlencode(decodedText);
      base64encode(decodedText);
      htmlentitiesencode(decodedText);
      byteencode(decodedText);
      hexencode(decodedText);
      binaryencode(decodedText);
      dnaencode(decodedText);
      document.querySelector('#sha1encoded').value = SHA1(decodedText);
      document.querySelector('#sha256encoded').value = sha256(decodedText);
      document.querySelector('#md5encoded').value = md5(decodedText);
      break;
    case 'byteencoded':
      var decodedText = bytedecode(textarea.value);
      urlencode(decodedText);
      base64encode(decodedText);
      unicodeencode(decodedText);
      htmlentitiesencode(decodedText);
      hexencode(decodedText);
      binaryencode(decodedText);
      dnaencode(decodedText);
      document.querySelector('#sha1encoded').value = SHA1(decodedText);
      document.querySelector('#sha256encoded').value = sha256(decodedText);
      document.querySelector('#md5encoded').value = md5(decodedText);
      break;
    case 'hexencoded':
      var decodedText = hexdecode(textarea.value);
      urlencode(decodedText);
      base64encode(decodedText);
      unicodeencode(decodedText);
      htmlentitiesencode(decodedText);
      byteencode(decodedText);
      binaryencode(decodedText);
      dnaencode(decodedText);
      document.querySelector('#sha1encoded').value = SHA1(decodedText);
      document.querySelector('#sha256encoded').value = sha256(decodedText);
      document.querySelector('#md5encoded').value = md5(decodedText);
      break;
    case 'binaryencoded':
      var decodedText = binarydecode(textarea.value);
      urlencode(decodedText);
      base64encode(decodedText);
      unicodeencode(decodedText);
      htmlentitiesencode(decodedText);
      byteencode(decodedText);
      hexencode(decodedText);
      dnaencode(decodedText);
      document.querySelector('#sha1encoded').value = SHA1(decodedText);
      document.querySelector('#sha256encoded').value = sha256(decodedText);
      document.querySelector('#md5encoded').value = md5(decodedText);
      break;
    case 'dnaencoded':
      var decodedText = dnadecode(textarea.value);
      urlencode(decodedText);
      base64encode(decodedText);
      unicodeencode(decodedText);
      htmlentitiesencode(decodedText);
      byteencode(decodedText);
      hexencode(decodedText);
      binaryencode(decodedText);
      document.querySelector('#sha1encoded').value = SHA1(decodedText);
      document.querySelector('#sha256encoded').value = sha256(decodedText);
      document.querySelector('#md5encoded').value = md5(decodedText);
      break;
  }
}

function ignore(text, f) {
  if(!document.querySelector('#ignore').checked)
    return f(text);
  var regex = new RegExp('^['+document.querySelector('#charsIgnored').value+']$');
  var s = '';
  for(i=0;i<text.length;i++){
    var c = text[i];
    s += c.match(regex) ? c : f(c);
  }
  return s;
}

function urlencode(text) {
  return document.querySelector('#urlencoded').value = ignore(text, encodeURIComponent);
}

function urldecode(text) {
  return document.querySelector('#decoded').value = decodeURIComponent(text);
}

function htmlentities(text) {
  var buf = [];
  for (var i=text.length-1;i>=0;i--) {
    buf.unshift(['&#', text[i].charCodeAt(), ';'].join(''));
  }
  return buf.join('');
}

function htmlentitiesencode(text) {
  return document.querySelector('#htmlentitiesencoded').value = ignore(text, htmlentities);
}

function htmlentitiesdecode(text) {
  return document.querySelector('#decoded').value = text.replace(/&#(\d+);/g, function(match, dec) {
    return String.fromCharCode(dec);
  });
}

function base64encode(text) {
  utf8Bytes = encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, function (match, p1) {
    return String.fromCharCode('0x' + p1);
  });  
  return document.querySelector('#base64encoded').value = btoa(utf8Bytes);
}

function base64decode(text) {
  return document.querySelector('#decoded').value = atob(text);
}

function unicode(text) {
  var bufView = '';
  for (var i=0, strLen=text.length; i < strLen; i++) {
    var c = text.codePointAt(i).toString(16);
    var z = '';
    for(j=4;j>c.length;j--)
      z += '0';
    bufView += '\\u' + z + c;
  }
  return bufView;
}

function unicodeencode(text) {
  return document.querySelector('#unicodeencoded').value = ignore(text, unicode);
}

function unicodedecode(text) {
  var str = '';
  var hex = text.replace(/\\/g, '').split('u');
  for(i=0;i<hex.length;i++) {
    if(hex[i].length==0) continue;
    var c = parseInt(hex[i], 16);
    str += String.fromCodePoint(c);
  }
  return document.querySelector('#decoded').value = str;
}

function byteencode(text) {
  var bytes = '';
  for(i=0;i<text.length;i++) {
    bytes += text.codePointAt(i)+' ';
  }
  return document.querySelector('#byteencoded').value = bytes;
}

function bytedecode(text) {
  var str = '';
  var bytes = text.split(' ');
  for(i=0;i<bytes.length;i++)
    str += String.fromCodePoint(bytes[i]);
  return document.querySelector('#decoded').value = str;
}

function binaryencode(text) {
  var binary = '';
  for(i=0;i<text.length;i++) {
    var b = text.codePointAt(i).toString(2);
    if(b.length<8) b = '0'+b;
    binary += b+' ';
  }
  return document.querySelector('#binaryencoded').value = binary;
}

function binarydecode(text) {
  return document.querySelector('#decoded').value = binary2decoded(text);
}


function dnaencode(text) {
  var dna = '';
  for(i=0;i<text.length;i++) {
    var v = text.codePointAt(i).toString(2);
    if(v.length<8) v = '0'+v;
    var binary = v.match(/.{1,2}/g).join('#').split('#');
    for(l=0;l<binary.length;l++) {
      var b = binary[l];
      dna += b == '00' ? 'A' : b == '11' ? 'T' : b == '01' ? 'C' : 'G';
    }
    dna += ' ';
  }
  return document.querySelector('#dnaencoded').value = dna;
}

function dnadecode(text) {
  return document.querySelector('#decoded').value = binary2decode(dna2binary(text));
}

function binary2decode(text) {
  var str = '';
  var bytes = text.trim().split(' ');
  for(i=0;i<bytes.length;i++) {
    var codePoint = 0;
    for(c=0;c<bytes[i].length;c++) {
      var bit = parseInt(bytes[i][c]);
      if(bit==1) codePoint += 2**(bytes[i].length - c - 1);
    }
    str += String.fromCodePoint(codePoint);
  }
  return str;
}

function dna2binary(text) {
  var str = '';
  var dna = text.trim().split(' ');
  for(i=0;i<dna.length;i++) {
    for(j=0;j<dna[i].length;j++) {
      var n = dna[i][j];
      str += n == 'A' ? '00' : n == 'T' ? '11' : n == 'C' ? '01' : '10';
    }
    str += ' ';
  }
  return str;
}

function hexencode(text) {
  var bytes = '';
  for(i=0;i<text.length;i++) {
    bytes += text.charCodeAt(i).toString(16);
  }
  return document.querySelector('#hexencoded').value = bytes.toUpperCase();
}

function hexdecode(text) {
  return document.querySelector('#decoded').value = hex_to_ascii(text);
}

function WordToHex(lValue){var WordToHexValue='',WordToHexValue_temp='',lByte,lCount;for(lCount=0;lCount<=3;lCount++){lByte=(lValue>>>(lCount*8))&255;WordToHexValue_temp='0'+lByte.toString(16);WordToHexValue=WordToHexValue+WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);}return WordToHexValue;}
function hex_to_ascii(str1){var hex  = str1.toString();var str = '';for (var n = 0; n < hex.length; n += 2){str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));}return str;}


function Utf8Encode(string){string=string.replace(/\r\n/g,'\n');var utftext='';for(var n=0;n<string.length;n++){var c=string.charCodeAt(n);if(c<128){utftext+=String.fromCharCode(c);}
else if((c>127)&&(c<2048)){utftext+=String.fromCharCode((c>>6)|192);utftext+=String.fromCharCode((c&63)|128);}
else{utftext+=String.fromCharCode((c>>12)|224);utftext+=String.fromCharCode(((c>>6)&63)|128);utftext+=String.fromCharCode((c&63)|128);}}return utftext;};

function md5(string){
  function RotateLeft(lValue,iShiftBits){ return(lValue<<iShiftBits)|(lValue>>>(32-iShiftBits)); }
  function AddUnsigned(lX,lY){var lX4,lY4,lX8,lY8,lResult;lX8=(lX&0x80000000);lY8=(lY&0x80000000);lX4=(lX&0x40000000);lY4=(lY&0x40000000);lResult=(lX&0x3FFFFFFF)+(lY&0x3FFFFFFF);
    if(lX4&lY4){return(lResult^0x80000000^lX8^lY8);}
    if(lX4|lY4){
      if(lResult&0x40000000){return(lResult^0xC0000000^lX8^lY8);}
      else{
        return(lResult^0x40000000^lX8^lY8);
      }
    }
    else{
      return(lResult^lX8^lY8);
    }
  }
  function F(x,y,z){return(x&y)|((~x)&z);}
  function G(x,y,z){return(x&z)|(y&(~z));}
  function H(x,y,z){return(x^y^z);}
  function I(x,y,z){return(y^(x|(~z)));}
  function FF(a,b,c,d,x,s,ac){a=AddUnsigned(a,AddUnsigned(AddUnsigned(F(b,c,d),x),ac));return AddUnsigned(RotateLeft(a,s),b);};
  function GG(a,b,c,d,x,s,ac){a=AddUnsigned(a,AddUnsigned(AddUnsigned(G(b,c,d),x),ac));return AddUnsigned(RotateLeft(a,s),b);};
  function HH(a,b,c,d,x,s,ac){a=AddUnsigned(a,AddUnsigned(AddUnsigned(H(b,c,d),x),ac));return AddUnsigned(RotateLeft(a,s),b);};
  function II(a,b,c,d,x,s,ac){a=AddUnsigned(a,AddUnsigned(AddUnsigned(I(b,c,d),x),ac));return AddUnsigned(RotateLeft(a,s),b);};
  function ConvertToWordArray(string){var lWordCount;var lMessageLength=string.length;var lNumberOfWords_temp1=lMessageLength+8;var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;var lNumberOfWords=(lNumberOfWords_temp2+1)*16;var lWordArray=Array(lNumberOfWords-1);var lBytePosition=0;var lByteCount=0;while(lByteCount<lMessageLength){lWordCount=(lByteCount-(lByteCount % 4))/4;lBytePosition=(lByteCount % 4)*8;lWordArray[lWordCount]=(lWordArray[lWordCount]|(string.charCodeAt(lByteCount)<<lBytePosition));lByteCount++;}
lWordCount=(lByteCount-(lByteCount % 4))/4;lBytePosition=(lByteCount % 4)*8;lWordArray[lWordCount]=lWordArray[lWordCount]|(0x80<<lBytePosition);lWordArray[lNumberOfWords-2]=lMessageLength<<3;lWordArray[lNumberOfWords-1]=lMessageLength>>>29;return lWordArray;};
  var x=Array();var k,AA,BB,CC,DD,a,b,c,d;var S11=7,S12=12,S13=17,S14=22;var S21=5,S22=9,S23=14,S24=20;var S31=4,S32=11,S33=16,S34=23;var S41=6,S42=10,S43=15,S44=21;string=Utf8Encode(string);x=ConvertToWordArray(string);a=0x67452301;b=0xEFCDAB89;c=0x98BADCFE;d=0x10325476;for(k=0;k<x.length;k+=16){AA=a;BB=b;CC=c;DD=d;a=FF(a,b,c,d,x[k+0],S11,0xD76AA478);d=FF(d,a,b,c,x[k+1],S12,0xE8C7B756);c=FF(c,d,a,b,x[k+2],S13,0x242070DB);b=FF(b,c,d,a,x[k+3],S14,0xC1BDCEEE);a=FF(a,b,c,d,x[k+4],S11,0xF57C0FAF);d=FF(d,a,b,c,x[k+5],S12,0x4787C62A);c=FF(c,d,a,b,x[k+6],S13,0xA8304613);b=FF(b,c,d,a,x[k+7],S14,0xFD469501);a=FF(a,b,c,d,x[k+8],S11,0x698098D8);d=FF(d,a,b,c,x[k+9],S12,0x8B44F7AF);c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);a=FF(a,b,c,d,x[k+12],S11,0x6B901122);d=FF(d,a,b,c,x[k+13],S12,0xFD987193);c=FF(c,d,a,b,x[k+14],S13,0xA679438E);b=FF(b,c,d,a,x[k+15],S14,0x49B40821);a=GG(a,b,c,d,x[k+1],S21,0xF61E2562);d=GG(d,a,b,c,x[k+6],S22,0xC040B340);c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);b=GG(b,c,d,a,x[k+0],S24,0xE9B6C7AA);a=GG(a,b,c,d,x[k+5],S21,0xD62F105D);d=GG(d,a,b,c,x[k+10],S22,0x2441453);c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);b=GG(b,c,d,a,x[k+4],S24,0xE7D3FBC8);a=GG(a,b,c,d,x[k+9],S21,0x21E1CDE6);d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);c=GG(c,d,a,b,x[k+3],S23,0xF4D50D87);b=GG(b,c,d,a,x[k+8],S24,0x455A14ED);a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);d=GG(d,a,b,c,x[k+2],S22,0xFCEFA3F8);c=GG(c,d,a,b,x[k+7],S23,0x676F02D9);b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);a=HH(a,b,c,d,x[k+5],S31,0xFFFA3942);d=HH(d,a,b,c,x[k+8],S32,0x8771F681);c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);a=HH(a,b,c,d,x[k+1],S31,0xA4BEEA44);d=HH(d,a,b,c,x[k+4],S32,0x4BDECFA9);c=HH(c,d,a,b,x[k+7],S33,0xF6BB4B60);b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);d=HH(d,a,b,c,x[k+0],S32,0xEAA127FA);c=HH(c,d,a,b,x[k+3],S33,0xD4EF3085);b=HH(b,c,d,a,x[k+6],S34,0x4881D05);a=HH(a,b,c,d,x[k+9],S31,0xD9D4D039);d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);b=HH(b,c,d,a,x[k+2],S34,0xC4AC5665);a=II(a,b,c,d,x[k+0],S41,0xF4292244);d=II(d,a,b,c,x[k+7],S42,0x432AFF97);c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);b=II(b,c,d,a,x[k+5],S44,0xFC93A039);a=II(a,b,c,d,x[k+12],S41,0x655B59C3);d=II(d,a,b,c,x[k+3],S42,0x8F0CCC92);c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);b=II(b,c,d,a,x[k+1],S44,0x85845DD1);a=II(a,b,c,d,x[k+8],S41,0x6FA87E4F);d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);c=II(c,d,a,b,x[k+6],S43,0xA3014314);b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);a=II(a,b,c,d,x[k+4],S41,0xF7537E82);d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);c=II(c,d,a,b,x[k+2],S43,0x2AD7D2BB);b=II(b,c,d,a,x[k+9],S44,0xEB86D391);a=AddUnsigned(a,AA);b=AddUnsigned(b,BB);c=AddUnsigned(c,CC);d=AddUnsigned(d,DD);}var temp=WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
  return temp.toLowerCase()
}

function SHA1(msg){
  function rotate_left(n,s){var t4=(n<<s)|(n>>>(32-s));return t4;};
  function lsb_hex(val){var str='';var i;var vh;var vl;for(i=0;i<=6;i+=2){vh=(val>>>(i*4+4))&0x0f;vl=(val>>>(i*4))&0x0f;str+=vh.toString(16)+vl.toString(16);}return str;};
  function cvt_hex(val){var str='';var i;var v;for(i=7;i>=0;i--){v=(val>>>(i*4))&0x0f;str+=v.toString(16);}return str;};
  var blockstart;var i,j;var W=new Array(80);var H0=0x67452301;var H1=0xEFCDAB89;var H2=0x98BADCFE;var H3=0x10325476;var H4=0xC3D2E1F0;var A,B,C,D,E;var temp;msg=Utf8Encode(msg);var msg_len=msg.length;var word_array=new Array();for(i=0;i<msg_len-3;i+=4){j=msg.charCodeAt(i)<<24|msg.charCodeAt(i+1)<<16|msg.charCodeAt(i+2)<<8|msg.charCodeAt(i+3);word_array.push(j);}switch(msg_len % 4){case 0:i=0x080000000;break;case 1:i=msg.charCodeAt(msg_len-1)<<24|0x0800000;break;case 2:i=msg.charCodeAt(msg_len-2)<<24|msg.charCodeAt(msg_len-1)<<16|0x08000;break;case 3:i=msg.charCodeAt(msg_len-3)<<24|msg.charCodeAt(msg_len-2)<<16|msg.charCodeAt(msg_len-1)<<8|0x80;break;}word_array.push(i);while((word_array.length % 16)!=14)word_array.push(0);word_array.push(msg_len>>>29);word_array.push((msg_len<<3)&0x0ffffffff);for(blockstart=0;blockstart<word_array.length;blockstart+=16){for(i=0;i<16;i++)W[i]=word_array[blockstart+i];for(i=16;i<=79;i++)W[i]=rotate_left(W[i-3]^W[i-8]^W[i-14]^W[i-16],1);A=H0;B=H1;C=H2;D=H3;E=H4;for(i=0;i<=19;i++){temp=(rotate_left(A,5)+((B&C)|(~B&D))+E+W[i]+0x5A827999)&0x0ffffffff;E=D;D=C;C=rotate_left(B,30);B=A;A=temp;}for(i=20;i<=39;i++){temp=(rotate_left(A,5)+(B^C^D)+E+W[i]+0x6ED9EBA1)&0x0ffffffff;E=D;D=C;C=rotate_left(B,30);B=A;A=temp;}for(i=40;i<=59;i++){temp=(rotate_left(A,5)+((B&C)|(B&D)|(C&D))+E+W[i]+0x8F1BBCDC)&0x0ffffffff;E=D;D=C;C=rotate_left(B,30);B=A;A=temp;}for(i=60;i<=79;i++){temp=(rotate_left(A,5)+(B^C^D)+E+W[i]+0xCA62C1D6)&0x0ffffffff;E=D;D=C;C=rotate_left(B,30);B=A;A=temp;}H0=(H0+A)&0x0ffffffff;H1=(H1+B)&0x0ffffffff;H2=(H2+C)&0x0ffffffff;H3=(H3+D)&0x0ffffffff;H4=(H4+E)&0x0ffffffff;}var temp=cvt_hex(H0)+cvt_hex(H1)+cvt_hex(H2)+cvt_hex(H3)+cvt_hex(H4);
  return temp.toLowerCase()
}

function sha256(ascii) {
  function rightRotate(value, amount) {
      return (value>>>amount) | (value<<(32 - amount));
  };  
  var mathPow = Math.pow;
  var maxWord = mathPow(2, 32);
  var lengthProperty = 'length'
  var i, j; 
  var result = '';
  var words = [];
  var asciiBitLength = ascii[lengthProperty]*8;
  var hash = sha256.h = sha256.h || [];
  var k = sha256.k = sha256.k || [];
  var primeCounter = k[lengthProperty];
  var isComposite = {};
  for (var candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
      k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
    }
  }  
  ascii += '\x80' // Append Ƈ' bit (plus zero padding)
  while (ascii[lengthProperty]%64 - 56) ascii += '\x00' // More zero padding
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j>>8) return; // ASCII check: only accept characters in range 0-255
    words[i>>2] |= j << ((3 - i)%4)*8;
  }
  words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
  words[words[lengthProperty]] = (asciiBitLength)
  
  for (j = 0; j < words[lengthProperty];) {
    var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
    var oldHash = hash;
    hash = hash.slice(0, 8);
      
    for (i = 0; i < 64; i++) {
      var i2 = i + j;
      var w15 = w[i - 15], w2 = w[i - 2];
      var a = hash[0], e = hash[4];
      var temp1 = hash[7]
          + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
          + ((e&hash[5])^((~e)&hash[6])) // ch
          + k[i]
          + (w[i] = (i < 16) ? w[i] : (
                  w[i - 16]
                  + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) // s0
                  + w[i - 7]
                  + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) // s1
              )|0
          );
      var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) + ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2]));
      hash = [(temp1 + temp2)|0].concat(hash);
      hash[4] = (hash[4] + temp1)|0;
    }      
    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i])|0;
    }
  }  
  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      var b = (hash[i]>>(j*8))&255;
      result += ((b < 16) ? 0 : '') + b.toString(16);
    }
  }
  return result;
};