import React from "react"
import './App.css'

function App() {
  
  const [text, setText] = React.useState("Write here your text to encrypt or decrypt!")
  const [response, setResponse] = React.useState("Encrypted code shows here, click to copy.")
  const loader = <div className="loader"/>

  const url = "https://three-stage-encryptor.cyclic.app"
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  }

  let copy = (e) => {
    setTimeout(() => {
      e.target.style.backgroundColor = "#ABEBC6"
      setTimeout(() => {
        e.target.style.backgroundColor = "#FFFFFF"
        let newResponse
        if (typeof response === "string") newResponse = `${response}`
        else newResponse = {...response}
        setResponse("Copied!")
        setTimeout(() => {
          setResponse(newResponse)
        }, 1000);
      }, 100);
    }, 300);
    navigator.clipboard.writeText(response)
  }

  let encrypt = () => {
    setResponse(undefined)
    options.body = JSON.stringify({ secret: text })

    fetch(`${url}/encrypt`, options)
    .then(res => res.json())
    .then(res => setResponse(res.encryption ? res.encryption : res.message))
    .catch((err) => setResponse(`ERROR: ${err.message}`))
  }

  let decrypt = () => {
    setResponse(undefined)
    options.body = JSON.stringify({ secret: text })

    fetch(`${url}/decrypt`, options)
    .then(res => res.json())
    .then(res => {
      if (!res.decryption) setResponse(res.message)
      if (res.decryption.length === 0) setResponse("Please, write encrypted code!")
      else setResponse(res.decryption)
    })
    .catch((err) => setResponse(`ERROR: ${err.message}`))
  }

  return (
    <div className="App">
      <h1>EncryptMe</h1>
      <textarea onChange={(e) => setText(e.target.value)} value={text}/>
      <div className="buttons">
        <button onClick={() => encrypt()}>Encrypt</button>
        <button onClick={() => decrypt()}>Decrypt</button>
      </div>
      <pre className="response" onClick={(e) => copy(e)}>{response ? response : loader}</pre>
    </div>
  )
}

export default App