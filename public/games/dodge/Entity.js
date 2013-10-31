
function Entity(){
	this.position = new PVector();
	this._forward = new PVector();
	this.forward = null;
	this.dimensions = new PVector();
	this.velocity = new PVector();
	this.acceleration = new PVector();
}
Entity.prototype = {
	position:null,
	dimensions:null,
	velocity:null,
	acceleration:null,
	_forward:null,
	_altitude:0,
	_azimuth:0,
	get altitude(){return this._altitude;},
	set altitude(alt){this._altitude = p.constrain(alt,-p.HALF_PI+0.001,p.HALF_PI-0.001);this.forward= null;},
	get azimuth(){return this._azimuth},
	set azimuth(azi){this._azimuth = azi%p.TWO_PI;this.forward= null;},
	get forward(){
		return this._forward.get();
	},
	set forward(arg){
		var hyp = p.cos(this.altitude);
		this._forward.set(
			hyp*p.sin(this.azimuth),
			hyp*p.cos(this.azimuth),
			p.sin(this.altitude));
	},
	walk:function(distance){
		var f = this.forward;
		f.z = 0;
		f.normalize();
		f.mult(distance);
		this.position.add(f);
	},
	strafe:function(distance){
		var f = new PVector(p.sin(this.azimuth-p.HALF_PI),p.cos(this.azimuth-p.HALF_PI));
		f.normalize();
		f.mult(distance);
		this.position.add(f);
	},
	jump:function(distance){
		this.position.z += distance;
	},
	fly:function(distance){
		var f = this.forward;
		f.mult(distance);
		this.position.add(f);
	},
	fixed:false,
	solid:false,
	colissionType:"BOX",
	collides:function(other){
		return false;
	},
	update:function(delta){/*Don't do shit*/},
	draw:function(){
		/*Default entity render is a box*/
		var f = this.forward;
		f.mult(1);
		p.fill(0);
		p.box(32);
	}
}
