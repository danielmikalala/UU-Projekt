import React, { useEffect } from "react";
import { TrendingUp } from "lucide-react";
import Post from "./Post.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function PostLog({ id }) {
  const fetchedRef = React.useRef(false);
  const { token } = useAuth();
  const fetchPostData = async () => {
    if (fetchedRef.current) return postData;
    fetchedRef.current = true;
    const res = await fetch(`/projects/${id}/posts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  };

  const [postData, setPostData] = React.useState([]);
  useEffect(() => {
    fetchPostData().then((data) => {
      setPostData(data);
    });
  }, [id]);
  return (
    <div className="w-full max-w-6xl mx-auto border rounded-xl p-6 bg-white shadow-sm">
      <div className="mb-4 sm:text-left flex flex-row">
        <TrendingUp />
        <h2 className="ms-2 text-xl font-semibold text-black">Updates</h2>
      </div>
      <div>
        {postData.map((post, index) => (
          <Post
            key={index}
            content={post.content}
            title={post.name}
            date={post.lastUpdatedDate}
          />
        ))}
      </div>
    </div>
  );
}
