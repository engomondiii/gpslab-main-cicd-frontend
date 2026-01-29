/**
 * GPS Lab Platform - ProfilePage Component
 * 
 * Main profile page integrating user profile components
 * with navigation and state management.
 * 
 * @module pages/ProfilePage/ProfilePage
 */

import React, { useState, useEffect, useCallback } from 'react';
import UserProfile from '../../components/profile/UserProfile/UserProfile';
import ProfileEditor from '../../components/profile/ProfileEditor/ProfileEditor';
import BadgeCollection from '../../components/profile/ProfileBadges/BadgeCollection';
import './ProfilePage.css';

/**
 * Mock user data - replace with actual data fetching
 */
const MOCK_USER = {
  id: 'user-001',
  displayName: 'GPS Explorer',
  username: 'gpsexplorer',
  email: 'explorer@gpslab.app',
  avatarUrl: '',
  bio: 'Passionate about solving global problems through technology and innovation.',
  location: 'Nairobi, Kenya',
  pronouns: 'they/them',
  customTitle: 'Aspiring Global Problem Solver',
  joinedDate: '2024-01-15',
  isOnline: true,
  isVerified: true,
  socialLinks: {
    github: 'gpsexplorer',
    linkedin: 'https://linkedin.com/in/gpsexplorer',
    twitter: '@gpsexplorer'
  }
};

const MOCK_STATS = {
  currentStage: 12,
  totalStages: 35,
  completedBites: 84,
  totalBites: 245,
  completedCheckpoints: 12,
  totalCheckpoints: 35,
  badgesEarned: 15,
  totalBadges: 50,
  achievementsUnlocked: 28,
  totalAchievements: 100,
  barakaBalance: 4250,
  psbBalance: 125,
  praiseGiven: 47,
  praiseReceived: 89,
  partiesJoined: 3,
  projectsCompleted: 5,
  daysActive: 156,
  currentStreak: 12,
  longestStreak: 34,
  totalXP: 15420,
  rank: 247
};

const MOCK_BADGES = [
  { id: 'b1', name: 'First Steps', icon: '👣', rarity: 'common', earnedDate: 'Jan 15, 2024' },
  { id: 'b2', name: 'Week Warrior', icon: '🗓️', rarity: 'uncommon', earnedDate: 'Jan 22, 2024' },
  { id: 'b3', name: 'Problem Spotter', icon: '🔍', rarity: 'rare', earnedDate: 'Feb 1, 2024' },
  { id: 'b4', name: 'Team Player', icon: '🤝', rarity: 'uncommon', earnedDate: 'Feb 15, 2024' },
  { id: 'b5', name: 'Innovation Star', icon: '⭐', rarity: 'epic', earnedDate: 'Mar 1, 2024' },
  { id: 'b6', name: 'Streak Master', icon: '🔥', rarity: 'rare', earnedDate: 'Mar 15, 2024' }
];

const MOCK_ACTIVITY = [
  { id: 'a1', icon: '🎯', text: 'Completed Stage 12', timeAgo: '2 hours ago' },
  { id: 'a2', icon: '🏅', text: 'Earned "Streak Master" badge', timeAgo: '1 day ago' },
  { id: 'a3', icon: '👏', text: 'Received praise from @mentor', timeAgo: '2 days ago' },
  { id: 'a4', icon: '📁', text: 'Added new portfolio entry', timeAgo: '3 days ago' },
  { id: 'a5', icon: '🎉', text: 'Joined "Tech Innovators" party', timeAgo: '1 week ago' }
];

/**
 * ProfilePage Component
 */
const ProfilePage = ({
  userId,
  isOwnProfile = true,
  className = '',
  ...props
}) => {
  const [user, setUser] = useState(MOCK_USER);
  const [stats, setStats] = useState(MOCK_STATS);
  const [badges, setBadges] = useState(MOCK_BADGES);
  const [activity, setActivity] = useState(MOCK_ACTIVITY);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showBadgeCollection, setShowBadgeCollection] = useState(false);
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        // In production, fetch actual user data
        // const response = await api.getUser(userId);
        // setUser(response.user);
        // setStats(response.stats);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [userId]);
  
  // Handle edit profile
  const handleEditProfile = useCallback(() => {
    setIsEditing(true);
  }, []);
  
  // Handle save profile
  const handleSaveProfile = useCallback(async (formData) => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In production: await api.updateProfile(formData);
      setUser((prev) => ({
        ...prev,
        ...formData
      }));
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  }, []);
  
  // Handle cancel edit
  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
  }, []);
  
  // Handle view portfolio
  const handleViewPortfolio = useCallback(() => {
    // Navigate to portfolio page
    window.location.href = `/portfolio/${user.username}`;
  }, [user.username]);
  
  // Handle share profile
  const handleShareProfile = useCallback(() => {
    const url = `${window.location.origin}/profile/${user.username}`;
    if (navigator.share) {
      navigator.share({
        title: `${user.displayName}'s Profile`,
        url
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Profile link copied to clipboard!');
    }
  }, [user]);
  
  // Handle follow
  const handleFollow = useCallback(async () => {
    setIsFollowing((prev) => !prev);
    // In production: await api.toggleFollow(userId);
  }, []);
  
  // Handle message
  const handleMessage = useCallback(() => {
    // Navigate to messages
    console.log('Open message to user');
  }, []);
  
  // Handle tab change
  const handleTabChange = useCallback((tabId) => {
    if (tabId === 'achievements') {
      setShowBadgeCollection(true);
    } else {
      setShowBadgeCollection(false);
    }
  }, []);
  
  const classNames = [
    'profile-page',
    isEditing && 'profile-page--editing',
    className
  ].filter(Boolean).join(' ');
  
  // Show editing mode
  if (isEditing) {
    return (
      <div className={classNames} {...props}>
        <div className="profile-page__container">
          <ProfileEditor
            initialData={user}
            onSave={handleSaveProfile}
            onCancel={handleCancelEdit}
            isSaving={isSaving}
            isEditing={true}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className={classNames} {...props}>
      <div className="profile-page__container">
        <UserProfile
          user={user}
          stats={stats}
          badges={badges}
          recentActivity={activity}
          portfolioItems={[]}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          onEditProfile={handleEditProfile}
          onViewPortfolio={handleViewPortfolio}
          onShareProfile={handleShareProfile}
          onFollow={handleFollow}
          onMessage={handleMessage}
          onTabChange={handleTabChange}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ProfilePage;