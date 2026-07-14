import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface Payload {
    id: number;
    email: string;
}

export function generateToken(payload: Payload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "1d",
    });
}

export function verifyToken(token: string): Payload {
    return jwt.verify(token, JWT_SECRET) as Payload;
}