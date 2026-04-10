import { useState } from 'react'

const Heading = ({text}) => {
  return (
    <div>
      <h1>
        {text}
      </h1>
    </div>
  )
}

const Button = ({onClick, text}) => {
  return (
    <>
      <button onClick={onClick}>
        {text}
      </button>
    </>
  )
}

const Display = ({text, total}) => {
  return (
    <div>
      {text} {total}
    </div>
  )
}

const Statistics = ({texts, good, neutral, bad, total, average, posPct}) => {
  return (
    <div>
      <Heading text="statistics"/>
      <Display text={texts[0]} total={good}/>
      <Display text={texts[1]} total={neutral}/>
      <Display text={texts[2]} total={bad}/>
      <Display text={"all"} total={total}/>
      <Display text={"average"} total={average}/>
      <Display text={"positive"} total={posPct}/>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  
  const texts = ["good", "neutral", "bad"]

  const setToValue = (value, setValue) => () => setValue(value + 1)
  
  const total = good + neutral + bad

  const averageRaw = (good - bad) / total
  const average = isNaN(averageRaw) ? 0 : averageRaw
  
  const posPctRaw = (good / total * 100)
  const posPct = (isNaN(posPctRaw) ? 0 : posPctRaw).toString().concat(" %")

  // console.log("posPct", posPct)
  return (
    <div>
      <Heading text="give feedback"/>
      <Button onClick={setToValue(good, setGood)} text={texts[0]}/>
      <Button onClick={setToValue(neutral, setNeutral)} text={texts[1]}/>
      <Button onClick={setToValue(bad, setBad)} text={texts[2]}/>
      <Statistics texts={texts} good={good} neutral={neutral} bad={bad} total={total} average={average} posPct={posPct}/>
    </div>
  )
}

export default App