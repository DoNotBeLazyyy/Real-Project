export interface ChatMessageProps {
  messageText?: string;
  time?: string;
  isSent?: boolean;
  avatarUrl?: string;
}

export default function ChatMessage({
    messageText,
    time,
    isSent,
    avatarUrl
}: ChatMessageProps) {
    return (
        <li className={`flex mb-3 ${isSent ? 'justify-end' : 'justify-start'}`}>
            {/* Avatar */}
            {!isSent && (
                <img
                    src={avatarUrl || '/default-avatar.png'}
                    alt="avatar"
                    className="h-8 mr-2 rounded-full w-8"
                />
            )}

            {/* Message bubble */}
            <div className={`flex flex-col max-w-xs ${isSent ? 'items-end' : 'items-start'}`}>
                <div
                    className={`px-4 py-2 rounded-xl break-words
            ${isSent ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-200 text-gray-900 rounded-tl-none'}
          `}
                >
                    {messageText}
                </div>
                {time && (
                    <span
                        className={`text-xs mt-1 ${isSent ? 'text-gray-200' : 'text-gray-500'}`}
                    >
                        {time}
                    </span>
                )}
            </div>

            {/* Avatar for sent message */}
            {isSent && (
                <img
                    src={avatarUrl || '/default-avatar.png'}
                    alt="avatar"
                    className="h-8 ml-2 rounded-full w-8"
                />
            )}
        </li>
    );
}