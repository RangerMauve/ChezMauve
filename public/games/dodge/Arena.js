function Arena(){
	Entity.call(this);
}
Arena.prototype = new Entity();
Arena.prototype.frame = 0;
Arena.prototype.draw = function(){
	var d = this.dimensions;
	if(!(d.x && d.y))return;
	var dim = 0.1;
	var bel = -6.0;
	var num = 10;
	var nsca = 0.3;
	var ncs = (p.PI/d.x)*8;
	p.noiseDetail(4,0.5);
	
	var tm= d.x/2,tmy = d.y/2;;
	
	p.stroke((p.millis()/20)%256,255,255);
	p.fill(255);
	p.pushMatrix();
	p.scale(1,d.y/2,1);
	p.beginShape(p.QUADS);
	for(var i = -tm; i < tm; i+=0.5){
		p.vertex(i-dim,-1,0);
		p.vertex(i+dim,-1,0);
		p.vertex(i+dim,1,0);
		p.vertex(i-dim,1,0);
	}
	p.endShape();
	p.popMatrix();
	
	
	p.beginShape(p.LINES);
	for(var i = -tmy; i < tmy; ++i){
		p.vertex(-tm,i,0.02);
		p.vertex(tm,i,0.02)
	}
	p.endShape();
	
	p.fill((p.millis()/20)%256,255,255);
	p.noStroke();
	p.beginShape(p.QUADS);
	for(var i = num; i; --i){
		p.vertex((p.random()-0.5)*d.x,(p.random()-0.5)*d.y,p.random()*bel);
		p.vertex((p.random()-0.5)*d.x,(p.random()-0.5)*d.y,p.random()*bel);
		p.vertex((p.random()-0.5)*d.x,(p.random()-0.5)*d.y,p.random()*bel);
		p.vertex((p.random()-0.5)*d.x,(p.random()-0.5)*d.y,p.random()*bel);
	}
	p.endShape();
}