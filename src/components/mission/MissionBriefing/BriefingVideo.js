/**
 * GPS Lab Platform - BriefingVideo Component
 * 
 * Video player for mission briefings with custom controls.
 * 
 * @module components/mission/MissionBriefing/BriefingVideo
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import './BriefingVideo.css';

/**
 * BriefingVideo Component
 */
const BriefingVideo = ({
  src,
  poster,
  title,
  autoPlay = false,
  muted = false,
  loop = false,
  onComplete,
  onProgress,
  onError,
  showControls = true,
  className = '',
  ...props
}) => {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControlsOverlay, setShowControlsOverlay] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);
  
  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);
  
  const skip = useCallback((seconds) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += seconds;
  }, []);
  
  const handleProgressClick = useCallback((e) => {
    if (!videoRef.current || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    videoRef.current.currentTime = percentage * duration;
  }, [duration]);
  
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration;
    setCurrentTime(current);
    setProgress((current / dur) * 100);
    onProgress?.({ currentTime: current, duration: dur, percentage: (current / dur) * 100 });
  }, [onProgress]);
  
  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setProgress(100);
    onComplete?.();
  }, [onComplete]);
  
  const handleLoadedMetadata = useCallback(() => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    setIsLoading(false);
  }, []);
  
  const handleError = useCallback((e) => {
    setError('Failed to load video');
    setIsLoading(false);
    onError?.(e);
  }, [onError]);
  
  const classNames = ['briefing-video', isPlaying && 'briefing-video--playing', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      <video
        ref={videoRef}
        className="briefing-video__video"
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleError}
        onClick={togglePlay}
      />
      
      {isLoading && (
        <div className="briefing-video__loading">
          <div className="briefing-video__spinner" />
        </div>
      )}
      
      {error && (
        <div className="briefing-video__error">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      {!isPlaying && !isLoading && !error && (
        <button type="button" onClick={togglePlay} className="briefing-video__play-overlay" aria-label="Play video">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </button>
      )}
      
      {showControls && !error && (
        <div className={`briefing-video__controls ${showControlsOverlay ? 'briefing-video__controls--visible' : ''}`}>
          <div ref={progressRef} className="briefing-video__progress" onClick={handleProgressClick}>
            <div className="briefing-video__progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="briefing-video__controls-row">
            <div className="briefing-video__controls-left">
              <button type="button" onClick={togglePlay} className="briefing-video__btn">
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>
              <button type="button" onClick={() => skip(-10)} className="briefing-video__btn">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/></svg>
              </button>
              <button type="button" onClick={() => skip(10)} className="briefing-video__btn">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>
              </button>
              <span className="briefing-video__time">{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>
            <div className="briefing-video__controls-right">
              <button type="button" onClick={toggleMute} className="briefing-video__btn">
                {isMuted ? (
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {title && showControlsOverlay && <div className="briefing-video__title-overlay">{title}</div>}
    </div>
  );
};

export default BriefingVideo;