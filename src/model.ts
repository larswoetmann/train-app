export interface Root {
  Departure: Departure[]
  TechnicalMessages: TechnicalMessages
  serverVersion: string
  dialectVersion: string
  planRtTs: string
  requestId: string
}

export interface Departure {
  JourneyDetailRef: JourneyDetailRef
  JourneyStatus: string
  ProductAtStop: ProductAtStop
  Product: Product[]
  Notes: Notes
  rtPlatform: RtPlatform
  name: string
  type: string
  stop: string
  stopid: string
  stopExtId: string
  lon: number
  lat: number
  isMainMast: boolean
  prognosisType: string
  time: string
  rtTime: string
  date: string
  rtTrack: string
  reachable: boolean
  direction: string
  directionFlag: string
}

export interface JourneyDetailRef {
  ref: string
}

export interface ProductAtStop {
  icon: Icon
  operatorInfo: OperatorInfo
  name: string
  internalName: string
  displayNumber: string
  num: string
  line: string
  lineId: string
  catOut: string
  catIn: string
  catCode: string
  cls: string
  catOutS: string
  catOutL: string
  operatorCode: string
  operator: string
  admin: string
  matchId: string
}

export interface Icon {
  res: string
}

export interface OperatorInfo {
  name: string
  nameS: string
  nameN: string
  nameL: string
}

export interface Product {
  icon: Icon2
  operatorInfo: OperatorInfo2
  name: string
  internalName: string
  displayNumber: string
  num: string
  line: string
  lineId: string
  catOut: string
  catIn: string
  catCode: string
  cls: string
  catOutS: string
  catOutL: string
  operatorCode: string
  operator: string
  admin: string
  routeIdxFrom: number
  routeIdxTo: number
  matchId: string
}

export interface Icon2 {
  res: string
}

export interface OperatorInfo2 {
  name: string
  nameS: string
  nameN: string
  nameL: string
}

export interface Notes {
  Note: Note[]
}

export interface Note {
  value?: string
  key: string
  type: string
  priority?: number
  routeIdxFrom?: number
  routeIdxTo?: number
  txtN?: string
}

export interface RtPlatform {
  type: string
  text: string
}

export interface TechnicalMessages {
  TechnicalMessage: TechnicalMessage[]
}

export interface TechnicalMessage {
  value: string
  key: string
}
