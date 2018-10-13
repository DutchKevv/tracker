const TEMPLATE_USER_ROW = _.template(document.querySelector('#userRowTemplate').innerHTML);
const HOST_URL = location.origin;
const COLORS = ['red', 'yellow', 'purple', 'brown', 'orange', 'grey', 'green', 'blue', 'gold']

//'136.144.181.63';

var sourceFeatures = new ol.source.Vector(),
    layerFeatures = new ol.layer.Vector({ source: sourceFeatures });

var long_string = 'a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text ';

var style1 = [
    new ol.style.Style({
        image: new ol.style.Icon(({
            scale: 0.7,
            rotateWithView: false,
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            opacity: 1,
            src: '//raw.githubusercontent.com/jonataswalker/map-utils/master/images/marker.png'
        })),
        zIndex: 5
    }),
    new ol.style.Style({
        image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({
                color: 'rgba(255,255,255,1)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0,0,0,1)'
            })
        })
    })
]

$(document).ready(() => {
    loadUsers().then(users => {
        loadMap(users);
    });

    $('#buildUrlModal form').submit(event => {
        const form$ = $('#buildUrlModal form');
        const URL = `${HOST_URL}/r/?n=${form$.find('[name="name"]').val()}&u=${form$.find('[name="url"]').val()}`;

        $('#formBuildUrlOutput').text(URL);

        return false;
    })
});

async function loadUsers() {
    // users
    const users = await $.get('/user');

    const usersNormalized = users.map((user, index) => {
        const lastEvent = user.events[user.events.length - 1];
        const lastLocation = lastEvent.location || {};

        return Object.assign({}, user, {
            name: user.name || '???',
            lastVisit: new Date(lastEvent.time).toLocaleString('nl-NL') || '???',
            lastUrl: lastEvent.url || '???',
            lastDevice: `${lastEvent.device.browser || '???'} / ${lastEvent.device.model || '???'} / ${lastEvent.device.os || '???'} / ${lastEvent.device.platform || '???'}`,
            lastCity: lastLocation.city || '???',
            color: COLORS[index] || 'black'
        });
    })

    let HTML = '';
    usersNormalized.forEach((user, index) => HTML += TEMPLATE_USER_ROW(user));

    document.querySelector('#users').innerHTML = HTML;

    return usersNormalized;
}

async function loadMap(users) {
    const map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }),
            layerFeatures
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([4.895168, 52.370216]),
            zoom: 8
        })
    });

    users.forEach(user => {
        user.events.forEach(event => {
            if (event.location) {
                add_map_point(user, event.location.lat, event.location.long);
            }

        });
    });
}

function add_map_point(user, lat, lng) {
    const feature = new ol.Feature({
        type: 'click',
        desc: long_string,
        geometry: new ol.geom.Point(ol.proj.fromLonLat([lng, lat]))
    });

    feature.setStyle(new ol.style.Style({
        image: new ol.style.Icon(/** @type {module:ol/style/Icon~Options} */({
            color: user.color,
            crossOrigin: 'anonymous',
            src: 'img/dot.png'
        }))
    }));

    sourceFeatures.addFeature(feature);


    // var vectorLayer = new ol.layer.Vector({
    //     source: new ol.source.Vector({
    //         features: [new ol.Feature({
    //             geometry: new ol.geom.Point(ol.proj.transform([parseFloat(lng), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857')),
    //         })]
    //     }),
    //     style: new ol.style.Style({
    //         image: new ol.style.Icon({
    //             anchor: [0.5, 0.5],
    //             anchorXUnits: "fraction",
    //             anchorYUnits: "fraction",
    //             src: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg"
    //         }),
    //         // text: new ol.style.Text({
    //         //     text: 'Hello',
    //         //     scale: 1.3,
    //         //     fill: new ol.style.Fill({
    //         //         color: '#000000'
    //         //     }),
    //         //     stroke: new ol.style.Stroke({
    //         //         color: '#FFFF99',
    //         //         width: 3.5
    //         //     })
    //         // })
    //     })
    // });
    // map.addLayer(vectorLayer);

    // // Vienna marker
    // var marker = new ol.Overlay({
    //     position: [parseFloat(lng), parseFloat(lat)],
    //     positioning: 'center-center',
    //     element: document.getElementById('marker'),
    //     stopEvent: false
    // });
    // map.addOverlay(marker);
}