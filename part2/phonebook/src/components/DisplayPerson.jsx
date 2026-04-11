const DisplayPerson = (props) => (
  <div>
    {props.name} {props.number} <button onClick={props.onDelete}>delete</button>
  </div>
)

export default DisplayPerson