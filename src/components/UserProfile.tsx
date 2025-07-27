import React, { useState } from 'react';
import { User, Edit3, MapPin, Calendar, Award, TrendingUp, Settings, Star } from 'lucide-react';
import { User as UserType } from '../types';

interface UserProfileProps {
  user: UserType;
  onUpdateProfile: (updates: Partial<UserType>) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    bio: user.bio || '',
    major: user.major || '',
    year: user.year || '',
    skills: user.skills.join(', '),
    interests: user.interests.join(', ')
  });

  const handleSave = () => {
    onUpdateProfile({
      ...editForm,
      skills: editForm.skills.split(',').map(s => s.trim()).filter(s => s),
      interests: editForm.interests.split(',').map(s => s.trim()).filter(s => s)
    });
    setIsEditing(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const getActivityStatus = (lastActive: Date) => {
    const now = new Date();
    const diffMinutes = (now.getTime() - lastActive.getTime()) / (1000 * 60);
    
    if (diffMinutes < 5) return { text: 'Online now', color: 'text-green-600' };
    if (diffMinutes < 60) return { text: `Active ${Math.floor(diffMinutes)}m ago`, color: 'text-yellow-600' };
    if (diffMinutes < 1440) return { text: `Active ${Math.floor(diffMinutes / 60)}h ago`, color: 'text-orange-600' };
    return { text: `Active ${Math.floor(diffMinutes / 1440)}d ago`, color: 'text-gray-600' };
  };

  const activityStatus = getActivityStatus(user.lastActive);

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user.avatar || `https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className={`text-sm ${activityStatus.color}`}>{activityStatus.text}</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
        >
          {isEditing ? <Settings className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          {isEditing ? 'Settings' : 'Edit Profile'}
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Major</label>
              <input
                type="text"
                value={editForm.major}
                onChange={(e) => setEditForm({ ...editForm, major: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell others about yourself..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated)</label>
            <input
              type="text"
              value={editForm.skills}
              onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="React, Python, Design..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Interests (comma-separated)</label>
            <input
              type="text"
              value={editForm.interests}
              onChange={(e) => setEditForm({ ...editForm, interests: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="AI, Web Development, Photography..."
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-emerald-600 transition-all duration-200"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2">
                <Award className="w-4 h-4 text-white" />
              </div>
              <p className="text-2xl font-bold text-blue-600">{user.credits}</p>
              <p className="text-sm text-blue-600">Credits</p>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <div className="flex items-center justify-center w-8 h-8 bg-emerald-500 rounded-full mx-auto mb-2">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <p className="text-2xl font-bold text-emerald-600">{user.totalSwaps}</p>
              <p className="text-sm text-emerald-600">Total Swaps</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <div className="flex items-center justify-center w-8 h-8 bg-yellow-500 rounded-full mx-auto mb-2">
                <Star className="w-4 h-4 text-white" />
              </div>
              <p className="text-2xl font-bold text-yellow-600">{user.rating}</p>
              <p className="text-sm text-yellow-600">Rating</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex items-center justify-center w-8 h-8 bg-purple-500 rounded-full mx-auto mb-2">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <p className="text-2xl font-bold text-purple-600">{formatDate(user.joinedAt).split(' ')[1]}</p>
              <p className="text-sm text-purple-600">Joined</p>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-600">{user.bio}</p>
            </div>
          )}

          {/* Academic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Academic Info</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{user.major || 'Major not specified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{user.year || 'Year not specified'}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Interests */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest, index) => (
                <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full border border-emerald-200">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};