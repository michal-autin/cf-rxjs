import React, { useState, useEffect } from 'react'
import { Button } from 'semantic-ui-react'
import axios from 'axios'
import dayjs from 'dayjs'
import { interval, fromPromise } from 'rxjs'
import { mockHTTPRequest, observe, unsubscribe } from '../ObservableTester'
import '../ObservableTester/subject'

const DATE_FORMAT = 'DD/MM/YYYY'

const retryCheckFlight = bt => {
  const observable = fromPromise(getCheckFlight(bt))
  const subscription = observable.subscribe(response =>
    console.log('RxJS:', response)
  )
}

const getFlight = () => {
  const URL = 'https://api.skypicker.com/flights'
  const fdate = dayjs(document.getElementById('fromdate').value)
  const options = {
    params: {
      fly_from: 'LON',
      fly_to: 'NYC',
      date_from: fdate.format(DATE_FORMAT),
      date_to: fdate.format(DATE_FORMAT),
      return_from: fdate.add(17, 'day').format(DATE_FORMAT),
      return_to: fdate.add(17, 'day').format(DATE_FORMAT),
      adults: 1,
      v: 3,
      partner: 'picky',
      curr: 'GBP',
      limit: 6,
    },
  }
  return axios.get(URL, options)
}

const URL = 'https://booking-api.skypicker.com/api/v0.1/check_flights'
const options = bt => ({
  params: {
    booking_tiken: bt,
    v: 2,
    bnum: 0,
    pnum: 2,
    affily: 'picky_uk',
    currency: 'GBP',
    adults: 1,
    children: 0,
    infants: 1,
  },
})
const getCheckFlight = bt => {
  return axios.get(URL, options(bt))
}

const CheckFlight = () => {
  const [flight, setFlight] = useState({})
  const [checkFlight, setCheckFlight] = useState({})
  const [lastCF, setLastCf] = useState({})
  const [startDate, setStartDate] = useState(dayjs().add(2, 'month'))
  useEffect(() => {
    observe()
    setTimeout(() => unsubscribe(), 10000)
  }, [])
  const handleClick = async () => {
    try {
      let response = await getFlight()
      setFlight(response.data)
    } catch (error) {
      setFlight(error)
    }
  }
  const handleCheckFlight = async bt => {
    retryCheckFlight(bt)
    console.log(`Check Flight: ${bt}`)
    try {
      let response = await getCheckFlight(bt)
      setCheckFlight(cf => {
        console.log(cf)
        setLastCf(response.data)
        let newCF = { ...cf, [bt]: response.data }
        console.log('NEW CF', newCF)
        return newCF
      })
    } catch (error) {
      setFlight(error)
    }
  }
  const handleDateChange = e => {
    setStartDate(dayjs(e.currentTarget.value))
  }
  const { flights, ...viewLastCf } = lastCF
  return (
    <div>
      <input
        onChange={handleDateChange}
        type="date"
        id="fromdate"
        value={startDate.format('YYYY-MM-DD')}
      />
      <Button onClick={() => handleClick()}>get flight</Button>
      <br />
      <div
        style={{
          height: 500,
          maxHeight: 500,
          width: '60%',
          border: '1px solid blue',
          overflow: 'scroll',
          textAlign: 'left',
          display: 'inline-block',
        }}
      >
        <pre>{JSON.stringify(viewLastCf, null, 2)}</pre>
      </div>
      <div style={{ display: 'inline-block' }}>
        {flight.data &&
          flight.data.map(f => {
            let { total, conversion, flights_checked, flights_invalid } =
              checkFlight[f.booking_token] || 0
            let { amount } = conversion || {}
            return (
              <div key={f.id}>
                <Button
                  primary={flights_checked}
                  onClick={() => handleCheckFlight(f.booking_token)}
                >
                  Check Flight
                </Button>
                <span>
                  {total}USD, &amp;{amount}
                </span>
                {/* : {JSON.stringify(checkFlight[f.booking_token])} */}
              </div>
            )
          })}
      </div>
      <pre style={{ textAlign: 'left' }}>
        {JSON.stringify(checkFlight, null, 2)}
      </pre>
      <pre style={{ textAlign: 'left' }}>{JSON.stringify(flight, null, 2)}</pre>
    </div>
  )
}

export default CheckFlight
