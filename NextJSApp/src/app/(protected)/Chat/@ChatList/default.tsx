import ChatList from "@/components/chatpage/ChatList"
import SearchUser from "@/components/chatpage/SearchUser"
import { Suspense } from "react"

const defaultChatList = async () => {
  return (
    <>
      <SearchUser />
        <Suspense fallback={<div>Loading chats...</div>}>
          <ChatList />
      </Suspense>
    </>
  )
}

export default defaultChatList