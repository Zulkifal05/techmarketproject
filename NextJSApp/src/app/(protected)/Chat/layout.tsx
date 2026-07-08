import SocketProvider from "@/components/SocketProvider"

export default function ChatLayout({
  children,
  ChatList
}: { children: React.ReactNode; ChatList: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <SocketProvider>
        <aside className="md:w-1/3 md:max-w-sm">
          {ChatList}
        </aside>
        <main className="flex-1">
          {children}
        </main>
      </SocketProvider>
    </div>
  )
}