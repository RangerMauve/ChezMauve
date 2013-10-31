function Player(){
	Entity.call(this);
}
Player.prototype = new Entity();
Player.prototype.jumptime = 0;
Player.prototype.jumping = 0;
Player.prototype.update = function(delta){
	var mspeed = 3.0*delta*0.001, // Move 3 meters per second
	lspeed=0.002,
	fspeed = 8.0*delta*0.001,
	jspeed = 6.0*delta*0.001;
	
	// Speed notes:
	// 9.0 m/s sprint speed
	// 6 m/s run speed
	// 3 m/s jogging
	// 1.4 m/s walking
	
	this.changeLook(-p.dmouseX*lspeed,-p.dmouseY*lspeed);
	
	var mo = new PVector();
	
	if(keyMap.w || keyMap.W || keyMap[p.UP])mo.y++;
	if(keyMap.s || keyMap.S || keyMap[p.DOWN])mo.y--;
	if(keyMap.a || keyMap.A || keyMap[p.LEFT])mo.x--;
	if(keyMap.d || keyMap.D || keyMap[p.RIGHT])mo.x++;
	
	mo.normalize();
	mo.mult(mspeed);
	
	if(keyMap[p.SHIFT])mo.mult(3.0);
	
	this.walk(mo.y);
	this.strafe(mo.x);
	
	// Jumping logic
	if(keyMap[" "] && !this.jumping){
		this.jumping = true;
		this.jumptime = 200;
	}
	if(this.jumping){
		if(!keyMap[" "])this.jumptime=0;
		if(this.jumptime){
			this.position.z += jspeed;
			this.jumptime = p.constrain(this.jumptime-delta,0,9999999999);
		} else {
			this.position.z -= fspeed;
		}
		if(this.position.z-this.dimensions.z/2 <= 0){
			this.jumping = false;
		}
	}
}
Player.prototype.head = 0;
Player.prototype.lookThrough = function(){
	var po = this.position;
	var fo = this.forward;
	p.camera(
		po.x,po.y,po.z+this.head,
		po.x+fo.x,po.y+fo.y,po.z+fo.z+this.head,
		0,0,-1);
}
Player.prototype.changeLook = function(azimuth,altitude){
	this.azimuth= this.azimuth+azimuth;
	this.altitude= this.altitude+altitude;
}
Player.prototype.draw = function(){};
Player.prototype.fixed = false;
Player.prototype.solid = true;
Player.prototype.collides = function(other){
	
}