// Detect request animation frame

window.addEventListener('scroll', function() {
	console.log("Scrollin'");
});

var scroll = function(callback) {
	window.setTimeout(callback, 1000 / 60);
};
var elementsToShow = document.querySelectorAll('.show-on-scroll');

function loop() {
	elementsToShow.forEach(function(element) {
		if (isElementInViewport(element)) {
			element.classList.add('is-visible');
		} else {
			element.classList.remove('is-visible');
		}
	});

	scroll(loop);
}
// Call the loop for the first time
loop();

function isElementInViewport(el) {
	// special bonus for those using jQuery
	if (typeof jQuery === 'function' && el instanceof jQuery) {
		el = el[0];
	}
	var rect = el.getBoundingClientRect();
	return (
		(rect.top <= 0 && rect.bottom >= 0) ||
		(rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.top <= (window.innerHeight || document.documentElement.clientHeight)) ||
		(rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight))
	);
}

//Get the button:
mybutton = document.getElementById('myBtn');

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {
	scrollFunction();
};

function scrollFunction() {
	if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
		mybutton.style.display = 'block';
	} else {
		mybutton.style.display = 'none';
	}
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
	document.body.scrollTop = 0; // For Safari
	document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
