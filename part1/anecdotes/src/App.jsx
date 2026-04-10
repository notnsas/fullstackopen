import { useState } from 'react'

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

const Body = ({heading, body}) => {
  return (
    <div>
      <h1>
        {heading}
      </h1>
      {body}
    </div>
  )

}
const Button = ({handleClick, text}) => {
  return (
    <>
      <button onClick={handleClick}>{text}</button>
    </>
  )
}

const DisplayVotes = ({votes}) => {
  return (
    <div>
      has {votes} votes
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  
  const [selected, setSelected] = useState(0)
  const arrayLen = anecdotes.length
  console.log("selected", selected)

  const [votes, setVotes] = useState(new Array(arrayLen).fill(0))
  const copyVotes = [...votes]
  const indexOfMaxValue = copyVotes.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);

  const handleRndm = () => {
    const newSelected = getRndInteger(0, arrayLen)
    setSelected(newSelected)
  }

  const handleVotes = () => {
    copyVotes[selected] += 1
    setVotes(copyVotes)
  }
  console.log(copyVotes)
  // increment the value in position 2 by one
       

  return (
    <div>
      <Body heading={"Anecdote of the day"} body={anecdotes[selected]}/>
      <DisplayVotes votes={votes[selected]}/>
      <Button handleClick={handleVotes} text={"vote"}/>
      <Button handleClick={handleRndm} text={"next anecdote"}/>

      <Body heading={"Anecdote with most votes"} body={anecdotes[indexOfMaxValue]}/>
    </div>
  )
}

export default App