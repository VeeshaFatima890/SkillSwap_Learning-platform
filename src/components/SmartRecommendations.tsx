import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Target, Clock } from 'lucide-react';
import { User, Skill, SkillMatch } from '../types';
import { SkillMatchingEngine } from '../utils/matchingAlgorithm';
import { SkillCard } from './SkillCard';

interface SmartRecommendationsProps {
  user: User;
  skills: Skill[];
  onSwapSkill: (skillId: string) => Promise<void>;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  user,
  skills,
  onSwapSkill
}) => {
  const [matches, setMatches] = useState<SkillMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const findMatches = async () => {
      setIsLoading(true);
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const skillMatches = SkillMatchingEngine.findMatches(user, skills);
      setMatches(skillMatches.slice(0, 6)); // Show top 6 matches
      setIsLoading(false);
    };

    findMatches();
  }, [user, skills]);

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">AI-Powered Recommendations</h2>
          </div>
          
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Analyzing your interests and finding perfect matches...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="mb-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">AI-Powered Recommendations</h2>
          </div>
          
          <div className="text-center py-8">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No matches found</h3>
            <p className="text-gray-500">Try updating your interests or check back later for new skills!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Smart Recommendations</h2>
              <p className="text-gray-600">Personalized matches based on your interests and learning style</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-full border border-purple-200">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">
              {Math.round(matches[0]?.matchScore * 100 || 0)}% match
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {matches.map((match, index) => (
            <div key={match.skill.id} className="relative">
              <div className="absolute -top-2 -right-2 z-10">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                  {Math.round(match.matchScore * 100)}% match
                </div>
              </div>
              
              <div className="relative">
                <SkillCard
                  skill={match.skill}
                  currentUser={user}
                  onSwap={onSwapSkill}
                  showMatchReasons={true}
                  matchReasons={match.reasons}
                />
              </div>
              
              {index === 0 && (
                <div className="absolute -top-3 -left-3 z-10">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Best Match
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">How we match you:</span>
          </div>
          <p className="text-sm text-purple-600">
            Our AI analyzes your interests, learning preferences, skill level, and past activity to find the most relevant skills for you.
          </p>
        </div>
      </div>
    </div>
  );
};