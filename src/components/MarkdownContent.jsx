import React from 'react'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import remarkGemoji from 'remark-gemoji'
import rehypeRaw from "rehype-raw";

export default function MarkdownContent({ text }) {

    return (
        <ReactMarkdown
            children={text}
            remarkPlugins={[remarkGfm, remarkGemoji]}
            rehypePlugins={[rehypeRaw]}
        />
    )
}
