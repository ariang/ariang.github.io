$.getJSON('https://matthiasbaldauf.com/swi1hs19/tools', function(data) {
	$.each(data, function(id, article) {
		var card =
			'<div class="card animated bounceInRight slow" style="width: 20rem;"><div class="card-body d-flex flex-column">';
		var bald = 'https://matthiasbaldauf.com/swi1hs19/';
		var img = '<img class="card-img-top" src="' + bald + article.img + '" alt="Wrench">';
		var title = '<h5 class= "card-title">' + article['label-de'] + ' / ' + article['label-en'] + '</h5 >';
		var price = '<p class="card-text price">' + 'Preis: CHF ' + article['price-chf'] + '0' + '</p>';
		if (article.stock !== 0) {
			var cart =
				'<div class="input-group mb-3 mt-auto"><input type="text" value="0" class="form-control"><button class="btn cartbtn btn-primary"  value="' +
				article.id +
				'">In den Warenkorb <i class="fas fa-cart-plus"></i></button>';
		} else {
			var cart =
				'<div class="input-group mb-3 mt-auto"><input type="text" value="0" class="form-control" disabled><button class="btn cartbtn btn-primary"  value="' +
				article.id +
				'" disabled>In den Warenkorb <i class="fas fa-cart-plus"></i></button>';
		}
		if (article.stock !== 0) {
			var info =
				'<button type="button" class="btn btn-secondary info" data-toggle="popover" data-trigger="focus" title="Mehr Infos" data-content="Es sind zurzeit ' +
				article.stock +
				' Stück vorhanden"><i class="fas fa-info-circle"></i></button> </div>';
		} else {
			var info =
				'<button type="button" class="btn btn-danger info" data-toggle="popover" data-trigger="focus" title="Mehr Infos" data-content="Zurzeit nich an Lager"><i class="fas fa-info-circle"></i></button> </div>';
		}

		$('.items').append(card + img + title + price + cart + info);
	});
	//stock popover
	$(function() {
		$('[data-toggle="popover"]').popover();
	});
	$('.popover-dismiss').popover({
		trigger: 'focus'
	});
});
//Projekte einholen
$.getJSON('https://matthiasbaldauf.com/swi1hs19/projects', function(data) {
	$.each(data, function(id, project) {
		$('.projects').append('<option value="' + project.id + '">' + project.label + '</option>');
	});
});
var lat = '47.4226744';
var long = '9.3675076';
$(document).ready(function() {
	//search function
	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.watchPosition(showPosition);
		} else {
			x.innerHTML = 'Geolocation is not supported by this browser.';
		}
	}

	function showPosition(position) {
		var lat = position.coords.latitude;
		var long = position.coords.longitude;
	}
	getLocation();
	$('#myInput').on('keyup', function() {
		var value = $(this).val().toLowerCase();
		$('.items .card').filter(function() {
			$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
		});
	});
	//date-picker
	$('.datepicker-here').datepicker({
		autoClose: true,
		language: 'de',
		minDate: new Date() // Now can select only dates, which goes after today
	});
	var mymap = L.map('mapid').setView([ lat, long ], 16);
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		attribution:
			'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		maxZoom: 18,
		id: 'mapbox.streets',
		accessToken: 'pk.eyJ1IjoiYXJpYW50aGVncmVhdCIsImEiOiJjazNhZjFmbDkwYnBlM2RxdGRneGh3NjE4In0.cMC_NpD8q2Mx36ck6CsGUg'
	}).addTo(mymap);
	//var marker = L.marker([ 51.5, -0.09 ]).addTo(mymap);
});
