import { useState, useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
// import { getUsers } from "../api/notesApi";
import { useAuthStore } from "../store/useAuthStore";

function ChatPage() {
  const { selectedUser,getUsers, getMessages, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  // const { authUser } = useAuthStore();

  // console.log("The messages is:", getMessages);

  useEffect(() => {
    getUsers();
  }, []); // ✅ empty array — only runs once on mount

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser.id);
      subscribeToMessages();
    }

    return () => unsubscribeFromMessages();
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
  const { chatUsers, searchResults, selectedUser, setSelectedUser, isUsersLoading, searchUsers } = useChatStore();
  const { authUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (searchTerm.trim() === "") {
        setIsSearching(false);
      } else {
        setIsSearching(true);
        await searchUsers(searchTerm.trim());
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  // Split search results into — already chatting vs new users
  const alreadyChattingIds = new Set(chatUsers.map(u => u.id));
  const newUsers = searchResults.filter(u => !alreadyChattingIds.has(u.id));
  const matchedChatUsers = searchResults.filter(u => alreadyChattingIds.has(u.id));

  return (
    <aside className="w-72 flex flex-col bg-[#1a1a2e] border-r border-white/10 flex-shrink-0">

      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-sm font-medium overflow-hidden">
              {authUser?.profile_pic
                ? <img src={authUser.profile_pic} className="w-full h-full object-cover" onError={(e) => e.target.style.display="none"} />
                : authUser?.name?.charAt(0).toUpperCase()
              }
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full ring-1 ring-[#1a1a2e]" />
          </div>
          <span className="text-sm font-medium text-gray-200 truncate">{authUser?.name}</span>
        </div>

        {/* Search input */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-8 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isUsersLoading ? (
          <div className="flex items-center justify-center h-32 text-gray-500 text-sm">Loading...</div>
        ) : !isSearching ? (
          // ── Normal mode: chat history only ──
          <>
            <SectionLabel label="Recent" />
            {chatUsers.length === 0
              ? <div className="text-center text-gray-500 text-sm py-8">No conversations yet</div>
              : chatUsers.map(user => <UserRow key={user.id} user={user} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />)
            }
          </>
        ) : (
          // ── Search mode: split into two sections ──
          <>
            {matchedChatUsers.length > 0 && (
              <>
                <SectionLabel label="Recent chats" />
                {matchedChatUsers.map(user => <UserRow key={user.id} user={user} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />)}
              </>
            )}

            {newUsers.length > 0 && (
              <>
                <SectionLabel label="All users" />
                {newUsers.map(user => <UserRow key={user.id} user={user} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />)}
              </>
            )}

            {matchedChatUsers.length === 0 && newUsers.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-8">No users found</div>
            )}
          </>
        )}
      </div>
    </aside>
  );
}

// ── Helpers ──────────────────────────────────────────

function SectionLabel({ label }) {
  return (
    <div className="px-4 pt-3 pb-1">
      <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">{label}</span>
    </div>
  );
}

function UserRow({ user, selectedUser, setSelectedUser }) {
  return (
    <div
      onClick={() => setSelectedUser(user)}
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-l-2 ${
        selectedUser?.id === user.id
          ? "bg-red-600/15 border-red-500"
          : "border-transparent hover:bg-white/5"
      }`}
    >
      <div className="w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center text-sm font-medium flex-shrink-0 overflow-hidden">
        {user.profile_pic
          ? <img src={user.profile_pic} className="w-full h-full object-cover" onError={(e) => e.target.style.display="none"} />
          : user.name?.charAt(0).toUpperCase()
        }
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-gray-200 truncate">{user.name}</p>
          {user.last_message_time && (
            <span className="text-[11px] text-gray-500 ml-2 flex-shrink-0">
              {new Date(user.last_message_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>
        {user.last_message
          ? <p className="text-xs text-gray-500 truncate mt-0.5">{user.last_message}</p>
          : <p className="text-xs text-gray-600 mt-0.5">No messages yet</p>
        }
      </div>

      {user.unread_count > 0 && (
        <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-medium flex items-center justify-center flex-shrink-0">
          {user.unread_count}
        </span>
      )}
    </div>
  );
}

function ChatContainer() {
  const [newMessage, setNewMessage] = useState("");
  const { messages, selectedUser, isMessagesLoading, sendMessage } = useChatStore();
  const { authUser } = useAuthStore();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  console.log("Messages in container is:", messages);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const isMine = (msg) => {
    return String(msg.sender_id) === String(authUser?.id);
  };

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
              className={`flex ${isMine(msg) ? "justify-end" : "justify-start"}`}
            >
              {!isMine(msg) && (
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
                  isMine(msg)
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
                  {formatTime(msg.created_at)}
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