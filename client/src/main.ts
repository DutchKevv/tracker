import './main.scss';
import * as $ from 'jquery';
import Map from 'ol/Map';
import View from 'ol/View';
// import Source from 'ol/Source';
import { Style, Icon, Circle, Fill, Stroke } from 'ol/style';
import { OSM } from 'ol/source.js';
import { Tile, Vector } from 'ol/layer.js';
import Feature from 'ol/Feature';
import * as proj from 'ol/proj';
import { Point } from 'ol/geom.js';
import { fromLonLat } from 'ol/proj.js';
// import * as ol from 'ol';
// import Point from 'ol/Point';
import * as _ from 'lodash';
// import 'popper.js';
// import 'bootstrap';

console.log('sd22f', proj['Projection'], proj['Projection'].fromLonLat);
// window['ol'] = ol;

const TEMPLATE_USER_ROW = _.template(document.querySelector('#userRowTemplate').innerHTML);
const HOST_URL = location.origin;
const COLORS = ['red', 'yellow', 'purple', 'brown', 'orange', 'grey', 'green', 'blue', 'gold'];

//'136.144.181.63';

var sourceFeatures = new Vector(),
    layerFeatures = new Vector({ source: sourceFeatures });

var long_string = 'a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text ';

var style1 = [
    new Style({
        image: new Icon(({
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
    new Style({
        image: new Circle({
            radius: 5,
            fill: new Fill({
                color: 'rgba(255,255,255,1)'
            }),
            stroke: new Stroke({
                color: 'rgba(0,0,0,1)'
            })
        })
    })
]

class App {

    public users = [];
    public map: any;
    
    private _mapFeatures = new Vector();
    private _sourceFeatures = new Vector({ source: this._mapFeatures });

    async init(): Promise<void> {
        this.users = await this._loadUsers();
        this._loadMap();

        $('#buildUrlModal form').submit(event => {
            const form$ = $('#buildUrlModal form');
            const URL = `${HOST_URL}/r/?n=${form$.find('[name="name"]').val()}&u=${form$.find('[name="url"]').val()}`;

            $('#formBuildUrlOutput').text(URL);

            return false;
        })
    }

    /**
     * 
     * @param user 
     * @param lat 
     * @param long 
     */
    public addMarker(user, lat, long): void {
        const feature = new Feature({
            type: 'click',
            desc: long_string,
            geometry: new Point(fromLonLat([long, lat]))
        });
    
        feature.setStyle(new Style({
            image: new Icon(/** @type {module:ol/style/Icon~Options} */({
                color: user.color,
                crossOrigin: 'anonymous',
                src: 'img/dot.png'
            }))
        }));
    
        this._sourceFeatures.addFeature(feature);
    }

    /**
     * 
     */
    private async _loadUsers(): Promise<void> {
        // users
        const users = await $.get('/user');

        this.users = users.map((user, index) => {
            const lastEvent = user.events[user.events.length - 1];
            const lastLocation = lastEvent.location || {};

            return Object.assign(user, {
                name: user.name || '???',
                lastVisit: new Date(lastEvent.time).toLocaleString('nl-NL') || '???',
                lastUrl: lastEvent.url || '???',
                lastDevice: `${lastEvent.device.browser || '???'} / ${lastEvent.device.model || '???'} / ${lastEvent.device.os || '???'} / ${lastEvent.device.platform || '???'}`,
                lastCity: lastLocation.city || '???',
                color: COLORS[index] || 'black'
            });
        })

        let HTML = '';
        this.users.forEach(user => HTML += TEMPLATE_USER_ROW(user));
        document.querySelector('#users').innerHTML = HTML;
    }

    /**
     * 
     */
    private async _loadMap(): Promise<void> {
        this.map = new Map({
            target: 'map',
            layers: [
                new Tile({
                    source: new OSM()
                }),
                layerFeatures
            ],
            view: new View({
                center: fromLonLat([4.895168, 52.370216]),
                zoom: 8
            })
        });

        this.users.forEach(user => {
            user.events.forEach(event => {
                if (event.location)
                    this.addMarker(user, event.location.lat, event.location.long);
            });
        });
    }
}

$(document).ready(() => {
    const app = window['app'] = new App;
    app.init();
});