import Course from './Course' 

const Courses = (props) => {
  console.log("tes courses");
  return (
    <div>
      {props.courses.map(course =>
        <Course key={course.id} course={course}/>
      )}
    </div>
  )
}

export default Courses