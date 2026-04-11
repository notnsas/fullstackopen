import DisplayPerson  from "./DisplayPerson"

const Persons = (props) => (
    <div>
        {props.personsToShow.map(person => 
            <DisplayPerson key={person.id} name={person.name} number={person.number}/>
        )}
    </div>
)

export default Persons