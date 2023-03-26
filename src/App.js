import React, { useState } from "react";

import Modal from './Modal'
import SplashModal from './SplashModal'
import Map from './Map'
import logo from './assets/img/logo.svg'
import useLocalStorage from "./util/use-localstorage";

function App() {

  const [showModal, setShowModal] = useState(false)


  const isMobile = window.location.pathname.includes('mobile')

  const [splashModalDismissed, setSplashModalDismissed] = useLocalStorage("splashModalDismissed", false);
  
  const [showSplashModal, setShowSplashModal] = useState(isMobile && !splashModalDismissed)


  return (
    <>
      <div className="absolute z-20 h-14 w-14 top-2 left-2">
        <img src={logo} alt="shorewalkers logo" />
      </div>
      <Map setShowModal={setShowModal} isMobile={isMobile} />
      <Modal showModal={showModal} setShowModal={setShowModal} />
      <SplashModal
        showModal={showSplashModal}
        setShowModal={setShowSplashModal}
        setDontShowAgain={(checked) => {
          if (checked) {
            console.log('setting localstorage')
            setSplashModalDismissed(true)
          }
        }}/>
    </>
  )
}

export default App;