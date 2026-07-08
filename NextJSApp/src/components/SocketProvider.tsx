"use client"
import getSocket from "@/utils/Socket"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import useChatStore from "@/store/ChatStore"
import toast from "react-hot-toast"
import type { Socket } from "socket.io-client"

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter()
    const addOneNewMessage = useChatStore((state) => state.addOneNewMessage)
    const addNewLatestMessageId = useChatStore((state) => state.addNewLatestMessageId)

    useEffect( () => {
        let socket: Socket | null = null;

        async function initSocket() {
            socket = await getSocket()
            if(!socket) {
                router.push("/Login")
                return
            }

            socket.connect()

            socket.on("newMessage", (message) => {
                toast.success("New message received")
                addOneNewMessage(message)
                addNewLatestMessageId(message?._id)
            })
        }

        initSocket()

        return () => {
            socket?.disconnect()
        }

    }, [router,addOneNewMessage])

    return <>{children}</>
}

export default SocketProvider