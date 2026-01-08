import React from "react";

export default function Post({ title, content, date }) {
    return (
        <div className="m-4 border-b pb-4">
            <div>
                <p className="font-medium">{title}</p>
                <p className="text-xs text-gray-500">
                    {date ? date.split("T")[0] : ""}
                </p>
            </div>
            <p className="text-sm mt-1 whitespace-pre-line">{content}</p>
        </div>
    );
}
