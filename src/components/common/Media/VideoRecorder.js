/**
 * GPS Lab Platform - VideoRecorder Component
 * 
 * Reusable video recording component with MediaRecorder API.
 * 
 * @module components/common/Media/VideoRecorder
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import './VideoRecorder.css';

/**
 * VideoRecorder Component
 */
const VideoRecorder = ({
  maxDuration = 120, // 2 minutes default
  minDuration = 10, // 10 seconds minimum
  onRecordingComplete,
  onCancel,
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
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);

  /**
   * Format time
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
        video: { width: 1280, height: 720 },
        audio: true
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraReady(true);
      setError(null);
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
    }
  }, []);

  /**
   * Start recording
   */
  const startRecording = useCallback(() => {
    if (!streamRef.current) return;

    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current);

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

    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        const newTime = prev + 1;
        if (newTime >= maxDuration) {
          stopRecording();
          return maxDuration;
        }
        return newTime;
      });
    }, 1000);
  }, [maxDuration]);

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
   * Toggle pause
   */
  const togglePause = useCallback(() => {
    if (!mediaRecorderRef.current) return;

    if (isPaused) {
      mediaRecorderRef.current.resume();
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          if (newTime >= maxDuration) {
            stopRecording();
            return maxDuration;
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
  }, [isPaused, maxDuration, stopRecording]);

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
    if (recordedBlob && recordingTime >= minDuration) {
      onRecordingComplete?.(recordedBlob);
    }
  }, [recordedBlob, recordingTime, minDuration, onRecordingComplete]);

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

  useEffect(() => {
    initCamera();
    return cleanup;
  }, [initCamera, cleanup]);

  const classNames = ['video-recorder', className].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...props}>
      <div className="video-recorder__preview">
        <video
          ref={videoRef}
          autoPlay
          muted={!recordedBlob}
          playsInline
          className="video-recorder__video"
          src={recordedBlob ? URL.createObjectURL(recordedBlob) : undefined}
        />

        {isRecording && !isPaused && (
          <div className="video-recorder__recording-indicator">
            <span className="video-recorder__recording-dot" />
            <span>REC</span>
          </div>
        )}

        <div className="video-recorder__timer">
          <span>{formatTime(recordingTime)}</span>
          <span> / {formatTime(maxDuration)}</span>
        </div>

        {error && (
          <div className="video-recorder__error">{error}</div>
        )}
      </div>

      <div className="video-recorder__controls">
        {!recordedBlob ? (
          <>
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                disabled={!cameraReady}
                className="video-recorder__button video-recorder__button--start"
              >
                Start Recording
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={togglePause}
                  className="video-recorder__button video-recorder__button--pause"
                >
                  {isPaused ? 'Resume' : 'Pause'}
                </button>

                <button
                  type="button"
                  onClick={stopRecording}
                  className="video-recorder__button video-recorder__button--stop"
                >
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
              className="video-recorder__button video-recorder__button--retry"
            >
              Retry
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={recordingTime < minDuration}
              className="video-recorder__button video-recorder__button--save"
            >
              Save Video
            </button>
          </>
        )}
      </div>

      {recordedBlob && recordingTime < minDuration && (
        <p className="video-recorder__hint">
          Video must be at least {minDuration} seconds long.
        </p>
      )}
    </div>
  );
};

export default VideoRecorder;