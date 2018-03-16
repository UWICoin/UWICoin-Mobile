import { Roles } from "../roles/roles.models";

export interface User {
    account_setup?: boolean;
    addresses?: any;
    full_name?: string;
    email?: string;
    password?: string;
    photoURL?: string;
    uid?: string;
    role?: Roles;
}