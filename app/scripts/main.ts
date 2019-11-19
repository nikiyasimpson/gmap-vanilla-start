/// <reference types="@types/markerclustererplus" />

import { loadMapScript } from "./mapscript";
// import { RegisterSW } from "./sw-reg";
import * as clickListeners from "./clickListeners";
import { FunWithMaps } from "./map";
import {} from "google-maps";

// RegisterSW();
clickListeners.loadAllDrawingButtons();
clickListeners.listenersForControlButtons();

let map: google.maps.Map;

if (window["google"] && window["google"]["maps"]) {
  initMap();
} else {
  loadMapScript("geometry,drawing,visualization,places", (event: Event) => {
    initMap();
  });
}

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    /**
     * Add your map options here
     *
     * https://developers-dot-devsite-v2-prod.appspot.com/maps/documentation/javascript/reference/map#MapOptions
     */
     backgroundColor: "white",
     draggable: true,
     mapTypeControl: true,
     streetViewControl: true,
     zoomControl: true,

  });
  FunWithMaps(map);
}
