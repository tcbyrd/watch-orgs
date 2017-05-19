const Koa = require('koa')
const app = new Koa()
const logger = require('koa-logger')
const route = require('koa-route')
const axios = require('axios')
const csv = require('csvtojson')

app.use(logger())

app.use(route.get('/', list))

const opts = {
              withCredentials: true,
              auth: {
                username: '<username>',
                password: '<password>' //TODO: REMOVE THIS BEFORE YOU COMMIT
              },
              responseType: 'json'
            }

async function list () {
  try {
    let csvStr = await getCsv('all_users.csv')
    let jsonData = []
    let result = await convertCsv(csvStr.data, jsonData)
    this.type = 'text/json; charset=utf-8'
    this.body = result
  } catch (error) {
    console.log(error)
    this.body = error
  }
}

async function getCsv (report) {
  let url = 'https://octodemo.com/stafftools/reports/' + report
  let csvData = await axios.get(url, opts)
  console.log('CSV Data: ', csvData.data);
  if (csvData.data === '') {
    console.log('sleeping')
    sleep(3000)
    csvData = await axios.get(url, opts)
    return csvData
  } else {
    return csvData
  }
}

async function convertCsv (csvData, jsonData) {
  results = csv({noheader:false, toArrayString: true})
    .fromString(csvData)
    .on('json', (jsonObj, i) => {
      // jsonData.push(jsonObj)
    })
    .on('done', () => {
      // return this.jsonData
    })
  return results
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, mss))
}

app.listen(3000, () => {
  console.log('Listening on port 3000');
})
