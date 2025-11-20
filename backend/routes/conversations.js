const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { authenticateUser } = require('../middleware/auth');

router.get('/', authenticateUser, async (req, res) => {
  try {
    const userId = req.userId;

    const conversationsSnapshot = await db.collection('conversations')
      .where('participantIds', 'array-contains', userId)
      .orderBy('updatedAt', 'desc')
      .get();

    const conversations = conversationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        const unreadDoc = await db.collection('conversationMembers')
          .doc(`${userId}_${conv.id}`)
          .get();

        const unreadCount = unreadDoc.exists ? unreadDoc.data().unreadCount : 0;

        return {
          ...conv,
          unreadCount
        };
      })
    );

    res.json(conversationsWithDetails);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

router.post('/create', authenticateUser, async (req, res) => {
  try {
    const { participantIds = [], name, isGroup, careTeamId } = req.body;
    const userId = req.userId;

    const participants = Array.from(new Set([...participantIds, userId])).sort();

    const existingConvSnapshot = await db.collection('conversations')
      .where('participantIds', '==', participants)
      .where('isGroup', '==', false)
      .limit(1)
      .get();

    if (!isGroup && !existingConvSnapshot.empty) {
      const existingConv = { id: existingConvSnapshot.docs[0].id, ...existingConvSnapshot.docs[0].data() };

      const memberRef = db.collection('conversationMembers').doc(`${userId}_${existingConv.id}`);
      await memberRef.set({
        userId,
        conversationId: existingConv.id,
        unreadCount: 0,
        lastReadAt: new Date().toISOString(),
        joinedAt: existingConv.createdAt
      }, { merge: true });

      return res.json(existingConv);
    }

    const conversation = {
      type: isGroup ? 'group' : 'direct',
      name: isGroup ? name : null,
      participantIds: participants,
      careTeamId: careTeamId || null,
      lastMessage: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isGroup: isGroup || false
    };

    const docRef = await db.collection('conversations').add(conversation);

    const batch = db.batch();
    participants.forEach(pId => {
      const memberRef = db.collection('conversationMembers').doc(`${pId}_${docRef.id}`);
      batch.set(memberRef, {
        userId: pId,
        conversationId: docRef.id,
        unreadCount: 0,
        lastReadAt: new Date().toISOString(),
        joinedAt: new Date().toISOString()
      });
    });

    await batch.commit();

    res.json({ id: docRef.id, ...conversation });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

router.get('/:conversationId', authenticateUser, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.userId;

    const convDoc = await db.collection('conversations').doc(conversationId).get();

    if (!convDoc.exists) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const conversation = { id: convDoc.id, ...convDoc.data() };

    if (!conversation.participantIds.includes(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

module.exports = router;
