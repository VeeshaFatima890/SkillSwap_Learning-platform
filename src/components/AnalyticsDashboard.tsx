import React from 'react';
import { TrendingUp, Users, BookOpen, Star, Calendar, Award, Target, Activity } from 'lucide-react';
import { User, Skill } from '../types';

interface AnalyticsDashboardProps {
  user: User;
  skills: Skill[];
  users: User[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ user, skills, users }) => {
  const userSkills = skills.filter(skill => skill.userId === user.id);
  const totalCreditsEarned = userSkills.reduce((sum, skill) => sum + (skill.swaps * skill.credits), 0);
  const totalViews = userSkills.reduce((sum, skill) => sum + skill.views, 0);
  const averageRating = userSkills.length > 0 
    ? userSkills.reduce((sum, skill) => sum + skill.rating, 0) / userSkills.length 
    : 0;

  const platformStats = {
    totalUsers: users.length,
    totalSkills: skills.length,
    totalSwaps: skills.reduce((sum, skill) => sum + skill.swaps, 0),
    averagePlatformRating: skills.length > 0 
      ? skills.reduce((sum, skill) => sum + skill.rating, 0) / skills.length 
      : 0
  };

  const getGrowthData = () => {
    // Mock growth data - in real app, this would come from historical data
    return [
      { month: 'Jan', swaps: 12, credits: 45 },
      { month: 'Feb', swaps: 18, credits: 67 },
      { month: 'Mar', swaps: 25, credits: 89 },
      { month: 'Apr', swaps: 32, credits: 112 },
      { month: 'May', swaps: 28, credits: 98 },
      { month: 'Jun', swaps: 35, credits: 125 }
    ];
  };

  const growthData = getGrowthData();
  const currentMonth = growthData[growthData.length - 1];
  const previousMonth = growthData[growthData.length - 2];
  const swapGrowth = ((currentMonth.swaps - previousMonth.swaps) / previousMonth.swaps * 100).toFixed(1);
  const creditGrowth = ((currentMonth.credits - previousMonth.credits) / previousMonth.credits * 100).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Personal Analytics */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Your Analytics</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-blue-600 bg-blue-200 px-2 py-1 rounded-full">
                +{swapGrowth}%
              </span>
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-1">{user.totalSwaps}</p>
            <p className="text-sm text-blue-600">Total Swaps</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-emerald-500 rounded-full">
                <Award className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-200 px-2 py-1 rounded-full">
                +{creditGrowth}%
              </span>
            </div>
            <p className="text-3xl font-bold text-emerald-600 mb-1">{totalCreditsEarned}</p>
            <p className="text-sm text-emerald-600">Credits Earned</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-full">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-purple-600 bg-purple-200 px-2 py-1 rounded-full">
                Views
              </span>
            </div>
            <p className="text-3xl font-bold text-purple-600 mb-1">{totalViews}</p>
            <p className="text-sm text-purple-600">Profile Views</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-500 rounded-full">
                <Star className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-yellow-600 bg-yellow-200 px-2 py-1 rounded-full">
                Avg
              </span>
            </div>
            <p className="text-3xl font-bold text-yellow-600 mb-1">{averageRating.toFixed(1)}</p>
            <p className="text-sm text-yellow-600">Your Rating</p>
          </div>
        </div>

        {/* Growth Chart Visualization */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">6-Month Growth Trend</h3>
          <div className="flex items-end justify-between h-32 gap-2">
            {growthData.map((data, index) => (
              <div key={data.month} className="flex flex-col items-center flex-1">
                <div className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg mb-2 relative group cursor-pointer"
                     style={{ height: `${(data.swaps / Math.max(...growthData.map(d => d.swaps))) * 100}%` }}>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {data.swaps} swaps
                  </div>
                </div>
                <span className="text-xs text-gray-600">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Analytics */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Platform Insights</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-500 rounded-full mx-auto mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-indigo-600 mb-1">{platformStats.totalUsers}</p>
            <p className="text-sm text-indigo-600">Active Users</p>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl border border-rose-200">
            <div className="flex items-center justify-center w-12 h-12 bg-rose-500 rounded-full mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-rose-600 mb-1">{platformStats.totalSkills}</p>
            <p className="text-sm text-rose-600">Available Skills</p>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl border border-cyan-200">
            <div className="flex items-center justify-center w-12 h-12 bg-cyan-500 rounded-full mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-cyan-600 mb-1">{platformStats.totalSwaps}</p>
            <p className="text-sm text-cyan-600">Total Swaps</p>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200">
            <div className="flex items-center justify-center w-12 h-12 bg-amber-500 rounded-full mx-auto mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-amber-600 mb-1">{platformStats.averagePlatformRating.toFixed(1)}</p>
            <p className="text-sm text-amber-600">Platform Rating</p>
          </div>
        </div>

        {/* Your Position */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Platform Standing</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                #{users.sort((a, b) => b.totalSwaps - a.totalSwaps).findIndex(u => u.id === user.id) + 1}
              </p>
              <p className="text-sm text-purple-600">Swap Ranking</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-pink-600">
                #{users.sort((a, b) => b.rating - a.rating).findIndex(u => u.id === user.id) + 1}
              </p>
              <p className="text-sm text-pink-600">Rating Ranking</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">
                {userSkills.length}
              </p>
              <p className="text-sm text-indigo-600">Skills Shared</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};