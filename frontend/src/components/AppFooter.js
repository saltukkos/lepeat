import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4 fs-7">
      <div>
        <a href="https://github.com/saltukkos/lepeat" target="_blank" rel="noopener noreferrer">
          Lepeat
        </a>
        <span className="ms-1">&copy; 2024 Anastasia &amp; Konstantin Saltuk.</span>
      </div>
      <div className="ms-auto">
        <a href="https://coreui.io/react" target="_blank" rel="noopener noreferrer">
          CoreUI
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
