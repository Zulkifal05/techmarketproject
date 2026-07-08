"use client"
import { useEffect, useRef, useState, useCallback } from "react"
import GetMessages , { MessageItem } from "@/services/client/GetMessages"
import SendMessageSection from "./SendMessageSection"
import NoMessagesUI from "./NoMessagesUI"
import useAuthStore from "@/store/AuthStore"
import useChatStore from "@/store/ChatStore"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

interface Props {
  receiver: string;
}

const LIMIT = 30;

export default function ChatMessages({ receiver }: Props) {
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [initialLoadDone,setInitialLoadDone] = useState(false)
  const user = useAuthStore((state) => state.user)
  const removeAllMessages = useChatStore((state) => state.removeAllMessages)
  const currentChatMessages = useChatStore((state) => state.currentChatMessages)
  const addManyMessages = useChatStore((state) => state.addManyMessages)
  const addOneNewMessage = useChatStore((state) => state.addOneNewMessage)
  const router = useRouter()
  const topRef = useRef<HTMLDivElement | null>(null);
  const bottomElementRef = useRef<HTMLDivElement | null>(null)
  const newLatestMessageId = useChatStore((state) => state.newLatestMessageId)

  const latestMessageTSRef = useRef<number>(0)
  const [latestMessageId,setLatestMessageId] = useState<string | undefined>(undefined) 

  function SetTheNewMessage(newMessage: MessageItem) {
    addOneNewMessage(newMessage)

    const latestMessageTS = newMessage.createdAt ? new Date(newMessage.createdAt).getTime() : Date.now()

    if(latestMessageTS >= latestMessageTSRef?.current) {
      setLatestMessageId(newMessage._id)
    }
  }

  const loadMessages = useCallback(
    async (pageNumber: number) => {
      if (loading || !hasMore) return;

      try {
        setLoading(true);
        let response = null

        try {
          response = await GetMessages(pageNumber,LIMIT,receiver);
        } catch (error) {
          if(error instanceof Error && error?.message === "UnAuthorized") {
            window.location.reload()
          }
        }

        let fetchedMessages = null;

        if(response === null) {
          setHasMore(false)
          return;
        } else {
          fetchedMessages = response?.data;
        }

        if (fetchedMessages && fetchedMessages.length < LIMIT) {
          setHasMore(false);
        }

        // Api returns Newest -> Oldest
        fetchedMessages.map((m) => addManyMessages(m))

        if(page === 1  && fetchedMessages.length > 0) {  //for page 1 add the ref to latest message
          const latestMessageTS = fetchedMessages[0].createdAt ? new Date(fetchedMessages[0].createdAt).getTime() : Date.now()

          if(latestMessageTS >= latestMessageTSRef?.current) {
            setLatestMessageId(fetchedMessages[0]._id)
          }
        }
        setInitialLoadDone(true)

      } finally {
        setLoading(false);
      }
    },
    [receiver]
  );

  // Initial load
  useEffect(() => {
    if(!user) {
      router.replace("/Login")
      return
    }

    if(!initialLoadDone) {
      removeAllMessages();
    }
    loadMessages(1);
  }, [receiver, router, user])

  // Infinite scroll (load older messages)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if ( entry.isIntersecting && !loading && hasMore && initialLoadDone ) {
          setPage((prev) => {
            const nextPage = prev + 1;

            loadMessages(nextPage);
            return prev + 1
          })

        }
      },
      {
        threshold: 0.1,
      }
    );

    if (topRef.current) {
      observer.observe(topRef.current);
    }

    return () => observer.disconnect();
  }, [page, loading, hasMore, loadMessages])

  useEffect(() => {
    if(bottomElementRef?.current) {
      bottomElementRef?.current.scrollIntoView({
        behavior: "smooth",
        block: "end"
      })
    }
  },[latestMessageId,newLatestMessageId])

  return (
    <div className="flex flex-col h-[80vh] overflow-hidden">
        <div className="flex flex-col overflow-y-auto min-h-[65vh]">
          {/* Top sentinel */}
          <div ref={topRef} />

          {loading && (
            <p className="text-center py-2">
              Loading...
            </p>
          )}

          {(currentChatMessages.length === 0 && !loading) ? <NoMessagesUI /> : currentChatMessages.map((message) => (
            message?.text ? (  // Check if message has text
            <div
              key={message._id}
              className={`p-3 flex flex-col ${message.sender.email === user?.email ? "items-end" : "items-start"}`}
            >
              <p className={`p-1 text-white rounded-lg max-w-[70%] wrap-break-word inline-block px-3 ${message.sender.email === user?.email ? "bg-green-500 text-white" : "bg-linear-to-br from-blue-600 to-purple-600"}`}>
                {message.text}
              </p>
              <small className="text-gray-500 text-xs">
                { message?.createdAt ? new Date(message.createdAt).toLocaleString() : ""}
              </small>
            </div>
            ) : message?.picture ? (  // Check if message has picture
            <div
              key={message._id}
              className={`p-3 flex flex-col ${message.sender.email === user?.email ? "items-end" : "items-start"}`}
            >
              <Link href={message.picture} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                <Image 
                  src={message.picture}
                  alt="Uploaded image"
                  width={300}
                  height={200}
                />
              </Link>
              <small className="text-gray-500 text-xs">
                { message?.createdAt ? new Date(message.createdAt).toLocaleString() : ""}
              </small>
            </div>
            ) : null
          ))}
          <div ref={bottomElementRef} />
        </div>
        <SendMessageSection setMessages={SetTheNewMessage} receiver={receiver} />
    </div>
  );
}