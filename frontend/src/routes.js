import React from 'react'

const Dashboard = React.lazy(() => import('./components/dashboard/Dashboard'))
const TrainingModificationPage = React.lazy(() => import('./components/trainingModificationPage/TrainingModificationPage'))
const TrainingsPage = React.lazy(() => import('./components/trainingsPage/TrainingsPage'))
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
  { path: '/statistics', name: 'Statistics', element: Statistics },
  { path: '/training_session', name: 'Training session', element: TrainingSession },
  { path: '/import_export_words', name: 'Words', element: ImportExportWords},
  { path: '/import_export_profile', name: 'Profile', element: ImportExportProfile},
  { path: '/backlog', name: 'Profile', element: BacklogPage},
  { path: '/words', name: 'Words', element: TermsPage},
  { path: '/edit-term/:id', name: 'Term editing', element: TermModificationPage},
  { path: '/add-term', name: 'Term adding', element: TermModificationPage},
  { path: '/trainings', name: 'Words', element: TrainingsPage},
  { path: '/edit-training/:id', name: 'Term editing', element: TrainingModificationPage},
  { path: '/add-training', name: 'Term adding', element: TrainingModificationPage},
]

export default routes
