import { useState, useEffect } from 'react'
import countryService from '../services/countries'
import Weather from './Weather'

const Country = ({country, isShow}) => {
    // console.log("newCountry in FindCountry", newCountry);
    const [show, setShow] = useState(isShow)
    const [weather, setWeather] = useState('')
    const lat = country.capitalInfo.latlng[0]
    const lon = country.capitalInfo.latlng[1]
    const handleShow = () => {
        setShow(!show)
    }
    const api_key = import.meta.env.VITE_SOME_KEY
    // let weather = null
    // const countryObject = {
    //     lat: lat,
    //     lon: lng,
    //     appid: api_key
    // }
    useEffect(() => {
        countryService.getWeather(lat, lon, api_key).then((returnedWeather) => {
        //   setNotes(notes.concat(returnedNote))
        //   setNewNote('')
            setWeather(returnedWeather)
            console.log("returnedWeather", returnedWeather)
        })
      }, [])
    
    
    if (show) {
        return (
            <div>
                <h1>{country.name.common}</h1>
                {country.capital.map(cap => <div key={cap}>Capital {cap}</div>)}
                {country.area}

                <h2>Language</h2>
                <ul>
                    {Object.keys(country.languages).map(e => {
                        return <li key={country.languages[e]}>{country.languages[e]}</li> 
                    })}
                    {/* {country.languages.map(lang => <li>{lang}</li>)} */}
                </ul>
                <img src={country.flags["png"]} alt="flag" />
                
                <Weather capital={country.capital[0]} weather={weather}/>
                <button onClick={handleShow}>Unshow</button>
            </div>
        )
    }
    return (
        <>
            {country.name.common} 
            <button onClick={handleShow}>Show</button>
        </>
    )
}

export default Country