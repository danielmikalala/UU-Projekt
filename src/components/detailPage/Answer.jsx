import React from 'react'

export default function Answer({ content, author, date }) {
  return (
    <div className="mb-4 bg-gray-100 p-4 rounded">
      <p className="font-semibold">{author}</p>
      <p className="text-sm text-gray-500">{date.split("T")[0]}</p>
      <p className="mt-1">{content}</p>
    </div>
  )
}
