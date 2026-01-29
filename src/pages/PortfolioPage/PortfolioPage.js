/**
 * GPS Lab Platform - PortfolioPage Component
 * 
 * Main portfolio page integrating portfolio view,
 * editor, and sharing components.
 * 
 * @module pages/PortfolioPage/PortfolioPage
 */

import React, { useState, useEffect, useCallback } from 'react';
import PortfolioView from '../../components/portfolio/PortfolioView/PortfolioView';
import PortfolioEditor from '../../components/portfolio/PortfolioEditor/PortfolioEditor';
import PortfolioShareModal from '../../components/portfolio/PortfolioShare/PortfolioShareModal';
import './PortfolioPage.css';

/**
 * Mock user data
 */
const MOCK_USER = {
  id: 'user-001',
  displayName: 'GPS Explorer',
  username: 'gpsexplorer',
  avatarUrl: '',
  customTitle: 'Aspiring Global Problem Solver'
};

/**
 * Mock portfolio entries
 */
const MOCK_ENTRIES = [
  {
    id: 'entry-1',
    title: 'AgriTech Mobile App',
    description: 'A mobile application helping smallholder farmers track crop health and access market prices in real-time.',
    thumbnailUrl: '',
    type: 'project',
    category: 'Mobile Development',
    tags: ['react-native', 'agriculture', 'mobile', 'ai'],
    views: 1240,
    likes: 89,
    isFeatured: true,
    stageCompleted: 8,
    externalUrl: 'https://github.com/gpsexplorer/agritech',
    createdAt: '2024-03-15'
  },
  {
    id: 'entry-2',
    title: 'Understanding SDG Impact',
    description: 'An analysis of how technology can accelerate progress toward Sustainable Development Goals in East Africa.',
    thumbnailUrl: '',
    type: 'article',
    category: 'Research',
    tags: ['sdg', 'research', 'analysis', 'sustainability'],
    views: 856,
    likes: 67,
    isFeatured: false,
    stageCompleted: 5,
    createdAt: '2024-02-20'
  },
  {
    id: 'entry-3',
    title: 'Water Quality Dashboard',
    description: 'Interactive dashboard for monitoring water quality data across rural communities.',
    thumbnailUrl: '',
    type: 'design',
    category: 'Data Visualization',
    tags: ['dashboard', 'data-viz', 'water', 'react'],
    views: 542,
    likes: 34,
    isFeatured: true,
    stageCompleted: 10,
    externalUrl: 'https://water-dashboard.demo.app',
    createdAt: '2024-01-28'
  },
  {
    id: 'entry-4',
    title: 'GPS Lab Completion Certificate',
    description: 'Certificate of completion for Stage 1-10 of the GPS Lab curriculum.',
    thumbnailUrl: '',
    type: 'certificate',
    category: 'Achievement',
    tags: ['certificate', 'gps-lab', 'completion'],
    views: 234,
    likes: 45,
    isFeatured: false,
    stageCompleted: 10,
    createdAt: '2024-01-10'
  }
];

/**
 * PortfolioPage Component
 */
const PortfolioPage = ({
  username,
  isOwnPortfolio = true,
  className = '',
  ...props
}) => {
  const [user, setUser] = useState(MOCK_USER);
  const [entries, setEntries] = useState(MOCK_ENTRIES);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [likedEntries, setLikedEntries] = useState([]);
  
  // Fetch portfolio data
  useEffect(() => {
    const fetchPortfolio = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        // In production: const response = await api.getPortfolio(username);
      } catch (error) {
        console.error('Failed to fetch portfolio:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPortfolio();
  }, [username]);
  
  // Handle add entry
  const handleAddEntry = useCallback(() => {
    setEditingEntry(null);
    setIsEditorOpen(true);
  }, []);
  
  // Handle edit entry
  const handleEditEntry = useCallback((entry) => {
    setEditingEntry(entry);
    setIsEditorOpen(true);
  }, []);
  
  // Handle delete entry
  const handleDeleteEntry = useCallback(async (entry) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        // In production: await api.deleteEntry(entry.id);
        setEntries((prev) => prev.filter((e) => e.id !== entry.id));
      } catch (error) {
        console.error('Failed to delete entry:', error);
      }
    }
  }, []);
  
  // Handle save entry
  const handleSaveEntry = useCallback(async (formData) => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (editingEntry) {
        // Update existing entry
        setEntries((prev) =>
          prev.map((e) =>
            e.id === editingEntry.id
              ? { ...e, ...formData, updatedAt: new Date().toISOString() }
              : e
          )
        );
      } else {
        // Create new entry
        const newEntry = {
          ...formData,
          id: `entry-${Date.now()}`,
          views: 0,
          likes: 0,
          createdAt: new Date().toISOString()
        };
        setEntries((prev) => [newEntry, ...prev]);
      }
      
      setIsEditorOpen(false);
      setEditingEntry(null);
    } catch (error) {
      console.error('Failed to save entry:', error);
    } finally {
      setIsSaving(false);
    }
  }, [editingEntry]);
  
  // Handle cancel editor
  const handleCancelEditor = useCallback(() => {
    setIsEditorOpen(false);
    setEditingEntry(null);
  }, []);
  
  // Handle entry click
  const handleEntryClick = useCallback((entry) => {
    // Navigate to entry detail or open modal
    console.log('View entry:', entry);
  }, []);
  
  // Handle like entry
  const handleLikeEntry = useCallback(async (entry) => {
    const isLiked = likedEntries.includes(entry.id);
    
    if (isLiked) {
      setLikedEntries((prev) => prev.filter((id) => id !== entry.id));
      setEntries((prev) =>
        prev.map((e) =>
          e.id === entry.id ? { ...e, likes: e.likes - 1 } : e
        )
      );
    } else {
      setLikedEntries((prev) => [...prev, entry.id]);
      setEntries((prev) =>
        prev.map((e) =>
          e.id === entry.id ? { ...e, likes: e.likes + 1 } : e
        )
      );
    }
    // In production: await api.toggleLike(entry.id);
  }, [likedEntries]);
  
  // Handle share
  const handleShare = useCallback(() => {
    setIsShareModalOpen(true);
  }, []);
  
  // Handle edit portfolio settings
  const handleEditPortfolio = useCallback(() => {
    // Open portfolio settings
    console.log('Edit portfolio settings');
  }, []);
  
  const classNames = [
    'portfolio-page',
    isEditorOpen && 'portfolio-page--editor-open',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      <div className="portfolio-page__container">
        {/* Main Portfolio View */}
        {!isEditorOpen && (
          <PortfolioView
            user={user}
            entries={entries}
            categories={['Mobile Development', 'Research', 'Data Visualization', 'Achievement']}
            isOwnPortfolio={isOwnPortfolio}
            onEditPortfolio={handleEditPortfolio}
            onAddEntry={handleAddEntry}
            onEditEntry={handleEditEntry}
            onDeleteEntry={handleDeleteEntry}
            onEntryClick={handleEntryClick}
            onShare={handleShare}
            isLoading={isLoading}
          />
        )}
        
        {/* Editor View */}
        {isEditorOpen && (
          <div className="portfolio-page__editor-wrapper">
            <PortfolioEditor
              initialData={editingEntry}
              categories={['Mobile Development', 'Research', 'Data Visualization', 'Achievement']}
              onSave={handleSaveEntry}
              onCancel={handleCancelEditor}
              onDelete={editingEntry ? handleDeleteEntry : null}
              isSaving={isSaving}
              isEditing={!!editingEntry}
            />
          </div>
        )}
        
        {/* Share Modal */}
        <PortfolioShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          username={user.username}
          portfolioTitle={`${user.displayName}'s Portfolio`}
          portfolioDescription={`Check out ${user.displayName}'s projects and achievements on GPS Lab!`}
        />
      </div>
    </div>
  );
};

export default PortfolioPage;