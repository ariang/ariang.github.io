//einholen der Tools
$.getJSON('http://matthiasbaldauf.com/swi1hs19/tools', function (data) {
	$.each(data, function (id, article) {
		var card=
			'<div class="card animated fadeIn"><div class="card-body d-flex flex-column">';
		var bald='http://matthiasbaldauf.com/swi1hs19/';
		var img='<img class="card-img-top" src="'+bald+article.img+'" alt="Wrench">';
		var title='<h5 class= "card-title" lang="de">'+article['label-de']+'</h5><h5 class= "card-title" lang="en">'+article['label-en']+'</h5 >';
		var price='<p class="card-text price">'+'Preis: CHF '+article['price-chf']+'0'+'</p>';

		if (article.stock!==0) {
			//Wenn Artikel Vorhanden ist
			var cart='<div class="input-group mb-3 mt-auto"><input type="number" id="qty" min="1" value="" class="form-control" required="true"><button class="btn cartbtn btn-primary"  value="'+article.id+'"><i class="fas fa-cart-plus"></i></button>';
			var info='<button type="button" class="btn btn-secondary info" data-toggle="popover" data-trigger="focus" title="Lagerbestand" data-content="Es sind zurzeit '+article.stock+' Stück vorhanden"><i class="fas fa-info-circle"></i></button></div>';
		} else {
			var cart='<div class="input-group mb-3 mt-auto"><input type="text" value="" class="form-control" disabled><button class="btn cartbtn btn-primary"  value="'+article.id+'" disabled> <i class="fas fa-cart-plus"></i></button>';
			var info='<button type="button" class="btn btn-danger info" data-toggle="popover" data-trigger="focus" title="Lagerbestand" data-content="Zurzeit nich an Lager"><i class="fas fa-info-circle"></i></button></div>';

		}
		$('.items').append(card+img+title+price+cart+info);

	});
	$("div.holder").jPages({
		containerID: "itemContainer",
		perPage: 8,
		startPage: 1,
		startRange: 1,
		midRange: 5,
		endRange: 1,
		scrollBrowse: true
	});

	//stock popover
	$(function () {
		$('[data-toggle="popover"]').popover();
	});
	$('.popover-dismiss').popover({
		trigger: 'focus'
	});

	//speichern in localstorage
	$('.cartbtn').click(function () {
		var item=data.find((art) => art.id===$(this).val());
		if ($(this).prev().val()=='') {
			return;
		}
		item.quantity=$(this).prev().val();
		var cartlist=localStorage.getItem('warenkorb');
		cartlist=JSON.parse(cartlist);
		if (cartlist==null||jQuery.isEmptyObject(cartlist)) {
			cartlist={};
			cartlist[item.id]=item;
			localStorage.setItem('warenkorb', JSON.stringify(cartlist));
		} else {
			Object.keys(cartlist).forEach(function (key) {
				if (key==item.id) {
					cartlist[key].quantity=item.quantity;
				} else {
					cartlist[item.id]=item;
				}
			});
			localStorage.setItem('warenkorb', JSON.stringify(cartlist));
		}
		updateCart();
		$(this).prev().val('');
	});
	deutsch();
});
var actualprice=0;
//Item in Cart legen
function updateCart() {
	var cartlist=localStorage.getItem('warenkorb');
	//cartlist in JSON Object umwandeln
	cartlist=JSON.parse(cartlist);
	$('.cartlist').empty();
	var exchange;
	actualprice=0;
	$.getJSON('https://api.exchangeratesapi.io/latest?base=CHF', function (data) {
		var exchange=data.rates.EUR;
		Object.values(cartlist).forEach(function (item) {
			var eur=item['price-chf']*exchange;
			actualprice+=item.quantity*item['price-chf'];
			var cartitem='<tr class="animated fadeInUp"><th scope="row" id="'+item.id+'">'+item['label-de']+
				'<td>'+item.quantity+'</td><td> '+
				//Ein Stück CHF und EURO
				new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'CHF' }).format(item['price-chf'])+' / '+new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(eur)+
				'</td><td>'+
				//Total für das Stück CHF und EURO
				new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'CHF' }).format(item.quantity*item['price-chf'])+' / '+new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(item.quantity*eur)+
				'</td><td><button title="Diesen Artikel löschen" id="deleteItem" class="btn btn-sm btn-light deleteItem" type="button" value="'+item.id+'"><i class="fas fa-trash-alt"></i></button></li></td></tr>';
			$('.cartlist').append(cartitem);
		});
		$('.cartlist').append(
			'<tr><td></td><td><th scope="row">Total:</td><td><b>'+
			//Total CHF UND EUR
			new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'CHF' }).format(actualprice)+' / '+new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'CHF' }).format(actualprice*exchange)+
			'</b></td><td></td>'
		);
	});
}
//Projekte einholen
$.getJSON('https://matthiasbaldauf.com/swi1hs19/projects', function (data) {
	$.each(data, function (id, project) {
		$('.projects').append('<option value="'+project.id+'">'+project.label+'</option>');
	});
});
//Post methode
$('#inputForm').on('submit', function (event) {
	event.preventDefault();
	var formData=$('#inputForm').serialize();
	console.log(formData);
	var cartlist=localStorage.getItem('warenkorb');
	cartlist=JSON.parse(cartlist);
	console.log(cartlist);
	$.ajax('http://matthiasbaldauf.com/swi1hs19/reservation', {
		type: 'POST',
		dataType: 'json',
		data: formData+cartlist,
		ContentType: 'application/json',
		success: function (data) {
			//show Map
			$('.hidden').show();
			//Toast mit Success-Antowrt
			$('.toast-body').text(data.message);
			$('.toast-body').addClass('text-success');
			lat=data.pickup.latitude;
			long=data.pickup.longitude;
			var mymap=L.map('mapid').setView([lat, long], 16);
			mymap.invalidateSize();
			L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
				attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
				maxZoom: 18,
				id: 'mapbox.streets',
				accessToken: 'pk.eyJ1IjoiYXJpYW50aGVncmVhdCIsImEiOiJjazNhZjFmbDkwYnBlM2RxdGRneGh3NjE4In0.cMC_NpD8q2Mx36ck6CsGUg'
			}).addTo(mymap);
			var marker=L.marker([lat, long]).addTo(mymap);
			marker.bindPopup('<b>Abholungsort</b></br>Sie können Ihre Werkzeuge hier abholen.', { maxWidth: 'none' });
			marker.openPopup();
			$('#inputForm').remove(); //Remove the form

			topFunction();
			$('.toast').show();
			$('.toast').toast('show');
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			var error=JSON.parse(XMLHttpRequest.responseText);
			alert(error.message);
		}
	});
});
//Einzelnes Item aus Cart löschen
$(document).on('click', '#deleteItem', function () {
	var cartlist=localStorage.getItem('warenkorb');
	cartlist=JSON.parse(cartlist);
	var item=$(this).val();
	Object.keys(cartlist).forEach(function (key) {
		if (key==item) {
			delete cartlist[key];
			localStorage.setItem('warenkorb', JSON.stringify(cartlist));
		}
	});
	updateCart();
});
//Wenn Dokument geladen ist folgendes ausführen
$(document).ready(function () {
	//Toast verstecken um keine html Elemente zu stören
	$('.toast').hide();

	//ZurückNachOben Button am Anfang nicht anzeigen
	$('#topBtn').css('display', 'none');

	//search funktion innerhalb des Dokuments
	$('#search').on('keyup', function () {
		var value=$(this).val().toLowerCase();
		$('.items .card').filter(function () {
			$(this).toggle($(this).text().toLowerCase().indexOf(value)>-1);
		});
	});

	//Ganzen Warenkorb löschen
	$('#deletecart').click(function () {
		localStorage.removeItem('warenkorb');
		updateCart();
	});

	//Warenkorb aktualisieren
	$('.show').ready(function () {
		updateCart();
	});

	//date-picker
	$('.datepicker-here').datepicker({
		autoClose: true,
		language: 'de',
		minDate: new Date() // Now can select only dates, which goes after today
	});

	// Map verstecken beim laden
	$('.hidden').hide();

	//langauge changer
	$('#lang-menu').hover(
		function () {
			$(this).addClass('cls-border-lang');
			$(this).children().eq(0).addClass('cls-borderbottom-lang');
			$('#lang-menu ul').stop().slideToggle(100);
		},
		function () {
			$(this).removeClass('cls-border-lang');
			$(this).children().eq(0).removeClass('cls-borderbottom-lang');
			$('#lang-menu ul').stop().slideToggle(100);
		}
	);

	//click languages
	$('#lang-menu ul li').on('click', function () {
		//select lang and apply changes
		$lang=$(this).text();
		if ($lang.includes('DE')) {
			$lang='<span class="flag-icon flag-icon-de"></span>'+$lang;
			deutsch();
		} else {
			$lang='<span class="flag-icon flag-icon-gb"></span>'+$lang;
			english();
		}
		$('#lang-menu div').html($lang);
	});

	// Zurück nach oben button
	$('#topBtn').click(function () {
		topFunction();
	});
});

function deutsch() {
	$('[lang=en]').hide();
	$('[lang=de]').show();
}
function english() {
	$('[lang=de]').hide();
	$('[lang=en]').show();
}
//Geodatenabfrage
var lat;
var long;

/*
navigator.geolocation.getCurrentPosition(success, error, options);

var options = {
	enableHighAccuracy: true,
	timeout: 5000,
	maximumAge: 0
};

function success(pos) {
	var crd = pos.coords;
	lat = `${crd.latitude}`;
	long = `${crd.longitude}`;
	return lat, long;
}

function error(err) {
	console.warn(`ERROR(${err.code}): ${err.message}`);
}*/

//Zurück nach oben
function topFunction() {
	window.scrollTo({ top: 0, behavior: 'smooth' }); // For Chrome, Firefox, IE and Opera
}
window.onscroll=function () {
	scrollFunction();
};

function scrollFunction() {
	if (document.body.scrollTop>40||document.documentElement.scrollTop>40) {
		$('#topBtn').css('display', 'block');
		$('#topBtn').addClass('animated bounceInRight');
	} else {
		$('#topBtn').css('display', 'none');
	}
}
/* when document is ready */