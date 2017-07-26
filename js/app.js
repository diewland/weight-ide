var INDEX   = 0;
var F_EVT   = null;
var ITEMS   = [];
var WEIGHTS = [];
var START_FLAG = false;
var ROWS_ALL  = 0;
var ROWS_DONE = 0;

// app object(s)
var nav_save   = document.querySelector('.save');
var obj_word   = document.querySelector('.word');
var obj_panel  = document.querySelector('.panel');
var obj_upload = document.querySelector('.upload');
var sts_info  = document.querySelector('.file-info');
var sts_stat   = document.querySelector('.stat');

// feedback event
function next(){
  ROWS_DONE = WEIGHTS.filter(function(v, i){ return v; }).length;
  if(ROWS_DONE < ROWS_ALL){
    // find next index
    for(var i in ITEMS){
      if(!WEIGHTS[i]){
        INDEX = i;
        break;
      }
    }
    // render word
    var word = ITEMS[INDEX];
    obj_word.innerHTML = word;
    // render status
    sts_info.innerHTML = 'Filename: '+ obj_upload.value +' ( '+ F_EVT.total +' bytes )';
    sts_stat.innerHTML = 'Line '+ (INDEX*1+1) +'/'+ ROWS_ALL +' | '+ (ROWS_DONE/ROWS_ALL*100).toFixed(2) +'%'
  }
  else {
    alert('Job done :-)');
    obj_word.innerHTML = 'Save result from top-right ↗️';
  }
}
window.addEventListener('keydown', function(e){
  if(!START_FLAG){
    return;
  }
  var code = e.keyCode;
  if(code == 40){ // down
    WEIGHTS[INDEX] = '-';
    next();
  }
  else if(code == 38){ // up
    WEIGHTS[INDEX] = '+';
    next();
  }
  else if(code == 32){ // space
    WEIGHTS[INDEX] = '0';
    next();
  }
  else if(code == 27){ // esc
    WEIGHTS[INDEX] = '!';
    next();
  }
  else {
    console.log(code);
  }
});

// upload file
function initialize(e){
  INDEX = 0;
  F_EVT = e;
  ITEMS = e.target.result.split('\n');
  WEIGHTS = [];
  START_FLAG = true;
  ROWS_ALL  = ITEMS.length;
  // update ITEMS, WEIGHTS
  for(var i=0; i<ROWS_ALL; i++){
    var v = ITEMS[i];
    if(v.match(/^[+-0!],/)){
      ITEMS[i]   = v.substring(2);
      WEIGHTS[i] = v[0];
    }
  }
}
obj_upload.addEventListener('change', function(e){
  var files = e.target.files;
  f = files[0];
  var reader = new FileReader();
  reader.onload = (function(theFile){
    return function(e) {
      obj_panel.style.display = 'none';
      initialize(e);
      next();
    };
  })(f);
  reader.readAsText(f);
});

// save file
function get_dt() {
  var now     = new Date();
  var year    = now.getFullYear();
  var month   = now.getMonth()+1;
  var day     = now.getDate();
  var hour    = now.getHours();
  var minute  = now.getMinutes();
  var second  = now.getSeconds();
  if(month.toString().length == 1)  { var month = '0'+month; }
  if(day.toString().length == 1)    { var day = '0'+day; }
  if(hour.toString().length == 1)   { var hour = '0'+hour; }
  if(minute.toString().length == 1) { var minute = '0'+minute; }
  if(second.toString().length == 1) { var second = '0'+second; }
  var dateTime = year+month+day+hour+minute+second;
  return dateTime;
}
nav_save.addEventListener('click', function(e){
  var out = [];
  ITEMS.forEach(function(v, i){
    var feedback = WEIGHTS[i];
    if(feedback){
      out.push(feedback + "," + v);
    }
    else {
      out.push(v);
    }
  });
  var blob = new Blob([out.join('\n')], {type: "text/plain;charset=utf-8"});
  saveAs(blob, 'out_'+ get_dt() +'.txt');
});
