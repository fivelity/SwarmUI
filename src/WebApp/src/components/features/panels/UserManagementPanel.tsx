import { useEffect, useState } from 'react';
import { Button } from '../core/Button';
import { TextInput } from '../core/TextInput';
import { ParameterGroup } from '../layout/ParameterGroup';
import { Tabs, Tab } from '../core/Tabs';

const api = {
    listUsers: async () => fetch('/API/Admin/ListUsers').then(res => res.json()),
    addUser: async (username, password) => fetch(`/API/Admin/AddUser?username=${username}&password=${password}`, { method: 'POST' }).then(res => res.json()),
    deleteUser: async (id) => fetch(`/API/Admin/DeleteUser?id=${id}`, { method: 'POST' }).then(res => res.json()),
    updateUserRoles: async (id, roles_csv) => fetch(`/API/Admin/UpdateUserRoles?id=${id}&roles_csv=${roles_csv}`, { method: 'POST' }).then(res => res.json()),
    changeUserPassword: async (id, new_password) => fetch(`/API/Admin/ChangeUserPassword?id=${id}&new_password=${new_password}`, { method: 'POST' }).then(res => res.json()),

    listRoles: async () => fetch('/API/Admin/ListRoles').then(res => res.json()),
    addRole: async (id, name) => fetch(`/API/Admin/AddRole?id=${id}&name=${name}`, { method: 'POST' }).then(res => res.json()),
    deleteRole: async (id) => fetch(`/API/Admin/DeleteRole?id=${id}`, { method: 'POST' }).then(res => res.json()),
    updateRolePermissions: async (id, permissions_csv) => fetch(`/API/Admin/UpdateRolePermissions?id=${id}&permissions_csv=${permissions_csv}`, { method: 'POST' }).then(res => res.json()),

    listPermissions: async () => fetch('/API/Admin/ListPermissions').then(res => res.json()),
};

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [newUser, setNewUser] = useState({ username: '', password: '' });

    const fetchUsersAndRoles = async () => {
        setUsers(await api.listUsers());
        setRoles(await api.listRoles());
    };

    useEffect(() => { fetchUsersAndRoles(); }, []);

    const handleAddUser = async () => {
        await api.addUser(newUser.username, newUser.password);
        setNewUser({ username: '', password: '' });
        fetchUsersAndRoles();
    };

    const handleDeleteUser = async (id) => {
        await api.deleteUser(id);
        fetchUsersAndRoles();
    };

    const handleUpdateUserRoles = async (userId, currentRoles) => {
        const newRoles = prompt(`Enter new roles (comma-separated) for ${userId}:`, currentRoles.join(','));
        if (newRoles !== null) {
            await api.updateUserRoles(userId, newRoles);
            fetchUsersAndRoles();
        }
    };

    const handleChangeUserPassword = async (userId) => {
        const newPassword = prompt(`Enter new password for ${userId}:`);
        if (newPassword !== null) {
            await api.changeUserPassword(userId, newPassword);
            alert('Password changed.');
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <ParameterGroup title="Add New User">
                <TextInput placeholder="Username" value={newUser.username} onChange={e => setNewUser(p => ({ ...p, username: e.target.value }))} />
                <TextInput type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))} />
                <Button onClick={handleAddUser}>Add User</Button>
            </ParameterGroup>
            <ParameterGroup title="Existing Users">
                <table className="w-full text-left table-auto">
                    <thead>
                        <tr><th>ID</th><th>Username</th><th>Roles</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.roles.join(', ')}</td>
                                <td className="flex gap-2">
                                    <Button onClick={() => handleUpdateUserRoles(user.id, user.roles)}>Edit Roles</Button>
                                    <Button onClick={() => handleChangeUserPassword(user.id)}>Change Password</Button>
                                    <Button onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </ParameterGroup>
        </div>
    );
};

const RoleList = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [newRole, setNewRole] = useState({ id: '', name: '' });

    const fetchRolesAndPermissions = async () => {
        setRoles(await api.listRoles());
        setPermissions(await api.listPermissions());
    };

    useEffect(() => { fetchRolesAndPermissions(); }, []);

    const handleAddRole = async () => {
        await api.addRole(newRole.id, newRole.name);
        setNewRole({ id: '', name: '' });
        fetchRolesAndPermissions();
    };

    const handleDeleteRole = async (id) => {
        await api.deleteRole(id);
        fetchRolesAndPermissions();
    };

    const handleUpdateRolePermissions = async (roleId, currentPermissions) => {
        const newPermissions = prompt(`Enter new permissions (comma-separated) for ${roleId}:`, currentPermissions.join(','));
        if (newPermissions !== null) {
            await api.updateRolePermissions(roleId, newPermissions);
            fetchRolesAndPermissions();
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <ParameterGroup title="Add New Role">
                <TextInput placeholder="Role ID" value={newRole.id} onChange={e => setNewRole(p => ({ ...p, id: e.target.value }))} />
                <TextInput placeholder="Role Name" value={newRole.name} onChange={e => setNewRole(p => ({ ...p, name: e.target.value }))} />
                <Button onClick={handleAddRole}>Add Role</Button>
            </ParameterGroup>
            <ParameterGroup title="Existing Roles">
                <table className="w-full text-left table-auto">
                    <thead>
                        <tr><th>ID</th><th>Name</th><th>Permissions</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {roles.map(role => (
                            <tr key={role.id}>
                                <td>{role.id}</td>
                                <td>{role.name}</td>
                                <td>{role.permissions.join(', ')}</td>
                                <td className="flex gap-2">
                                    <Button onClick={() => handleUpdateRolePermissions(role.id, role.permissions)}>Edit Permissions</Button>
                                    <Button onClick={() => handleDeleteRole(role.id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </ParameterGroup>
        </div>
    );
};

export const UserManagementPanel = () => {
    return (
        <Tabs>
            <Tab label="Users">
                <UserList />
            </Tab>
            <Tab label="Roles">
                <RoleList />
            </Tab>
        </Tabs>
    );
};
