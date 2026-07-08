"use client"
import React, { useRef, useState } from 'react'
import { Send, Upload } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { MessageItem } from '@/services/client/GetMessages'
import SendMessage from '@/services/client/SendMessage'
import toast from 'react-hot-toast'

type SendMessageFormValues = {
  message?: string
}

const SendMessageSection = ({ setMessages , receiver }: { setMessages : (newMessage: MessageItem) => void , receiver: string  }) => {

  const { register, handleSubmit, reset } = useForm<SendMessageFormValues>({
    defaultValues: {
      message: '',
    },
  })
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFileName, setSelectedFileName] = useState<File | null>(null)
  const [isSending, setIsSending] = useState(false)

  const handleFileButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFileName(file)
    } else {
      setSelectedFileName(null)
    }
  }

  const onSubmit = async (data: SendMessageFormValues) => {
    if(!data?.message && selectedFileName === null) {  // Check if both message and file are empty
      return
    }

    setIsSending(true)
    try {
        const messageSendResponse = await SendMessage({
          message: data?.message,
          file: selectedFileName,
          receiver: receiver,
        })

        if(!messageSendResponse) {
          toast.error("Error sending message. Please try again.")
          return
        }

        setMessages(messageSendResponse)
    } catch (error) {
        if(error instanceof Error && error.message === "UnAuthorized") {
          window.location.reload()
        } else if(error instanceof Error && error.message === "File upload failed") {
          toast.error("Error uploading file. Please try again.")
        } else if(error instanceof Error && error.message === "Only image files are allowed") {
          toast.error("Only image files are allowed.")
        } else {
          toast.error("Error sending message. Please try again.")
        }
    } finally {
        reset()
        setSelectedFileName(null)
        setIsSending(false)
    }
  }

  return (
    <section className="send-message-section bottom-0 z-30 border-t border-gray-300 bg-white px-4 py-3 w-full h-full">
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto flex w-full flex-col gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFileButtonClick}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-gray-300 bg-gray-100 text-gray-700 transition hover:bg-gray-200 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-300"
            disabled={isSending}
          >
            <Upload className="h-5 w-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="*"
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            id="message"
            type="text"
            placeholder="Type your message..."
            className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            autoComplete="off"
            {...register('message')}
          />
          <button
            type="submit"
            disabled={isSending}
            className="inline-flex h-11 items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <div className="text-sm text-gray-500">
          {selectedFileName ? `Selected file: ${selectedFileName?.name}` : 'No file selected'}
        </div>
      </form>
    </section>
  )
}

export default SendMessageSection
