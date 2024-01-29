import React from 'react'

const Dashboard = React.lazy(() => import('./components/dashboard/Dashboard'))
const AddWords = React.lazy(() => import('./components/addTermPage/AddNewTermsPage'))
const AddTraining = React.lazy(() => import('./components/addNewTraining/AddNewTraining'))
const EditWords = React.lazy(() => import('./components/editTermsPage/EditTermsPage'))
const TrainingSession = React.lazy(() => import('./components/training/TrainingSession'))
const Statistics = React.lazy(() => import('./components/statistics/debug/Statistics'))
const ImportExportWords = React.lazy(() => import('./components/dataExchange/TermsImportExport'))
const ImportExportProfile = React.lazy(() => import('./components/dataExchange/ProfileImportExport'))
const BacklogPage = React.lazy(() => import('./backlog/BacklogPage'))
const TermsPage = React.lazy(() => import('./components/terms/TermsPage'))
const TermModificationPage = React.lazy(() => import('./components/termModificationPage/TermModificationPage'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/add_words', name: 'Add words', element: AddWords },
  { path: '/edit_words', name: 'Edit words', element: EditWords },
  { path: '/statistics', name: 'Statistics', element: Statistics },
  { path: '/training_session', name: 'Training session', element: TrainingSession },
  { path: '/import_export_words', name: 'Words', element: ImportExportWords},
  { path: '/import_export_profile', name: 'Profile', element: ImportExportProfile},
  { path: '/backlog', name: 'Profile', element: BacklogPage},
  { path: '/add_training', name: 'Add Training', element: AddTraining},
  { path: '/words', name: 'Words', element: TermsPage},
  { path: '/edit-word/:id', name: 'Term modification', element: TermModificationPage}
]

export default routes
