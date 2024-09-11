import { useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Graph from './graph'
import NetworkGraph from './NetworkGraph'
import { ResponsiveNetwork } from '@nivo/network'
import { data } from './data'

function App() {
  const [count, setCount] = useState(0)
  const graphRef = useRef(null);

  const zoomIn = () => {
    graphRef.current?.zoomIn();
  };

  const zoomOut = () => {
    graphRef.current?.zoomOut();
  };


  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        {/* <h1>Vite + React</h1> */}
        {/* <Graph reactLogo={reactLogo} viteLogo={viteLogo} /> */}
        <NetworkGraph />
      </div>

      <div className="card">
        {/* <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button> */}

      </div>
      {/* <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App
