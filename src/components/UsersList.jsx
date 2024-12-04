import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [message, setMessage] = useState('');
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [page]);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`https://reqres.in/api/users?page=${page}`);
      const data = await response.json();
      const filteredUsers = data.data.filter((user) => !deletedUsers.includes(user.id));
      const persistedUsers = JSON.parse(localStorage.getItem('users')) || [];
      const usersWithPersistedData = filteredUsers.map((user) => {
        const persistedUser = persistedUsers.find((persisted) => persisted.id === user.id);
        return persistedUser ? persistedUser : user;
      });

      setUsers(usersWithPersistedData);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const filterUsers = () => {
    if (!searchQuery) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const response = await fetch(`https://reqres.in/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser),
      });

      if (response.ok) {
        setMessage('User updated successfully');
        setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
        const updatedUsers = users.map(u => (u.id === editingUser.id ? editingUser : u));
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        setEditingUser(null);
      } else {
        setMessage('Failed to update user');
      }
    } catch (error) {
      setMessage('An error occurred while updating user');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://reqres.in/api/users/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('User deleted successfully');
        setDeletedUsers((prev) => [...prev, id]);
        setUsers(users.filter(u => u.id !== id));
      } else {
        setMessage('Failed to delete user');
      }
    } catch (error) {
      setMessage('An error occurred while deleting user');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employwise FE Assignment</h1>
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {message && <p className="text-center text-green-600 font-medium mb-4">{message}</p>}
      <div className="mb-6 max-w-screen-lg mx-auto">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
        />
      </div>

      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={editingUser?.first_name || ''}
                onChange={(e) => setEditingUser({ ...editingUser, first_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={editingUser?.last_name || ''}
                onChange={(e) => setEditingUser({ ...editingUser, last_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editingUser?.email || ''}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src={user.avatar} alt={`${user.first_name} ${user.last_name}`} />
                <AvatarFallback>{user.first_name[0]}{user.last_name[0]}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-center">{`${user.first_name} ${user.last_name}`}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600 mb-4">{user.email}</p>
              <div className="flex justify-between">
                <Button onClick={() => handleEdit(user)}>Edit</Button>
                <Button variant="destructive" onClick={() => handleDelete(user.id)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-center space-x-4">
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

