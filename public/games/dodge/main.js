var canvas, gl;
var entities = [];
var player;
var arena;
var keyMap = {};
var mouseMap = {};
var debug = {
	colissionFrame:true,
	colission:true,
	gui:true,
	update:true,
	firstPerson:true,
	clearbg:true
};

canvas = document.getElementById("canvas");

var FPSelement = document.getElementById("FPS");
function displayFPS(fps){
	FPSelement.innerHTML = fps;
}

window.onload = function(){
	p.draw = draw;
	p.perspective(p.radians(110),p.width/p.height,0.01,200);
	gl = canvas.getContext("webgl");
	//gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	//gl.enable(gl.BLEND);
		//p.textSize(64);
	p.colorMode(p.HSB);
	
	// Player init
	entities.push(player = new Player());
	player.dimensions.set(0.7,0.7,1.7);
	player.position.z = player.dimensions.z/2;
	player.head = 0.5;
	
	// Arena init
	entities.push(arena = new Arena());
	arena.dimensions.set(20,20,1.5);
}

function draw(){
	var ct = p.millis();
	p.delta = ct - p.prevtime;
	if(debug.update)
	for(var k in entities){
		var e = entities[k];
		e.update(p.delta);
	}
	
	if(debug.clearbg)p.background(128);
	
	if(debug.firstPerson)
		player.lookThrough();
	else {
		p.translate(p.width/2,p.height/2,0);
		p.scale(64);
	}
	
	debugDraw();
	
	for(var k in entities){
		var e = entities[k];
		p.pushMatrix();
		p.translate(e.position.x, e.position.y, e.position.z);
		p.rotateZ(-e.azimuth);
		p.rotateX(e.altitude);
		e.draw();
		p.popMatrix();
	}
	
	if(debug.gui)gui();
	p.pdmouseX = p.dmouseX;
	p.pdmouseY = p.dmouseY;
	p.dmouseX = 0;
	p.dmouseY = 0;
	p.prevtime = ct;
}

function gui(){
	displayFPS(Math.round(p.__frameRate));
}
function debugDraw(){
	// Draw test box
	p.pushMatrix();
	p.translate(0,8,2);
	p.stroke((p.millis()/100)%256,255,255);
	p.fill(255,0.5);
	p.box(4);
	p.popMatrix();
	p.fill(255,1);
	p.line(0,0,0,0,8,0);
	
	// Draw player pointer;
	p.pushMatrix();
	var tmv = player.forward.get();
	tmv.add(player.position);
	p.translate(tmv.x, tmv.y, tmv.z+player.head);
	p.sphere(0.25);
	p.popMatrix();
	
	if(debug.colissionFrame){
		p.stroke(0);
		p.noFill();
		for(var e in entities){
			var d = entities[e].dimensions;
			if(d.x && d.y && d.z){
				var po = entities[e].position;
				p.pushMatrix();
				p.translate(po.x,po.y,po.z);
				p.box(d.x, d.y, d.z);
				p.popMatrix();
			}
		}
	}
}

var p = new Processing(canvas,function(p){
	window.PVector = p.PVector;
	p.dmouseX = 0;
	p.dmouseY = 0;
	p.pdmouseX = 0;
	p.pdmouseY = 0;
	p.setup = function(){
		p.size(window.innerWidth,window.innerHeight, p.P3D);
		
		EasyLock.listenTo(canvas,function(x,y){
			p.dmouseX += x;
			p.dmouseY += y;
		});
		p.prevtime = p.millis();
		p.delta = 0;
		//setTimeout(setup,10);
	}
	function processKeys(pressed){
		if(p.key.code === p.CODED)keyMap[p.keyCode]=pressed;
		else keyMap[p.key.toString().toLowerCase()]= pressed;
	}
	p.keyPressed = function(){
		processKeys(true);}
	p.keyReleased = function(){
		processKeys(false);}
	p.draw = function(){
		//Placeholder draw because of structuring
	};
	p.mousePressed = function(){
		mouseMap[p.mouseButton]=true;
	}
	
	p.mouseReleased = function(){
		mouseMap[p.mouseButton]=false;
	}
});