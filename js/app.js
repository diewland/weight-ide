var INDEX   = 0;
var ITEMS   = [];
var WEIGHTS = [];
var START_FLAG = false;

// feedback event
function next(){
  INDEX++;
  if(INDEX < ITEMS.length){
    render();
  }
  else {
    alert('Job done :-)');
    document.querySelector('#word').innerHTML = 'Save result from top-right ↗️';
  }
}
window.addEventListener('keydown', function(e){
  if(!START_FLAG){
    return;
  }
  var code = e.keyCode;
  //console.log(code);
  
  if(code == 37){ // left
    WEIGHTS[INDEX] = '-';
    next();
  }
  else if(code == 40){ // down
    WEIGHTS[INDEX] = '0';
    next();
  }
  else if(code == 39){ // right
    WEIGHTS[INDEX] = '+';
    next();
  }
  //else if(code == 32){ // spacebar
  //  console.log('skip');
  //}
});

// upload file
window.addEventListener('change', function(e){
  var files = e.target.files;
  f = files[0];
  var reader = new FileReader();
  reader.onload = (function(theFile){
    return function(e) {
      INDEX = 0;
      ITEMS = e.target.result.split('\n');
      WEIGHTS = [];
      START_FLAG = true;
      render();
    };
  })(f);
  reader.readAsText(f);
});

// render word
function render(){
  var word = ITEMS[INDEX];
  document.querySelector('#word').innerHTML = word;
}

// save file
document.querySelector('#save').addEventListener('click', function(e){
  var out = '';
  ITEMS.forEach(function(v, i){
    var feedback = WEIGHTS[i];
    out += feedback + "," + v + "\n";
  });
  var blob = new Blob([out], {type: "text/plain;charset=utf-8"});
  saveAs(blob, "out.txt");
});
