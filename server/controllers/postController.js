import {Post} from '../model/Posts.js'; // Adjust the import as needed

export const createPost = async (req, res, next)=> {
    const { content } = req.body;
    const userId = req.cookies.userId; // Retrieve the UUID from the cookie
    
    const newPost = new Post({
        content,
        userId, 
        comments: [],
        likes: [],
    });

    try {
        await newPost.save();
        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        next(error); 
    }
};


export const getPosts = async (req, res, next ) => {
    try {
        // Fetch all posts from the database
        const posts = await Post.find();
        
        // Send the posts back to the client
        res.status(200).json(posts);
    } catch (error) {
        next(error); // Pass the error to the next middleware
    }
};