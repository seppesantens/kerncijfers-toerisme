// Creating map options
var mapOptions = {
	center: [51.03, 3.10],
	zoom: 9,
	zoomControl: false,
	dragging: false,
	touchZoom: false,
	doubleClickZoom: false,
	scrollWheelZoom: false,
	keyboard: false
}

// Creating a map object
var map = L.map('map', mapOptions); 

var tiles = new L.TileLayer('https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'data <a href="https://corporate.westtoer.be/nl/kenniscentrum">Kenniscentrum Westtoer</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

tiles.addTo(map);

var geojson;

function style(feature) {
    return {
			weight: 2,
			opacity: 1,
			color: feature.properties.kleur,
			fillOpacity: 0.3
    };
}

function style_lsovl(feature) {
    return {
			weight: 1.75,
			opacity: 1,
			color: feature.properties.kleur,
			fillColor: '#808080',
			fillOpacity: 0.2
    };
}

function highlightFeature(e) {
    var layer = e.target;
    //$('.information').html(info.update(layer.feature.properties));

    layer.setStyle({
			weight: 3,
			fillOpacity: 0.8
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
    ;
}

function resetHighlight(e) {
    kerncijfers.resetStyle(e.target);
    //$('.information').html(info.update());  
}

function updateInfo(e){
    var layer = e.target;
    $('.information').html(info.update(layer.feature.properties));	
}

function onEachFeature(feature, layer) {
    layer.on({
				mouseover: highlightFeature,
        mouseout: resetHighlight,
				click: updateInfo
    });
}

const r1 = fetch('kerncijfers_2020.geojson')
	.then(r1 => r1.json())
	.then(r1 => {
		kerncijfers = L.geoJson(r1,{
			style: style,
			onEachFeature: onEachFeature
		}).addTo(map);
	})
	
const r2 = fetch('leiestreek_oost-vlaanderen.geojson')
	.then(r2 => r2.json())
	.then(r2 => {
		leiestreek_ovl = L.geoJson(r2,{
			style: style_lsovl
		}).addTo(map);
	})

var info = L.control();

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    var info = '<strong>' + props.naam_regio + '</strong><br />' 
			+	'<table>'
			+ '<td align="right">' + props.aantal_bedden + '</td><td>bedden</td><td></td></tr>'
			+ '<tr><td align="right">' + props.aantal_verblijfstoeristen + '</td><td>miljoen</td><td>verblijfstoeristen</td></tr>'
			+ '<tr><td align="right">' + props.aantal_overnachtingen + '</td><td>miljoen</td><td>overnachtingen</td></tr>'
			+ '<tr><td align="right">' + props.aantal_dagtoeristen + '</td><td>miljoen</td><td>dagtoeristen</td></tr>'
			+ '<tr><td align="right">' + props.besteed + '</td><td>' + props.besteed_eenheid + '</td><td>euro besteed</td></tr>'
			+ '</table><br />'
		
		if (props.link_trendrapport){
			info = info + '<a href="' + props.link_trendrapport + '" target="_blank">link naar trendrapport</a><br /><a href="' + props.link_flyer + '" target="_blank">link naar flyer</a>';
		}
		
		return (props ?
			info
			: '');
};
