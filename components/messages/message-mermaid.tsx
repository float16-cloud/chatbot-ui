import { FC, useEffect, useRef } from "react"
import mermaid from "mermaid"

interface MessageMermaidProps {
  value: string
}

export const MessageMermaid: FC<MessageMermaidProps> = ({ value }) => {
  const mermaidRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
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
  }, [value])

  return (
    <div className="mermaid-container relative w-full bg-zinc-950 font-sans">
      <div className="flex w-full items-center justify-between bg-zinc-700 px-4 py-2 text-white">
        <span className="text-xs lowercase">mermaid</span>
      </div>
      <div className="p-4">
        <div className="mermaid" ref={mermaidRef}>
          {value}
        </div>
      </div>
    </div>
  )
}
