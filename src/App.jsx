import { Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import UsersList from './components/UsersList'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/users" element={<UsersList />} />
      </Route>
    </Routes>
  )
}

export default App

