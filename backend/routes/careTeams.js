const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { authenticateUser } = require('../middleware/auth');

router.get('/my-team', authenticateUser, async (req, res) => {
  try {
    const userId = req.userId;

    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.json({ careTeam: null, members: [] });
    }

    const userData = userDoc.data();
    const careTeamId = userData.careTeam || 'default-team';

    const membersSnapshot = await db.collection('users')
      .where('careTeam', '==', careTeamId)
      .get();

    const members = membersSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(member => member.id !== userId);

    const careTeam = {
      id: careTeamId,
      name: 'Care Team',
      memberIds: membersSnapshot.docs.map(doc => doc.id)
    };

    res.json({ careTeam, members });
  } catch (error) {
    console.error('Error fetching care team:', error);
    res.status(500).json({ error: 'Failed to fetch care team' });
  }
});

router.post('/create', authenticateUser, async (req, res) => {
  try {
    const { name, olderAdultId, memberIds } = req.body;
    const userId = req.userId;

    if (!memberIds.includes(userId)) {
      memberIds.push(userId);
    }

    const careTeam = {
      name,
      olderAdultId,
      memberIds,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userId
    };

    const docRef = await db.collection('careTeams').add(careTeam);

    res.json({ id: docRef.id, ...careTeam });
  } catch (error) {
    console.error('Error creating care team:', error);
    res.status(500).json({ error: 'Failed to create care team' });
  }
});

module.exports = router;
