import { getDistance } from 'geolib';
import { Departure, Root } from './model';
import { stations, Station, lineEndStations, lines } from './stations';

var selectedJourneyDetailRef: string;
var firstDepartureTime: Date | undefined;
var clockTimer: number | undefined;
var lastPlayedMinute: number | undefined;
var selectedStation: Station | undefined;
var lastKnownPosition: GeolocationPosition | undefined;
const stationSelect = document.getElementById("station-select") as HTMLSelectElement;
const switchDirectionToggle = document.getElementById("switch-direction") as HTMLInputElement;

initializeStationSelect();
initializeSwitchDirectionToggle();

setSelectedStation();
setInterval(() => getDepartures(selectedStation!), 60000);

navigator.geolocation.watchPosition((position) => {
  lastKnownPosition = position;
  updateStatus();
}, (error) => {
  const status = document.getElementById("status")!;
  status.textContent = "Unable to retrieve your location";
  console.log(error);
}, {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 27000,
});

function setSelectedStation() {
  const params = new URLSearchParams(window.location.search);
  const stationIdFromQuery = params.get("stationId");
  if (stationIdFromQuery) {
    const queryStation = stations.find(station => station.id === stationIdFromQuery);
    if (queryStation) {
      console.log("Found station from query:", queryStation);
      selectedStation = queryStation;
      stationSelect.value = queryStation.id;
      updateStatus();
      getDepartures(selectedStation);
      return;
    }

    updateStationIdQuery();
  }

  stationSelect.value = "";

  console.log("No station in query, using geolocation");
 
  if(lastKnownPosition) {
    setStationFromLocation(lastKnownPosition);
    return;
  }

  navigator.geolocation.getCurrentPosition((position) => {
      lastKnownPosition = position;
      setStationFromLocation(position);
    }, (error) => {
      const countdown = document.getElementById("countdown")!;
      countdown.textContent = "Unable to retrieve your location";
      console.log(error);
    }
  );
}

function setStationFromLocation(position: GeolocationPosition) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  selectedStation = getClosestStation(latitude, longitude);
  console.log("Using nearest station:", selectedStation);
  updateStatus();
  getDepartures(selectedStation);
}

function initializeStationSelect() {
  stationSelect.innerHTML = "";

  const nearestOption = document.createElement("option");
  nearestOption.value = "";
  nearestOption.textContent = "Nærmeste station";
  stationSelect.appendChild(nearestOption);

  stations.forEach((station) => {
    const option = document.createElement("option");
    option.value = station.id;
    option.textContent = station.name;
    stationSelect.appendChild(option);
  });

  const params = new URLSearchParams(window.location.search);
  const stationIdFromQuery = params.get("stationId");
  stationSelect.value = stationIdFromQuery && stations.some(station => station.id === stationIdFromQuery)
    ? stationIdFromQuery
    : "";

  stationSelect.addEventListener("change", () => {
    const stationId = stationSelect.value;
    console.log("Selected station ID:", stationId);
    if (!stationId) {
      console.log("No station selected, using nearest station");
      updateStationIdQuery();
      setSelectedStation();
      updateStatus();
      return;
    }

    const station = stations.find(s => s.id === stationId);
    if (!station) {
      console.log("Selected station ID not found in stations list");
      return;
    }

    selectedStation = station;
    updateStationIdQuery(station.id);
    updateStatus();
    getDepartures(selectedStation);
  });
}

function initializeSwitchDirectionToggle() {
  switchDirectionToggle.checked = isSwitchDirectionEnabled();

  switchDirectionToggle.addEventListener("change", () => {
    updateSwitchDirectionQuery(switchDirectionToggle.checked);
    if (selectedStation) {
      getDepartures(selectedStation);
    }
  });
}

function updateStatus() {
  const status = document.getElementById("status")!;
  if (!selectedStation) {
    status.textContent = "";
    return;
  }

  if (!lastKnownPosition) {
    status.textContent = `Valgt station: ${selectedStation.name}`;
    return;
  }

  const latitude = lastKnownPosition.coords.latitude;
  const longitude = lastKnownPosition.coords.longitude;
  status.textContent = `Valgt station: ${selectedStation.name} (${getDistance({ latitude, longitude }, selectedStation)} m), Speed: ${lastKnownPosition?.coords.speed ?? 0} m/s`;
}

function updateStationIdQuery(stationId?: string) {
  const url = new URL(window.location.href);
  if (stationId) {
    url.searchParams.set("stationId", stationId);
  } else {
    url.searchParams.delete("stationId");
  }
  window.history.replaceState({}, "", url);
}

function updateSwitchDirectionQuery(enabled: boolean) {
  const url = new URL(window.location.href);
  if (enabled) {
    url.searchParams.set("switchDirection", "true");
  } else {
    url.searchParams.delete("switchDirection");
  }
  window.history.replaceState({}, "", url);
}

function isSwitchDirectionEnabled(): boolean {
  const params = new URLSearchParams(window.location.search);
  return params.get("switchDirection") === "true";
}

function getEffectiveDirection(direction: string | undefined): string | undefined {
  if (!direction || !switchDirectionToggle.checked) {
    return direction;
  }

  if (direction === "1") {
    return "0";
  }

  if (direction === "0") {
    return "1";
  }

  return direction;
}

function getClosestStation(latitude: number, longitude: number): Station {
  const stationDistances = stations.map(station => ({
    station,
    distance: getDistance({ latitude, longitude }, station),
  }));

  const closest = stationDistances.reduce((best, current) =>
    current.distance < best.distance ? current : best
  );

  return closest.station;
}

function getDepartures(selectedStation: Station) {
  var added = 0;
  var addedNotCancelled = 0;
  var addedCancelled = 0;
  fetch(`https://www.rejseplanen.dk/api/departureBoard?accessId=5f2f5f78-f98b-4c63-bb69-c1a3b8757f77&aid=&requestId=&format=json&jsonpCallback=&lang=da&id=${selectedStation.id}&extId=&date=&time=&dur=&duration=60&maxJourneys=60&products=&operators=&categories=&lines=&attributes=&platforms=&passlist=false&passlistMaxStops=&minDur=&baim=false&rtMode=SERVER_DEFAULT&type=DEP&`)
    .then(response => response.json())
    .catch((error) => console.log(error))
    .then((data: Root) => {
      const departures = data.Departure;
      const ul = document.getElementById("departures")!;
      ul.innerHTML = "";
      //log departures to console where .Product[0].catOut === "S-Tog"
      console.log(departures.filter(departure => departure.Product[0].catOut === "S-Tog"));

      departures.forEach(departure => {
        if (added < 8 && addedNotCancelled < 5 && showDeparture(departure, selectedStation)) {
          if(departure.cancelled && addedCancelled >= 4) {
            return;
          }
          var departureTime = getDepartureDate(departure.rtTime || departure.time);
          if (!firstDepartureTime || departureTime < firstDepartureTime) {
            firstDepartureTime = departureTime;
          }

          const li = document.createElement("li");
          const departureClockTime = departure.rtTime || departure.time;
          li.innerHTML = `<div class="departure-main"><span>${departureClockTime}</span><span>${departure.name}</span><span>${departure.direction}</span></div><div class="departure-note"></div>`;
          li.attributes.setNamedItem(document.createAttribute("data"));
          li.attributes.getNamedItem("data")!.value = departure.JourneyDetailRef.ref;
          li.attributes.setNamedItem(document.createAttribute("time"));
          li.attributes.getNamedItem("time")!.value = departureClockTime;
          li.attributes.setNamedItem(document.createAttribute("status"));
          li.attributes.getNamedItem("status")!.value = departure.cancelled ? "cancelled" : "runs";
          const note = li.querySelector(".departure-note") as HTMLDivElement;
          if(selectedJourneyDetailRef === departure.JourneyDetailRef.ref) {
            li.classList.add("selected");
          }
          if(departure.cancelled) {
            li.classList.add("cancelled");
          } else {
            const notes = departure.Notes.Note.filter(note => note.type === "R");
            //add all notes to the note element, separated by <br>.
            if (notes.length > 0) {
              note.innerHTML = notes.map(note => note.txtN).join("<br>");
            } 
          }

          ul.appendChild(li);
          added++;
          if(!departure.cancelled) {
            addedNotCancelled++;
          }
          if(departure.cancelled) {
            addedCancelled++;
          }
        }
      });
    });
}

function showDeparture(departure: Departure, selectedStation: Station): boolean {
  const line = departure.Product[0].line;
  const stationDirection = getEffectiveDirection(selectedStation.defaultDirection[line]?.direction);
  const fallbackDirection = getEffectiveDirection(selectedStation.defaultDirection[departure.name]?.direction);

  return departure.Product[0].catOut === "S-Tog" && 
  lines.split(",").includes(line) &&
  (
    departure.directionFlag === stationDirection || 
    (
      departure.directionFlag === undefined && 
      lineEndStations[departure.name]?.direction === fallbackDirection &&
      departure.direction === lineEndStations[departure.name]?.stationName
    )
  );
}

//call a function when a departures li element is clicked
document.getElementById("departures")!.addEventListener("click", function (event) {
  const target = event.target as HTMLElement;
  const li = target.closest("li");
  const countdown = document.getElementById("countdown")!;
  const alreadySelected = li?.classList.contains("selected");

  selectedJourneyDetailRef = "";

  //remove timer text
  countdown.textContent = "";

  //remove color of all li element
  const ul = document.getElementById("departures")!;
  ul.childNodes.forEach(node => {
    if((node as HTMLElement).classList.contains("selected")) {
      (node as HTMLElement).classList.remove("selected");
    }
  });

  if (clockTimer) {
    clearInterval(clockTimer);
  }

  if (!li || alreadySelected) {
    return;
  }

  var status = li.attributes.getNamedItem("status")!.value;
  if(status === "cancelled") {
    return;
  }

  selectedJourneyDetailRef = li.attributes.getNamedItem("data")!.value;
  //update color of selected li element
  li.classList.add("selected");

  //show countdown timer for selected departur time
  const departureTime = li.attributes.getNamedItem("time")!.value;
  const departureDate = getDepartureDate(departureTime);
  countdown.textContent = "";
  lastPlayedMinute = Math.floor(getDepartureDiff(departureDate) / 60000) + 1; //set to current minute + 1 to avoid playing sound immediately

  clockTimer = setInterval(function () {
    const diff = getDepartureDiff(departureDate);
    if (diff <= 0) {
      clearInterval(clockTimer);
      countdown.textContent = "Departure time";
      return;
    }
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    countdown.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    if (minutes > 0 && minutes <= 10 && lastPlayedMinute != minutes + 1) {
      lastPlayedMinute = minutes + 1;
      console.log("Play minute", minutes + 1);
      const audio = new Audio('/train-app/' + (minutes + 1) + '.mp3');
      audio.play();
    }
    console.log("Countdown", minutes, seconds);
  }
    , 1000);

});

function getDepartureDiff(departureDate: Date): number {
    const now = new Date();
    const diff = departureDate.getTime() - now.getTime();
    return diff;
}

function getDepartureDate(departureTime: string) {
  const departureDate = new Date();
  const departureTimeParts = departureTime.split(":");
  departureDate.setHours(parseInt(departureTimeParts[0]));
  departureDate.setMinutes(parseInt(departureTimeParts[1]));
  departureDate.setSeconds(0);
  return departureDate;
}

