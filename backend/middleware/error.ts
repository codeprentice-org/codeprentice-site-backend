import { NextFunction, Request, Response } from "express";
import GitHubError from "../errors/GitHubError";
import HttpError from "../errors/HttpError"

const gitHubErrorMiddleware = (error: GitHubError, request: Request, response: Response, next: NextFunction) => {
    const message = error.message || "Something went wrong";
    response.status(500).json({ message: message });
}

const httpErrorMiddleware = (error: HttpError, request: Request, response: Response, next: NextFunction) => {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    response.status(status).json({ message: message });
  }

export default { gitHubErrorMiddleware, httpErrorMiddleware };