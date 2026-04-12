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
                <Country country={countries[0]} isShow={true}/>
            </div>
        )
    }
    else if (countries.length <= 10) {
        console.log(countries)
        return (
        <div>
            {countries.map((country) =>
            <div key={countries}><Country country={country} isShow={false}/></div> 
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