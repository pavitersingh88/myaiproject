import { useState } from 'react';
import ConversationsList from '../components/chat/ConversationsList';
import ChatWindow from '../components/chat/ChatWindow';
import CreateGroupModal from '../components/chat/CreateGroupModal';

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleBack = () => {
    setSelectedConversation(null);
  };

  const handleGroupCreated = (conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col md:flex-row">
      <div className={`${selectedConversation ? 'hidden md:block' : 'block'} w-full md:w-96 border-r-2 border-warm-gray`}>
        <ConversationsList
          onSelectConversation={handleSelectConversation}
          onCreateGroup={() => setShowCreateModal(true)}
        />
      </div>

      <div className={`${selectedConversation ? 'block' : 'hidden md:block'} flex-1`}>
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            onBack={handleBack}
          />
        ) : (
          <div className="hidden md:flex h-full items-center justify-center text-warm-gray">
            <div className="text-center">
              <p className="text-xl mb-2">Select a conversation</p>
              <p className="text-sm">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onGroupCreated={handleGroupCreated}
        />
      )}
    </div>
  );
}
