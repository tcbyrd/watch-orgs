const Koa = require('koa')
const app = new Koa()
const logger = require('koa-logger')
const route = require('koa-route')
const axios = require('axios')
const csv = require('csvtojson')

app.use(logger())

app.use(route.get('/', listen))


async function listen () {
  let url = 'https://octodemo.com/stafftools/reports/all_organizations.csv'
  try {
    let csvStr = await axios.get(url, {
        withCredentials: true,
        auth: {
          username: '<username>',
          password: '<password>' //TODO: REMOVE THIS BEFORE YOU COMMIT
        },
        responseType: 'json'
    })
    let jsonData = []
    let result = await convertCsv(csvStr.data, jsonData)
    this.type = 'text/json; charset=utf-8'
    this.body = result

  } catch (error) {
    console.log(error)
    this.body = error
  }
}

async function convertCsv (csvData, jsonData) {
  results = csv({noheader:false, toArrayString: true})
    .fromString(csvData)
    .on('json', (jsonObj, i) => {
      // jsonData.push(jsonObj)
    })
    .on('done', () => {
      // return jsonData
    })
  return results
}

app.listen(3000, () => {
  console.log('Listening on port 3000');
})
