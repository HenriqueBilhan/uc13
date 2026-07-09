import jwt from "jsonwebtoken"
import * as dotenv from "dotenv"
interface Payload {
    id:number
    email: string
}
dotenv.config()
const {JWT_SECRET, JWT_EXPIRES_IN} = process.env
export function generateToken(payload: Payload) {
    return jwt.sign(payload, JWT_SECRET!), {
        expereIn: JWT_EXPIRES_IN
    } 
    }
