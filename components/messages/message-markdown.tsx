import React, { FC, useMemo } from "react"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import { MessageCodeBlock } from "./message-codeblock"
import { MessageMarkdownMemoized } from "./message-markdown-memoized"
import { MessageMermaid } from "./message-mermaid"

interface MessageMarkdownProps {
  content: string
}

export const MessageMarkdown: FC<MessageMarkdownProps> = ({ content }) => {
  const isMermaidComplete = useMemo(() => {
    const mermaidPattern = /```mermaid\n([\s\S]*?)```/g
    const matches = content.matchAll(mermaidPattern)
    const matchCount = [...matches].length

    // นับจำนวนครั้งที่เจอ ```mermaid
    const startTags = (content.match(/```mermaid/g) || []).length

    // ถ้าเจอ ```mermaid แต่จำนวน matches ไม่เท่ากับจำนวน start tags แสดงว่ายังไม่สมบูรณ์
    if (startTags > 0 && matchCount !== startTags) {
      return false
    }
    return true
  }, [content])

  return (
    <MessageMarkdownMemoized
      className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 min-w-full space-y-6 break-words"
      remarkPlugins={[remarkGfm, remarkMath]}
      components={{
        p({ children }) {
          return <p className="mb-2 last:mb-0">{children}</p>
        },
        img({ node, ...props }) {
          return <img className="max-w-[67%]" {...props} />
        },
        code({ node, className, children, ...props }) {
          const childArray = React.Children.toArray(children)
          const firstChild = childArray[0] as React.ReactElement
          const firstChildAsString = React.isValidElement(firstChild)
            ? (firstChild as React.ReactElement).props.children
            : firstChild

          if (firstChildAsString === "▍") {
            return <span className="mt-1 animate-pulse cursor-default">▍</span>
          }

          if (typeof firstChildAsString === "string") {
            childArray[0] = firstChildAsString.replace("`▍`", "▍")
          }

          const match = /language-(\w+)/.exec(className || "")

          if (match && match[1] === "mermaid") {
            // if (!isMermaidComplete) {
            //   return <div>Loading diagram...</div>
            // }
            return (
              <MessageMermaid
                value={String(childArray).replace(/\n$/, "")}
                isComplete={isMermaidComplete}
              />
            )
          }

          if (
            typeof firstChildAsString === "string" &&
            !firstChildAsString.includes("\n")
          ) {
            return (
              <code className={className} {...props}>
                {childArray}
              </code>
            )
          }

          return (
            <MessageCodeBlock
              key={Math.random()}
              language={(match && match[1]) || ""}
              value={String(childArray).replace(/\n$/, "")}
              {...props}
            />
          )
        }
      }}
    >
      {content}
    </MessageMarkdownMemoized>
  )
}
