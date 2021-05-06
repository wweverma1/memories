import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';

export const getPosts = async(req, res) => {
    try{
        const postMessages = await PostMessage.find();
        console.log(postMessages);
        res.status(200).json(postMessages);
    }
    catch(error) {
        res.status(404).json({message: error.message});
    }

}

export const createPost = async (req, res) => {
    const post = req.body;

    const newPostMessage = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() })

    try {
        await newPostMessage.save();

        res.status(201).json(newPostMessage );
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No memory with id: ${id}`);

    let updatedPost = { creator, title, message, tags, selectedFile, _id: id };

    updatedPost = await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}


export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No Memory with id: ${id}`);

    await PostMessage.findByIdAndRemove(id);
    console.log('Delete');
    res.json({ message: "Post deleted successfully." });
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if(!req.userId) return res.json({message: "Unauthenticated User"});

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No Memory with id: ${id}`);
    
    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id)=>id ===String(req.userId));

    if(index===-1)
    {
        post.likes.push(req.userId);
    }
    else
    {
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post , { new: true });
    
    res.json(updatedPost);
}

