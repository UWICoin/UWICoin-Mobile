import { Roles } from "../roles/roles.models";
import { IAccount } from "../account/account.models";

export interface User {
    account_setup?: boolean;
    account?: IAccount;
    full_name?: string;
    email?: string;
    password?: string;
    photoURL?: string;
    uid?: string;
    role?: Roles;
}