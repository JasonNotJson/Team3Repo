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
};

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
