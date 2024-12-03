import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function UsersList() {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [editingUser, setEditingUser] = useState(null)
  const [message, setMessage] = useState('')
  const [deletedUsers, setDeletedUsers] = useState([]) // State to track deleted user IDs
  const navigate = useNavigate()

  useEffect(() => {
    fetchUsers()
  }, [page])

  const fetchUsers = async () => {
    try {
      const response = await fetch(`https://reqres.in/api/users?page=${page}`)
      const data = await response.json()
      // Filter out deleted users from the fetched data
      const filteredUsers = data.data.filter((user) => !deletedUsers.includes(user.id))
      setUsers(filteredUsers)
      setTotalPages(data.total_pages)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  const handleEdit = (user) => {
    setEditingUser(user)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!editingUser) return

    try {
      const response = await fetch(`https://reqres.in/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser),
      })

      if (response.ok) {
        setMessage('User updated successfully')
        setUsers(users.map(u => u.id === editingUser.id ? editingUser : u))
        setEditingUser(null)
      } else {
        setMessage('Failed to update user')
      }
    } catch (error) {
      setMessage('An error occurred while updating user')
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://reqres.in/api/users/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setMessage('User deleted successfully')
        // Add user ID to the deletedUsers list
        setDeletedUsers((prev) => [...prev, id])
        setUsers(users.filter(u => u.id !== id))
      } else {
        setMessage('Failed to delete user')
      }
    } catch (error) {
      setMessage('An error occurred while deleting user')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Employwise FE Assignment</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          Logout
        </button>
      </div>
      {message && <p className="text-center text-green-600 font-medium mb-4">{message}</p>}
      {editingUser ? (
        <form onSubmit={handleUpdate} className="mb-8 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Edit User</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={editingUser.first_name}
              onChange={(e) => setEditingUser({ ...editingUser, first_name: e.target.value })}
              className="block w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="First Name"
            />
            <input
              type="text"
              value={editingUser.last_name}
              onChange={(e) => setEditingUser({ ...editingUser, last_name: e.target.value })}
              className="block w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Last Name"
            />
            <input
              type="email"
              value={editingUser.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              className="block w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
            />
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-300"
            >
              <img
                src={user.avatar}
                alt={`${user.first_name} ${user.last_name}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-bold text-gray-800">{`${user.first_name} ${user.last_name}`}</h2>
                <p className="text-gray-600">{user.email}</p>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
        >
          Next
        </button>
      </div>
    </div>
  )
}
