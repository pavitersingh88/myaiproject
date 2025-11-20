const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { authenticateUser } = require('../middleware/auth');

router.get('/:conversationId', authenticateUser, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 50;
    const before = req.query.before;

    const convDoc = await db.collection('conversations').doc(conversationId).get();

    if (!convDoc.exists) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const conversation = convDoc.data();

    if (!conversation.participantIds.includes(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    let query = db.collection('conversations').doc(conversationId)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .limit(limit);

    if (before) {
      query = query.startAfter(new Date(before));
    }

    const messagesSnapshot = await query.get();

    const messages = messagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    await db.collection('conversationMembers')
      .doc(`${userId}_${conversationId}`)
      .update({
        unreadCount: 0,
        lastReadAt: new Date().toISOString()
      });

    res.json(messages.reverse());
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.post('/:conversationId', authenticateUser, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;
    const userId = req.userId;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const convDoc = await db.collection('conversations').doc(conversationId).get();

    if (!convDoc.exists) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const conversation = convDoc.data();

    if (!conversation.participantIds.includes(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    const message = {
      text: text.trim(),
      senderId: userId,
      senderName: userData.full_name,
      timestamp: new Date().toISOString(),
      readBy: [userId],
      type: 'text'
    };

    const messageRef = await db.collection('conversations')
      .doc(conversationId)
      .collection('messages')
      .add(message);

    await db.collection('conversations').doc(conversationId).update({
      lastMessage: {
        text: message.text,
        senderId: userId,
        timestamp: message.timestamp
      },
      updatedAt: message.timestamp
    });

    const batch = db.batch();
    conversation.participantIds.forEach(pId => {
      if (pId !== userId) {
        const memberRef = db.collection('conversationMembers').doc(`${pId}_${conversationId}`);
        batch.update(memberRef, {
          unreadCount: db.FieldValue.increment(1)
        });
      }
    });

    await batch.commit();

    res.json({ id: messageRef.id, ...message });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
