/**
 * GPS Lab Platform - Audio Service
 * 
 * Audio management service for sound effects, background music,
 * and audio preferences.
 * 
 * @module services/audio/audio.service
 * @version 1.0.0
 */

import { getItem, setItem, STORAGE_KEYS, subscribeToKey } from '../storage/localStorage.service';

// =============================================================================
// AUDIO CONFIGURATION
// =============================================================================

const AUDIO_CONFIG = {
  basePath: '/audio/',
  defaultVolume: 0.5,
  fadeTime: 500
};

// =============================================================================
// SOUND CONSTANTS
// =============================================================================

export const SOUNDS = {
  // UI Sounds
  CLICK: 'ui/click.mp3',
  HOVER: 'ui/hover.mp3',
  SUCCESS: 'ui/success.mp3',
  ERROR: 'ui/error.mp3',
  WARNING: 'ui/warning.mp3',
  NOTIFICATION: 'ui/notification.mp3',
  
  // Achievement Sounds
  BADGE_EARNED: 'achievement/badge.mp3',
  LEVEL_UP: 'achievement/level-up.mp3',
  MILESTONE: 'achievement/milestone.mp3',
  STREAK: 'achievement/streak.mp3',
  
  // Progress Sounds
  MISSION_COMPLETE: 'progress/mission-complete.mp3',
  CHECKPOINT_PASS: 'progress/checkpoint-pass.mp3',
  BITE_COMPLETE: 'progress/bite-complete.mp3',
  STAGE_COMPLETE: 'progress/stage-complete.mp3',
  
  // Baraka Sounds
  BARAKA_EARN: 'baraka/earn.mp3',
  BARAKA_SPEND: 'baraka/spend.mp3',
  BARAKA_TIER_UP: 'baraka/tier-up.mp3',
  
  // Social Sounds
  PRAISE_RECEIVED: 'social/praise.mp3',
  MESSAGE_RECEIVED: 'social/message.mp3',
  PARTY_JOIN: 'social/party-join.mp3',
  
  // Timer Sounds
  TIMER_TICK: 'timer/tick.mp3',
  TIMER_WARNING: 'timer/warning.mp3',
  TIMER_COMPLETE: 'timer/complete.mp3'
};

export const MUSIC = {
  AMBIENT: 'music/ambient.mp3',
  FOCUS: 'music/focus.mp3',
  CELEBRATION: 'music/celebration.mp3'
};

// =============================================================================
// AUDIO SERVICE CLASS
// =============================================================================

class AudioService {
  constructor() {
    this.sounds = new Map();
    this.music = null;
    this.enabled = true;
    this.volume = AUDIO_CONFIG.defaultVolume;
    this.musicVolume = AUDIO_CONFIG.defaultVolume * 0.5;
    this.initialized = false;
  }
  
  // ===========================================================================
  // INITIALIZATION
  // ===========================================================================
  
  /**
   * Initializes audio service
   */
  initialize() {
    if (this.initialized) return;
    
    // Load preferences from storage
    this.enabled = getItem(STORAGE_KEYS.soundEnabled) !== false;
    
    const savedVolume = getItem('gps_sound_volume');
    if (savedVolume !== null) {
      this.volume = savedVolume;
    }
    
    const savedMusicVolume = getItem('gps_music_volume');
    if (savedMusicVolume !== null) {
      this.musicVolume = savedMusicVolume;
    }
    
    // Listen for preference changes across tabs
    subscribeToKey('gps_soundEnabled', (enabled) => {
      this.enabled = enabled !== false;
      if (!this.enabled) {
        this.stopAll();
      }
    });
    
    // Preload common sounds
    this.preloadCommonSounds();
    
    this.initialized = true;
  }
  
  /**
   * Preloads commonly used sounds
   */
  preloadCommonSounds() {
    const commonSounds = [
      SOUNDS.CLICK,
      SOUNDS.SUCCESS,
      SOUNDS.ERROR,
      SOUNDS.NOTIFICATION
    ];
    
    commonSounds.forEach(sound => {
      this.preload(sound);
    });
  }
  
  /**
   * Preloads a sound
   * @param {string} soundKey - Sound key
   */
  preload(soundKey) {
    if (this.sounds.has(soundKey)) return;
    
    const audio = new Audio(`${AUDIO_CONFIG.basePath}${soundKey}`);
    audio.preload = 'auto';
    audio.volume = this.volume;
    
    this.sounds.set(soundKey, audio);
  }
  
  // ===========================================================================
  // SOUND PLAYBACK
  // ===========================================================================
  
  /**
   * Plays a sound
   * @param {string} soundKey - Sound key
   * @param {Object} options - Play options
   * @returns {HTMLAudioElement|null} Audio element
   */
  play(soundKey, { volume, loop = false } = {}) {
    if (!this.enabled) return null;
    
    try {
      let audio = this.sounds.get(soundKey);
      
      if (!audio) {
        audio = new Audio(`${AUDIO_CONFIG.basePath}${soundKey}`);
        this.sounds.set(soundKey, audio);
      }
      
      // Clone for overlapping sounds
      const playableAudio = audio.cloneNode();
      playableAudio.volume = volume ?? this.volume;
      playableAudio.loop = loop;
      
      playableAudio.play().catch(e => {
        // Ignore autoplay errors
        console.debug('Audio play failed:', e.message);
      });
      
      return playableAudio;
    } catch (error) {
      console.error('Error playing sound:', error);
      return null;
    }
  }
  
  /**
   * Plays UI click sound
   */
  playClick() {
    this.play(SOUNDS.CLICK, { volume: this.volume * 0.5 });
  }
  
  /**
   * Plays success sound
   */
  playSuccess() {
    this.play(SOUNDS.SUCCESS);
  }
  
  /**
   * Plays error sound
   */
  playError() {
    this.play(SOUNDS.ERROR);
  }
  
  /**
   * Plays notification sound
   */
  playNotification() {
    this.play(SOUNDS.NOTIFICATION);
  }
  
  // ===========================================================================
  // ACHIEVEMENT SOUNDS
  // ===========================================================================
  
  /**
   * Plays badge earned sound
   */
  playBadgeEarned() {
    this.play(SOUNDS.BADGE_EARNED);
  }
  
  /**
   * Plays level up sound
   */
  playLevelUp() {
    this.play(SOUNDS.LEVEL_UP);
  }
  
  /**
   * Plays mission complete sound
   */
  playMissionComplete() {
    this.play(SOUNDS.MISSION_COMPLETE);
  }
  
  /**
   * Plays Baraka earn sound
   */
  playBarakaEarn() {
    this.play(SOUNDS.BARAKA_EARN);
  }
  
  /**
   * Plays praise received sound
   */
  playPraiseReceived() {
    this.play(SOUNDS.PRAISE_RECEIVED);
  }
  
  // ===========================================================================
  // MUSIC PLAYBACK
  // ===========================================================================
  
  /**
   * Plays background music
   * @param {string} musicKey - Music key
   * @param {Object} options - Play options
   */
  playMusic(musicKey, { fadeIn = true } = {}) {
    if (!this.enabled) return;
    
    // Stop current music
    if (this.music) {
      this.stopMusic(fadeIn);
    }
    
    try {
      this.music = new Audio(`${AUDIO_CONFIG.basePath}${musicKey}`);
      this.music.loop = true;
      
      if (fadeIn) {
        this.music.volume = 0;
        this.music.play().catch(() => {});
        this.fadeIn(this.music, this.musicVolume);
      } else {
        this.music.volume = this.musicVolume;
        this.music.play().catch(() => {});
      }
    } catch (error) {
      console.error('Error playing music:', error);
    }
  }
  
  /**
   * Stops background music
   * @param {boolean} fadeOut - Whether to fade out
   */
  stopMusic(fadeOut = true) {
    if (!this.music) return;
    
    if (fadeOut) {
      this.fadeOut(this.music, () => {
        this.music?.pause();
        this.music = null;
      });
    } else {
      this.music.pause();
      this.music = null;
    }
  }
  
  /**
   * Pauses music
   */
  pauseMusic() {
    this.music?.pause();
  }
  
  /**
   * Resumes music
   */
  resumeMusic() {
    this.music?.play().catch(() => {});
  }
  
  // ===========================================================================
  // VOLUME CONTROL
  // ===========================================================================
  
  /**
   * Sets master volume
   * @param {number} volume - Volume (0-1)
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    setItem('gps_sound_volume', this.volume);
    
    // Update all cached sounds
    this.sounds.forEach(audio => {
      audio.volume = this.volume;
    });
  }
  
  /**
   * Gets master volume
   * @returns {number} Volume
   */
  getVolume() {
    return this.volume;
  }
  
  /**
   * Sets music volume
   * @param {number} volume - Volume (0-1)
   */
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    setItem('gps_music_volume', this.musicVolume);
    
    if (this.music) {
      this.music.volume = this.musicVolume;
    }
  }
  
  /**
   * Gets music volume
   * @returns {number} Volume
   */
  getMusicVolume() {
    return this.musicVolume;
  }
  
  // ===========================================================================
  // ENABLE/DISABLE
  // ===========================================================================
  
  /**
   * Enables audio
   */
  enable() {
    this.enabled = true;
    setItem(STORAGE_KEYS.soundEnabled, true);
  }
  
  /**
   * Disables audio
   */
  disable() {
    this.enabled = false;
    setItem(STORAGE_KEYS.soundEnabled, false);
    this.stopAll();
  }
  
  /**
   * Toggles audio
   * @returns {boolean} New state
   */
  toggle() {
    if (this.enabled) {
      this.disable();
    } else {
      this.enable();
    }
    return this.enabled;
  }
  
  /**
   * Checks if audio is enabled
   * @returns {boolean} Enabled state
   */
  isEnabled() {
    return this.enabled;
  }
  
  // ===========================================================================
  // UTILITIES
  // ===========================================================================
  
  /**
   * Stops all sounds
   */
  stopAll() {
    this.sounds.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    
    if (this.music) {
      this.music.pause();
      this.music = null;
    }
  }
  
  /**
   * Fades in audio
   * @param {HTMLAudioElement} audio - Audio element
   * @param {number} targetVolume - Target volume
   */
  fadeIn(audio, targetVolume) {
    const step = targetVolume / (AUDIO_CONFIG.fadeTime / 50);
    
    const fade = setInterval(() => {
      if (audio.volume < targetVolume - step) {
        audio.volume = Math.min(targetVolume, audio.volume + step);
      } else {
        audio.volume = targetVolume;
        clearInterval(fade);
      }
    }, 50);
  }
  
  /**
   * Fades out audio
   * @param {HTMLAudioElement} audio - Audio element
   * @param {Function} onComplete - Callback when complete
   */
  fadeOut(audio, onComplete) {
    const step = audio.volume / (AUDIO_CONFIG.fadeTime / 50);
    
    const fade = setInterval(() => {
      if (audio.volume > step) {
        audio.volume = Math.max(0, audio.volume - step);
      } else {
        audio.volume = 0;
        clearInterval(fade);
        if (onComplete) onComplete();
      }
    }, 50);
  }
  
  /**
   * Clears cached sounds
   */
  clearCache() {
    this.sounds.clear();
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

const audioService = new AudioService();

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

export const initialize = () => audioService.initialize();
export const play = (sound, options) => audioService.play(sound, options);
export const playClick = () => audioService.playClick();
export const playSuccess = () => audioService.playSuccess();
export const playError = () => audioService.playError();
export const playNotification = () => audioService.playNotification();
export const playBadgeEarned = () => audioService.playBadgeEarned();
export const playLevelUp = () => audioService.playLevelUp();
export const playMissionComplete = () => audioService.playMissionComplete();
export const playBarakaEarn = () => audioService.playBarakaEarn();
export const playPraiseReceived = () => audioService.playPraiseReceived();
export const playMusic = (music, options) => audioService.playMusic(music, options);
export const stopMusic = (fadeOut) => audioService.stopMusic(fadeOut);
export const pauseMusic = () => audioService.pauseMusic();
export const resumeMusic = () => audioService.resumeMusic();
export const setVolume = (volume) => audioService.setVolume(volume);
export const getVolume = () => audioService.getVolume();
export const setMusicVolume = (volume) => audioService.setMusicVolume(volume);
export const getMusicVolume = () => audioService.getMusicVolume();
export const enable = () => audioService.enable();
export const disable = () => audioService.disable();
export const toggle = () => audioService.toggle();
export const isEnabled = () => audioService.isEnabled();
export const stopAll = () => audioService.stopAll();

// =============================================================================
// EXPORTS
// =============================================================================

export { audioService as default, SOUNDS, MUSIC };