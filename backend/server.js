const express = require('express');
const cors = require('cors');
const path = require('path');

const careTeamsRouter = require('./routes/careTeams');
const conversationsRouter = require('./routes/conversations');
const messagesRouter = require('./routes/messages');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SarAI API is running' });
});

app.use('/api/care-teams', careTeamsRouter);
app.use('/api/conversations', conversationsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/users', usersRouter);

app.use(express.static(path.join(__dirname, '../frontend/src')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/src/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
