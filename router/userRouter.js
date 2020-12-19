import express from "express";
import routes from "../routess";
import {
    users,
    userDetail,
    editProfile,
    changePassword
} from "../controller/userController";

const userRouter = express.Router();
//userRouter.get(routes.users, users);
userRouter.get(routes.editProfile, editProfile);
userRouter.get(routes.changePassword, changePassword);
userRouter.get(routes.userDetail, userDetail);

export default userRouter;