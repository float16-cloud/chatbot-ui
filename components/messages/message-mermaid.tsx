import { FC, useEffect, useRef, useState } from "react"
import mermaid from "mermaid"
import { Button } from "../ui/button"
import { IconCheck, IconCode, IconCopy } from "@tabler/icons-react"
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism"

interface MessageMermaidProps {
  value: string
  isComplete?: boolean
}

export const MessageMermaid: FC<MessageMermaidProps> = ({
  value,
  isComplete
}) => {
  const mermaidRef = useRef<HTMLDivElement>(null)
  const [showRaw, setShowRaw] = useState(true)
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

  useEffect(() => {
    if (showRaw) return
    const isValidDiagram = async (content: string) => {
      try {
        await mermaid.parse(content)
        return true
      } catch {
        return false
      }
    }

    const renderDiagram = async () => {
      if (mermaidRef.current) {
        const isValid = await isValidDiagram(value)

        if (isValid) {
          mermaid.initialize({
            startOnLoad: true,
            theme: "dark",
            securityLevel: "loose"
          })

          mermaid.run({
            nodes: [mermaidRef.current]
          })
        }
      }
    }

    renderDiagram()
  }, [value, showRaw])

  useEffect(() => {
    if (isComplete) {
      setShowRaw(false)
    }
  }, [isComplete])

  const onCopy = () => {
    if (isCopied) return
    copyToClipboard(value)
  }

  return (
    <div className="mermaid-container relative w-full bg-zinc-950 font-sans">
      <div className="flex w-full items-center justify-between bg-zinc-700 px-4 text-white">
        <span className="text-xs lowercase">mermaid</span>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-zinc-600"
            onClick={() => setShowRaw(!showRaw)}
          >
            <IconCode size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className=" hover:bg-zinc-600"
            onClick={onCopy}
          >
            {isCopied ? <IconCheck size={16} /> : <IconCopy size={16} />}
          </Button>
        </div>
      </div>
      <div>
        {showRaw ? (
          <SyntaxHighlighter
            language="mermaid"
            style={oneDark}
            // showLineNumbers
            customStyle={{
              margin: 0,
              width: "100%",
              background: "transparent"
            }}
            codeTagProps={{
              style: {
                fontSize: "14px",
                fontFamily: "var(--font-mono)"
              }
            }}
          >
            {value}
          </SyntaxHighlighter>
        ) : (
          <div className="mermaid p-4" ref={mermaidRef}>
            {value}
          </div>
        )}
      </div>
    </div>
  )
}
