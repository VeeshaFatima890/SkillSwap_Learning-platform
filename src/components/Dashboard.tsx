import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, TrendingUp, Users, Award, BarChart3, User as UserIcon } from 'lucide-react';
import { User, Skill } from '../types';
import { SkillCard } from './SkillCard';
import { AddSkillForm } from './AddSkillForm';
import { SmartRecommendations } from './SmartRecommendations';
import { UserProfile } from './UserProfile';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { skillCategories } from '../data/categories';

interface DashboardProps {
  user: User;
  users: User[];
  skills: Skill[];
  onSwapSkill: (skillId: string) => Promise<void>;
  onAddSkill: (title: string, description: string, credits: number, category: string, difficulty: string, duration: string, format: string, tags: string[]) => void;
  onUpdateUser: (updates: Partial<User>) => void;
}

type TabType = 'browse' | 'recommendations' | 'profile' | 'analytics';

export const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  users, 
  skills, 
  onSwapSkill, 
  onAddSkill, 
  onUpdateUser 
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [filteredSkills, setFilteredSkills] = useState(skills);

  useEffect(() => {
    let filtered = skills.filter(skill => {
      const matchesSearch = skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           skill.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || skill.category.id === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || skill.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    // Sort by relevance and activity
    filtered = filtered.sort((a, b) => {
      // Prioritize skills with higher ratings and more recent activity
      const scoreA = a.rating * 0.6 + (a.swaps / 10) * 0.4;
      const scoreB = b.rating * 0.6 + (b.swaps / 10) * 0.4;
      return scoreB - scoreA;
    });

    setFilteredSkills(filtered);
  }, [skills, searchTerm, selectedCategory, selectedDifficulty]);

  const userSkills = skills.filter(skill => skill.userId === user.id);
  const totalCreditsEarned = userSkills.reduce((sum, skill) => sum + (skill.swaps * skill.credits), 0);

  const tabs = [
    { id: 'browse' as TabType, label: 'Browse Skills', icon: BookOpen },
    { id: 'recommendations' as TabType, label: 'Smart Matches', icon: TrendingUp },
    { id: 'profile' as TabType, label: 'Profile', icon: UserIcon },
    { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3 }
  ];

  const handleAddSkill = (
    title: string, 
    description: string, 
    credits: number, 
    categoryId: string, 
    difficulty: string, 
    duration: string, 
    format: string, 
    tags: string[]
  ) => {
    onAddSkill(title, description, credits, categoryId, difficulty, duration, format, tags);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Skills</p>
                <p className="text-3xl font-bold text-blue-600">{skills.length}</p>
                <p className="text-xs text-blue-500 mt-1">+12 this week</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Your Skills</p>
                <p className="text-3xl font-bold text-emerald-600">{userSkills.length}</p>
                <p className="text-xs text-emerald-500 mt-1">{totalCreditsEarned} credits earned</p>
              </div>
              <Award className="w-8 h-8 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Your Rating</p>
                <p className="text-3xl font-bold text-amber-600">{user.rating}</p>
                <p className="text-xs text-amber-500 mt-1">Based on {user.totalSwaps} swaps</p>
              </div>
              <TrendingUp className="w-8 h-8 text-amber-500" />
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-purple-600">{users.length}</p>
                <p className="text-xs text-purple-500 mt-1">Online now: {users.filter(u => (Date.now() - u.lastActive.getTime()) < 300000).length}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-2">
            <div className="flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'browse' && (
          <>
            {/* Add Skill Form */}
            <AddSkillForm onAddSkill={handleAddSkill} />

            {/* Enhanced Search and Filter */}
            <div className="mb-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search skills, tags, or descriptions..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                    />
                  </div>
                  
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  >
                    <option value="all">All Categories</option>
                    {skillCategories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>

                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>

                  <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200">
                    <Filter className="w-5 h-5" />
                    More Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Skills Grid */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === 'all' ? 'All Skills' : skillCategories.find(c => c.id === selectedCategory)?.name} 
                  ({filteredSkills.length})
                </h2>
              </div>

              {filteredSkills.length === 0 ? (
                <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-12 text-center">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No skills found</h3>
                  <p className="text-gray-500">
                    {searchTerm ? 'Try adjusting your search terms or filters' : 'Be the first to share a skill!'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredSkills.map(skill => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      currentUser={user}
                      onSwap={onSwapSkill}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'recommendations' && (
          <SmartRecommendations
            user={user}
            skills={skills}
            onSwapSkill={onSwapSkill}
          />
        )}

        {activeTab === 'profile' && (
          <UserProfile
            user={user}
            onUpdateProfile={onUpdateUser}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            user={user}
            skills={skills}
            users={users}
          />
        )}
      </div>
    </div>
  );
};