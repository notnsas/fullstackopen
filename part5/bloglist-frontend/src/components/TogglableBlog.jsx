import { useState, useImperativeHandle } from 'react'

const TogglableBlog = props => {
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(props.ref, () => {
    return { toggleVisibility }
  })

  return (
    <>
      <button onClick={toggleVisibility}>{ visible ? 'hide' : 'view' }</button>
      <div style={showWhenVisible}>
        {props.children}
        {/* <button onClick={toggleVisibility}>cancel</button> */}
      </div>
    </>
  )
}

export default TogglableBlog