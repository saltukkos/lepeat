import React, {useContext, useEffect, useRef, useState} from 'react'
import {useLocation} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {cilCloudDownload, cilContrast, cilMenu, cilMoon, cilSun} from '@coreui/icons'
import {serializeProfileToLocalStorage} from "../services/Persistence";
import ToastContext from "../contexts/ToastContext";
import routes from "../routes";
import ProfileContext from "../contexts/ProfileContext";
import GoogleDriveSynchronizer from "./dataExchange/GoogleDriveSynchronizer";

const AppHeader = () => {
  const { showToast } = useContext(ToastContext)
  const { profile } = useContext(ProfileContext);

  const [visible, setVisible] = useState(false)
  
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  const location = useLocation().pathname;
  const currentRoute = routes.find((route) => route.path === location)?.name ?? "";

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="fs-5">
          <CNavItem>
            <CNavLink>
              {currentRoute}
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-auto">
          <CButton onClick={() => setVisible(!visible)}>
            <CIcon icon={cilCloudDownload} size="lg" />
          </CButton>
        </CHeaderNav>
        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                  <CIcon icon={cilMoon} size="lg"/>
              ) : colorMode === 'auto' ? (
                  <CIcon icon={cilContrast} size="lg"/>
              ) : (
                  <CIcon icon={cilSun} size="lg"/>
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                  active={colorMode === 'light'}
                  className="d-flex align-items-center"
                  component="button"
                  type="button"
                  onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg"/> Light
              </CDropdownItem>
              <CDropdownItem
                  active={colorMode === 'dark'}
                  className="d-flex align-items-center"
                  component="button"
                  type="button"
                  onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg"/> Dark
              </CDropdownItem>
              <CDropdownItem
                  active={colorMode === 'auto'}
                  className="d-flex align-items-center"
                  component="button"
                  type="button"
                  onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg"/> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CHeaderNav>
      </CContainer>

      <CModal
          visible={visible}
          onClose={() => setVisible(false)}
          aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle id="LiveDemoExampleLabel">Synchronization</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <GoogleDriveSynchronizer/>
        </CModalBody>

      </CModal>

    </CHeader>
  )
}

export default AppHeader
