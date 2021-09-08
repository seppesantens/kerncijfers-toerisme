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

const response = fetch('kerncijfers.geojson')
	.then(response => response.json())
	.then(response => {
		kerncijfers = L.geoJson(response,{
			style: style,
			onEachFeature: onEachFeature,
		}).addTo(map);
	})

var info = L.control();

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    var info = '<strong>' + props.naam_regio + '</strong><br />' 
			+	'<table>'
			+ '<tr><td></td><td align="right">' + props.aantal_bedden + '</td><td>bedden</td></tr>'
			+ '<tr><td align="right">' + props.aantal_verblijfstoeristen + '</td><td align="right">miljoen</td><td>verblijfstoeristen</td></tr>'
			+ '<tr><td align="right">' + props.aantal_overnachtingen + '</td><td align="right">miljoen</td><td>overnachtingen</td></tr>'
			+ '<tr><td align="right">' + props.aantal_dagtoeristen + '</td><td align="right">miljoen</td><td>dagtoeristen</td></tr>'
			+ '<tr><td align="right">' + props.besteed + '</td><td align="right">' + props.besteed_eenheid + '</td><td>euro besteed</td></tr>'
			+ '</table><br />'
		
		if (props.link_trendrapport){
			info = info + '<a href="' + props.link_trendrapport + '" target="_blank">link naar trendrapport</a>';
		}
		
		return (props ?
			info
			: '');
};
