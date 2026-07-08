import { create } from 'zustand'

interface MessageItem {
    sender: {
        email: string;
        _id: string;
    }
    receiver: string;
    chatID: string;
    text?: string;
    picture?: string;
    updatedAt?: string;
    createdAt?: string;
    _id?: string;
}

interface ChatState {
    currentChatMessages: MessageItem[],
    newLatestMessageId: string | null
    addNewLatestMessageId: (messageId: string) => void
    addManyMessages: (message: MessageItem) => void,
    addOneNewMessage: (message: MessageItem) => void,
    removeAllMessages: () => void,
}

const useChatStore = create<ChatState>((set) => ({
    currentChatMessages: [],
    chats: [],
    newLatestMessageId: null,

    addManyMessages: (message) =>
        set((state) => ({
            currentChatMessages: state?.currentChatMessages.some((msg) => msg._id === message._id)
            ? state.currentChatMessages
            : [message, ...state.currentChatMessages]
        })),

    addNewLatestMessageId: (messageId) => set({ newLatestMessageId: messageId }),

    addOneNewMessage: (newMessage) => 
        set((state) => ({ currentChatMessages: state?.currentChatMessages?.some((m) => m._id === newMessage._id) ? state.currentChatMessages : [...state.currentChatMessages, newMessage]})),

    removeAllMessages: () => set({ currentChatMessages: [] , newLatestMessageId: null }),
}))

export default useChatStore