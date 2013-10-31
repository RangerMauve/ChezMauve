/*
	Made by RangerMauve (RangerMauve@hotmail.com) May 2013
	Simple wrapper for using the pointerlock feature
	Just use EasyLock.listenTo(element,onmove);
	Where element is the element you want to use as the trigger
	And onmove is a callback that takes (x,y) movement
	You can bind several elements together and the onmoves will
	Be all be triggered once one of the elements is clicked
	All of the onmoves will be removed once the pointer is unlocked
*/
var EasyLock = (function(){
	document.exitPointerLock = document.exitPointerLock ||
			   document.mozExitPointerLock ||
			   document.webkitExitPointerLock;
	document.addEventListener('pointerlockchange', changeCallback, false);
	document.addEventListener('mozpointerlockchange', changeCallback, false);
	document.addEventListener('webkitpointerlockchange', changeCallback, false);
	document.addEventListener("mousemove", moveCallback, false);
	function changeCallback(e){
		var hasnew = false;
		for(var i = 0; i < handlers.length; ++i){
			if(!(handlers[i].triggered)){
				hasnew=true;
				handlers[i].triggered = true;
			}
		}
		if(!hasnew){
			for(var i = 0; i < handlers.length; ++i){
				delete handlers[i].handler.registered
			}
			handlers.splice(0,handlers.length);
		}
	}
	function moveCallback(e){
		//console.log(e);
		var movementX = e.movementX||e.mozMovementX||e.webkitMovementX||0,
		movementY = e.movementY||e.mozMovementY||e.webkitMovementY||0;
		for(var i = 0; i < handlers.length; ++i){
			handlers[i].handler(movementX,movementY);
		}
	}
	var handlers = [];
	var el= {};
	el.handlers = handlers;
	el.listenTo=function(element, onmove){
		element.requestPointerLock = element.requestPointerLock ||
			     element.mozRequestPointerLock ||
			     element.webkitRequestPointerLock;
		element.addEventListener("click",function(e){
			if(onmove.registered)return;
			onmove.registered = true;
			handlers.push({handler:onmove,triggered:false});
			element.requestPointerLock();
		});
	}
	return el;
})();