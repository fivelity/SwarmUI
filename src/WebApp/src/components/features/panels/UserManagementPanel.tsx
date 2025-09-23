import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ParameterGroup } from '@/components/layout/ParameterGroup';

// TODO: Move to a dedicated api.ts file and centralize
const api = {
    listUsers: async (): Promise<User[]> => fetch('/API/Admin/ListUsers').then(res => res.json()),
    addUser: async (username, password) => fetch(`/API/Admin/AddUser?username=${username}&password=${password}`, { method: 'POST' }).then(res => res.json()),
    deleteUser: async (id) => fetch(`/API/Admin/DeleteUser?id=${id}`, { method: 'POST' }).then(res => res.json()),
    updateUserRoles: async (id, roles_csv) => fetch(`/API/Admin/UpdateUserRoles?id=${id}&roles_csv=${roles_csv}`, { method: 'POST' }).then(res => res.json()),
    changeUserPassword: async (id, new_password) => fetch(`/API/Admin/ChangeUserPassword?id=${id}&new_password=${new_password}`, { method: 'POST' }).then(res => res.json()),
    listRoles: async (): Promise<Role[]> => fetch('/API/Admin/ListRoles').then(res => res.json()),
    addRole: async (id, name) => fetch(`/API/Admin/AddRole?id=${id}&name=${name}`, { method: 'POST' }).then(res => res.json()),
    deleteRole: async (id) => fetch(`/API/Admin/DeleteRole?id=${id}`, { method: 'POST' }).then(res => res.json()),
    updateRolePermissions: async (id, permissions_csv) => fetch(`/API/Admin/UpdateRolePermissions?id=${id}&permissions_csv=${permissions_csv}`, { method: 'POST' }).then(res => res.json()),
    listPermissions: async (): Promise<string[]> => fetch('/API/Admin/ListPermissions').then(res => res.json()),
};

interface User {
    id: string;
    username: string;
    roles: string[];
}

interface Role {
    id: string;
    name: string;
    permissions: string[];
}

const UserList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState({ username: '', password: '' });
    const [editingRoles, setEditingRoles] = useState<User | null>(null);
    const [newRoles, setNewRoles] = useState('');

    const fetchUsers = async () => setUsers(await api.listUsers());

    useEffect(() => { fetchUsers(); }, []);

    const handleAddUser = async () => {
        await api.addUser(newUser.username, newUser.password);
        setNewUser({ username: '', password: '' });
        fetchUsers();
    };

    const handleDeleteUser = async (id: string) => {
        await api.deleteUser(id);
        fetchUsers();
    };

    const handleUpdateUserRoles = async () => {
        if (editingRoles) {
            await api.updateUserRoles(editingRoles.id, newRoles);
            setEditingRoles(null);
            fetchUsers();
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <ParameterGroup title="Add New User">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input placeholder="Username" value={newUser.username} onChange={e => setNewUser(p => ({ ...p, username: e.target.value }))} />
                    <Input type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))} />
                    <Button onClick={handleAddUser}>Add User</Button>
                </div>
            </ParameterGroup>
            <ParameterGroup title="Existing Users">
                <Table>
                    <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Username</TableHead><TableHead>Roles</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.roles.join(', ')}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Dialog>
                                        <DialogTrigger asChild><Button variant="outline">Edit Roles</Button></DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader><DialogTitle>Edit Roles for {user.username}</DialogTitle></DialogHeader>
                                            <Input defaultValue={user.roles.join(', ')} onChange={e => setNewRoles(e.target.value)} />
                                            <DialogFooter><Button onClick={handleUpdateUserRoles}>Save</Button></DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                    <Button variant="destructive" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ParameterGroup>
        </div>
    );
};

const RoleList = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [newRole, setNewRole] = useState({ id: '', name: '' });

    const fetchRoles = async () => setRoles(await api.listRoles());

    useEffect(() => { fetchRoles(); }, []);

    const handleAddRole = async () => {
        await api.addRole(newRole.id, newRole.name);
        setNewRole({ id: '', name: '' });
        fetchRoles();
    };

    const handleDeleteRole = async (id: string) => {
        await api.deleteRole(id);
        fetchRoles();
    };

    return (
        <div className="flex flex-col gap-4">
            <ParameterGroup title="Add New Role">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input placeholder="Role ID" value={newRole.id} onChange={e => setNewRole(p => ({ ...p, id: e.target.value }))} />
                    <Input placeholder="Role Name" value={newRole.name} onChange={e => setNewRole(p => ({ ...p, name: e.target.value }))} />
                    <Button onClick={handleAddRole}>Add Role</Button>
                </div>
            </ParameterGroup>
            <ParameterGroup title="Existing Roles">
                <Table>
                    <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Permissions</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {roles.map(role => (
                            <TableRow key={role.id}>
                                <TableCell>{role.id}</TableCell>
                                <TableCell>{role.name}</TableCell>
                                <TableCell>{role.permissions.join(', ')}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    {/* TODO: Implement permission editing with a dialog */}
                                    <Button variant="destructive" onClick={() => handleDeleteRole(role.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ParameterGroup>
        </div>
    );
};

export const UserManagementPanel = () => {
    return (
        <Tabs defaultValue="users" className="w-full">
            <TabsList>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="roles">Roles</TabsTrigger>
            </TabsList>
            <TabsContent value="users"><UserList /></TabsContent>
            <TabsContent value="roles"><RoleList /></TabsContent>
        </Tabs>
    );
};
