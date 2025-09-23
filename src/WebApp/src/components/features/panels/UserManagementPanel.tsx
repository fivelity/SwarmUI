import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ParameterGroup } from '@/components/layout/ParameterGroup';

import {
    listUsers,
    addUser,
    deleteUser,
    updateUserRoles,
    listRoles,
    addRole,
    deleteRole,
    // updateRolePermissions, // TODO: Implement permission editing UI
    // listPermissions, // TODO: Implement permission editing UI
} from '@/services/api';

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
    const { t } = useTranslation();
    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState({ username: '', password: '' });
    const [editingRoles, setEditingRoles] = useState<User | null>(null);
    const [newRoles, setNewRoles] = useState('');

    const fetchUsers = async () => setUsers(await listUsers());

    useEffect(() => { fetchUsers(); }, []);

    const handleAddUser = async () => {
        await addUser(newUser.username, newUser.password);
        setNewUser({ username: '', password: '' });
        fetchUsers();
    };

    const handleDeleteUser = async (id: string) => {
        await deleteUser(id);
        fetchUsers();
    };

    const handleUpdateUserRoles = async () => {
        if (editingRoles) {
            await updateUserRoles(editingRoles.id, newRoles);
            setEditingRoles(null);
            fetchUsers();
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <ParameterGroup title={t('Add New User')}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input placeholder={t('Username')} value={newUser.username} onChange={e => setNewUser(p => ({ ...p, username: e.target.value }))} />
                    <Input type="password" placeholder={t('Password')} value={newUser.password} onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))} />
                    <Button onClick={handleAddUser}>{t('Add User')}</Button>
                </div>
            </ParameterGroup>
            <ParameterGroup title={t('Existing Users')}>
                <Table>
                    <TableHeader><TableRow><TableHead>{t('ID')}</TableHead><TableHead>{t('Username')}</TableHead><TableHead>{t('Roles')}</TableHead><TableHead className="text-right">{t('Actions')}</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.roles.join(', ')}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Dialog>
                                        <DialogTrigger asChild><Button variant="outline">{t('Edit Roles')}</Button></DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader><DialogTitle>{t('Edit Roles for')} {user.username}</DialogTitle></DialogHeader>
                                            <Input defaultValue={user.roles.join(', ')} onChange={e => setNewRoles(e.target.value)} />
                                            <DialogFooter><Button onClick={handleUpdateUserRoles}>{t('Save')}</Button></DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                    <Button variant="destructive" onClick={() => handleDeleteUser(user.id)}>{t('Delete')}</Button>
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
    const { t } = useTranslation();
    const [roles, setRoles] = useState<Role[]>([]);
    const [newRole, setNewRole] = useState({ id: '', name: '' });

    const fetchRoles = async () => setRoles(await listRoles());

    useEffect(() => { fetchRoles(); }, []);

    const handleAddRole = async () => {
        await addRole(newRole.id, newRole.name);
        setNewRole({ id: '', name: '' });
        fetchRoles();
    };

    const handleDeleteRole = async (id: string) => {
        await deleteRole(id);
        fetchRoles();
    };

    return (
        <div className="flex flex-col gap-4">
            <ParameterGroup title={t('Add New Role')}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input placeholder={t('Role ID')} value={newRole.id} onChange={e => setNewRole(p => ({ ...p, id: e.target.value }))} />
                    <Input placeholder={t('Role Name')} value={newRole.name} onChange={e => setNewRole(p => ({ ...p, name: e.target.value }))} />
                    <Button onClick={handleAddRole}>{t('Add Role')}</Button>
                </div>
            </ParameterGroup>
            <ParameterGroup title={t('Existing Roles')}>
                <Table>
                    <TableHeader><TableRow><TableHead>{t('ID')}</TableHead><TableHead>{t('Name')}</TableHead><TableHead>{t('Permissions')}</TableHead><TableHead className="text-right">{t('Actions')}</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {roles.map(role => (
                            <TableRow key={role.id}>
                                <TableCell>{role.id}</TableCell>
                                <TableCell>{role.name}</TableCell>
                                <TableCell>{role.permissions.join(', ')}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    {/* TODO: Implement permission editing with a dialog */}
                                    <Button variant="destructive" onClick={() => handleDeleteRole(role.id)}>{t('Delete')}</Button>
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
    const { t } = useTranslation();
    return (
        <Tabs defaultValue="users" className="w-full">
            <TabsList>
                <TabsTrigger value="users">{t('Users')}</TabsTrigger>
                <TabsTrigger value="roles">{t('Roles')}</TabsTrigger>
            </TabsList>
            <TabsContent value="users"><UserList /></TabsContent>
            <TabsContent value="roles"><RoleList /></TabsContent>
        </Tabs>
    );
};
