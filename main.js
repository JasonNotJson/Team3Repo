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
//35.7089403, 139.721231 wasead
//Exercise 3
var mymap;
const start = () => {
  mymap = L.map("map_area").setView([35.7089403, 139.721231], 18);
  const mapLink = '<a href="https://openstreetmap.org">OpenStreetMap</a>';
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map data &copy;" + mapLink,
    maxZoom: 18,
  }).addTo(mymap);
};

const pan = () => {
  mymap.panTo([35.7060497, 139.7173685, 20], { animate: true, duration: 1 });
  // mymap.flyTo([35.7060497, 139.7173685, 20], { animate: true, duration: 1 });
};
