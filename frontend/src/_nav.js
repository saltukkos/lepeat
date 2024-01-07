import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilChart,
  cilColumns,
  cilEnvelopeLetter,
  cilList,
  cilPencil,
  cilPlus,
  cilSpeedometer,
  cilUser
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Add word',
    to: '/add_words',
    icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Edit words',
    to: '/edit_words',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Statistics',
    to: '/statistics',
    icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Import and export',
  },
  {
    component: CNavItem,
    name: 'Words',
    to: '/import_export_words',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Whole profile',
    to: '/import_export_profile',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Settings',
  },
  {
    component: CNavItem,
    name: 'Trainings editor',
    to: '/trainings',
    icon: <CIcon icon={cilColumns} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Terms editor',
    to: '/terms',
    icon: <CIcon icon={cilEnvelopeLetter} customClassName="nav-icon" />,
  },
]

export default _nav
