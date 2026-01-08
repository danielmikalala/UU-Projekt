import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import Post from "./Post.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import NoItemsDisplay from "../cards/NoItemsDisplay.jsx";

export default function PostLog({ id, reloadKey }) {
    const { token } = useAuth();
    const [postData, setPostData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const fetchPostData = async () => {
            try {
                setLoading(true);

                const res = await fetch(`/projects/${id}/posts`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Failed to load posts.");
                }

                const data = await res.json();
                if (mounted) setPostData(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to fetch posts:", err);
                if (mounted) setPostData([]);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchPostData();

        return () => {
            mounted = false;
        };
    }, [id, token, reloadKey]);

    return (
        <div className="w-full max-w-6xl mx-auto border rounded-xl p-6 bg-white shadow-sm mt-6">
            <div className="mb-4 sm:text-left flex flex-row items-center">
                <TrendingUp />
                <h2 className="ms-2 text-xl font-semibold text-black">Updates</h2>
            </div>

            {loading ? (
                <p className="text-gray-500 text-sm">Loading updates...</p>
            ) : postData.length > 0 ? (
                <div>
                    {postData.map((post) => (
                        <Post
                            key={post._id}
                            content={post.content}
                            title={post.name}
                            date={post.lastUpdatedDate}
                        />
                    ))}
                </div>
            ) : (
                <NoItemsDisplay />
            )}
        </div>
    );
}
