import { User, Skill, SkillMatch } from '../types';

export class SkillMatchingEngine {
  static findMatches(user: User, skills: Skill[]): SkillMatch[] {
    const availableSkills = skills.filter(skill => 
      skill.userId !== user.id && 
      skill.isActive &&
      user.credits >= skill.credits
    );

    const matches = availableSkills.map(skill => ({
      skill,
      matchScore: this.calculateMatchScore(user, skill),
      reasons: this.getMatchReasons(user, skill)
    }));

    return matches
      .filter(match => match.matchScore > 0.3)
      .sort((a, b) => b.matchScore - a.matchScore);
  }

  private static calculateMatchScore(user: User, skill: Skill): number {
    let score = 0;
    const weights = {
      interest: 0.4,
      skillLevel: 0.2,
      format: 0.15,
      rating: 0.15,
      activity: 0.1
    };

    // Interest matching
    const interestMatch = this.calculateInterestMatch(user, skill);
    score += interestMatch * weights.interest;

    // Skill level compatibility
    const skillLevelMatch = this.calculateSkillLevelMatch(user, skill);
    score += skillLevelMatch * weights.skillLevel;

    // Format preference
    const formatMatch = this.calculateFormatMatch(user, skill);
    score += formatMatch * weights.format;

    // Skill rating
    const ratingScore = skill.rating / 5;
    score += ratingScore * weights.rating;

    // Recent activity
    const activityScore = this.calculateActivityScore(skill);
    score += activityScore * weights.activity;

    return Math.min(score, 1);
  }

  private static calculateInterestMatch(user: User, skill: Skill): number {
    const userInterests = user.interests.map(i => i.toLowerCase());
    const skillTags = skill.tags.map(t => t.toLowerCase());
    
    const matches = skillTags.filter(tag => 
      userInterests.some(interest => 
        interest.includes(tag) || tag.includes(interest)
      )
    );

    return matches.length / Math.max(skillTags.length, 1);
  }

  private static calculateSkillLevelMatch(user: User, skill: Skill): number {
    // Simple heuristic based on user's total swaps and skill difficulty
    const userExperience = user.totalSwaps;
    
    if (skill.difficulty === 'beginner') return 1;
    if (skill.difficulty === 'intermediate') return userExperience >= 5 ? 1 : 0.7;
    if (skill.difficulty === 'advanced') return userExperience >= 15 ? 1 : 0.5;
    
    return 0.8;
  }

  private static calculateFormatMatch(user: User, skill: Skill): number {
    if (user.preferences.preferredMeetingType === 'both') return 1;
    
    // Simplified format matching
    if (skill.format === 'one-on-one' && user.preferences.preferredMeetingType === 'online') return 0.9;
    if (skill.format === 'group' && user.preferences.preferredMeetingType === 'in-person') return 0.9;
    
    return 0.7;
  }

  private static calculateActivityScore(skill: Skill): number {
    const daysSinceUpdate = (Date.now() - skill.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, 1 - (daysSinceUpdate / 30)); // Decay over 30 days
  }

  private static getMatchReasons(user: User, skill: Skill): string[] {
    const reasons: string[] = [];

    // Interest-based reasons
    const matchingInterests = user.interests.filter(interest =>
      skill.tags.some(tag => 
        tag.toLowerCase().includes(interest.toLowerCase()) ||
        interest.toLowerCase().includes(tag.toLowerCase())
      )
    );

    if (matchingInterests.length > 0) {
      reasons.push(`Matches your interests: ${matchingInterests.slice(0, 2).join(', ')}`);
    }

    // Rating-based reasons
    if (skill.rating >= 4.5) {
      reasons.push('Highly rated by other students');
    }

    // Popularity reasons
    if (skill.swaps >= 10) {
      reasons.push('Popular skill with many successful swaps');
    }

    // Format reasons
    if (skill.format === 'one-on-one') {
      reasons.push('Personalized one-on-one learning');
    }

    // Difficulty matching
    if (skill.difficulty === 'beginner' && user.totalSwaps < 5) {
      reasons.push('Perfect for beginners');
    }

    return reasons.slice(0, 3); // Limit to top 3 reasons
  }
}