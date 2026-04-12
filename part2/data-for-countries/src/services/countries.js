import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/'
const baseUrlWeather = "https://api.openweathermap.org/data/2.5/weather"
/*
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}*/

const getCountries = () => {
  const request = axios.get(`${baseUrl}/api/all`)
  return request.then((response) => response.data)
}

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject)
  return request.then((response) => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then((response) => response.data)
}

// const getWeather = (country) => {
//     const request = axios.post(baseUrlWeather, country)
//     return request.then((response) => response.data)
// }
const getWeather = (lat, lon, appid) => {
    const request = axios.get(`${baseUrlWeather}?lat=${lat}&lon=${lon}&appid=${appid}`)
    return request.then((response) => response.data)
}

export default {
  getCountries,
  create,
  update,
  getWeather
}