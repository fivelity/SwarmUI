import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { listPermissions, updateRolePermissions } from '@/services/api';
import { Role } from '@/types/index';

interface EditRolePermissionsDialogProps {
    role: Role;
    onSave: () => void;
}

export const EditRolePermissionsDialog = ({ role, onSave }: EditRolePermissionsDialogProps) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [allPermissions, setAllPermissions] = useState<string[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            const fetchPermissions = async () => {
                const perms = await listPermissions();
                setAllPermissions(perms);
                setSelectedPermissions(role.permissions || []);
            };
            fetchPermissions();
        }
    }, [isOpen, role]);

    const handlePermissionToggle = (permission: string) => {
        setSelectedPermissions(prev =>
            prev.includes(permission)
                ? prev.filter(p => p !== permission)
                : [...prev, permission]
        );
    };

    const handleSave = async () => {
        await updateRolePermissions(role.id, selectedPermissions.join(','));
        onSave();
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">{t('Edit Permissions')}</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t('Edit Permissions for Role')}: {role.name}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-2 py-4">
                    {allPermissions.map(permission => (
                        <div key={permission} className="flex items-center space-x-2">
                            <Checkbox
                                id={`perm-${permission}`}
                                checked={selectedPermissions.includes(permission)}
                                onCheckedChange={() => handlePermissionToggle(permission)}
                            />
                            <Label htmlFor={`perm-${permission}`} className="font-normal">
                                {permission}
                            </Label>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button onClick={handleSave}>{t('Save Permissions')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
