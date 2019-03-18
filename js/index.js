let polop;
//polop.play();

start_offset = 1

const canvas = document.getElementById('canvas');
const points = document.getElementById('points');
const ctx = canvas.getContext('2d');
const nxButton = document.getElementById("nxButton")

let start_time = Date.now()/1000
let a = [[0.1,1]]
const b = [[1.982,2.53],[3.8,4],[4.5,5.047],[5.5,5.7],[6,6.2],[6.337,6.574],[6.774,7.002],[7.199,7.403],[7.616,7.801],[8.012,8.16],[8.379,8.611],[8.795,9.19],[9.595,10.022],[10.366,10.826],[11.194,11.604],[12.348,12.594],[12.876,13.044],[13.328,13.492],[13.74,15.345],[15.647,16.064],[16.292,16.54],[16.764,16.946],[17.184,17.684],[17.845,17.909],[18.055,18.668],[18.876,19.358],[19.658,19.926],[20.134,20.215],[20.348,20.417],[20.623,21.55],[21.843,21.988],[22.245,22.69],[23.05,23.211],[23.513,23.663],[23.99,24.501],[24.693,24.772],[24.925,25.433],[25.638,25.902],[26.134,26.211],[26.374,26.462],[26.634,26.733],[27.01,27.133],[27.443,28.626]]
a = a.concat(b)
const a_to_draw = [...a]

for(v of a){
	v[0] += start_offset
	v[1] += start_offset
}
const saved_a = [...a]

let last_time_okay = 0
let last_time_fail = 0
const h_win = 10
const w_win = 400
const window_length = 4
const time_to_get_okay = 0.2
let score = 0
let is_okay = undefined

function init(){
  points.innerHTML="Score : 0"
  score = 0
  last_time_okay = 0
  last_time_fail = 0
  a = [...saved_a]
  start_time = Date.now()/1000
  polop.pause()
  polop.currentTime = 0
  setTimeout(function(){ polop.play(); }, start_offset*1000);
}

let window_begin = 0
let space = 'up'

let sound = 'muted'

function fail(){
  if(Math.abs(Date.now()/1000 - last_time_okay) > 0.2){
		polop.muted = true
    bonus = -100 - Math.floor(Math.random() * Math.floor(20));
    score += bonus
  	points.innerHTML = "Score : " + score + " (" + bonus + ")"
    is_okay = false
  }
}
function success(k){
	if(k)
  	a.splice(k,1)
	polop.muted = false
  bonus = 100 + Math.floor(Math.random() * Math.floor(20));
  score += bonus
  points.innerHTML = "Score : " + score + " (+" + bonus + ")" 
  is_okay = true
}

function update(){
	window_begin = -window_length/2 + Date.now()/1000-start_time
  for(v of a){
  	cur_t = Date.now()/1000-start_time
  	delta_deb_a = cur_t-v[0]
  	delta_end_a = cur_t-v[1]
    if((v[0] != last_time_fail && v[0] != last_time_okay) && delta_deb_a > time_to_get_okay && delta_deb_a < time_to_get_okay+0.05){
    	fail()
      last_time_fail = v[0]
    }else if((v[1] != last_time_fail && v[1] != last_time_okay) && delta_end_a > time_to_get_okay && delta_end_a < time_to_get_okay+0.1){
      last_time_fail = v[1]
    	fail()
    }
  }
}

function draw(){
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, w_win+4, h_win*2);

  for(v of a_to_draw){
    t = [0, v[1]-v[0]]
    offset = v[0]
    deb = w_win*((t[0] - window_begin)/window_length)
    end = w_win*((t[1] - window_begin)/window_length)
    deb += offset*w_win/window_length
    end += offset*w_win/window_length
    if(deb > w_win)
    	continue
    if(deb < 0){
    	deb = 0
    }
    if(end > w_win){
    	end = w_win
    }
  	ctx.fillStyle = 'white';
    ctx.fillRect(deb, h_win/2, end-deb, h_win);
    if(is_okay === undefined)
  	  ctx.fillStyle = 'grey';
    else if(is_okay)
  	  ctx.fillStyle = '#5A5';
    else if(!is_okay)
  	  ctx.fillStyle = '#F55';
    ctx.fillRect(w_win/2-h_win, 2, h_win, (h_win-2)*2);
  }
}

function mainLoop() {
    update();
    draw();
    if(started)
		  requestAnimationFrame(mainLoop);
}
 
// Start things off
// requestAnimationFrame(mainLoop);

function checkIfKeyUpOkay(){
  if(!started)return
	first_down = true
	current_time = Date.now()/1000 - start_time
	for(k in a){
  	v = a[k]
  	t=v[1]
    if(last_time_okay != t && Math.abs(t-current_time) < time_to_get_okay){
    	success(k)
      last_time_okay = t
    }else if(last_time_okay == t && Math.abs(t-current_time)){
    	fail()
    }
  }
}

first_down = true
function checkIfKeyDownOkay(){
  if(!started)return
	if(first_down){
  	first_down = false
  }else{
  	return
  }
	current_time = Date.now()/1000 - start_time
	for(k in a){
  	v = a[k]
  	t=v[0]
    if(last_time_okay != t && Math.abs(t-current_time) < time_to_get_okay){
    	success()
      last_time_okay = t
    }else if(last_time_okay == t && Math.abs(t-current_time)){
    	fail()
    }
  }
}

let started = false;
document.body.onkeyup = function(e){
    if(e.keyCode == 78 || e.keyCode == 88){
        checkForStart()
        checkIfKeyUpOkay()
    }
}
document.body.onkeydown = function(e){
    if(e.keyCode == 78 || e.keyCode == 88){
        checkForStart()
        checkIfKeyDownOkay()
    }
}

function checkForStart(){
  if(!started){
    tuto = document.getElementById("tuto")
    tuto.innerHTML = 'Rendez vous au <a style="color:black;text-decoration:none;font-weight:bold;" href="https://linkcs.fr/event/62">Direct 3A en amphi Michelin à 20h30<a/> !'
    start_time = Date.now()/1000
    polop = new Audio('http://shared.nicolasfley.fr/total_polop.mp3');
    polop.onended = () => {
        started = false;
        let text = score > 5000 ? "Bravo" : "Déso"
        points.innerHTML = text + ", tu as fait " + score + " points.<br>N'oublie pas de venir en amphi Michelin pour le direct 3A le 20 mars à 22h !"
    }
    setTimeout(function(){ polop.play(); }, start_offset*1000);
    requestAnimationFrame(mainLoop);
  }
  started = true
}

if( /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/.test(navigator.userAgent) ) {
  nxButton.className = "mobileButton";
  nxButton.addEventListener("touchstart", checkIfKeyDownOkay, false);
  nxButton.addEventListener("touchend", checkIfKeyUpOkay, false);
  // nxButton.addEventListener("touchstart", () => points.innerHTML="down", false);
  // nxButton.addEventListener("touchend", () => points.innerHTML="up", false);
}else{
  nxButton.addEventListener("mousedown", checkIfKeyDownOkay);
  nxButton.addEventListener("mouseup", checkIfKeyUpOkay);
}