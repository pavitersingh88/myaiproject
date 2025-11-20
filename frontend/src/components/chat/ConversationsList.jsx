import { useEffect, useState } from 'react';
import { Users, MessageCircle, Plus } from 'lucide-react';
import { chatService } from '../../services/chatService';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

export default function ConversationsList({ onSelectConversation, onCreateGroup }) {
  const [conversations, setConversations] = useState([]);
  const [careTeam, setCareTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userCache, setUserCache] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    loadConversations();
    loadCareTeam();

    if (user) {
      const unsubscribe = chatService.subscribeToConversations(user.uid, async (convs) => {
        setConversations(convs);
        await loadUserDataForConversations(convs);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const loadConversations = async () => {
    try {
      const convs = await chatService.getConversations();
      setConversations(convs);
      await loadUserDataForConversations(convs);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserDataForConversations = async (convs) => {
    const userIds = new Set();

    convs.forEach(conv => {
      conv.participantIds.forEach(id => {
        if (id !== user?.uid) {
          userIds.add(id);
        }
      });
    });

    const newUserCache = { ...userCache };

    for (const userId of userIds) {
      if (!newUserCache[userId]) {
        try {
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            newUserCache[userId] = userDoc.data();
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    }

    setUserCache(newUserCache);
  };

  const loadCareTeam = async () => {
    try {
      const team = await chatService.getCareTeam();
      setCareTeam(team);
    } catch (error) {
      console.error('Error loading care team:', error);
    }
  };

  const getConversationName = (conversation) => {
    if (conversation.isGroup) {
      return conversation.name || 'Group Chat';
    }

    const otherParticipantId = conversation.participantIds.find(id => id !== user?.uid);
    const otherUser = userCache[otherParticipantId];
    return otherUser?.full_name || 'Unknown User';
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 86400000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 604800000) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
      </div>
    );
  }

  return (
    <div className="bg-white h-full flex flex-col">
      <div className="p-4 border-b-2 border-warm-gray flex justify-between items-center">
        <h2 className="text-h2">Messages</h2>
        <button
          onClick={onCreateGroup}
          className="btn-primary flex items-center"
          aria-label="Create group chat"
        >
          <Plus size={20} className="mr-2" />
          New Group
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-warm-gray">
            <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
            <p>No conversations yet</p>
            <p className="text-sm mt-2">Start a chat with your care team members</p>
          </div>
        ) : (
          <div className="divide-y divide-warm-gray">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className="w-full p-4 hover:bg-beige transition-colors text-left"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {conversation.isGroup ? (
                      <Users size={24} className="text-navy" />
                    ) : (
                      <MessageCircle size={24} className="text-navy" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold text-navy truncate">
                        {getConversationName(conversation)}
                      </h3>
                      {conversation.lastMessage && (
                        <span className="text-xs text-warm-gray ml-2">
                          {formatTimestamp(conversation.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>

                    {conversation.lastMessage && (
                      <p className="text-sm text-warm-gray truncate mt-1">
                        {conversation.lastMessage.text}
                      </p>
                    )}
                  </div>

                  {conversation.unreadCount > 0 && (
                    <div className="flex-shrink-0">
                      <span className="bg-navy text-garrison-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                        {conversation.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
