import { ROLE } from "../enums/role";
import { Types } from "mongoose";

export type UserType = {
    _id: Types.ObjectId;
    githubId: string;
    email: string;
    username: string;
    name: string;
    avatarUrl: string;
    admin: Boolean;
    ROLE: ROLE;
}

export interface UserInt {
    _id: Types.ObjectId;
    githubId: string;
    email: string;
    username: string; 
    name: string;
    admin: Boolean;
    ROLE: ROLE;
}