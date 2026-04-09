export interface Station {
  longitude: number
  latitude: number
  id: string
  name: string
  defaultDirection: { [key: string]: {direction: string} }
}

const klampenborgStation: Station = { longitude: 12.58773, latitude: 55.777446, id: "8600659", name: "Klampenborg St.", defaultDirection: { "C": { direction: "0" } } };
const ordrupStation: Station = { longitude: 12.583649, latitude: 55.76307, id: "8600658", name: "Ordrup St.", defaultDirection: { "C": { direction: "0" } } };
const charlottenlundStation: Station = { longitude: 12.572144, latitude: 55.751851, id: "8600657", name: "Charlottenlund St.", defaultDirection: { "C": { direction: "0" } } };
const hellerupStation: Station = { longitude: 12.567658, latitude: 55.731022, id: "8600655", name: "Hellerup St.", defaultDirection: { "C": { direction: "0" } } };
const svanemoellenStation: Station = { longitude: 12.578049, latitude: 55.71555, id: "8600654", name: "Svanemøllen St.", defaultDirection: { "B": { direction: "1" }, "C": { direction: "0" } } };
const nordhavnStation: Station = { longitude: 12.590613, latitude: 55.705616, id: "8600653", name: "Nordhavn St.", defaultDirection: { "B": { direction: "1" }, "C": { direction: "0" } } };
const oesterportStation: Station = { longitude: 12.587785, latitude: 55.692499, id: "8600650", name: "Østerport St.", defaultDirection: { "B": { direction: "1" }, "C": { direction: "0" } } };
const noerreportStation: Station = { longitude: 12.571804, latitude: 55.683452, id: "8600646", name: "Nørreport St.", defaultDirection: { "B": { direction: "1" }, "C": { direction: "0" } } };
const vesterportStation: Station = { longitude: 12.562087, latitude: 55.676011, id: "8600645", name: "Vesterport St.", defaultDirection: { "B": { direction: "1" }, "C": { direction: "0" } } };
const koebenhavnHStation: Station = { longitude: 12.565558, latitude: 55.673059, id: "8600626", name: "København H", defaultDirection: { "B": { direction: "1" }, "C": { direction: "0" } } };
const dybboelsbroStation: Station = { longitude: 12.559511, latitude: 55.664828, id: "8600634", name: "Dybbølsbro St.", defaultDirection: { "B": { direction: "1" }, "C": { direction: "0" } } };
const carlsbergStation: Station = { longitude: 12.537353, latitude: 55.663257, id: "8600631", name: "Carlsberg St.", defaultDirection: { "B": { direction: "1" }, "C": { direction: "0" } } };
const valbyStation: Station = { longitude: 12.51445, latitude: 55.663997, id: "8600624", name: "Valby St.", defaultDirection: { "B": { direction: "1" }, "C": { direction: "0" } } };
const langgadeStation: Station = { longitude: 12.504224, latitude: 55.66705, id: "8600701", name: "Langgade St.", defaultDirection: { "C": { direction: "0" } } };
const peterBangsVejStation: Station = { longitude: 12.503443, latitude: 55.67859, id: "8600702", name: "Peter Bangs Vej St.", defaultDirection: { "C": { direction: "0" } } };
const flintholmStation: Station = { longitude: 12.49866, latitude: 55.685435, id: "8600736", name: "Flintholm St.", defaultDirection: { "C": { direction: "0" } } };
const vanloeseStation: Station = { longitude: 12.490603, latitude: 55.687355, id: "8600703", name: "Vanløse St.", defaultDirection: { "C": { direction: "0" } } };
const jyllingevejStation: Station = { longitude: 12.477206, latitude: 55.69081, id: "8600734", name: "Jyllingevej St.", defaultDirection: { "C": { direction: "0" } } };
const islevStation: Station = { longitude: 12.469383, latitude: 55.699529, id: "8600704", name: "Islev St.", defaultDirection: { "C": { direction: "0" } } };
const husumStation: Station = { longitude: 12.464033, latitude: 55.709409, id: "8600705", name: "Husum St.", defaultDirection: { "C": { direction: "0" } } };
const herlevStation: Station = { longitude: 12.443674, latitude: 55.718919, id: "8600706", name: "Herlev St.", defaultDirection: { "C": { direction: "0" } } };
const skovlundeStation: Station = { longitude: 12.403533, latitude: 55.722763, id: "8600707", name: "Skovlunde St.", defaultDirection: { "C": { direction: "0" } } };
const malmparkenStation: Station = { longitude: 12.386028, latitude: 55.724632, id: "8600756", name: "Malmparken St.", defaultDirection: { "C": { direction: "0" } } };
const ballerupStation: Station = { longitude: 12.358344, latitude: 55.729871, id: "8600708", name: "Ballerup St.", defaultDirection: { "C": { direction: "0" } } };
const maaloevStation: Station = { longitude: 12.318319, latitude: 55.747485, id: "8600709", name: "Måløv St.", defaultDirection: { "C": { direction: "1" } } };
const kildedalStation: Station = { longitude: 12.286623, latitude: 55.751952, id: "8600955", name: "Kildedal St.", defaultDirection: { "C": { direction: "1" } } };
const veksoeStation: Station = { longitude: 12.238432, latitude: 55.750211, id: "8600710", name: "Veksø St.", defaultDirection: { "C": { direction: "1" } } };
const stenloeseStation: Station = { longitude: 12.190608, latitude: 55.766379, id: "8600711", name: "Stenløse St.", defaultDirection: { "C": { direction: "1" } } };
const egedalStation: Station = { longitude: 12.185481, latitude: 55.779952, id: "8600956", name: "Egedal St.", defaultDirection: { "C": { direction: "1" } } };
const oelstykkeStation: Station = { longitude: 12.159712, latitude: 55.795641, id: "8600712", name: "Ølstykke St.", defaultDirection: { "C": { direction: "1" } } };
const vingeStation: Station = { longitude: 12.115244, latitude: 55.810333, id: "8600713", name: "Vinge St.", defaultDirection: { "C": { direction: "1" } } };
const frederikssundStation: Station = { longitude: 12.065636, latitude: 55.835809, id: "8600714", name: "Frederikssund St.", defaultDirection: { "C": { direction: "1" } } };

export const stations = [
  klampenborgStation,
  ordrupStation,
  charlottenlundStation,
  hellerupStation,
  svanemoellenStation,
  nordhavnStation,
  oesterportStation,
  noerreportStation,
  vesterportStation,
  koebenhavnHStation,
  dybboelsbroStation,
  carlsbergStation,
  valbyStation,
  langgadeStation,
  peterBangsVejStation,
  flintholmStation,
  vanloeseStation,
  jyllingevejStation,
  islevStation,
  husumStation,
  herlevStation,
  skovlundeStation,
  malmparkenStation,
  ballerupStation,
  maaloevStation,
  kildedalStation,
  veksoeStation,
  stenloeseStation,
  egedalStation,
  oelstykkeStation,
  vingeStation,
  frederikssundStation,
];
export const lines = "B,C";

//export dictionary with list of end stations for each line
export const lineEndStations: { [key: string]: {stationName: string, direction: string} } = {
  "B": {stationName:"Farum St.", direction:"1"},
  "C": {stationName:"Frederikssund St.", direction:"0"},
};