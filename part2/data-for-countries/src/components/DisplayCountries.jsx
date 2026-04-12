import Country from "./Country"

const DisplayCountries = ({countries}) => {
    const handleShow = (country) => {
        country.show = !country.show
        console.log(country)
    }
    console.log("country in DisplayCountry", countries);
    if (countries.length == 1) {
        return (
            <div>
                <Country country={countries[0]}/>
            </div>
        )
    }
    else if (countries.length <= 10) {
        console.log(countries)
        return (
        <div>
            {countries.map((country) =>
            <div><Country country={country} show={country.show}/></div> 
            )}
        </div>
        )
    }
    return (
        <div>
            Too many matches, specify another filter
        </div>
    )
}

export default DisplayCountries