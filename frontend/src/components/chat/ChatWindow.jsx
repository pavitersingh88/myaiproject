import { useEffect, useState, useRef } from 'react';
import { Send, ArrowLeft, Users } from 'lucide-react';
import { chatService } from '../../services/chatService';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

export default function ChatWindow({ conversation, onBack }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherUserName, setOtherUserName] = useState('');
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    if (conversation) {
      loadMessages();
      loadOtherUserData();

      const unsubscribe = chatService.subscribeToMessages(conversation.id, (msgs) => {
        setMessages(msgs);
        scrollToBottom();
      });

      return () => unsubscribe();
    }
  }, [conversation]);

  const loadOtherUserData = async () => {
    if (!conversation.isGroup) {
      const otherParticipantId = conversation.participantIds.find(id => id !== user?.uid);
      if (otherParticipantId) {
        try {
          const userDoc = await getDoc(doc(db, 'users', otherParticipantId));
          if (userDoc.exists()) {
            setOtherUserName(userDoc.data().full_name);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
    }
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const msgs = await chatService.getMessages(conversation.id);
      setMessages(msgs);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      await chatService.sendMessage(conversation.id, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getConversationName = () => {
    if (conversation.isGroup) {
      return conversation.name || 'Group Chat';
    }
    return otherUserName || 'Loading...';
  };

  if (!conversation) return null;

  return (
    <div className="bg-white h-full flex flex-col">
      <div className="p-4 border-b-2 border-warm-gray flex items-center space-x-3">
        <button
          onClick={onBack}
          className="md:hidden p-2 hover:bg-beige rounded-button"
          aria-label="Go back"
        >
          <ArrowLeft size={24} className="text-navy" />
        </button>

        <div className="flex items-center space-x-3 flex-1">
          {conversation.isGroup ? (
            <Users size={24} className="text-navy" />
          ) : (
            <div className="w-10 h-10 bg-navy text-garrison-white rounded-full flex items-center justify-center font-semibold">
              {getConversationName().charAt(0).toUpperCase()}
            </div>
          )}
          <h2 className="text-h3 font-semibold">{getConversationName()}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-warm-gray py-12">
            <p>No messages yet</p>
            <p className="text-sm mt-2">Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isOwnMessage = message.senderId === user?.uid;

              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md px-4 py-3 rounded-card ${
                      isOwnMessage
                        ? 'bg-navy text-garrison-white'
                        : 'bg-beige text-navy'
                    }`}
                  >
                    {!isOwnMessage && conversation.isGroup && (
                      <p className="text-xs font-semibold mb-1 opacity-75">
                        {message.senderName}
                      </p>
                    )}
                    <p className="text-base break-words">{message.text}</p>
                    <p className={`text-xs mt-1 ${isOwnMessage ? 'opacity-75' : 'text-warm-gray'}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t-2 border-warm-gray">
        <div className="flex space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="input-field flex-1"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} className="mr-2" />
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
