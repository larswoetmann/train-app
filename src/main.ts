import { getDistance } from 'geolib';
import { Root } from './model';

const maaloevStation = { longitude: 12.318323, latitude: 55.747485, id: "8600709", name: "Måløv Station" };
const oesterportStation = { longitude: 12.587784, latitude: 55.692498, id: "8600650", name: "Østerport Station" };
const skovlundeStation = { longitude: 12.403532, latitude: 55.722765, id: "8600707", name: "Skovlunde Station" };


// function geoFindMe() {
//   const status = document.getElementById("status")!;
//   status.textContent = "";

//   function success(position: GeolocationPosition) {
//     const latitude = position.coords.latitude;
//     const longitude = position.coords.longitude;
//     const distance = getDistance({ latitude: latitude, longitude: longitude }, maaloevStationCoordinates);
//     status.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °, Speed: ${position.coords.speed} m/s, Accuracy: ${position.coords.accuracy} m, Distance to station: ${distance} m`;

//   }

//   function error() {
//     status.textContent = "Unable to retrieve your location";
//   }

//   if (!navigator.geolocation) {
//     status.textContent = "Geolocation is not supported by your browser";
//   } else {
//     status.textContent = "Locating…";

//     const options = {
//       enableHighAccuracy: true,
//       maximumAge: 30000,
//       timeout: 27000,
//     };

//     navigator.geolocation.watchPosition(success, error, options);
//   }
// }

//document.getElementById("find-me")!.addEventListener("click", geoFindMe);

navigator.geolocation.watchPosition((position) => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  var { closestStationName, closestDistance } = getClosestStation(latitude, longitude);

  const status = document.getElementById("status")!;
  status.textContent = `Closest station: ${closestStationName} (${closestDistance} m), Speed: ${position.coords.speed} m/s`;
  console.log(position);

}, (error) => {
  const status = document.getElementById("status")!;
  status.textContent = "Unable to retrieve your location";
  console.log(error);
}, {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 27000,
});


navigator.geolocation.getCurrentPosition((position) => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  var { closestStation } = getClosestStation(latitude, longitude);
  getDepartures(closestStation);

}, (error) => {
  const countdown = document.getElementById("countdown")!;
  countdown.textContent = "Unable to retrieve your location";
  console.log(error);
});

var selectedJourneyDetailRef: string;
var globalTimer: number | undefined;

function getClosestStation(latitude: number, longitude: number) {
  const distanceToMaaloev = getDistance({ latitude: latitude, longitude: longitude }, maaloevStation);
  const distanceToOesterport = getDistance({ latitude: latitude, longitude: longitude }, oesterportStation);
  const distanceToSkovlunde = getDistance({ latitude: latitude, longitude: longitude }, skovlundeStation);

  //find the closest station
  var closestStation = maaloevStation.id;
  var closestStationName = maaloevStation.name;
  var closestDistance = distanceToMaaloev;
  if (distanceToOesterport < closestDistance) {
    closestStation = oesterportStation.id;
    closestStationName = oesterportStation.name;
    closestDistance = distanceToOesterport;
  }
  if (distanceToSkovlunde < closestDistance) {
    closestStation = skovlundeStation.id;
    closestStationName = skovlundeStation.name;
    closestDistance = distanceToSkovlunde;
  }
  return { closestStationName, closestDistance, closestStation };
}

function getDepartures(closestStation: string) {
  fetch(`https://www.rejseplanen.dk/api/departureBoard?accessId=5f2f5f78-f98b-4c63-bb69-c1a3b8757f77&aid=&requestId=&format=json&jsonpCallback=&lang=da&id=${closestStation}&extId=&date=&time=&dur=&duration=60&maxJourneys=8&products=&operators=&categories=&lines=C&attributes=&platforms=&passlist=false&passlistMaxStops=&minDur=&baim=false&rtMode=SERVER_DEFAULT&type=DEP&`)
    .then(response => response.json())
    .then((data: Root) => {
      const departures = data.Departure;
      const ul = document.getElementById("departures")!;
      ul.innerHTML = "";
      departures.forEach(departure => {
        if (departure.directionFlag === "1") {
          const li = document.createElement("li");
          li.textContent = `${departure.time} ${departure.name} ${departure.direction}`;
          li.attributes.setNamedItem(document.createAttribute("data"));
          li.attributes.getNamedItem("data")!.value = departure.JourneyDetailRef.ref;
          ul.appendChild(li);
        }
      });
    });
}

//call a function when a departures li element is clicked
document.getElementById("departures")!.addEventListener("click", function (event) {
  const target = event.target as HTMLElement;

  //remove color of all li element
  const ul = document.getElementById("departures")!;
  ul.childNodes.forEach(node => {
    (node as HTMLElement).style.backgroundColor = "";
  });

  if (globalTimer) {
    clearInterval(globalTimer);
  }

  //check if target is a li element
  if (target.tagName !== "LI") {
    selectedJourneyDetailRef = "";

    //remove timer text
    const countdown = document.getElementById("countdown")!;
    countdown.textContent = "";

    return;
  }

  selectedJourneyDetailRef = target.attributes.getNamedItem("data")!.value;
  //update color of selected li element
  target.style.backgroundColor = "green";

  //show countdown timer for selected departur time
  const departureTime = target.textContent!.split(" ")[0];
  const departureDate = new Date();
  const departureTimeParts = departureTime.split(":");
  departureDate.setHours(parseInt(departureTimeParts[0]));
  departureDate.setMinutes(parseInt(departureTimeParts[1]));
  departureDate.setSeconds(0);
  const countdown = document.getElementById("countdown")!;
  countdown.textContent = "";

  globalTimer = setInterval(function () {
    const now = new Date();
    const diff = departureDate.getTime() - now.getTime();
    if (diff <= 0) {
      clearInterval(globalTimer);
      countdown.textContent = "Departure time";
      return;
    }
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    countdown.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
    , 1000);

});
