import React, { useState } from 'react';
import { Star, User, Calendar, Coins, CheckCircle, AlertCircle, Eye, Users, Clock, Target } from 'lucide-react';
import { Skill, User as UserType } from '../types';

interface SkillCardProps {
  skill: Skill;
  currentUser: UserType;
  onSwap: (skillId: string) => Promise<void>;
  showMatchReasons?: boolean;
  matchReasons?: string[];
}

export const SkillCard: React.FC<SkillCardProps> = ({ 
  skill, 
  currentUser, 
  onSwap, 
  showMatchReasons = false,
  matchReasons = []
}) => {
  const [isSwapping, setIsSwapping] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isOwnSkill = skill.userId === currentUser.id;
  const canAfford = currentUser.credits >= skill.credits;

  const handleSwap = async () => {
    if (isOwnSkill || !canAfford) return;

    setIsSwapping(true);
    try {
      await onSwap(skill.id);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Swap failed:', error);
    }
    setIsSwapping(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (categoryId: string) => {
    const colors = {
      programming: 'bg-blue-100 text-blue-800 border-blue-200',
      design: 'bg-purple-100 text-purple-800 border-purple-200',
      business: 'bg-green-100 text-green-800 border-green-200',
      languages: 'bg-orange-100 text-orange-800 border-orange-200',
      academic: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      music: 'bg-pink-100 text-pink-800 border-pink-200',
      fitness: 'bg-red-100 text-red-800 border-red-200',
      other: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[categoryId as keyof typeof colors] || colors.other;
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(skill.category.id)}`}>
              {skill.category.name}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(skill.difficulty)}`}>
              {skill.difficulty}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
            {skill.title}
          </h3>
        </div>
        <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          <Coins className="w-4 h-4 text-amber-600" />
          <span className="font-semibold text-amber-700">{skill.credits}</span>
        </div>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
        <div className="flex items-center gap-1">
          <User className="w-4 h-4" />
          <span>{skill.userEmail.split('@')[0]}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{skill.duration}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{skill.format}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-4 line-clamp-3">
        {skill.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {skill.tags.slice(0, 4).map((tag, index) => (
          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            {tag}
          </span>
        ))}
        {skill.tags.length > 4 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            +{skill.tags.length - 4} more
          </span>
        )}
      </div>

      {/* Match Reasons */}
      {showMatchReasons && matchReasons.length > 0 && (
        <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Why this matches you:</span>
          </div>
          <ul className="text-sm text-purple-600 space-y-1">
            {matchReasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-1">
                <span className="text-purple-400 mt-1">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{skill.views} views</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{skill.swaps} swaps</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < Math.floor(skill.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
          ))}
          <span className="text-sm text-gray-500 ml-1">{skill.rating}</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex items-center justify-between">
        {showSuccess ? (
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200 w-full justify-center">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Swapped Successfully!</span>
          </div>
        ) : isOwnSkill ? (
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200 w-full justify-center">
            <User className="w-5 h-5" />
            <span className="font-medium">Your Skill</span>
          </div>
        ) : !canAfford ? (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200 w-full justify-center">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Need {skill.credits - currentUser.credits} more credits</span>
          </div>
        ) : (
          <button
            onClick={handleSwap}
            disabled={isSwapping}
            className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-full justify-center"
          >
            {isSwapping ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Swapping...
              </>
            ) : (
              <>
                <Coins className="w-4 h-4" />
                Swap Now
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};