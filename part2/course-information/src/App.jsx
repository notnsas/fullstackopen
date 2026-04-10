const Header = (props) => <h1>{props.course}</h1>

const Content = (props) => (
  <div>
    {props.parts.map(part => 
      <Part key={part.id} part={part} />
    )}
  </div>
)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = (props) => <b><p>total of exercises {props.total}</p></b>

const Course = (props) => {
  const total = props.course.parts.reduce((s, p) => s + p.exercises, 0)
  
  return (
    <div>
      <Header course={props.course.name}/>
      <Content parts={props.course.parts}/>
      <Total total={total}/>
    </div>
  )
}

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'Redux',
        exercises: 11,
        id: 4
      },
    ]
  }
  
  

  return <Course course={course} />
}

export default App