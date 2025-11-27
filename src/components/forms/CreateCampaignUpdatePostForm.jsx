import React, {useState} from "react";

export default function CreateCampaignUpdatePostForm({id}) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setTitle("");
        setContent("");
        console.log({id, title, content});
        // TODO: integrate with server API call to create new post
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-6">Post Update</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block font-medium mb-2">Update Title</label>
                    <input
                        type="text"
                        className="w-full border rounded-lg p-3"
                        value={title}
                        required
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter update title"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-2">Content</label>
                    <textarea
                        className="w-full border rounded-lg p-3 h-40"
                        value={content}
                        required
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your content here"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
                >
                    Post Update
                </button>
            </form>
        </div>
    );
}