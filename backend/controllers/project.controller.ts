import { Request, Response, NextFunction } from "express";
import { ProjectModel } from "../models/project.model";
import { UserModel } from "../models/user.model";
import { Types, Schema } from "mongoose";

// Creates a new project give a request body containing project: { name: string }
// Just for testing
const createProject = async (req: Request, res: Response, next: NextFunction) => {
    const projectInfo = req.body.project;
    const teamMember = await UserModel.findOne({ _id: req.body.user._id }).exec(); 
    const newProject = new ProjectModel({
        _id: new Types.ObjectId(),
        name: projectInfo.name,
        team: [(teamMember)? teamMember.toObject(): undefined]
    });
    newProject.save()
              .then((resolve:any) => {
                  console.log(resolve);
                  res.status(200)
                    .send("Project was successfully created");
              })
              .catch(() => {
                  res.status(401)
                     .send("Unable to create new project");
              });
};

export { createProject }
