import crypto from 'crypto';

const SECRETE = (process.env.SECRET_KEY) || "PayBuddy234";

export const random = () => crypto.randomBytes(128).toString('base64');
export const authentication = (salt: string, password: string) => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRETE).digest('hex');
}
export const decryption = (data: string, SECRETE: string) => {
    const iv = crypto.randomBytes(128).toString('base64')
    let pro = crypto.createDecipheriv('aes-256-cbc', Buffer.from(SECRETE), iv)
    let dData = pro.update(data, 'hex', 'utf8')
    dData += pro.final('utf8');
    return dData
}