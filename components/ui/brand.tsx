"use client"

import Link from "next/link"
import { FC } from "react"
import { ChatbotUISVG } from "../icons/chatbotui-svg"
import Image from "next/image"

interface BrandProps {
  theme?: "dark" | "light"
}

export const Brand: FC<BrandProps> = ({ theme = "dark" }) => {
  return (
    <Link
      className="flex cursor-pointer flex-col items-center hover:opacity-50"
      href="https://www.chatbotui.com"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="mb-2">
        {/* <ChatbotUISVG theme={theme === "dark" ? "dark" : "light"} scale={0.3} /> */}
        <Image src="/logo.png" alt="Chat Float16" width={192} height={192} />
      </div>

      <div className="text-4xl font-bold tracking-wide">Chat Float16</div>
    </Link>
  )
}
