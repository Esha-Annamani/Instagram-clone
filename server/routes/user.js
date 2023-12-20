const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const User = mongoose.model("User")
const Post = mongoose.model("Post")
const requireLogin = require('../middlewares/requireLogin')
  
router.get('/user/:id',requireLogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then((user)=>{
        Post.find({postedBy:req.params.id})
        .populate('postedBy',"_id name")
        .then(posts=>{
            res.json({user,posts})
        })
        .catch(err=>res.status(422).json({error:err}))
    }).catch(err=>res.status(404).json({error:"User not found"}))
})

router.put('/follow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(
        req.body.followId,
        { $push: { followers: req.user._id } },
        { new: true }
    )
    .then((result1) => {
        User.findByIdAndUpdate(
            req.user._id,
            { $push: { following: req.body.followId } },
            { new: true }
        ).select("-password")
        .then((result2) => {
            res.json(result2); 
        })
        .catch((err) => {
            return res.status(422).json({ error: err.message });
        });
    })
    .catch((err) => {
        return res.status(422).json({ error: err.message });
    });
});

router.put('/unfollow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(
        req.body.unfollowId,
        { $pull: { followers: req.user._id } },
        { new: true }
    )
    .then((result1) => {
        User.findByIdAndUpdate(
            req.user._id,
            { $pull: { following: req.body.unfollowId } },
            { new: true }
        ).select("-password")
        .then((result2) => {
            res.json(result2); 
        })
        .catch((err) => {
            return res.status(422).json({ error: err.message });
        });
    })
    .catch((err) => {
        return res.status(422).json({ error: err.message });
    });
});

router.put('/updatepic',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,
        {$set:{pic:req.body.pic}},{new:true}
        ).then(result=>req.json(result))
        .catch(err=>res.status(422).json({error:"Profile pic annot be updated."}))
})


module.exports = router