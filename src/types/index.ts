export interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
  avatar?: string;
  bio?: string;
  major?: string;
  year?: string;
  skills: string[];
  interests: string[];
  rating: number;
  totalSwaps: number;
  joinedAt: Date;
  lastActive: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  notifications: boolean;
  publicProfile: boolean;
  matchingAlgorithm: 'basic' | 'advanced' | 'ai';
  preferredMeetingType: 'online' | 'in-person' | 'both';
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  credits: number;
  userId: string;
  userEmail: string;
  category: SkillCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  format: 'one-on-one' | 'group' | 'workshop';
  tags: string[];
  requirements: string[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  views: number;
  swaps: number;
  rating: number;
  reviews: Review[];
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Review {
  id: string;
  skillId: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface SwapTransaction {
  id: string;
  skillId: string;
  buyerId: string;
  sellerId: string;
  credits: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  timestamp: Date;
  completedAt?: Date;
  rating?: number;
  feedback?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'skill-request' | 'system';
}

export interface Notification {
  id: string;
  userId: string;
  type: 'swap-request' | 'message' | 'skill-match' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface SkillMatch {
  skill: Skill;
  matchScore: number;
  reasons: string[];
}