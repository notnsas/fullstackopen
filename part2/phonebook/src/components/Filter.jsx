const Filter = (props) => (
    <div>
        filter shown with 
        <input value={props.filt} onChange={props.handleFiltChange}/>
    </div>
)

export default Filter
