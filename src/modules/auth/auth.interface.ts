import type { ROLES } from "../../types";

export interface Tuser {
    name: string,
    email: string,
    password: string,
    role?: ROLES
}