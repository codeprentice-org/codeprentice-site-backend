import { Types, Document } from "mongoose";
import { Request, Response, NextFunction } from "express";
import { UserType } from "../types/user";
import { UserModel, UserSchema } from "../models/user.model";
import jwt from "jsonwebtoken";
import { Secret } from "jsonwebtoken";
import { ROLE } from "../enums/role";
import { AxiosResponse } from "axios";
import HttpError from "../errors/HttpError";
import GitHubError from "../errors/GitHubError";
import qs from "qs";
import axios from "axios";
import { Model } from "mongoose";

// localhost:4200/user/github/login

// GET /user/github/login
const loginOrCreateUser = async (req: Request, res: Response, next: NextFunction) => {
    // Redirect caller to the GitHub auth web flow with our app credentials
    res.redirect("https://github.com/login/oauth/authorize?" + qs.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        scope: "read:org read:user user:email",
        redirect_uri: "http://localhost:4200/user/github/callback"
    }))
};

// GET /user/github/callback
const gitHubCallback = async (req: Request, res: Response, next: NextFunction) => {
    // After successfull auth on GitHub, a code is sent back. We POST it back
    // to exchange it for an access token
    const body = {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: req.query.code // The code we received from GitHub
    };
    const opts = { headers: { accept: 'application/json' } };
    await axios.post(`https://github.com/login/oauth/access_token`, body, opts)
    .then((post_res:AxiosResponse) => {
        handleUser(req, res, post_res.data.access_token);
    })
    .catch((err:Error) => res.status(500).json({ error: "Error logging in with GitHub" }));
};

// GET /user
const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {

};

// GET /user/:id
const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if(!Types.ObjectId.isValid(id)){
        res.status(400).json({ error: "Invalid id" })
    }
    await UserModel.findById(req.params.id.toString())
    .then((result:any) => {
        if(result){
            res.status(200).json({ user: result });
        }else{
            res.status(404).json({ error: "User not found"});
        }
    });
};

// GET /user/all?page={},per={}
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    const myCustomLabels = {
        totalDocs: "itemCount",
        docs: "itemsList",
        limit: "perPage",
        page: "currentPage",
        nextPage: "next",
        prevPage: "prev",
        totalPages: "pageCount",
        meta: "paginator",
      };
    const options = {
        select: "_id githubId name avatarUrl admin",
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 5,
        sort: { name: 1 },
        customLabels: myCustomLabels
    };
    await UserModel.paginate({}, options)
    .then((result:any) => {
        res.status(200).send({ users: result.itemsList, paginator: result.paginator });
    })
    .catch((err:Error) => res.status(500).json({ data: "Something went wrong :(" }));

};

// ================ helpers ================

const handleUser = async (req: Request, res: Response, token:string) => {
    
    // use token to find membership
    await axios.get('https://api.github.com/user/memberships/orgs/codeprentice-org',
    { headers: { 
        authorization: "token " + token,
        accept: "application/vnd.github.v3+json" 
    } })
    .then((r:AxiosResponse) => {
        // login or create user
        const orgUserData = r.data.user
        UserModel.findOne({ githubId: orgUserData.id })
        .exec()
        .then(async (resolve) =>  {
            if(!resolve){
                console.log("Creating user.");
                createUser(req, res, orgUserData, token);
            }else{
                console.log("Logging in.")
                const user: UserType = resolve.toObject();
                const token = jwt.sign(user, process.env.JWT_KEY as Secret, { expiresIn: '1h' });
                console.log("User with email: ${user.email} logged in");
                return res.status(200).json({
                    status: 0,
                    data: { token: token }
                }); 
            }
        })
    })
    .catch((err:Error) => res.status(500).json({ message: err.message }));
};

const createUser = async (req: Request, res: Response, orgUserData:any, token:string) => {
    await getUserData(req, res, orgUserData.url, token)
        .then((userData:any) => {
            console.log(userData);
            const newUser = new UserModel({
                _id: new Types.ObjectId(),
                githubId: userData.id,
                name: userData.name || userData.login,
                email: userData.email,
                username: userData.login,
                avatarUrl: userData.avatar_url,
                admin: orgUserData.role === "member" ? false : true,
                ROLE: ROLE.MEMBER
            });
            newUser.save()
                .then((resolve:any) => {
                    console.log(resolve)
                    res.status(200).json({ message: "Created user"})
                })
                .catch((resolve:any) => {
                    console.log(resolve);
                    res.status(500).json({
                        status: 1,
                        data: "Failed to create user"
                    });
                });
        })
        .catch((err:Error) => res.status(500).json({ message: err.message }));
};

const getUserData = async (req: Request, res: Response, url:string, token:string) => {
    const response:any = await axios.get(url,
        { headers: { 
                authorization: "token " + token,
                accept: "application/vnd.github.v3+json" 
        } });
    return (({ id, name, email, login, avatar_url }) => ({ id, name, email, login, avatar_url }))(response.data);
}

// Changes user username give a request body container user: { newUsername: string }
// Just for testing
// const changeUsername = async (req: Request, res: Response, next: NextFunction) => {
//     const user: UserType = req.body.user;
//     const newUsername: string = req.body.newUsername;
//     UserModel.updateOne({ _id: user._id }, {"$set": { "username": newUsername } })
//         .exec()
//         .then((resolve) => {
//             console.log(resolve);
//             return res.status(200)
//                .send("Username Successfully Updated");
//         })
//         .catch(() => {
//             return res.status(401).json({
//                 status: 1,
//                 data: "Failed to Change Username"
//             });
//         });
// };


export { loginOrCreateUser, gitHubCallback, getCurrentUser, getUser, getAllUsers };
