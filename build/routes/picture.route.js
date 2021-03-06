"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PICTURE_API = void 0;
const express_1 = __importDefault(require("express"));
exports.PICTURE_API = express_1.default.Router();
// Endpoints to get pictures
exports.PICTURE_API.get("/code", (req, res) => {
    res.sendFile("../static/code.jpg");
});
exports.PICTURE_API.get("/coding", (req, res) => {
    res.sendFile("../static/coding.jpg");
});
exports.PICTURE_API.get("/dark", (req, res) => {
    res.sendFile("../static/dark.png");
});
exports.PICTURE_API.get("/githubLogo", (req, res) => {
    res.sendFile("../static/github_logo.png");
});
exports.PICTURE_API.get("/codeprenticeLogo", (req, res) => {
    res.sendFile("../static/logo.png");
});
exports.PICTURE_API.get("/:username", (req, res) => {
    res.sendFile("../static/logo.png");
});
