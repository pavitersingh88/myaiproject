import { db, auth } from './firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  serverTimestamp,
  limit as firestoreLimit,
  startAfter
} from 'firebase/firestore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getAuthToken = async () => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

export const chatService = {
  async getCareTeam() {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/care-teams/my-team`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch care team');
    return response.json();
  },

  async getConversations() {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/conversations`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch conversations');
    return response.json();
  },

  async createConversation(participantIds, name = null, isGroup = false, careTeamId = null) {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/conversations/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ participantIds, name, isGroup, careTeamId })
    });

    if (!response.ok) throw new Error('Failed to create conversation');
    return response.json();
  },

  async getMessages(conversationId, limitCount = 50, beforeTimestamp = null) {
    const token = await getAuthToken();
    let url = `${API_URL}/messages/${conversationId}?limit=${limitCount}`;
    if (beforeTimestamp) {
      url += `&before=${beforeTimestamp}`;
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch messages');
    return response.json();
  },

  async sendMessage(conversationId, text) {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/messages/${conversationId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
  },

  async registerUserProfile(profile) {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profile)
    });

    if (!response.ok) throw new Error('Failed to register user profile');
    return response.json();
  },

  subscribeToConversations(userId, callback) {
    const q = query(
      collection(db, 'conversations'),
      where('participantIds', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const conversations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(conversations);
    });
  },

  subscribeToMessages(conversationId, callback) {
    const q = query(
      collection(db, 'conversations', conversationId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(messages);
    });
  }
};
