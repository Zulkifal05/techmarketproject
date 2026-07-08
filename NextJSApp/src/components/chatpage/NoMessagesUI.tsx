export default function NoMessagesUI() {
  return (
    <div className="flex h-full w-full items-center justify-center py-20">
      <div className="flex flex-col items-center text-center px-6">
        
        {/* Icon */}
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <svg
            className="h-7 w-7 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16h6M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4-.8L3 20l1.1-3.3C3.4 15.4 3 13.8 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800">
          No messages yet
        </h2>

        {/* Subtitle */}
        <p className="mt-1 text-sm text-gray-500 max-w-sm">
          Start the conversation by sending a message. Your chat history will appear here.
        </p>
      </div>
    </div>
  );
}