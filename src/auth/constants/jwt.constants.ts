import * as fs from 'fs';
import * as path from 'path';

const privateKeyPath = path.join(__dirname, '..', '..', '..', 'keys', 'private_key.pem');
const publicKeyPath = path.join(__dirname, '..', '..', '..', 'keys', 'public_key.pem');

export const JWT_PRIVATE_KEY = fs.readFileSync(privateKeyPath, 'utf8');
export const JWT_PUBLIC_KEY = fs.readFileSync(publicKeyPath, 'utf8');

export const JWT_EXPIRES_IN = '1h';