import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const hashPassword = (password: string) => {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export const random = (numberChar: number) => {
    return crypto.randomBytes(numberChar).toString('hex');
}

export const createJWT = (user: any, exp: string) => {
    return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: exp });
}

export const readJWT = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}