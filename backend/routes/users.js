const express = require('express');
const router = express.Router();
const { db, admin } = require('../config/firebase');
const { authenticateUser } = require('../middleware/auth');

const DEFAULT_CARE_TEAM_ID = 'default-team';

router.post('/register', authenticateUser, async (req, res) => {
  try {
    const userId = req.userId;
    const { email, full_name, role } = req.body;

    if (!email || !full_name || !role) {
      return res.status(400).json({ error: 'Missing required user fields' });
    }

    const userRef = db.collection('users').doc(userId);
    const userData = {
      id: userId,
      email,
      full_name,
      role,
      careTeam: DEFAULT_CARE_TEAM_ID,
      language: 'en',
      createdAt: new Date().toISOString(),
      lastSeen: new Date().toISOString()
    };

    await userRef.set(userData, { merge: true });

    const careTeamRef = db.collection('careTeams').doc(DEFAULT_CARE_TEAM_ID);
    await careTeamRef.set(
      {
        id: DEFAULT_CARE_TEAM_ID,
        name: 'Default Care Team',
        memberIds: admin.firestore.FieldValue.arrayUnion(userId),
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );

    res.json({ success: true, user: { id: userId, ...userData } });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

module.exports = router;
