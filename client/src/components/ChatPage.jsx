import { useState, useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";

function ChatPage() {
  const { selectedUser, getUsers, getMessages } = useChatStore();

  useEffect(() => {
    getUsers();
  }, []); // ✅ empty array — only runs once on mount

  useEffect(() => {
    if (selectedUser) getMessages(selectedUser.id);
  }, [selectedUser]); // ✅ only re-runs when selectedUser changes

  return (
    <div className="h-screen flex bg-gray-900 text-gray-100">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        {selectedUser ? <ChatContainer /> : <NoChatSelected />}
      </main>
    </div>
  );
}

function Sidebar() {
  const [searchTerm, setSearchTerm] = useState("");
  const { users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();

  const filteredUsers = (users || []).filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="w-72 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {isUsersLoading ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No users found</div>
        ) : (
          <ul>
            {filteredUsers.map((user) => (
              <li
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`px-4 py-3 cursor-pointer transition-colors ${
                  selectedUser?.id === user.id
                    ? "bg-red-600 text-white"
                    : "hover:bg-gray-800 text-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0 flex items-center justify-center">
                    {user.profile_pic ? (
                      <img
                        src={user.profile_pic}
                        alt={user.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    ) : (
                      <span className="text-sm font-bold text-yellow-400">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">{user.name}</p>
                    {user.last_message && (
                      <p className="text-xs text-gray-400 truncate">{user.last_message}</p>
                    )}
                  </div>

                  {user.unread_count > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {user.unread_count}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

function ChatContainer() {
  const [newMessage, setNewMessage] = useState("");
  const { messages, selectedUser, isMessagesLoading, sendMessage } = useChatStore();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await sendMessage({ text: newMessage, image: null });
    setNewMessage("");
  };

  if (isMessagesLoading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <header className="p-4 border-b border-gray-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-700 flex-shrink-0 flex items-center justify-center">
          {selectedUser.profile_pic ? (
            <img
              src={selectedUser.profile_pic}
              alt={selectedUser.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          ) : (
            <span className="text-sm font-bold text-yellow-400">
              {selectedUser.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <h2 className="text-lg font-semibold text-yellow-400">{selectedUser.name}</h2>
      </header>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No messages yet. Say hello! 👋</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender !== "me" && (
                <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-700 mr-2 flex-shrink-0 self-end flex items-center justify-center">
                  {selectedUser.profile_pic ? (
                    <img src={selectedUser.profile_pic} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-yellow-400">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              )}

              <div
                className={`max-w-xs px-4 py-2 rounded-lg text-sm shadow-md ${
                  msg.sender === "me"
                    ? "bg-red-600 text-white rounded-br-none"
                    : "bg-gray-800 text-gray-200 rounded-bl-none"
                }`}
              >
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="attachment"
                    className="mb-2 rounded-md max-w-full"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                )}
                {msg.text && <p>{msg.text}</p>}
                <span className="block text-xs text-gray-400 mt-1">
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Footer */}
      <footer className="p-4 border-t border-gray-800">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 px-3 py-2 rounded-md bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}

function NoChatSelected() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
      <p className="text-lg">Select a user to start chatting</p>
      <p className="text-sm">Your conversations will appear here</p>
    </div>
  );
}

export default ChatPage;