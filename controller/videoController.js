import fs from "fs";
import routes from "../routess";
import Video from "../models/Video";

export const home = async (req, res) => {
    try {
        const videos = await Video.find({}); 
        res.render('home', { pageTitle: 'Home', videos });
    } catch(error) {
        console.error(error);
        res.render('home', { pageTitle: 'Home', videos : []});
    }
};

export const search = async (req, res) => {
    const {
        query: { term: searchingBy }
    } = req;
    let videos = [];
    try {
        videos = await Video.find({title: { $regex: searchingBy, $options: "i" } });
    } catch (error) {
       console.error(error); 
    }
    res.render("search", { pageTitle: 'Search', searchingBy, videos });
};

//export const videos = (req, res) => res.render("videos");
// 비디오 업로드
export const getUpload = (req, res) => 
    res.render("upload", { pageTitle: 'Upload' });

export const postUpload = async (req, res) => {
    const { 
        body : { title, description },
        file: { path }
    } = req;
    const newVideo = await Video.create({
        fileUrl: path,
        title,
        description,
        creator: req.user.id
    });
    console.log(newVideo);
    // upload and save video
    req.user.videos.push(newVideo.id);
    req.user.save();
    res.redirect(routes.videoDetail(newVideo.id));
};


export const videoDetail = async (req, res) => {
    const {
        params: {id}
    } = req;
    try {
        const video = await Video.findById(id).populate("creator");
        console.log(video);
        res.render("videoDetail", { pageTitle: video.title, video });
    } catch (error) {
        console.error(error);
        res.redirect(routes.home);
    }
};

export const getEditVideo = async (req, res) => {
    const {
        params: {id}
    } = req;
    try {
        const video = await Video.findById(id);
        if(video.creator.toString() !== req.user.id){
            throw Error();
        } else {
            res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
        }
    } catch (error) {
        res.redirect(routes.home);
    }
};

export const postEditVideo =  async (req, res) => {
    const {
        params: {id},
        body: { title, description },
    } = req;
    try {
        await Video.findOneAndUpdate({ _id: id }, { title, description });
        res.redirect(routes.videoDetail(id));
    } catch (error) {
        res.redirect(routes.home);
    }
};


export const deleteVideo =  async (req, res) => {
    const {
        params : {id}
    } = req;
    try {
        const video = await Video.findById(id);
        if(video.creator.toString() !== req.user.id){
            throw Error();
        } else {
            await Video.findOneAndRemove({_id: id});
            fs.unlinkSync(video.fileUrl); // 폴더에 비디오 삭제하기 귀찮으니까...
        }
        //console.log(video);
    } catch (error) {
        console.error(error);
    }
    res.redirect(routes.home);
};