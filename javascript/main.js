// All elements should be placed within this function
//This function will initially load all datasets and properties of the map

//window.onload = init();
//function init() {
// Map creation
const view = new ol.View({
  center: ol.proj.fromLonLat([-16.225, 14.662]),
  zoom: 15,
  minZoom: 8,
});

const map = new ol.Map({
  target: "map",
  view: view,
});

//Layers Imports outside the Map element
// I- BASEMAPS IMPORT
// 1) OSM standard basemap
const osmStandard = new ol.layer.Tile({
  source: new ol.source.OSM(),
  attributions: [
    '<b>&copy; autors - <a href ="http://www.openstreetmap.org/copyright">OpenStreetMap</a></b>',
  ],
  type: "base", //basemap layer for layerSwitcher
  visible: false,
  title: "OSM standard",
});

// 2) OSM Humanitarian basemap
const osmHumanitarian = new ol.layer.Tile({
  source: new ol.source.OSM({
    url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
  }),
  type: "base",
  visible: true,
  title: "OSM Humanitaire",
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
});

// 3) ESRI
const ESRIimagery = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }),
  type: "base",
  visible: false,
  title: "Imagerie ESRI",
});

// 4) Bingmaps
const bingmaps = new ol.layer.Tile({
  source: new ol.source.BingMaps({
    // We need a key to get the layer from the provider.
    // Sign in with Bing Maps and you will get your key (for free)
    key: "AvsKyH0qVUWx9QRT1EsuMU68CgpCXD1M1XmeCMynzmyCILkgXF5-iLRJgxLmPMUV",
    imagerySet: "Road", // or 'Road', 'Aerial', AerialWithLabels', etc.
    // use maxZoom 19 to see stretched tiles instead of the Bing Maps
    // "no photos at this zoom level" tiles
    maxZoom: 19,
  }),
  visible: false,
  preload: Infinity,
  title: "Bingmaps",
});

// Basemap layers Group 1
const basemapGroup = new ol.layer.Group({
  title: "Fonds de cartes",
  fold: "open",
  type: "base",
  layers: [osmHumanitarian, osmStandard, ESRIimagery, bingmaps],
});
map.addLayer(basemapGroup);

// II- VECTOR LAYERS IMPORT
// 1) Bati
const Bati = new ol.layer.VectorImage({
  source: new ol.source.Vector({
    defaultProjection: "EPSG:4326",
    url: "asset/bati_wgs84.geojson",
    format: new ol.format.GeoJSON(),
  }),
  visible: true,
  title: "Batiments",
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: "rgb(211,211,211)",
    }),
    stroke: new ol.style.Stroke({
      color: "rgb(211,211,211)",
      width: 0.5,
    }),
  }),
});

// 2) Zones Inondables
// const ZonesInondables = new ol.layer.Image({
//   source: new ol.layer.Image({
//     extent: [
//       -16.2379679119999984, 14.6510942320000002, -16.2146388080000001,
//       14.6738059560000007,
//     ],
//     defaultProjection: "EPSG:4326",
//     url: "asset/ZI100ans_DIOURBEL_wgs84.tif",
//   }),
//   visible: true,
//   title: "Zones inondables",
// });

// 2)https://gis.stackexchange.com/questions/433139/adding-raster-tiff-image-directly-on-the-map-using-openlayers-without-using-geos
// const ZonesInondables = new ol.layer.Image({
//   source: new ol.source.ImageStatic({
//     url: "asset/ZI100ans_DIOURBEL_wgs84.tif",
//     imageExtent: [
//       -16.2379679119999984, 14.6510942320000002, -16.2146388080000001,
//       14.6738059560000007,
//     ],
//     visible: true,
//     name: "Zones inondables",
//     imageLoadFunction: function (image, src) {
//       var xhr = new XMLHttpRequest();
//       xhr.responseType = "arraybuffer";
//       xhr.open("GET", src);
//       xhr.onload = function (e) {
//         var tiff = new Tiff({ buffer: xhr.response });
//         var canvas = tiff.toCanvas();
//         image.getImage().src = canvas.toDataURL();
//       };
//       xhr.send();
//     },
//   }),
// });

// Geotiff with ol ext of Viglino
// const ZonesInondables = new ol.layer.GeoImage({
//   name: "Zones inondables",
//   opacity: 1,
//   source: new ol.source.GeoImage({
//     url: "asset/ZI100ans_DIOURBEL_webMercator.tif",
//     projection: "EPSG:3857",
//     imageExtent: [
//       -16.2379679119999984, 14.6510942320000002, -16.2146388080000001,
//       14.6738059560000007,
//     ],
//     imageCenter: [-16.225, 14.662],
//     imageScale: [1, 1],
//     //imageMask: [[273137.343,6242443.14],[273137.343,6245428.14],[276392.157,6245428.14],[276392.157,6242443.14],[273137.343,6242443.14]],
//     imageRotate: Number((30 * Math.PI) / 180),
//   }),
// });

//Zones inondables vectorised
// Chloropleth style for Countries - Colorbrewer scheme for colors
getStyle = function (feature, resolution) {
  if (feature.get("Type") == "Risque faible") {
    //
    return new ol.style.Style({
      fill: new ol.style.Fill({
        color: "rgb(254,240,217)", //  yellow
      }),
      stroke: new ol.style.Stroke({
        color: "rgb(254,240,217)",
        width: 1,
      }),
    });
  } else if (feature.get("Type") == "Risque modèré") {
    //
    return new ol.style.Style({
      fill: new ol.style.Fill({
        color: "rgb(252,141,89)", //  orange
      }),
      stroke: new ol.style.Stroke({
        color: "rgb(252,141,89)",
        width: 1,
      }),
    });
  } else if (feature.get("Type") == "Risque fort") {
    //
    return new ol.style.Style({
      fill: new ol.style.Fill({
        color: "rgb(215,48,31)", //  red
      }),
      stroke: new ol.style.Stroke({
        color: "rgb(215,48,31)",
        width: 1,
      }),
    });
  }
};

const zonesinondables = new ol.layer.VectorImage({
  source: new ol.source.Vector({
    url: "asset/ZonesInondables.geojson",
    format: new ol.format.GeoJSON(),
  }),
  visible: true,
  title: "Zones inondables",
  style: function (feature, resolution) {
    return getStyle(feature, resolution);
  },
});

// vector layers Group 2
const vectorLayers = new ol.layer.Group({
  title: "Couches spatiales",
  fold: "open",
  layers: [zonesinondables, Bati],
});
map.addLayer(vectorLayers);

// POPUP - Virgino

//  var map = new ol.Map({
//    target: "map",
//    view: new ol.View({
//      center: [274770, 6243929],
//      zoom: 3,
//    }),
//    layers: [new ol.layer.Geoportail("GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2")],
//  });
// var vectorSource = new ol.source.Vector({
//   url: "asset/ne_110m_admin_0_countries.geojson",
//   format: new ol.format.GeoJSON(),
// });

// map.addLayer(
//   new ol.layer.Vector({
//     name: "Countries",
//     source: vectorSource,
//   })
// );

// Select interaction
var select = new ol.interaction.Select({
  hitTolerance: 1,
  multi: true,
  condition: ol.events.condition.singleClick,
});
map.addInteraction(select);

var popup = new ol.Overlay.PopupFeature({
  popupClass: "default anim",
  select: select,
  canFix: true,
  template: function (f) {
    // Test feature
    return {
      // title: function (f) {
      //   return f.get("NAME_LONG") + " (" + f.get("SOV_A3") + ")";
      // },
      // [CONTINENT, SUBREGION, POP_EST, POP_YEAR] for layer countries, [name] for layer lakes
      attributes: {
        Type: { title: "Risque d'inondation :" },
        batiaffected: { title: "Nombre de batiments en risque en 2023 :" },
        Area_m2: { title: "Superficie du batiment (en m2) :" },
      },
    };
  },
});
map.addOverlay(popup);

// 1) SEARCH BASED ON LAYER'S ATTRIBUTE - Viglino :
// Search based on layer's attribute and nominatim works fine !
// Mais 1 des 2 doit etre commentee pour permettre a l'autre de marcher !
// Control Select - essential for both searchs events
var select = new ol.interaction.Select({});
map.addInteraction(select);

// // Set the control grid reference
// var search = new ol.control.SearchFeature({
//   //target: $(".options").get(0),
//   source: countries.getSource(),
//   property: "NAME_LONG",
// });
// map.addControl(search);
// // Select feature when click on the reference index
// search.on("select", function (e) {
//   select.getFeatures().clear();
//   select.getFeatures().push(e.search);
//   var p = e.search.getGeometry().getFirstCoordinate();
//   map.getView().animate({ center: p, zoom: 3 });
// });

// 2) SEARCH BASED ON NOMINATIM - Viglino
// Current selection - in order to save results of the search in a layer / pas utilisee maintenant
// var sLayer = new ol.layer.Vector({
//   source: new ol.source.Vector(),
//   style: new ol.style.Style({
//     image: new ol.style.Circle({
//       radius: 5,
//       stroke: new ol.style.Stroke({
//         color: "rgb(255,165,0)",
//         width: 3,
//       }),
//       fill: new ol.style.Fill({
//         color: "rgba(255,165,0,.3)",
//       }),
//     }),
//     stroke: new ol.style.Stroke({
//       color: "rgb(255,165,0)",
//       width: 3,
//     }),
//     fill: new ol.style.Fill({
//       color: "rgba(255,165,0,.3)",
//     }),
//   }),
// });
// map.addLayer(sLayer);

// Set the search control - nominatim
var search = new ol.control.SearchNominatim({
  //target: $(".options").get(0),
  polygon: $("#polygon").prop("checked"),
  reverse: true,
  position: true, // Search, with priority to geo position
});
map.addControl(search);

// Select feature when click on the reference index
search.on("select", function (e) {
  // console.log(e);
  // sLayer.getSource().clear();
  // Check if we get a geojson to describe the search
  if (e.search.geojson) {
    var format = new ol.format.GeoJSON();
    var f = format.readFeature(e.search.geojson, {
      dataProjection: "EPSG:4326",
      featureProjection: map.getView().getProjection(),
    });
    // sLayer.getSource().addFeature(f);
    var view = map.getView();
    var resolution = view.getResolutionForExtent(
      f.getGeometry().getExtent(),
      map.getSize()
    );
    var zoom = view.getZoomForResolution(resolution);
    var center = ol.extent.getCenter(f.getGeometry().getExtent());
    // redraw before zoom
    setTimeout(function () {
      view.animate({
        center: center,
        zoom: Math.min(zoom, 7),
      });
    }, 100);
  } else {
    map.getView().animate({
      center: e.coordinate,
      zoom: Math.max(map.getView().getZoom(), 7),
    });
  }
});

// Ol geocoder nominatim extension
// var geocoder = new Geocoder("nominatim", {
//   provider: "osm", //change it here
//   lang: "en-US",
//   placeholder: "Search for ...",
//   targetType: "text-input",
//   limit: 5,
//   keepOpen: true,
// });
// map.addControl(geocoder);
// map.addOverlay(popup);

// // Listen when an address is chosen
// geocoder.on("addresschosen", (evt) => {
//   window.setTimeout(() => {
//     popup.show(evt.coordinate, evt.address.formatted);
//   }, 3000);
// });

// POPUP - Walkermatt third party

// var map = new ol.Map({
//   target: "map",
//   layers: [
//     new ol.layer.Tile({
//       source: new ol.source.OSM(),
//     }),
//   ],
//   view: new ol.View({
//     center: ol.proj.transform([-0.92, 52.96], "EPSG:4326", "EPSG:3857"),
//     zoom: 6,
//   }),
// });

// var popup = new Popup();
// map.addOverlay(popup);

// map.on("singleclick", function (evt) {
//   var prettyCoord = ol.coordinate.toStringHDMS(
//     ol.proj.transform(evt.coordinate, "EPSG:3857", "EPSG:4326"),
//     2
//   );
//   popup.show(
//     evt.coordinate,
//     "<div><h2>Coordinates</h2><p>" +
//       prettyCoord +
//       "</p> + <p> STATE_NAME : </></div>"
//   );
// });

// Layer switcher - Walkermatt third party
const layerSwitcher = new ol.control.LayerSwitcher({
  activationMode: "click",
  tipLabel: "Show layer list", // Optional label for button
  collapseTipLabel: "Hide layer list", // Optional label for button
  groupSelectStyle: "group", // Can be 'children' [default], 'group' or 'none'
  collapsed: false,
  mouseover: true,
});
map.addControl(layerSwitcher);

// Define a new legend - Viglino Control Stat
var legend = new ol.legend.Legend({
  title: "Légende :",
  style: getStyle,
  margin: 3,
  size: [30, 16],
});
map.addControl(
  new ol.control.Legend({
    //collapsible: false,
    collapsed: true,
    legend: legend,
    collapsed: false,
    mouseover: true,
  })
);

// Add empty row to
//legend.addItem();
legend.addItem({
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: "rgba(211,211,211)",
    }),
    stroke: new ol.style.Stroke({
      color: "rgb(211,211,211)",
      width: 0.5,
    }),
  }),
  title: " Batiments ",
  typeGeom: "Polygon",
});
legend.addItem({
  title: " Faible risque d'inondation ",
  properties: { Type: "Risque faible" },
  typeGeom: "Polygon",
});
legend.addItem({
  title: " Risque modèré d'inondation ",
  properties: { Type: "Risque modèré" },
  typeGeom: "Polygon",
});
legend.addItem({
  title: " Fort risque d'inondation ",
  properties: { Type: "Risque fort" },
  typeGeom: "Polygon",
});

//put var legend values into the html div
document.getElementById("legendmap").innerHTML = legend;
//}
