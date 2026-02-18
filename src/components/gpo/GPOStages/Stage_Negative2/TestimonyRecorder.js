/**
 * GPS Lab Platform - TestimonyRecorder Component
 *
 * Short testimony video/audio recorder for Stage -2.
 * Max 3 minutes.
 *
 * @module components/gpo/GPOStages/Stage_Negative2/TestimonyRecorder
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import './TestimonyRecorder.css';

const MAX_DURATION = 180; // 3 minutes
const MIN_DURATION = 20;

const TestimonyRecorder = ({
  existingVideo = null,
  onVideoRecorded,
  error = null,
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
  const [cameraError, setCameraError] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);

  const formatTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const timePercent = Math.min((recordingTime / MAX_DURATION) * 100, 100);

  const initCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraReady(true);
      setCameraError(null);
    } catch {
      setCameraError('Cannot access camera. Please check permissions and try again.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive')
      mediaRecorderRef.current.stop();
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const startRecording = useCallback(() => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    const mr = new MediaRecorder(streamRef.current);
    mr.ondataavailable = e => { if (e.data?.size > 0) chunksRef.current.push(e.data); };
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setRecordedBlob(blob);
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
    };
    mediaRecorderRef.current = mr;
    mr.start(100);
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        const next = prev + 1;
        if (next >= MAX_DURATION) { stopRecording(); return MAX_DURATION; }
        return next;
      });
    }, 1000);
  }, [stopRecording]);

  const togglePause = useCallback(() => {
    if (!mediaRecorderRef.current) return;
    if (isPaused) {
      mediaRecorderRef.current.resume();
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const next = prev + 1;
          if (next >= MAX_DURATION) { stopRecording(); return MAX_DURATION; }
          return next;
        });
      }, 1000);
    } else {
      mediaRecorderRef.current.pause();
      if (timerRef.current) clearInterval(timerRef.current);
    }
    setIsPaused(p => !p);
  }, [isPaused, stopRecording]);

  const retry = useCallback(() => {
    setRecordedBlob(null);
    setRecordingTime(0);
    chunksRef.current = [];
  }, []);

  const handleSave = useCallback(() => {
    if (recordedBlob && recordingTime >= MIN_DURATION) onVideoRecorded?.(recordedBlob);
  }, [recordedBlob, recordingTime, onVideoRecorded]);

  useEffect(() => {
    initCamera();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, [initCamera]);

  const classNames = ['testimony-recorder', className].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...props}>
      <div className="tr__header">
        <h3 className="tr__title">Record Your Testimony 🎙️</h3>
        <p className="tr__subtitle">
          Speak directly to Global Problem Solvers. Share your story, your pain, and your hope.
          You have up to 3 minutes — be authentic and speak from the heart.
        </p>
      </div>

      {/* Prompts */}
      <div className="tr__prompts">
        <h4 className="tr__prompts-title">Testimony prompts to guide you:</h4>
        <ul className="tr__prompts-list">
          <li>"My name is _____, and I live in _____."</li>
          <li>"The problem I face every day is _____."</li>
          <li>"Because of this, I _____ (describe daily hardship)."</li>
          <li>"The people most affected are _____."</li>
          <li>"If this problem were solved, my life would _____."</li>
        </ul>
      </div>

      {/* Video Area */}
      <div className="tr__video-area">
        <video
          ref={videoRef}
          autoPlay
          muted={!recordedBlob}
          playsInline
          controls={!!recordedBlob}
          className="tr__video"
          src={recordedBlob ? URL.createObjectURL(recordedBlob) : undefined}
        />

        {isRecording && !isPaused && (
          <div className="tr__rec-badge">
            <span className="tr__rec-dot" />
            REC
          </div>
        )}

        {isPaused && (
          <div className="tr__paused-badge">⏸ PAUSED</div>
        )}

        {/* Timer Bar */}
        <div className="tr__timer-bar">
          <div className="tr__timer-bar-fill" style={{ width: `${timePercent}%` }} />
        </div>

        <div className="tr__timer-text">
          <span className="tr__timer-current">{formatTime(recordingTime)}</span>
          <span className="tr__timer-max"> / {formatTime(MAX_DURATION)}</span>
        </div>

        {cameraError && <div className="tr__camera-error">{cameraError}</div>}
      </div>

      {/* Controls */}
      <div className="tr__controls">
        {!recordedBlob ? (
          !isRecording ? (
            <button type="button" onClick={startRecording} disabled={!cameraReady} className="tr__btn tr__btn--record">
              <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
              Start Testimony
            </button>
          ) : (
            <>
              <button type="button" onClick={togglePause} className="tr__btn tr__btn--pause">
                {isPaused
                  ? <><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>Resume</>
                  : <><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>Pause</>
                }
              </button>
              <button type="button" onClick={stopRecording} className="tr__btn tr__btn--stop">
                <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12"/></svg>
                Stop
              </button>
            </>
          )
        ) : (
          <>
            <button type="button" onClick={retry} className="tr__btn tr__btn--retry">
              <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/></svg>
              Record Again
            </button>
            <button type="button" onClick={handleSave} disabled={recordingTime < MIN_DURATION} className="tr__btn tr__btn--save">
              <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
              Use This Testimony
            </button>
          </>
        )}
      </div>

      {recordedBlob && recordingTime < MIN_DURATION && (
        <p className="tr__warn">⚠️ Testimony must be at least {MIN_DURATION} seconds. Please record again.</p>
      )}

      {error && <p className="tr__error">{error}</p>}
    </div>
  );
};

export default TestimonyRecorder;