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

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  
  const texts = ["good", "neutral", "bad"]

  const setToValue = (value, setValue) => () => setValue(value + 1)

  return (
    <div>
      <Heading text="give feedback"/>
      <Button onClick={setToValue(good, setGood)} text={texts[0]}/>
      <Button onClick={setToValue(neutral, setNeutral)} text={texts[1]}/>
      <Button onClick={setToValue(bad, setBad)} text={texts[2]}/>
      <Heading text="statistics"/>

      <Display text={texts[0]} total={good}/>
      <Display text={texts[1]} total={neutral}/>
      <Display text={texts[2]} total={bad}/>
    </div>
  )
}

export default App