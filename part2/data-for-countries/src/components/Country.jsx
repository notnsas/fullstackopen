import { useState } from 'react'
const Country = ({country, isShow}) => {
    // console.log("newCountry in FindCountry", newCountry);
    const [show, setShow] = useState(isShow)

    const handleShow = () => {
        setShow(!show)
    }
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