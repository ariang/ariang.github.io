// anime({
// 	targets: 'div.box.red',
// 	translateY: [
// 		{ value: 200, duration: 500 },
// 		{ value: 0, duration: 900 }
// 	],
// 	rotate: {
// 		value: '1turn',
// 		easing: 'easeInOutSine'
// 	}

// });

// anime({
// 	targets: 'div.box.blue',
// 	translateY: [
// 		{ value: 200, duration: 500, delay: 1000 },
// 		{ value: 0, duration: 900 }
// 	],
// 	rotate: {
// 		value: '1turn',
// 		easing: 'easeInOutSine',
// 		delay: 1000
// 	}

// });

// anime({
// 	targets: 'div.box.green',
// 	translateY: [
// 		{ value: 200, duration: 500, delay: 2000 },
// 		{ value: 0, duration: 900 }
// 	],
// 	rotate: {
// 		value: '1turn',
// 		easing: 'easeInOutSine',
// 		delay: 2000
// 	}

// });
// anime({
// 	targets: 'div.box.yellow',
// 	translateY: [
// 		{ value: 200, duration: 500, delay: 3000 },
// 		{ value: 0, duration: 900 }
// 	],
// 	rotate: {
// 		value: '1turn',
// 		easing: 'easeInOutSine',
// 		delay: 3000
// 	}

// });

var playPause=anime({
	targets: 'div.box',
	translateY: [
		{ value: 200, duration: 500 },
		{ value: 0, duration: 900 }
	],
	translateX: function (el, i, l) { return i*50 },
	rotate: {
		value: '1turn',
		easing: 'easeInOutSine'
	},
	scale: 1.3,
	delay: function (el, i, l) { return i*1000 },
	autoplay: false,
});

document.querySelector('#playrect').onclick=playPause.play;
document.querySelector('#pauserect').onclick=playPause.pause;
document.querySelector('#restartrect').onclick=playPause.restart;


var objPropLogEl=document.querySelector('.js-object-log');

var myObject={
	Anzahl: 0,
	Prozent: '0%'
}

var prop=anime({
	targets: myObject,
	Anzahl: 1000,
	Prozent: '100%',
	easing: 'linear',
	round: 1,
	update: function () {
		objPropLogEl.innerHTML=JSON.stringify(myObject);
	},
	autoplay: false
});
document.querySelector('#playprop').onclick=prop.play;
document.querySelector('#pauseprop').onclick=prop.pause;
document.querySelector('#restartprop').onclick=prop.restart;


var lineDrawing=anime({
	targets: '.line-drawing-demo .lines path',
	strokeDashoffset: [anime.setDashoffset, 0],
	easing: 'easeInOutSine',
	duration: 1500,
	delay: function (el, i) { return i*250 },
	direction: 'alternate',
	loop: true,
	autoplay: false
});

document.querySelector('#playanim').onclick=lineDrawing.play;
document.querySelector('#pauseanim').onclick=lineDrawing.pause;
document.querySelector('#restartanim').onclick=lineDrawing.restart;

