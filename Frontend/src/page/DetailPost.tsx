// import React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../component/Navbar";
import ShareButton from "../component/Sharebutton";
import ScrollToTopButton from "../component/ScrollTotop";
import { uniqueNamesGenerator, Config, adjectives, animals } from "unique-names-generator"; // Import uniqueNamesGenerator
import { Link } from "react-router-dom";
import { ArrowLeft,Loader } from "lucide-react";
interface Comment {
    _id: string;
    content: string;
    createdAt: string;
    userId: string; // Assuming userId is part of the comment
}

interface Post {
    _id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    likes: any[]; // Define this more specifically if you have a structure for likes
    comments: Comment[];
    userId: string;
}

const DetailPost = () => {
    const { id } = useParams<{ id: string }>();
    const [backgroundEmojis, setBackgroundEmojis] = useState<string[]>([]);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const [post, setPost] = useState<Post | null>(null); // Initialize as null
    const [commentText, setCommentText] = useState("");
    // const [activePostId, setActivePostId] = useState<string | null>(null);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    // const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isLoading,setIsLoading] = useState(false);


    const generateAvatarUrl = (seed: string) => {
        return `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`;
    };
    useEffect(() => {
        const emojis = ['😀', '😎', '🤪', '🥳', '🚀', '🌈', '🍕', '🎉', '🦄', '🐶', '🌟', '🎸'];
        const newBackgroundEmojis = Array.from({ length: 5000 }, () => emojis[Math.floor(Math.random() * emojis.length)]);
        setBackgroundEmojis(newBackgroundEmojis);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/posts`);
                const posts: Post[] = response.data; // Assuming your API returns an array of posts
                const post = posts.find((p) => p._id === id);
                setPost(post || null); // Set to null if not found

            } catch (err) {
                console.error('Error fetching posts:', err);
            }finally{
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [id]); // Include id as a dependency

    const handleLike = async (id: string) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/posts/like/${id}`, {}, { withCredentials: true });
            if (response.status === 200) {
                // Update the local state with the updated post data
                const updatedPost = response.data.post;
                setPost(() =>
                    updatedPost
                );
                setReloadTrigger(!reloadTrigger);
            }
        } catch (err) {
            console.error('Error occurred while liking/disliking the post:', err);
        }
    };

    const postComment = async (postId: string) => {
        if (!commentText.trim()) return;

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/posts/comment/${postId}`,
                { content: commentText },
                { withCredentials: true }
            );

            //   setActivePostId(null);
            setCommentText('');
            console.log(response.data.message);
            const updatedPost = response.data.post;
            setPost(() =>
                updatedPost
            );
            setReloadTrigger(!reloadTrigger);
        } catch (err) {
            console.error('Error adding comment:', err);
        }
    };
    const customConfig: Config = {
        dictionaries: [adjectives, animals],
        separator: '-',
        length: 2,
    };

    const generateUniqueName = (id: string) => {
        // Use the post or comment ID to generate a new name each time
        return uniqueNamesGenerator({
            ...customConfig,
            seed: id, // Ensure uniqueness by seeding with the post/comment ID
        });
    };

    //   const handleCommentClick = (postId: string): void => {
    //     setActivePostId((prev: string | null) => (prev === postId ? null : postId));
    //   };

    // const shareUrl = `https://buzz-s3.vercel.app/post/${post?._id}`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-orange-100 font-sans relative overflow-hidden flex justify-center items-center gap-3">
            {/* Emoji Background */}
            <div className="absolute inset-0 opacity-10 flex flex-wrap justify-center items-center pointer-events-none">
                {backgroundEmojis.map((emoji, index) => (
                    <span key={index} className="text-2xl p-2">{emoji}</span>
                ))}
            </div>

            <div className="container mx-auto lg:p-6 p-2 flex flex-col justify-center items-center gap-3 relative z-10">
                {/* Fixed Navbar */}
                <div className={`fixed left-0 right-0 z-50 flex justify-center items-center transition-all duration-300 ${isScrolled ? 'top-0' : 'top-6'}`}>
                    <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </div>

                {/* Main feed */}
                {isLoading?(
                    <div className="flex flex-col items-center mt-10">
                    <Loader className="text-orange-500 animate-spin" size={48} />
                    <p className="text-center text-lg text-gray-500 mt-4 animate-pulse">Loading...</p>
                  </div>
                ):(
                <div className="mt-24 w-full flex flex-col items-center">
                    <div className=" w-full lg:w-1/2 flex justify-start "><Link to='/' className="text-orange-400 flex justify-between gap-3 font-semibold  rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"><ArrowLeft /> Back to Home </Link>
                    </div>
                    {post ? (
                        <div key={post._id} className="bg-white rounded-lg shadow-lg lg:p-6 p-3 border-2 border-orange-300 cursor-pointer w-full lg:w-1/2">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={generateAvatarUrl(post._id)} // Add the appropriate avatar URL
                                        alt="User Avatar"
                                        className="w-12 h-12 rounded-full bg-slate-200"
                                    />
                                    <div>
                                        <h3 className="font-bold text-xl">{generateUniqueName(post._id)}</h3>
                                        {/* Uncomment if you want to display the date */}
                                        <p className="text-gray-500">{new Date(post.createdAt).toLocaleDateString('en-GB')}, {new Date(post.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })}</p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <button
                                        className="btn  text-orange-500 text-4xl hover:text-orange-600 transition-colors"
                                        onClick={() => (document.getElementById("my_modal_3") as HTMLDialogElement).showModal()}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                        </svg>
                                    </button>
                                    <dialog id="my_modal_3" className="modal rounded-lg border-4 border-orange-400">
                                        <div className="modal-box rounded-lg">
                                            <form method="dialog" className="">
                                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 bg-orange-400 text-white flex justify-center items-center font-bold w-6 h-6 rounded-full">✕</button>
                                            </form>
                                            {/* <h3 className="font-bold text-lg">➦</h3> */}
                                            {/* Use the ShareButton component and pass the post ID */}
                                            <ShareButton postId={post._id} />
                                        </div>
                                    </dialog>

                                </div>
                            </div>


                            <p className="text-xl mb-4">{post.content}</p>

                            <div className="mt-4 flex justify-between items-center">
                                <button
                                    className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 transition-colors"
                                    onClick={() => handleLike(post._id)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    <span className="font-bold">{post.likes.length} Likes</span>
                                </button>
                                <button
                                    className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 transition-colors"

                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <span className="font-bold">{post.comments.length} Comments</span>
                                </button>
                            </div>


                            <div className="mt-6 bg-orange-50 rounded-lg lg:p-4 p-2">
                                <textarea
                                    className="w-full p-3 border-2 border-orange-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition duration-200"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Write a comment..."
                                    rows={3}
                                />
                                <button
                                    className="mt-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-2 rounded-full font-bold hover:from-orange-500 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                                    onClick={() => postComment(post._id)}
                                >
                                    Post Comment
                                </button>

                                <div className="mt-6 space-y-4">
                                    {post.comments.map((comment: Comment) => (
                                        // <div key={comment._id} className="bg-white rounded-lg p-4 shadow-sm">
                                        //     <div className="flex items-start space-x-3">
                                        //         <img
                                        //             src={generateAvatarUrl(comment._id)}// Assuming you have a function to generate the avatar URL
                                        //             alt="Commenter Avatar"
                                        //             className="w-8 h-8 rounded-full bg-orange-200"
                                        //         />
                                        //         <div className="flex-1">
                                        //             <p>{generateUniqueName(comment._id)}</p>
                                        //             <div className="flex w-full justify-between  ">
                                        //                 <p className="text-gray-600 mt-1 font-semibold">{comment.content}</p>
                                        //                 <p className="text-xs text-gray-400 mt-2">
                                        //                     {new Date(comment.createdAt).toLocaleDateString('en-GB')} at{' '}
                                        //                     {new Date(comment.createdAt).toLocaleTimeString('en-GB', {
                                        //                         hour: '2-digit',
                                        //                         minute: '2-digit',
                                        //                         hour12: false,
                                        //                     })}
                                        //                 </p>
                                        //             </div>
                                        //         </div>
                                        //     </div>
                                        // </div>
                                        <div key={comment._id} className="bg-white flex flex-col gap-1 rounded-xl lg:p-4 p-2 shadow-sm transition-all duration-300 hover:shadow-md">
                                            <div className="flex items-center space-x-3 0 justify-start">
                                                <img
                                                    src={generateAvatarUrl(comment._id)}// Assuming you have a function to generate the avatar URL
                                                    alt="Commenter Avatar"
                                                    className="w-8 h-8 rounded-full border bg-orange-200"
                                                />
                                                <h4 className="font-bold text-gray-500">{generateUniqueName(comment._id)}</h4>
                                            </div>
                                            <div className=" w-full lg:pl-12 p-2 flex flex-col justify-between">
                                                <p className="text-black font-semibold text-xl">{comment.content}</p>
                                                <p className="text-xs text-gray-400 mt-2 flex justify-end  w-full ">
                                                    {new Date(comment.createdAt).toLocaleDateString('en-GB')} at{' '}
                                                    {new Date(comment.createdAt).toLocaleTimeString('en-GB', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: false,
                                                    })}
                                                </p>
                                            </div>


                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    ) : (
                        <h1>No posts</h1>
                    )}
                </div>
                )}
            </div>
            <ScrollToTopButton />
        </div>

    );
};

export default DetailPost;






