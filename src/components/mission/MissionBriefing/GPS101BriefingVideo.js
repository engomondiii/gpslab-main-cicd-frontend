/**
 * GPS 101 Briefing Video Component
 * Video player for mission briefings with custom controls
 * CORRECT: Part of GPS 101 structure (5 Stages → 5 Missions → 30 Sub-missions)
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import './GPS101BriefingVideo.css';

const GPS101BriefingVideo = ({
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
    if (!seconds || isNaN(seconds)) return '0:00';
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
  
  const toggleFullscreen = useCallback(() => {
    if (!videoRef.current) return;
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  const classNames = [
    'gps101-briefing-video',
    isPlaying && 'gps101-briefing-video--playing',
    isFullscreen && 'gps101-briefing-video--fullscreen',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      <video
        ref={videoRef}
        className="gps101-briefing-video__video"
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
        <div className="gps101-briefing-video__loading">
          <div className="gps101-briefing-video__spinner" />
        </div>
      )}
      
      {error && (
        <div className="gps101-briefing-video__error">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      {!isPlaying && !isLoading && !error && (
        <button type="button" onClick={togglePlay} className="gps101-briefing-video__play-overlay" aria-label="Play video">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </button>
      )}
      
      {showControls && !error && (
        <div className={`gps101-briefing-video__controls ${showControlsOverlay ? 'gps101-briefing-video__controls--visible' : ''}`}>
          <div ref={progressRef} className="gps101-briefing-video__progress" onClick={handleProgressClick}>
            <div className="gps101-briefing-video__progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="gps101-briefing-video__controls-row">
            <div className="gps101-briefing-video__controls-left">
              <button type="button" onClick={togglePlay} className="gps101-briefing-video__btn" aria-label={isPlaying ? 'Pause' : 'Play'}>
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>
              <button type="button" onClick={() => skip(-10)} className="gps101-briefing-video__btn" aria-label="Skip backward 10 seconds">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>
              </button>
              <button type="button" onClick={() => skip(10)} className="gps101-briefing-video__btn" aria-label="Skip forward 10 seconds">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/></svg>
              </button>
              <span className="gps101-briefing-video__time">{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>
            <div className="gps101-briefing-video__controls-right">
              <button type="button" onClick={toggleMute} className="gps101-briefing-video__btn" aria-label={isMuted ? 'Unmute' : 'Mute'}>
                {isMuted ? (
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                )}
              </button>
              <button type="button" onClick={toggleFullscreen} className="gps101-briefing-video__btn" aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
                {isFullscreen ? (
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {title && showControlsOverlay && (
        <div className="gps101-briefing-video__title-overlay">{title}</div>
      )}
    </div>
  );
};

export default GPS101BriefingVideo;