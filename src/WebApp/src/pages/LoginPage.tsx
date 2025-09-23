import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { doPasswordClientPrehash } from '@/services/auth';

const api = {
    login: async (username: string, password: string): Promise<any> => fetch('/API/Login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) }).then(res => res.json()),
};

export const LoginPage = () => {
    const { t } = useTranslation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (username.length < 3) {
            setError('Please enter a valid username.');
            return;
        }
        if (password.length < 8) {
            setError('Please enter a valid password.');
            return;
        }
        setLoading(true);
        setError('');
        const hashedPassword = await doPasswordClientPrehash(username, password);
        const result = await api.login(username, hashedPassword);
        if (result.success) {
            window.location.href = '/';
        }
        else {
            setError(result.error || 'An unknown error occurred.');
        }
        setLoading(false);
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>{t('Login to SwarmUI')}</CardTitle>
                    <CardDescription>{t('Enter your credentials to continue.')}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Input placeholder={t('Username')} value={username} onChange={e => setUsername(e.target.value)} />
                    <Input type="password" placeholder={t('Password')} value={password} onChange={e => setPassword(e.target.value)} />
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button onClick={handleLogin} disabled={loading}>{loading ? t('Logging in...') : t('Login')}</Button>
                </CardContent>
            </Card>
        </div>
    );
};
