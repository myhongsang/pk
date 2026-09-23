import * as fs from 'fs';
import * as path from 'path';

function findProjectRoot(startDir: string): string {
  let current = startDir;

  for (let i = 0; i < 20; i += 1) {
    if (fs.existsSync(path.join(current, 'package.json'))) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }

    current = parent;
  }

  return startDir;
}

const projectRoot = findProjectRoot(__dirname);

const privateKeyPath = path.join(projectRoot, 'keys', 'private_key.pem');
const publicKeyPath = path.join(projectRoot, 'keys', 'public_key.pem');

export const JWT_PRIVATE_KEY = fs.readFileSync(privateKeyPath, 'utf8');
export const JWT_PUBLIC_KEY = fs.readFileSync(publicKeyPath, 'utf8');

export const JWT_EXPIRES_IN = '1h';

export const JWT_ALGORITHM = 'RS256';

export const JWT_IGNORE_EXPIRATION = false;
