import { Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import UsersList from './components/UsersList'
import ProtectedRoute from './components/ProtectedRoute'
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/users" element={<UsersList />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  )
}

export default App
