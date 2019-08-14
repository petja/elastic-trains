import nodeFetch from 'node-fetch'

export interface Train {
  trainNumber: number
  departureDate: string
  operatorUICCode: number
  operatorShortCode: string
  trainType: string
  trainCategory: string
  commuterLineID: string
  runningCurrently: boolean
  cancelled: boolean
  version: number
  timetableType: 'REGULAR' | 'ADHOC'
  timetableAcceptanceDate: string
  timeTableRows: TimetableRow[]
}

export interface TimetableRow {
  stationShortCode: string
  stationUICCode: number
  countryCode: 'FI' | 'RU'
  type: 'DEPARTURE' | 'ARRIVAL'
  trainStopping: boolean
  commercialStop: boolean
  commercialTrack: string
  cancelled: boolean
  scheduledTime: string
  causes: string[]
  differenceInMinutes?: number
}

export const fetch = (path: string) => {
  return nodeFetch(`https://rata.digitraffic.fi/api/v1${path}`).then(resp => resp.json())
}

export const getTrainsOfDay = (day: Date = new Date()): Train[] =>
  fetch(`/trains/${day.toISOString().slice(0, 10)}`)
