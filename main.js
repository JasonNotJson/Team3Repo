console.log("Hello World! Lets make something epic!");

// Exercise 1
// for (i = 1; i < 10; i++) {
//   document.write(i + ": O");
//   for (j = 0; j < i; j++) {
//     document.write("*");
//   }
//   document.write("<br>");
// }

// Exercise 2
// for (i = 1; i <= 10; i++) {
//   document.write(i + ": ");
//   for (j = 1; j <= 10; j++) {
//     if (i == j) {
//       document.write("*");
//     } else {
//       document.write("-");
//     }
//   }
//   document.write("<br>");
// }

//36.209817,139.420683 menuma
//35.7089403, 139.721231 waseda
//35.78610367249648, 139.39959393862824 toko
//Exercise 3
// Pan to Toyama Campus from Waseda Campus
// var mymap;
// const start = () => {
//   mymap = L.map("map_area").setView([35.7089403, 139.721231], 18);
//   const mapLink = '<a href="https://openstreetmap.org">OpenStreetMap</a>';
//   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution: "Map data &copy;" + mapLink,
//     maxZoom: 18,
//   }).addTo(mymap);
// };

// const pan = () => {
//   mymap.panTo([35.7060497, 139.7173685, 20], { animate: true, duration: 1 });
//   // mymap.flyTo([35.7060497, 139.7173685, 20], { animate: true, duration: 1 });
// };

// Exercise 4
// Slowly pan towards tokorozawa campus.
// var mymap;
// var waseda_lat = 35.7089403,
//   waseda_lon = 139.721231;
// var toko_lat = 35.7861036,
//   toko_lon = 139.39959393;
// var lat_now = waseda_lat,
//   lon_now = waseda_lon;
// var lat_diff = (toko_lat - waseda_lat) / 50,
//   lon_diff = (toko_lon - waseda_lon) / 50;
// var iterateID;

// const start = () => {
//   mymap = L.map("map_area").setView([lat_now, lon_now], 15);
//   const mapLink = '<a href="https://openstreetmap.org">OpenStreetMap</a>';
//   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution: "Map data &copy;" + mapLink,
//     maxZoom: 18,
//   }).addTo(mymap);
// };

// const panIntervals = () => {
//   if (
//     Math.abs(lat_now - toko_lat) < 0.0001 &&
//     Math.abs(lon_now - toko_lon) < 0.0001
//   ) {
//     clearInterval(iterateID);
//     alert("ARRIVED!");
//   } else {
//     lat_now += lat_diff;
//     lon_now += lon_diff;
//     mymap.panTo([lat_now, lon_now]);
//   }
// };

// const move = () => {
//   // Does not accelerate
//   if (iterateID) {
//     clearInterval(iterateID);
//   }
//   iterateID = window.setInterval(function () {
//     panIntervals();
//   }, 1000);
// };

//exercise 5

// const latlonList = [
//   [35.709233, 139.72152],
//   [35.710318, 139.717724],
//   [35.708048, 139.720128],
//   [35.709223, 139.72152],
// ];

var polyLine1;
var mymap;
var waseda_lat = 35.7089403,
  waseda_lon = 139.721231;
var toko_lat = 35.7861036,
  toko_lon = 139.39959393;
var lat_now = waseda_lat,
  lon_now = waseda_lon;
var lat_diff = (toko_lat - waseda_lat) / 50,
  lon_diff = (toko_lon - waseda_lon) / 50;
var iterateID;

const start = () => {
  mymap = L.map("map_area").setView([lat_now, lon_now], 15);
  const mapLink = '<a href="https://openstreetmap.org">OpenStreetMap</a>';
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map data &copy;" + mapLink,
    maxZoom: 18,
  }).addTo(mymap);

  // const area = L.polyline(latlonList, {
  //   color: "green",
  //   fillColor: "blue",
  //   fill: true,
  // }).addTo(mymap);

  const circleMarker = L.circle([35.7089403, 139.721231], {
    color: "green",
    fillColor: "#f03",
    fillOpacity: 0.2,
    radius: 100,
  }).addTo(mymap);

  window.setTimeout(function () {
    circleMarker.remove();
  }, 1000);

  const wasedaMarker = L.marker([35.7089403, 139.721231]).addTo(mymap);
  const popupMessage = L.popup().setContent(
    '<img src="https://www.waseda.jp/culture/assets/uploads/2020/04/Zoom_Auditorium02.jpg" width="300" length="190"></img>  '
  );
  wasedaMarker.bindPopup(popupMessage);

  mymap.on("click", onClickFunction);
  mymap.on("mouseout", onMouseOutFunction);
  polyLine1 = L.polyline([], { color: "#008000", weight: 2 }).addTo(mymap);
};

function onClickFunction(e) {
  polyLine1.addLatLng(e.latlng);
  console.log(e.latlng);
}

const panIntervals = () => {
  if (
    Math.abs(lat_now - toko_lat) < 0.0001 &&
    Math.abs(lon_now - toko_lon) < 0.0001
  ) {
    clearInterval(iterateID);
    alert("You made it!");
  } else {
    lat_now += lat_diff;
    lon_now += lon_diff;
    mymap.panTo([lat_now, lon_now]);
  }
};

const move = () => {
  iterateID = window.setInterval(function () {
    panIntervals();
  }, 1000);
};
