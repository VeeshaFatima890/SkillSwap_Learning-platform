import React, { useState, useCallback } from 'react';
import { LoginForm } from './components/LoginForm';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { User, Skill } from './types';
import { mockUsers, mockSkills } from './data/mockData';
import { skillCategories } from './data/categories';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [skills, setSkills] = useState<Skill[]>(mockSkills);
  const [loginError, setLoginError] = useState('');

  const handleLogin = useCallback((email: string) => {
    setLoginError('');

    // Validate university email
    if (!email.endsWith('@university.edu')) {
      setLoginError('Please use a valid university email address ending with @university.edu');
      return;
    }

    // Find existing user or create new one
    let user = users.find(u => u.email === email);
    
    if (!user) {
      // Create new user with enhanced profile
      const name = email.split('@')[0].split('.').map(part => 
        part.charAt(0).toUpperCase() + part.slice(1)
      ).join(' ');
      
      user = {
        id: Date.now().toString(),
        email,
        name,
        credits: 10,
        bio: '',
        major: '',
        year: '',
        skills: [],
        interests: [],
        rating: 4.0,
        totalSwaps: 0,
        joinedAt: new Date(),
        lastActive: new Date(),
        preferences: {
          notifications: true,
          publicProfile: true,
          matchingAlgorithm: 'advanced',
          preferredMeetingType: 'both'
        }
      };
      
      setUsers(prev => [...prev, user!]);
    } else {
      // Update last active time
      user.lastActive = new Date();
      setUsers(prev => prev.map(u => u.id === user!.id ? user! : u));
    }

    setCurrentUser(user);
  }, [users]);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setLoginError('');
  }, []);

  const handleSwapSkill = useCallback(async (skillId: string) => {
    if (!currentUser) return;

    const skill = skills.find(s => s.id === skillId);
    if (!skill) return;

    // Check if user has enough credits
    if (currentUser.credits < skill.credits) {
      throw new Error('Insufficient credits');
    }

    // Check if it's not user's own skill
    if (skill.userId === currentUser.id) {
      throw new Error('Cannot swap your own skill');
    }

    // Update user credits and stats
    const updatedUser = { 
      ...currentUser, 
      credits: currentUser.credits - skill.credits,
      totalSwaps: currentUser.totalSwaps + 1
    };
    setCurrentUser(updatedUser);
    
    // Update users array
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

    // Update skill stats
    setSkills(prev => prev.map(s => 
      s.id === skillId 
        ? { ...s, swaps: s.swaps + 1, views: s.views + 1 }
        : s
    ));

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, [currentUser, skills]);

  const handleAddSkill = useCallback((
    title: string, 
    description: string, 
    credits: number, 
    categoryId: string, 
    difficulty: 'beginner' | 'intermediate' | 'advanced', 
    duration: string, 
    format: 'one-on-one' | 'group' | 'workshop', 
    tags: string[]
  ) => {
    if (!currentUser) return;

    const category = skillCategories.find(c => c.id === categoryId);
    if (!category) return;

    const newSkill: Skill = {
      id: Date.now().toString(),
      title,
      description,
      credits,
      userId: currentUser.id,
      userEmail: currentUser.email,
      category,
      difficulty,
      duration,
      format,
      tags,
      requirements: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      views: 0,
      swaps: 0,
      rating: 4.5,
      reviews: []
    };

    setSkills(prev => [newSkill, ...prev]);
  }, [currentUser]);

  const handleUpdateUser = useCallback((updates: Partial<User>) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  }, [currentUser]);

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} error={loginError} />;
  }

  return (
    <div className="min-h-screen">
      <Header user={currentUser} onLogout={handleLogout} />
      <Dashboard
        user={currentUser}
        users={users}
        skills={skills}
        onSwapSkill={handleSwapSkill}
        onAddSkill={handleAddSkill}
        onUpdateUser={handleUpdateUser}
      />
    </div>
  );
}

export default App;