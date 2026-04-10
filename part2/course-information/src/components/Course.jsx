import Header from './Header' 
import Content from './Content' 
import Total from './Total' 

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

export default Course