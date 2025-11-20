# Chat System Schema Design

## Collections

### 1. users (already exists)
- id: string (Firebase Auth UID)
- email: string
- full_name: string
- role: string (older_adult, family, caregiver, clinician, admin)
- language: string
- createdAt: timestamp
- lastSeen: timestamp
- avatar: string (optional)

### 2. careTeams
- id: string (auto-generated)
- name: string
- olderAdultId: string (reference to user)
- memberIds: array<string> (array of user IDs)
- createdAt: timestamp
- updatedAt: timestamp
- createdBy: string (user ID)

### 3. conversations
- id: string (auto-generated)
- type: string ('direct' | 'group')
- name: string (for group chats, null for direct)
- participantIds: array<string> (array of user IDs)
- careTeamId: string (reference to careTeam, optional)
- lastMessage: object {
    text: string
    senderId: string
    timestamp: timestamp
  }
- createdAt: timestamp
- updatedAt: timestamp
- isGroup: boolean

### 4. messages (subcollection of conversations)
- Path: conversations/{conversationId}/messages/{messageId}
- id: string (auto-generated)
- text: string
- senderId: string (reference to user)
- senderName: string (denormalized for performance)
- timestamp: timestamp
- readBy: array<string> (array of user IDs who read the message)
- type: string ('text' | 'system') - for future extensibility

### 5. conversationMembers (for quick lookup)
- id: string (userId_conversationId)
- userId: string
- conversationId: string
- unreadCount: number
- lastReadAt: timestamp
- joinedAt: timestamp

## Indexes Required
1. conversationMembers: userId, lastReadAt (desc)
2. messages: senderId, timestamp (desc)
3. conversations: participantIds (array-contains), updatedAt (desc)
4. careTeams: memberIds (array-contains)

## Query Patterns
1. Get all conversations for a user: Query conversationMembers where userId == currentUser
2. Get messages for a conversation: Query messages subcollection ordered by timestamp
3. Get care team members: Query careTeams where memberIds array-contains userId
4. Search users in care team: Query users where id in careTeam.memberIds
