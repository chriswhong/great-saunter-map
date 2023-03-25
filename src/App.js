import React, { useState } from "react";

import Modal from './Modal'
import Map from './Map'
import logo from './assets/img/logo.svg'

function App() {

  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className="absolute z-20 h-14 w-14 top-2 left-2">
        <img src={logo} alt="shorewalkers logo" />
      </div>
      <Map setShowModal={setShowModal} />
      <Modal showModal={showModal} setShowModal={setShowModal} />
    </>
  )
}

export default App;