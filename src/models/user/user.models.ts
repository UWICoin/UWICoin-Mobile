import { Roles } from "../roles/roles.models";

export interface User {
    full_name?: string;
    email?: string;
    password?: string;
    uid?: string;
    role: Roles;
}