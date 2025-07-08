import { useState } from 'react'
import './App.css'
import ChallengeComponent from '@components/ChallengeComponent/ChallengeComponent.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='App'>
        <header className='App-header'>
          <ChallengeComponent />
        </header>
      </div>
    </>
  )
}

export default App
