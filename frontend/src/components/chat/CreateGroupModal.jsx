import { useState, useEffect } from 'react';
import { X, Users } from 'lucide-react';
import { chatService } from '../../services/chatService';
import { useAuth } from '../../contexts/AuthContext';

export default function CreateGroupModal({ onClose, onGroupCreated }) {
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [careTeamMembers, setCareTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadCareTeamMembers();
  }, []);

  const loadCareTeamMembers = async () => {
    try {
      const { members } = await chatService.getCareTeam();
      const otherMembers = members.filter(member => member.id !== user?.uid);
      setCareTeamMembers(otherMembers);
    } catch (error) {
      console.error('Error loading care team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMember = (memberId) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    if (!groupName.trim() || selectedMembers.length === 0) return;

    try {
      setCreating(true);
      const conversation = await chatService.createConversation(
        selectedMembers,
        groupName.trim(),
        true
      );
      onGroupCreated(conversation);
      onClose();
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleStartDirectChat = async (memberId) => {
    try {
      setCreating(true);
      const conversation = await chatService.createConversation([memberId], null, false);
      onGroupCreated(conversation);
      onClose();
    } catch (error) {
      console.error('Error creating conversation:', error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-card max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b-2 border-warm-gray flex justify-between items-center">
          <h2 className="text-h2">New Conversation</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-beige rounded-button"
            aria-label="Close"
          >
            <X size={24} className="text-navy" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="font-semibold text-navy mb-3">Create Group Chat</h3>
                <form onSubmit={handleCreateGroup} className="space-y-4">
                  <div>
                    <label htmlFor="groupName" className="block text-sm font-semibold mb-2">
                      Group Name
                    </label>
                    <input
                      id="groupName"
                      type="text"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      placeholder="Enter group name"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Select Members ({selectedMembers.length} selected)
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {careTeamMembers.map((member) => (
                        <label
                          key={member.id}
                          className="flex items-center space-x-3 p-3 bg-beige rounded-card cursor-pointer hover:bg-warm-gray transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedMembers.includes(member.id)}
                            onChange={() => toggleMember(member.id)}
                            className="w-5 h-5 rounded border-2 border-navy"
                          />
                          <div className="flex-1">
                            <p className="font-semibold">{member.full_name}</p>
                            <p className="text-sm text-warm-gray capitalize">{member.role}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!groupName.trim() || selectedMembers.length === 0 || creating}
                    className="btn-primary w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Users size={20} className="mr-2" />
                    {creating ? 'Creating...' : 'Create Group'}
                  </button>
                </form>
              </div>

              <div className="border-t-2 border-warm-gray pt-6">
                <h3 className="font-semibold text-navy mb-3">Direct Messages</h3>
                <div className="space-y-2">
                  {careTeamMembers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => handleStartDirectChat(member.id)}
                      disabled={creating}
                      className="w-full p-3 bg-beige rounded-card text-left hover:bg-warm-gray transition-colors disabled:opacity-50"
                    >
                      <p className="font-semibold">{member.full_name}</p>
                      <p className="text-sm text-warm-gray capitalize">{member.role}</p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
