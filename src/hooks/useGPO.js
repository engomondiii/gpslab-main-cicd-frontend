/**
 * GPS Lab Platform - useGPO Hook
 * 
 * Custom hook for GPO Call functionality.
 * 
 * @module hooks/useGPO
 */

import { useState, useCallback, useEffect } from 'react';
import * as gpoService from '../services/api/gpo.service';
import { GPO_STAGES } from '../config/constants';

/**
 * useGPO Hook
 */
const useGPO = (initialProjectId = null) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gpoProgress, setGPOProgress] = useState({
    currentStage: -4,
    completedStages: [],
    totalStages: 5,
    percentage: 0
  });

  /**
   * Fetch projects
   */
  const fetchProjects = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await gpoService.getProjects(filters);
      setProjects(data.projects || []);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch projects');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch single project
   */
  const fetchProject = useCallback(async (projectId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const project = await gpoService.getProject(projectId);
      setCurrentProject(project);
      
      // Update progress
      if (project.completedStages) {
        const completed = project.completedStages.length;
        setGPOProgress({
          currentStage: project.stage || -4,
          completedStages: project.completedStages || [],
          totalStages: 5,
          percentage: (completed / 5) * 100
        });
      }
      
      return project;
    } catch (err) {
      setError(err.message || 'Failed to fetch project');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create new project
   */
  const createProject = useCallback(async (data) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const project = await gpoService.createProject(data);
      setCurrentProject(project);
      setProjects(prev => [project, ...prev]);
      return project;
    } catch (err) {
      setError(err.message || 'Failed to create project');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update project
   */
  const updateProject = useCallback(async (projectId, data) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updated = await gpoService.updateProject(projectId, data);
      setCurrentProject(updated);
      setProjects(prev => prev.map(p => p.id === projectId ? updated : p));
      return updated;
    } catch (err) {
      setError(err.message || 'Failed to update project');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Submit project for review
   */
  const submitProject = useCallback(async (projectId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await gpoService.submitProject(projectId);
      setCurrentProject(prev => ({ ...prev, status: 'submitted' }));
      return result;
    } catch (err) {
      setError(err.message || 'Failed to submit project');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Delete project
   */
  const deleteProject = useCallback(async (projectId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await gpoService.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete project');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentProject]);

  /**
   * Fetch categories
   */
  const fetchCategories = useCallback(async () => {
    try {
      const data = await gpoService.getCategories();
      setCategories(data.categories || []);
      return data.categories;
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      return [];
    }
  }, []);

  /**
   * Complete GPO stage
   */
  const completeStage = useCallback((stageNumber) => {
    setGPOProgress(prev => {
      const newCompleted = [...prev.completedStages, stageNumber];
      const nextStage = stageNumber + 1;
      
      return {
        ...prev,
        currentStage: nextStage <= 0 ? nextStage : 0,
        completedStages: newCompleted,
        percentage: (newCompleted.length / 5) * 100
      };
    });
  }, []);

  /**
   * Reset error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Load initial project
   */
  useEffect(() => {
    if (initialProjectId) {
      fetchProject(initialProjectId);
    }
  }, [initialProjectId, fetchProject]);

  /**
   * Load categories on mount
   */
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    // State
    projects,
    currentProject,
    categories,
    isLoading,
    error,
    gpoProgress,
    
    // Actions
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    submitProject,
    deleteProject,
    fetchCategories,
    completeStage,
    clearError,
    
    // Computed
    isGPOComplete: gpoProgress.percentage === 100,
    currentGPOStage: GPO_STAGES.find(s => s.number === gpoProgress.currentStage)
  };
};

export default useGPO;