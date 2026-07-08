import Link from "next/link"
import { MessageSquare } from "lucide-react"
import GetUserChats, { Chat } from "@/services/server/GetUserChats"
import { getUser } from "@/services/server/GetUser"
import Image from "next/image"
import { redirect } from "next/navigation"

const ChatList = async () => {
    const user = await getUser()

    if (!user) {
        redirect("/login")
    }

    let chats;
    try {
        chats = await GetUserChats()
    } catch (error) {
        console.error("Error fetching user chats:", error)
        
        chats = null
        if(error instanceof Error && error.message === "Unauthorized. Please log in again.") {
            redirect("/Login")
        }
    }

    if (!chats || chats.length === 0) {
        return (
        <div className="bg-white p-8 mt-5">
            <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <MessageSquare className="h-8 w-8" />
            </div>
            <div>
                <h2 className="text-lg font-semibold text-gray-900">No chats yet</h2>
                <p className="text-sm text-gray-600">Start a conversation and your chats will appear here.</p>
            </div>
            </div>
        </div>
        )
    }

    const getOtherParticipant = (participants: Array<{ _id: string; name?: string; profilePicture?: string }>) => {
        return participants.find((participant) => participant._id !== String(user._id)) || participants[0]
    }

    const formatPreview = (message: { text?: string; picture?: string; _id?: string } | null) => {
        if (!message) return "No messages yet"
        if (message.text) return message.text
        if (message.picture) return "Sent a picture"
        return "New message"
    }

    const formatDate = (dateValue: string | number | undefined) => {
        if (!dateValue) return ""
        const date = new Date(dateValue)
        return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
    }

    const getInitials = (name?: string) => {
        if (!name) return "?"
        return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
    }

    const sortedChats = chats.sort((a, b) => {
        const timestampA = a.updatedAt ?? a.createdAt;
        const timestampB = b.updatedAt ?? b.createdAt;

        if (!timestampA || !timestampB) return 0;

        return new Date(timestampB).getTime() - new Date(timestampA).getTime();
    });

    return (
        <div className="space-y-4 px-1">
            <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-1 md:gap-3 md:overflow-visible md:pb-0 max-h-125 lg:overflow-auto">
                {sortedChats.map((chat: Chat) => {
                const other = getOtherParticipant(chat.participants || [])
                const preview = formatPreview(chat.lastMessage)
                const updatedAt = formatDate(chat.updatedAt || chat.createdAt)

                return (
                    <Link
                    key={String(chat._id)}
                    href={`/Chat/${String(other._id)}`}
                    className="flex min-w-23 flex-col items-center rounded-3xl border border-gray-200 bg-white p-3 shadow-sm transition hover:border-blue-300 hover:shadow-md md:flex-row md:items-center md:gap-4 md:p-4"
                    >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-lg font-semibold text-slate-700 md:rounded-3xl">
                        {other?.profilePicture ? (
                            <Image
                            src={other.profilePicture}
                            alt={other?.name || "Chat avatar"}
                            className="h-full w-full object-cover"
                            />
                        ) : (
                            getInitials(other?.name)
                        )}
                    </div>

                    <div className="mt-2 min-w-0 text-center md:mt-0 md:flex-1 md:text-left">
                        <h3 className="truncate text-sm font-semibold text-gray-900 md:text-base">{other?.name || "Unknown"}</h3>
                        <p className="mt-1 hidden truncate text-sm text-gray-600 md:block">{preview}</p>
                        <span className="mt-1 block text-[11px] text-gray-500 md:hidden">{updatedAt}</span>
                    </div>

                    <span className="mt-1 hidden text-xs text-gray-500 md:block">{updatedAt}</span>
                    </Link>
                )
                })}
            </div>
        </div>
    )
}

export default ChatList