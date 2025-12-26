import React from 'react'

export default function Question({ content, author, date }) {
  return (
    <div className="mb-4">
      <p className="font-semibold">{author}</p>
      <p className="text-sm text-gray-500">{date}</p>
      <p className="mt-1">{content}</p>
    </div>
  )
}
