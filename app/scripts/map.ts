/// <reference types="@types/markerclustererplus" />
import {} from "google-maps";
import * as styledMap from "./styledMap";
import { listenForDrawing } from "./drawing";
import { placesSearch } from "./placesSearch";
import { directionCalculator } from "./directions";

import { customGradient } from "./gradient";
import { mapNumber } from "./mapNumber";

let this_map: google.maps.Map;
let london: google.maps.LatLng;
let dark_theme: boolean = true;
let markers: google.maps.Marker[] = [];
let infoWindow: google.maps.InfoWindow;

let masts: string[][];
let mastsVisible: boolean = false;
let markerClusterer: MarkerClusterer;
let clustersVisible: boolean = false;

let heatmap: google.maps.visualization.HeatmapLayer;
let lettings: string[][];

let prevalence: string;
let heatmapVisible: boolean = false;

export function FunWithMaps(map: google.maps.Map) {
  this_map = map;
  london = coords(51.561638, -0.14);
  let darkmap = new google.maps.StyledMapType(
    styledMap.styledMap as google.maps.MapTypeStyle[],
    {
      name: "Dark Map"
    }
  );

  /**
   * Let's look at the Styled Map.
   *
   * Now, why don't you create your own style map,
   * and add it to the options.
   */

  map.setCenter(london);
  map.mapTypes.set("dark_map", darkmap);
  map.setMapTypeId("dark_map");

  const controls: HTMLElement = document.getElementById("controls");

  // Add the legend to the bottom left
  const legend: HTMLElement = document.getElementById("legend");

  // Add the drawing controls to the top right
  const drawingControls: HTMLElement = document.getElementById(
    "drawingControls"
  );

  // Add the link to my side to the bottom right
  const katlink: HTMLElement = document.getElementById("katlink");

  // Add the places search to the top center
  const place_search: HTMLElement = document.getElementById("place-search");

  // Take a look at the documentation
  // https://developers.google.com/maps/documentation/javascript/controls#ControlPositioning
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(controls);
  map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(legend);
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(drawingControls);
  map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(katlink);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(place_search);

  directionCalculator(map);
  placesSearch(map);
  listenForDrawing(map);
  loadAllMarkers(map);
  loadHeatmapData();
  //loadGeoJson(map);
}

function coords(x: number, y: number) {
  return new google.maps.LatLng(x, y);
}

function loadAllMarkers(map: google.maps.Map): void {
  let antenna: google.maps.Icon = {
    url: "assets/img/antennabl.png",
    scaledSize: new google.maps.Size(40, 40)
  };
  fetch("assets/data/masts.json")
    .then(response => {
      return response.json();
    })
    .then((response_masts: { meta: {}; data: string[][] }) => {
      masts = response_masts.data;

      /**
       * These data contain latitude and longitude information
       * about electricity masts.
       * If you look at the data, you will see that
       * the latitude is at position 18, and the longitude is at position 17.
       *
       * In order to create a latitude and longitude object,
       * we would do that, for each one of the array entries/lines:
       *
       * new google.maps.LatLng(
       *     parseFloat(x[18]),
       *     parseFloat(x[17])
       *   )
       *
       *
       * That said, add a marker for each mast on the map,
       * with the antenna icon.
       *
       * Use documentation here:
       *
       * https://developers.google.com/maps/documentation/javascript/markers#add
       */

      masts.map((x: string[]) => {
        let marker = new google.maps.Marker();
        /**
         * Marker contents here
         */

        /**
         * Now, let's create an info window.
         * The data at position 14 of each row tells us the address of the masts.
         * When a user clicks on the marker, we want an info window to pop up
         * displaying only the address of the mast.
         *
         */
        infoWindow = new google.maps.InfoWindow();
        marker.addListener("click", e => {
          /**
           * Info window here
           */
        });
        markers.push(marker);
      });
    })
    .catch(error => {
      console.log(error, "Error loading asset");
    });
}

export function city(city: string) {
  if (city === "lon") {
    this_map.setCenter(coords(51.561638, -0.14));
  }
  if (city === "man") {
    this_map.setCenter(coords(53.52476717517185, -2.5434842249308414));
  }
}

export function changeType() {
  if (!dark_theme) {
    this_map.setMapTypeId("dark_map");
  } else {
    this_map.setMapTypeId("roadmap");
  }
  dark_theme = !dark_theme;
}
export function toggleMasts(): void {
  if (!mastsVisible) {
    markers.map(marker => {
      marker.setMap(this_map);
    });
  } else {
    markers.map(marker => {
      marker.setMap(null);
    });
  }
  mastsVisible = !mastsVisible;
}

export function toggleClusters(): void {
  if (!clustersVisible) {
    markerClusterer = new MarkerClusterer(this_map, markers, {
      imagePath: "assets/img/m"
    });
    markerClusterer.setGridSize(10);
  } else {
    markerClusterer.clearMarkers();
  }
  clustersVisible = !clustersVisible;
}

export function toggleHeatmap(): void {
  if (heatmapVisible) {
    heatmap.setMap(null);
  } else {
    heatmap.setMap(this_map);
  }
  heatmapVisible = !heatmapVisible;
}
export function changeHeatmapRadius(heatmap_radius: number) {
  heatmap.set("radius", heatmap_radius);
}
export function changeCluster(clust_num: number): void {
  clustersVisible = true;
  if (markerClusterer) {
    markerClusterer.clearMarkers();
  }
  markerClusterer = new MarkerClusterer(this_map, markers, {
    imagePath: "assets/img/m"
  });
  markerClusterer.setGridSize(clust_num);
}

function loadHeatmapData() {
  fetch("assets/data/letting.json")
    .then(response => {
      return response.json();
    })

    .then((data: { meta: {}; data: string[][] }) => {
      lettings = data.data;
      let heatmapData: {}[] = [];

      /**
       *
       * Let's look at our data
       * and understand what this function does
       */
      lettings.map((x: string[]) => {
        if (x[24] && x[23]) {
          heatmapData.push({
            location: new google.maps.LatLng(
              parseFloat(x[24]),
              parseFloat(x[23])
            ),
            weight: parseInt(x[15], 10)
          });
        }
      });
      heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData
      });
      heatmap.set("gradient", customGradient);
      heatmap.set("radius", 40);
      heatmap.set("opacity", 1);
    })
    .catch(error => {
      console.log(error);
    });
}
function loadGeoJson(map: google.maps.Map) {
  /**
   * Find the function that loads a GeoJson file in
   * the documentation, and load the file from this path
   *
   * https://developers.google.com/maps/documentation/javascript/datalayer#load_geojson
   *
   * "assets/data/lonely.geojson"
   */

  /**
   * Fix this code so that whenever we mouseover one of the
   * elements, the value is displayed on our page.
   *
   * https://developers.google.com/maps/documentation/javascript/datalayer#change_appearance_dynamically
   */
  /*
  map.data.setStyle((feature: any) => {
    // let lon =
    /**
     * Use the documentation to receive the
     * Prevalence value of each feature.
     * https://developers.google.com/maps/documentation/javascript/datalayer#declarative_style_rules
     *
     *
     * If you do not undestand what the function mapNumber does, read it and ask me!
     
    // let value = 255 - Math.round(mapNumber(lon, 0, 5, 0, 255));
    // let color = "rgb(" + value + "," + value + "," + 0 + ")";
    // return {
    //   fillColor: color,
    //   strokeWeight: 1
    // };
  });
  infoWindow = new google.maps.InfoWindow();
  /**
   * Let's create an info window which will display the prevalence information
   * when a shape/feature is clicked.
  
  map.data.addListener("click", e => {
    /**
     * Info window here
     
  });
  */
}
