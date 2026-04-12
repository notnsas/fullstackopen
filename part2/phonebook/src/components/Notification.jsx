const Notification = ({ message, messageType }) => {
  if (message === null) {
    return null
  }

  const notifColor = (messageType == "notif") ? "green" : "red"
  console.log("notifColor", notifColor);
  console.log("messageType in notification", messageType);
  
  const notifStyle = {
    color: notifColor,
    fontStyle: 'italic'
  }

  return (
    <div className="notif" style={notifStyle}>
      {message}
    </div>
  )
}

export default Notification