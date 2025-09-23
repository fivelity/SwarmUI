export async function doPasswordClientPrehash(userId: string, pw: string): Promise<string> {
    if (!userId) {
        throw new Error('Password handling failed, no userId set?');
    }
    const str = `swarmclientpw:${userId}:${pw}`;
    try {
        const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
        return toHexString(new Uint8Array(hash)).toLowerCase();
    }
    catch (e) {
        console.warn(`Crypto.Subtle is invalid in your browser context, passwords won't be prehashed`);
        return `__swarmdoprehash:${str}`;
    }
}

function toHexString(bytes: Uint8Array): string {
    return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
}
