import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";

export default function UsersList() {
  const [users, setUsers] = useState([]); 
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchAllUsers(); 
    fetchUsers();  
  }, [page]);

  useEffect(() => {
    filterUsers();
  }, [users, allUsers, searchQuery]);
  

  const fetchAllUsers = async () => {
    try {
      const response = await fetch('https://reqres.in/api/users?per_page=77'); 
      const data = await response.json();
      setAllUsers(data.data);
    } catch (error) {
      console.error('Error fetching all users:', error);
      toast({
        title: "❌ Error",
        description: "Failed to fetch all users for search.",
        variant: "destructive",
      });
    }
  };

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
      toast({
        title: "❌ Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filterUsers = () => {
    if (!searchQuery) {
      setFilteredUsers(users); // Default to paginated users if no search query
    } else {
      const filtered = allUsers.filter(user =>
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
  
    const originalUser = allUsers.find(user => user.id === editingUser.id);
    if (
      originalUser.first_name === editingUser.first_name &&
      originalUser.last_name === editingUser.last_name &&
      originalUser.email === editingUser.email
    ) {
      toast({
        title: "⚠️ No Changes",
        description: "No updates were made to the user details.",
      });
      return;
    }
  
    try {
      const response = await fetch(`https://reqres.in/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser),
      });
  
      if (response.ok) {
        // Update `users` and `allUsers` state arrays
        const updatedUsers = users.map(u => (u.id === editingUser.id ? editingUser : u));
        const updatedAllUsers = allUsers.map(u => (u.id === editingUser.id ? editingUser : u));
  
        // Update `localStorage`
        const persistedUsers = JSON.parse(localStorage.getItem('users')) || [];
        const updatedPersistedUsers = persistedUsers.filter(u => u.id !== editingUser.id);
        updatedPersistedUsers.push(editingUser);
        localStorage.setItem('users', JSON.stringify(updatedPersistedUsers));
  
        setUsers(updatedUsers); // Update the paginated list
        setAllUsers(updatedAllUsers); // Update the search source
  
        setEditingUser(null); // Close the dialog
        toast({
          title: "✅ Success",
          description: "User updated successfully.",
        });
      } else {
        toast({
          title: "❌ Error",
          description: "Failed to update user.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "An error occurred while updating user.",
        variant: "destructive",
      });
    }
  };
  
  
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://reqres.in/api/users/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDeletedUsers((prev) => [...prev, id]);
        setUsers(users.filter(u => u.id !== id));
        toast({
          title: "✅ Success",
          description: "User deleted successfully",
        });
      } else {
        toast({
          title: "❌ Error",
          description: "Failed to delete user",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "An error occurred while deleting user",
        variant: "destructive",
      });
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
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink 
                  onClick={() => setPage(index + 1)}
                  active={index + 1 === page}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
