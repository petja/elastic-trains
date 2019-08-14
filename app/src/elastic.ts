import { Client } from '@elastic/elasticsearch'

const client = new Client({ node: 'http://localhost:9200' })

export const indexExists = async (index: string) => {
  const query = await client.indices.exists({
    index
  })

  return query.statusCode === 200
}

export const createIndexIfNotExists = async (index: string) => {
  const exists = indexExists(index)

  if (!exists) {
    await client.indices.create({
      index,
      body: {
        mappings: {
          properties: {
            date: { type: 'date' },
            number: { type: 'integer' },
            line: { type: 'keyword' },
            type: { type: 'keyword' },
            lateMinutes: { type: 'short' },
            stationVia: { type: 'keyword' },
            stationStop: { type: 'keyword' },
            stationFrom: { type: 'keyword' },
            stationTo: { type: 'keyword' },
            duration: { type: 'short' },
            distance: { type: 'short' },
            operator: { type: 'keyword' },
            cancelled: { type: 'boolean' },
            running: { type: 'boolean' },
            digitransitTrip: { type: 'keyword' }
          }
        }
      }
    })
  }
}

export default client
