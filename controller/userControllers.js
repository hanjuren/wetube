import passport from "passport";
import routes from "../routess";
import User from "../models/User";

export const getJoin = (req, res) => {
    res.render("join", { pageTitle: 'Join' });
};

export const postJoin = async(req, res, next) => {
    console.log(req.body);
    const {
        body: { name, email, password, password2 }
    } = req;
    if(password !== password2) {
        res.status(400);
        res.render("join", { pageTitle: 'Join' });
    } else {
        try{
            const user = await User({
                name,
                email
            });
            await User.register(user, password);
            next();
        } catch (error) {
            console.log(error);
            res.redirect(routes.home);
        }
        // To Do : Log User In
    }  
};

export const getLogin = (req, res) => res.render("login", { pageTitle: 'Login' });

export const postLogin = passport.authenticate('local', {
        failureRedirect: routes.login,
        successRedirect: routes.home

});

// 깃허브 로그인
export const githubLogin = passport.authenticate('github');

export const githubLoginCallback = async (accessToken, refreshToken, profile, cb) => {
    const { _json: {id, avatar_url: avatarUrl, name, email} } = profile;
    try {
        const user = await User.findOne({email});
        if(user){
            user.githubId = id;
            user.save();
            return cb(null, user);
        }
        const newUser = await User.create({
            email,
            name,
            githubId: id,
            avatarUrl
        });
        return cb(null, newUser);
        
    } catch(error) {
        return cb(error);
    }
};

export const postGithubLogin = (req, res) => {
    res.redirect(routes.home);
};

// 페이스북 로그인
// export const facebookLogin = passport.authenticate("facebook");

// export const fcebookLoginCallback = (accessToken, refreshToken, profile, cb) => {
//     console.log(accessToken, refreshToken, profile, cb);
// };

// export const postFacebookLogin = (req, res) => {
//     res.redirect(routes.home);
// };

export const logout = (req, res) => {
    // TO DO logout
    req.logout();
    req.session.destroy();
    res.redirect(routes.home);
};
    
//export const users = (req, res) => res.render("Users");

export const getMe = (req, res) => {
    res.render("userDetail", { pageTitle: 'User Detail', user: req.user });
};

export const userDetail = async (req, res) => {
    const { params: {id} } = req;
    try {
        const user = await User.findById({_id: id });
        res.render("userDetail", { pageTitle: 'User Detail', user });
    } catch(error) {
        res.redirect(routes.home);
    }
};

export const editProfile = (req, res) => res.render("editProfile", { pageTitle: 'Edit Profile' });
export const changePassword = (req, res) => res.render("changePassword", { pageTitle: 'Change Password' });