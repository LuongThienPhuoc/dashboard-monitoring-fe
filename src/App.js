import React, { Suspense } from "react"
import "antd/dist/antd.min.css"
// ** Router Import
import Router from "./router/Router"
import "./index1.css"
const App = () => {
  return (
    <Suspense fallback={null}>
      <Router />
    </Suspense>
  )
}

export default App
