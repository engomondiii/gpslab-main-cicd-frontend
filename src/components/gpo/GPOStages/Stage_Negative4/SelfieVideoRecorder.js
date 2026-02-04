/**
 * GPS Lab Platform - SelfieVideoRecorder Component
 * 
 * Records 1-minute selfie video using device camera.
 * 
 * @module components/gpo/GPOStages/Stage_Negative4/SelfieVideoRecorder
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import './SelfieVideoRecorder.css';

const MAX_DURATION = 90; // 90 seconds (1.5 minutes)
const MIN_DURATION = 30; // 30 seconds minimum

/**
 * SelfieVideoRecorder Component
 */
const SelfieVideoRecorder = ({
  onVideoRecorded,
  onCancel,
  existingVideo = null,
  className = '',
  ...props
}) => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(existingVideo);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);

  /**
   * Format time as MM:SS
   */
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Initialize camera
   */
  const initCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 },
        audio: true
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraReady(true);
      setError(null);
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access camera. Please check permissions.');
    }
  }, []);

  /**
   * Start recording
   */
  const startRecording = useCallback(() => {
    if (!streamRef.current) return;

    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm;codecs=vp9'
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setRecordedBlob(blob);
      setIsRecording(false);
      setIsPaused(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start(100);
    setIsRecording(true);
    setRecordingTime(0);

    // Timer
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        const newTime = prev + 1;
        
        // Auto-stop at max duration
        if (newTime >= MAX_DURATION) {
          stopRecording();
          return MAX_DURATION;
        }
        
        return newTime;
      });
    }, 1000);
  }, []);

  /**
   * Stop recording
   */
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  /**
   * Pause/Resume recording
   */
  const togglePause = useCallback(() => {
    if (!mediaRecorderRef.current) return;

    if (isPaused) {
      mediaRecorderRef.current.resume();
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          if (newTime >= MAX_DURATION) {
            stopRecording();
            return MAX_DURATION;
          }
          return newTime;
        });
      }, 1000);
    } else {
      mediaRecorderRef.current.pause();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    
    setIsPaused(!isPaused);
  }, [isPaused, stopRecording]);

  /**
   * Retry recording
   */
  const retryRecording = useCallback(() => {
    setRecordedBlob(null);
    setRecordingTime(0);
    chunksRef.current = [];
  }, []);

  /**
   * Save video
   */
  const handleSave = useCallback(() => {
    if (recordedBlob && recordingTime >= MIN_DURATION) {
      onVideoRecorded?.(recordedBlob);
    }
  }, [recordedBlob, recordingTime, onVideoRecorded]);

  /**
   * Cleanup
   */
  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  }, []);

  /**
   * Initialize on mount
   */
  useEffect(() => {
    initCamera();
    return cleanup;
  }, [initCamera, cleanup]);

  const classNames = ['selfie-video-recorder', className].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...props}>
      <div className="selfie-video-recorder__container">
        {/* Header */}
        <div className="selfie-video-recorder__header">
          <h3 className="selfie-video-recorder__title">Record Your Selfie Video 🎥</h3>
          <p className="selfie-video-recorder__subtitle">
            Introduce yourself in 30 seconds to 1.5 minutes. Be authentic!
          </p>
        </div>

        {/* Video Preview */}
        <div className="selfie-video-recorder__preview">
          <video
            ref={videoRef}
            autoPlay
            muted={!recordedBlob}
            playsInline
            className="selfie-video-recorder__video"
            src={recordedBlob ? URL.createObjectURL(recordedBlob) : undefined}
          />

          {/* Recording Indicator */}
          {isRecording && !isPaused && (
            <div className="selfie-video-recorder__recording-indicator">
              <span className="selfie-video-recorder__recording-dot" />
              <span>REC</span>
            </div>
          )}

          {/* Timer */}
          <div className="selfie-video-recorder__timer">
            <span className="selfie-video-recorder__time">{formatTime(recordingTime)}</span>
            <span className="selfie-video-recorder__max-time">/ {formatTime(MAX_DURATION)}</span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="selfie-video-recorder__error">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {error}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="selfie-video-recorder__controls">
          {!recordedBlob ? (
            <>
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  disabled={!cameraReady}
                  className="selfie-video-recorder__button selfie-video-recorder__button--start"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                  Start Recording
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={togglePause}
                    className="selfie-video-recorder__button selfie-video-recorder__button--pause"
                  >
                    {isPaused ? (
                      <>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                        Resume
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                        Pause
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={stopRecording}
                    className="selfie-video-recorder__button selfie-video-recorder__button--stop"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="6" width="12" height="12"/>
                    </svg>
                    Stop
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={retryRecording}
                className="selfie-video-recorder__button selfie-video-recorder__button--retry"
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                </svg>
                Retry
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={recordingTime < MIN_DURATION}
                className="selfie-video-recorder__button selfie-video-recorder__button--save"
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Save Video
              </button>
            </>
          )}
        </div>

        {/* Hints */}
        <div className="selfie-video-recorder__hints">
          {!recordedBlob && !isRecording && (
            <p className="selfie-video-recorder__hint">
              💡 <strong>Tip:</strong> Find good lighting and a quiet space. Speak clearly and from the heart!
            </p>
          )}
          {recordedBlob && recordingTime < MIN_DURATION && (
            <p className="selfie-video-recorder__hint selfie-video-recorder__hint--warning">
              ⚠️ Video must be at least {MIN_DURATION} seconds long. Please record again.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="selfie-video-recorder__actions">
          <button
            type="button"
            onClick={onCancel}
            className="selfie-video-recorder__button selfie-video-recorder__button--cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelfieVideoRecorder;