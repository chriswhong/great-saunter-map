import React, { useState } from "react";

import Modal from './Modal'
import Map from './Map'

function App() {

  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <Map setShowModal={setShowModal} />
      <Modal showModal={showModal} setShowModal={setShowModal} />
    </>
  )
}

export default App;