import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../api'; // adjust path based on your file location



interface User {
    id: number;
    name: string;
    email: string;
    role: string; // You can add more user fields as needed
}

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch users from API
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true); // Set loading to true before fetching data
            setError(null); // Clear any previous error

            try {
                const response = await axios.get(`${API_BASE_URL}/api/users`);
                setUsers(response.data); // Update state with fetched data
            } catch (err: any) {
                console.error('Error fetching users:', err);
                setError(err.response?.data?.message || 'Failed to load users'); // Set error state
            } finally {
                setLoading(false); // Set loading to false after the request is done
            }
        };


        fetchUsers();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Users</h1>
            <table className="min-w-full border-collapse">
                <thead>
                    <tr>
                        <th className="border-b p-2">ID</th>
                        <th className="border-b p-2">Name</th>
                        <th className="border-b p-2">Email</th>
                        <th className="border-b p-2">Role</th>
                        <th className="border-b p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td className="border-b p-2">{user.id}</td>
                            <td className="border-b p-2">{user.name}</td>
                            <td className="border-b p-2">{user.email}</td>
                            <td className="border-b p-2">{user.role}</td>
                            <td className="border-b p-2">
                                <button
                                    onClick={() => handleEdit(user.id)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="ml-2 px-4 py-2 bg-red-500 text-white rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    function handleEdit(id: number) {
        // Logic to navigate to edit user page, for example:
        // navigate(`/ admin / users / edit / ${ id }`);
    }

    function handleDelete(id: number) {
        // Logic to delete user
        if (window.confirm('Are you sure you want to delete this user?')) {
            axios
                .delete(`http://localhost:5000/api/users/${id}`) // Replace with your API endpoint
                .then(() => {
                    setUsers(users.filter((user) => user.id !== id)); // Update the users state after deletion
                })
                .catch((err) => {
                    setError('Failed to delete user');
                });
        }
    }
};

export default AdminUsers;
