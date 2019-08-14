import * as elastic from './elastic'

import * as DigiTraffic from './digitraffic'

const convertTrain = (train: DigiTraffic.Train) => {
  const timetableAnalysis = train.timeTableRows.reduce(
    (timetableAcc, { stationShortCode, commercialStop, differenceInMinutes, type }, index) => {
      if (index === 0) {
        timetableAcc.stationFrom = stationShortCode
      }

      if (index === train.timeTableRows.length - 1) {
        timetableAcc.stationTo = stationShortCode
      }

      if (commercialStop) {
        timetableAcc.stationStop.add(stationShortCode)

        // Find commercial arrival with largest deviation from scheduled time
        if (type == 'ARRIVAL') {
          timetableAcc.lateMinutes = Math.max(timetableAcc.lateMinutes, differenceInMinutes)
        }
      }

      timetableAcc.stationVia.add(stationShortCode)

      return timetableAcc
    },
    {
      stationVia: new Set(),
      stationStop: new Set(),
      stationTo: null,
      stationFrom: null,
      lateMinutes: 0
    }
  )

  return {
    ...timetableAnalysis,
    //_id: getId(train),
    running: train.runningCurrently,
    cancelled: train.cancelled,
    number: train.trainNumber,
    type: train.trainType,
    operator: train.operatorShortCode,
    line: train.commuterLineID,
    date: train.departureDate,
    stationVia: Array.from(timetableAnalysis.stationVia),
    stationStop: Array.from(timetableAnalysis.stationStop)
  }
}

const getId = (train: DigiTraffic.Train) => train.departureDate + '/' + train.trainNumber

  // Testing
;(async function() {
  await elastic.createIndexIfNotExists('foo')

  const trains = await DigiTraffic.getTrainsOfDay()

  const trainsES = trains.reduce(
    (acc, train) => [
      ...acc,
      { update: { _id: getId(train) } },
      { doc: convertTrain(train), doc_as_upsert: true }
    ],
    []
  )

  await elastic.default.bulk({
    index: 'foo',
    body: trainsES
  })

  console.log('Inserted!')

  /*   const foo = 

  const trains = await getTrainsOfDay()

  console.log(trains) */
})()
