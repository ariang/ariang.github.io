var actualprice;
var cartlist;
var search = false;
var tools = 'http://matthiasbaldauf.com/swi1hs19/tools';
var detools = tools + '/label-de/';
var entools = tools + '/label-en/';
var lang = 0;
var lat;
var long;
var from;
var to;

//einholen der Tools
function getTools() {
	//wenn search auf true dann wird die URL geändert auf De (0) oder En (1)
	if (search == true) {
		if (lang == 0) {
			tools = detools;
			$('.items').empty();
		} else {
			tools = entools;
			$('.items').empty();
		}
	}
	$.getJSON(tools, function(data) {
		if (search == true) {
			var reload =
				'<div class="d-flex justify-content-center"><a href="index.html" class="btn btn-secondary">Zurück</a></div>';
			$('.reload').append(reload);
		}
		$.each(data, function(id, article) {
			var card =
				'<div class="card col-9 col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-6 animated fadeIn"><div class="card-body d-flex flex-column align-items-center">';
			var bald = 'http://matthiasbaldauf.com/swi1hs19/';
			var img = '<img class="card-img-top border" src="' + bald + article.img + '" alt="Wrench">';
			var title =
				'<h5 class= "card-title pt-3" lang="de"><b>' +
				article['label-de'] +
				'</b></h5><h5 class= "card-title pt-3" lang="en"><b>' +
				article['label-en'] +
				'</b></h5>';
			var price =
				'<p class="card-text price">' + 'Preis pro Tag: <b> CHF ' + article['price-chf'] + '0' + '</b></p>';
			//Prüfung ob Artikel vorhanden ist
			if (article.stock !== 0) {
				var cart =
					'<div class="input-group mb-3 mt-auto"><input type="number" id="qty" min="1" value="" class="form-control" required="true"><button class="btn cartbtn ml-1 mr-1 btn-primary" value="' +
					article.id +
					'"><i class="fas fa-cart-plus"></i></button>';
				var info =
					'<button type="button" class="btn btn-secondary info" data-toggle="popover" data-trigger="focus" title="Lagerbestand" data-content="Es sind zurzeit ' +
					article.stock +
					' Stück vorhanden"><i class="fas fa-info-circle"></i></button></div>';
			} else {
				var cart =
					'<div class="input-group mb-3 mt-auto"><input type="text" value="" class="form-control" disabled><button class="btn cartbtn ml-1 mr-1 btn-primary"  value="' +
					article.id +
					'" disabled> <i class="fas fa-cart-plus"></i></button>';
				var info =
					'<button type="button" class="btn btn-danger info" data-toggle="popover" data-trigger="focus" title="Lagerbestand" data-content="Zurzeit nicht an Lager"><i class="fas fa-info-circle"></i></button></div></div>';
			}

			$('.items').append(card + img + title + price + cart + info);

			//Nur Sprache anzeigen die aktiv ist
			if (lang == 0) {
				deutsch();
			} else {
				english();
			}
		});

		//Seitenanzahl mittels jPages Library
		$('div.holder').jPages({
			containerID: 'itemContainer',
			perPage: 8,
			startPage: 1,
			startRange: 1,
			midRange: 5,
			endRange: 1
		});
		//stock popover
		$(function() {
			$('[data-toggle="popover"]').popover();
		});
		$('.popover-dismiss').popover({
			trigger: 'focus'
		});

		//speichern in localstorage
		$('.cartbtn').click(function() {
			var item = data.find((art) => art.id === $(this).val());
			if ($(this).prev().val() == '') {
				return;
			}
			item.quantity = $(this).prev().val();
			cartlist = localStorage.getItem('warenkorb');
			cartlist = JSON.parse(cartlist);
			if (cartlist == null || jQuery.isEmptyObject(cartlist) || cartlist == '{}') {
				cartlist = {};
				cartlist[item.id] = item;
				localStorage.setItem('warenkorb', JSON.stringify(cartlist));
			} else {
				Object.keys(cartlist).forEach(function(key) {
					if (key == item.id) {
						cartlist[key].quantity = item.quantity;
					} else {
						cartlist[item.id] = item;
					}
				});
				localStorage.setItem('warenkorb', JSON.stringify(cartlist));
			}
			updateCart();
			//Anzahl wert wieder auf 0 setzen
			$(this).prev().val('');
		});
	});
}
//Beim ersten Laden die Sprache auf deutsch einstellen
deutsch();

//Funktion um Warenkorb vom Localstorage zu holen
function getCartlist() {
	var list = localStorage.getItem('warenkorb');
	if (list == '' || list == '{}' || list == null) {
		localStorage.setItem('warenkorb', '{}');
		return JSON.parse('{}');
	} else {
		return JSON.parse(list);
	}
}

//Item in Cart legen
function updateCart() {
	cartlist = getCartlist();
	$('.cartlist').empty();
	var exchange;
	actualprice = 0;
	if (cartlist !== null && !jQuery.isEmptyObject(cartlist)) {
		$.getJSON('https://api.exchangeratesapi.io/latest?base=CHF', function(data) {
			$('.pulpfiction').hide();
			$('.carttable').show();
			var exchange = data.rates.EUR;
			Object.values(cartlist).forEach(function(item) {
				var eur = item['price-chf'] * exchange;
				var cartitem =
					'<tr class="animated fadeInUp"><th scope="row" id="' +
					item.id +
					'">' +
					item['label-de'] +
					'<td>' +
					item.quantity +
					'</td><td> ' +
					//Ein Stück CHF und EURO
					new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'CHF' }).format(item['price-chf']) +
					' / ' +
					new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(eur) +
					'</td><td>' +
					//Total für das Stück CHF und EURO
					new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'CHF' }).format(
						item.quantity * item['price-chf']
					) +
					' / ' +
					new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(item.quantity * eur) +
					'</td><td><button title="Diesen Artikel löschen" id="deleteItem" class="btn btn-sm btn-light deleteItem" type="button" value="' +
					item.id +
					'"><i class="fas fa-trash-alt"></i></button></li></td></tr>';
				$('.cartlist').append(cartitem);
			});
			$('.cartlist').append(
				'<tr><td></td><td><th scope="row">Total:</td><td><b>' +
					//Total CHF UND EUR
					new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'CHF' }).format(actualprice) +
					' / ' +
					new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
						actualprice * exchange
					) +
					'</b></td><td></td>'
			);
		});
	} else {
		$('.carttable').hide();
		$('.pulpfiction').show();
	}
	totalValue();
}
//Projekte einholen
$.getJSON('https://matthiasbaldauf.com/swi1hs19/projects', function(data) {
	$.each(data, function(id, project) {
		$('.projects').append('<option value="' + project.id + '">' + project.label + '</option>');
	});
});

//Post methode
$('#reservationsForm').on('submit', function(event) {
	event.preventDefault();
	var formData = $('#reservationsForm').serialize();
	cartlist = getCartlist();
	$.each(cartlist, function(id, item) {
		formData += '&' + item.id + '=' + item.quantity;
	});
	if (jQuery.isEmptyObject(cartlist)) {
		$('#Warenkorbinhalte').collapse('show');
		$('#ReservationsInfos').collapse('hide');
		return alert('Es muss mind. ein Werkzeug im Warenkorb sein');
	}
	$.ajax('http://matthiasbaldauf.com/swi1hs19/reservation', {
		type: 'POST',
		dataType: 'json',
		data: formData + cartlist,
		ContentType: 'application/json',
		success: function(data) {
			//Warenkorb zu machen
			$('#Warenkorbinhalte').collapse('hide');

			//User in Localstorage einfügen
			localStorage.setItem(
				'User',
				'{"firstname":"' +
					$('#inputFirstname').val() +
					'","lastname":"' +
					$('#inputLastname').val() +
					'","email":"' +
					$('#inputEmail').val() +
					'"}'
			);
			//show Map
			$('.hidden').show();

			//Toast mit Success-Antowrt
			$('.toast-body').text(data.message);
			$('.toast-body').addClass('text-success');

			//Map Inhalte setzen und anzeigen
			lat = data.pickup.latitude;
			long = data.pickup.longitude;
			var mymap = L.map('mapid').setView([ lat, long ], 16);
			mymap.invalidateSize();
			L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
				attribution:
					'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
				maxZoom: 18,
				id: 'mapbox.streets',
				accessToken:
					'pk.eyJ1IjoiYXJpYW50aGVncmVhdCIsImEiOiJjazNhZjFmbDkwYnBlM2RxdGRneGh3NjE4In0.cMC_NpD8q2Mx36ck6CsGUg'
			}).addTo(mymap);
			var marker = L.marker([ lat, long ]).addTo(mymap);
			marker.bindPopup('<b>Abholungsort</b></br>Sie können Ihre Werkzeuge hier abholen.', { maxWidth: 'none' });
			marker.openPopup();

			//Form entfernen
			$('#reservationsForm').remove();

			topFunction();
			$('.toast').show();
			$('.toast').toast('show');
			localStorage.removeItem('warenkorb');
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			var error = JSON.parse(XMLHttpRequest.responseText);
			$('.pulpfiction').hide();
			alert(error.message);
		}
	});
});
//Einzelnes Item aus Cart löschen
$(document).on('click', '#deleteItem', function() {
	cartlist = getCartlist();
	var item = $(this).val();
	Object.keys(cartlist).forEach(function(key) {
		if (key == item) {
			delete cartlist[key];
			localStorage.setItem('warenkorb', JSON.stringify(cartlist));
		}
	});
	updateCart();
	totalValue();
});
//SearchFunktion
$(document).on('click', '#searchBtn', function() {
	var value = $('#search').val().toLowerCase();
	if (!value) {
		return;
	}
	search = true;
	if (lang == 0) {
		detools = detools + value;
	} else {
		entools = entools + value;
	}

	getTools();
	detools = 'http://matthiasbaldauf.com/swi1hs19/tools/label-de/';
	/*$('.items .card').filter(function() {
		$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
	});*/
});
$(document).on('click', '#cart', function() {
	updateCart();
});
//langauge changer
$('#lang-menu').on({
	mouseenter: function() {
		$(this).addClass('cls-border-lang');
		$(this).children().eq(0).addClass('cls-borderbottom-lang');
		$('#lang-menu ul').stop().slideToggle(100);
	},
	mouseleave: function() {
		$(this).removeClass('cls-border-lang');
		$(this).children().eq(0).removeClass('cls-borderbottom-lang');
		$('#lang-menu ul').stop().slideToggle(100);
	}
});

//click languages
$('#lang-menu ul li').on('click', function() {
	//select lang and apply changes
	$lang = $(this).text();
	if ($lang.includes('DE')) {
		$lang = '<span class="flag-icon flag-icon-de"></span>' + $lang;
		deutsch();
	} else {
		$lang = '<span class="flag-icon flag-icon-gb"></span>' + $lang;
		english();
	}
	$('#lang-menu div').html($lang);
});
//aktueller Preis
function getActualPrice() {
	actualprice = 0;
	cartlist = getCartlist();
	if (cartlist !== null) {
		Object.values(cartlist).forEach(function(item) {
			actualprice += item.quantity * item['price-chf'];
		});
	}
}

//kostenRechner
function totalValue() {
	getActualPrice();
	var actualDays = to - from + 1;
	var totalValue = actualprice * actualDays;
	var tagTage;
	if (actualDays == 1) {
		tagTage = 'Tag';
	} else {
		tagTage = 'Tage';
	}
	totalValue = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'CHF' }).format(totalValue);
	var totalPrice = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'CHF' }).format(`${actualprice}`);
	if (from !== undefined && to !== undefined && actualprice !== 0) {
		$('#totalValue').html(
			'Totaler Betrag für den angegebenen Zeitraum = Preis für Werkzeuge: <b>' +
				totalPrice +
				'</b> * <b>' +
				actualDays +
				' ' +
				tagTage +
				'</b> : <u><b>' +
				totalValue
		);
		$('#totalValue').addClass('animated bounceInleft');
		$('.total').show();
	} else {
		$('.total').hide();
	}
}

//date-picker
$('.datepicker-here.from').datepicker({
	autoClose: true,
	language: 'de',
	minDate: new Date(), // Now can select only dates, which goes after today
	onSelect: function(fd, d, picker) {
		// Do nothing if selection was cleared
		if (!d) return;
		var datepicker = $('.datepicker-here.to').datepicker().data('datepicker');
		from = d.getTime() / (1000 * 3600 * 24);
		datepicker.update('minDate', new Date(d));
		totalValue();
		$('#toDate').prop('disabled', false);
	}
});
if (!from) {
	$('#toDate').prop('disabled', true);
}
$('.datepicker-here.to').datepicker({
	autoClose: true,
	language: 'de',
	onSelect: function(fd, d, picker) {
		// Do nothing if selection was cleared
		if (!d) return;
		var datepicker = $('.datepicker-here.from').datepicker().data('datepicker');
		datepicker.update('maxDate', new Date(d));

		to = d.getTime() / (1000 * 3600 * 24);
		totalValue();
	}
});
//Ganzen Warenkorb löschen
$('#deletecart').click(function() {
	localStorage.setItem('warenkorb', '');
	updateCart();
	totalValue();
});

//Wenn Dokument geladen ist folgendes ausführen
$(document).ready(function() {
	getTools();
	//Toast+Total verstecken um keine html Elemente zu stören
	$('.toast').hide();
	$('.total').hide();
	// Map verstecken beim laden
	$('.hidden').hide();
	//ZurückNachOben Button am Anfang nicht anzeigen
	$('#topBtn').css('display', 'none');

	//UserInfos einholen von Localstorage
	var user = localStorage.getItem('User');
	user = JSON.parse(user);
	if (user !== undefined) {
		$('#inputFirstname').val(user.firstname);
		$('#inputLastname').val(user.lastname);
		$('#inputEmail').val(user.email);
	}
	//Warenkorb aktualisieren
	$('.show').ready(function() {
		updateCart();
	});
});

// Zurück nach oben button
$('#topBtn').click(function() {
	topFunction();
});

function deutsch() {
	$('[lang=en]').hide();
	$('[lang=de]').show();
	lang = 0;
}
function english() {
	$('[lang=de]').hide();
	$('[lang=en]').show();
	lang = 1;
}

//Zurück nach oben
function topFunction() {
	window.scrollTo({ top: 0, behavior: 'smooth' }); // For Chrome, Firefox, IE and Opera
}
window.onscroll = function() {
	scrollFunction();
};

function scrollFunction() {
	if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
		$('#topBtn').css('display', 'block');
		$('#topBtn').addClass('animated bounceInRight');
	} else {
		$('#topBtn').css('display', 'none');
	}
}
