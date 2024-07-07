import { UserPayload } from "../../services/data";

declare global {
    namespace Express {
        interface Request {
            userPayload?: UserPayload
        }
    }
}