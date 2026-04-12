const FindCountry = ({newCountry, onChange}) => {
    // console.log("newCountry in FindCountry", newCountry);
    return (
        <div>
            find countries <input value={newCountry} onChange={onChange} type="text" />
        </div>
    )
}

export default FindCountry