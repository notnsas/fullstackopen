import { useState, useEffect } from 'react'
import countryService from '../services/countries'

const Weather = ({capital, weather}) => {
    // console.log("newCountry in FindCountry", newCountry);
    
    
    if (weather) {
        console.log(`https://openweathermap.org/img/w/${weather.weather.icon}.png`);
        console.log(weather.weather[0].icon);
        return (
            <div>
                <h2>Weather in {capital}</h2>
                <p>Temperature {weather.main.temp} Celcius</p> 
                <img className="cloudIcon" src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} alt="Cloud Image" />
                <p>Wind {weather.wind.speed} m/s</p>
            </div>
        )
    }
    return (
        <>
        </>
    )
}

export default Weather
