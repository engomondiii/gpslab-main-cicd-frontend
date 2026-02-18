/**
 * GPS Lab Platform - InvitationVideoRecorder Component
 *
 * Record invitation message to GPS — Stage 0.
 * Max 2 minutes, guided prompts.
 *
 * @module components/gpo/GPOStages/Stage0/InvitationVideoRecorder
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import './InvitationVideoRecorder.css';

const MAX_DURATION = 120;
const MIN_DURATION = 15;

const InvitationVideoRecorder = ({
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

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive')
      mediaRecorderRef.current.stop();
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const initCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraReady(true);
      setCameraError(null);
    } catch {
      setCameraError('Cannot access camera. Please check permissions.');
    }
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

  const classNames = ['invitation-video-recorder', className].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...props}>
      <div className="ivr__header">
        <h3 className="ivr__title">Record Your Invitation 📣</h3>
        <p className="ivr__subtitle">
          Look directly into the camera and speak to the Global Problem Solvers who will watch this.
          Be personal, be passionate, be specific about how they can help.
        </p>
      </div>

      {/* Prompts */}
      <div className="ivr__script">
        <div className="ivr__script-header">
          <span className="ivr__script-icon">💬</span>
          <span className="ivr__script-title">Suggested Script (adapt freely):</span>
        </div>
        <ol className="ivr__script-list">
          <li>"Hello, I'm _____, a Problem Owner from _____."</li>
          <li>"I'm facing _____ and it affects _____ people."</li>
          <li>"I am calling on GPS to help me with _____."</li>
          <li>"If you're a _____ (skill), you can make a real difference here."</li>
          <li>"Together, we can _____. Will you join me?"</li>
        </ol>
      </div>

      {/* Video */}
      <div className="ivr__video-area">
        <video
          ref={videoRef}
          autoPlay
          muted={!recordedBlob}
          playsInline
          controls={!!recordedBlob}
          className="ivr__video"
          src={recordedBlob ? URL.createObjectURL(recordedBlob) : undefined}
        />

        {isRecording && !isPaused && (
          <div className="ivr__rec-badge">
            <span className="ivr__rec-dot" />
            LIVE
          </div>
        )}
        {isPaused && <div className="ivr__paused-badge">⏸ PAUSED</div>}

        <div className="ivr__timer-bar">
          <div className="ivr__timer-fill" style={{ width: `${timePercent}%` }} />
        </div>
        <div className="ivr__timer">
          <span className="ivr__timer-current">{formatTime(recordingTime)}</span>
          <span className="ivr__timer-max"> / {formatTime(MAX_DURATION)}</span>
        </div>
        {cameraError && <div className="ivr__camera-error">{cameraError}</div>}
      </div>

      {/* Controls */}
      <div className="ivr__controls">
        {!recordedBlob ? (
          !isRecording ? (
            <button type="button" onClick={startRecording} disabled={!cameraReady} className="ivr__btn ivr__btn--record">
              <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
              Start Invitation
            </button>
          ) : (
            <>
              <button type="button" onClick={togglePause} className="ivr__btn ivr__btn--pause">
                {isPaused ? '▶ Resume' : '⏸ Pause'}
              </button>
              <button type="button" onClick={stopRecording} className="ivr__btn ivr__btn--stop">
                ⏹ Stop
              </button>
            </>
          )
        ) : (
          <>
            <button type="button" onClick={retry} className="ivr__btn ivr__btn--retry">
              🔄 Record Again
            </button>
            <button type="button" onClick={handleSave} disabled={recordingTime < MIN_DURATION} className="ivr__btn ivr__btn--save">
              ✅ Use This Invitation
            </button>
          </>
        )}
      </div>

      {recordedBlob && recordingTime < MIN_DURATION && (
        <p className="ivr__warn">⚠️ Must be at least {MIN_DURATION} seconds. Please record again.</p>
      )}
      {error && <p className="ivr__field-error">{error}</p>}
    </div>
  );
};

export default InvitationVideoRecorder;