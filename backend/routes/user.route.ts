import express from "express";
import { checkAuth }  from "../middleware/check-auth";
import { 
    loginOrCreateUser,
    gitHubCallback,
    getUser, 
    getCurrentUser,
    getAllUsers
} from "../controllers/user.controller";

export const USER_API = express.Router();

// gets user from GitHub -- either signs jwt or creates new user
USER_API.get("/github/login", loginOrCreateUser);

// callback route
USER_API.get("/github/callback", gitHubCallback);

// get all users
USER_API.get("/all", getAllUsers);

//get data of current user
USER_API.get("/", checkAuth, getCurrentUser);

// get data of another user
USER_API.get("/:id", getUser);



// Changes user username given a request body containing user: { newUsername: string }
//USER_API.post("/change_username", checkAuth, changeUsername);

// Creates new user given a request body containing user: { email: string, username: string, name: string }
//USER_API.post("/create_user", createUser);
