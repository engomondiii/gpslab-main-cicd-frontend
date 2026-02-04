/* global window */
/**
 * GPS Lab Platform - CommandCenterGlobe Component
 * 
 * 3D Cesium globe showing real GPO problems as beacons.
 * Based on Globe.js implementation with full beacon system.
 * 
 * @module components/dashboard/CommandCenter/CommandCenterGlobe
 */

import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import './CommandCenterGlobe.css';

// Extended problem database with more locations
const PROBLEM_DATABASE = [
  // Kenya
  { id: 1, title: 'Clean Water Access in Rural Kenya', lat: -1.2921, lon: 36.8219, stage: 2 },
  { id: 2, title: 'Digital Literacy for Farmers', lat: -0.0236, lon: 37.9062, stage: 5 },
  { id: 3, title: 'Renewable Energy in Villages', lat: -4.0435, lon: 39.6682, stage: 8 },
  
  // East Africa
  { id: 4, title: 'Mobile Health Clinics Uganda', lat: 0.3476, lon: 32.5825, stage: 12 },
  { id: 5, title: 'Solar Power Tanzania', lat: -6.7924, lon: 39.2083, stage: 15 },
  { id: 6, title: 'Agricultural Training Rwanda', lat: -1.9403, lon: 29.8739, stage: 18 },
  
  // West Africa
  { id: 7, title: 'Microfinance Nigeria', lat: 9.0820, lon: 8.6753, stage: 21 },
  { id: 8, title: 'Education Access Ghana', lat: 7.9465, lon: -1.0232, stage: 24 },
  
  // Southern Africa
  { id: 9, title: 'Water Purification Zambia', lat: -13.1339, lon: 27.8493, stage: 27 },
  { id: 10, title: 'Tech Hubs South Africa', lat: -33.9249, lon: 18.4241, stage: 30 },
  
  // Asia
  { id: 11, title: 'Flood Management Bangladesh', lat: 23.6850, lon: 90.3563, stage: 3 },
  { id: 12, title: 'Rural Internet India', lat: 20.5937, lon: 78.9629, stage: 7 },
  { id: 13, title: 'Agricultural Innovation Philippines', lat: 12.8797, lon: 121.7740, stage: 11 },
  
  // South America
  { id: 14, title: 'Amazon Conservation Brazil', lat: -3.4653, lon: -62.2159, stage: 14 },
  { id: 15, title: 'Urban Farming Peru', lat: -12.0464, lon: -77.0428, stage: 19 },
  
  // Middle East
  { id: 16, title: 'Desert Agriculture Jordan', lat: 31.9454, lon: 35.9284, stage: 22 },
  { id: 17, title: 'Refugee Education Lebanon', lat: 33.8547, lon: 35.8623, stage: 25 },
  
  // Europe
  { id: 18, title: 'Green Energy Germany', lat: 51.1657, lon: 10.4515, stage: 28 },
  { id: 19, title: 'Circular Economy Netherlands', lat: 52.1326, lon: 5.2913, stage: 31 },
  
  // North America
  { id: 20, title: 'Urban Sustainability USA', lat: 37.0902, lon: -95.7129, stage: 33 },
];

/**
 * CommandCenterGlobe Component
 */
const CommandCenterGlobe = ({
  currentStage = 1,
  onProblemClick,
  className = '',
  ...props
}) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const beaconsRef = useRef([]);
  const beaconCanvasCache = useRef(new Map());
  const interactionHandlerRef = useRef(null);
  const isInitializingRef = useRef(false);
  const mountedRef = useRef(false);

  // Beacon colors matching Globe.js (ROYGBIV for stages 1-35)
  const beaconColors = useMemo(() => ({
    red: { color: '#FF6B6B', stages: [1, 2, 3, 4, 5] },
    orange: { color: '#FF8C42', stages: [6, 7, 8, 9, 10] },
    yellow: { color: '#F39C12', stages: [11, 12, 13, 14, 15] },
    green: { color: '#27AE60', stages: [16, 17, 18, 19, 20] },
    blue: { color: '#3498DB', stages: [21, 22, 23, 24, 25] },
    indigo: { color: '#9B59B6', stages: [26, 27, 28, 29, 30] },
    violet: { color: '#8E44AD', stages: [31, 32, 33, 34, 35] }
  }), []);

  /**
   * Get beacon color based on stage
   */
  const getBeaconColor = useCallback((stage) => {
    for (const [, colorData] of Object.entries(beaconColors)) {
      if (colorData.stages.includes(stage)) {
        return colorData.color;
      }
    }
    return beaconColors.red.color;
  }, [beaconColors]);

  /**
   * Create beacon canvas (same as Globe.js)
   */
  const createBeaconCanvas = useCallback((color) => {
    if (beaconCanvasCache.current.has(color)) {
      return beaconCanvasCache.current.get(color);
    }

    const canvas = document.createElement('canvas');
    canvas.width = 40;
    canvas.height = 60;
    const context = canvas.getContext('2d');
    
    // Gradient for beacon glow
    const gradient = context.createRadialGradient(20, 45, 0, 20, 45, 15);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.7, color + '80');
    gradient.addColorStop(1, color + '00');
    
    // Beacon body
    context.fillStyle = color;
    context.beginPath();
    context.arc(20, 45, 8, 0, 2 * Math.PI);
    context.fill();
    
    // Beacon pulse ring
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.setLineDash([2, 2]);
    context.beginPath();
    context.arc(20, 45, 12, 0, 2 * Math.PI);
    context.stroke();
    
    // Beacon glow
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(20, 45, 15, 0, 2 * Math.PI);
    context.fill();
    
    // Beacon beam (vertical line)
    const beamGradient = context.createLinearGradient(20, 45, 20, 5);
    beamGradient.addColorStop(0, color + 'FF');
    beamGradient.addColorStop(1, color + '00');
    
    context.strokeStyle = beamGradient;
    context.lineWidth = 3;
    context.setLineDash([]);
    context.beginPath();
    context.moveTo(20, 45);
    context.lineTo(20, 5);
    context.stroke();
    
    beaconCanvasCache.current.set(color, canvas);
    return canvas;
  }, []);

  /**
   * Create beacons on globe
   */
  const createBeacons = useCallback(() => {
    if (!viewerRef.current || !window.Cesium) {
      console.warn('Viewer or Cesium not ready for beacons');
      return;
    }

    // Clear existing beacons
    beaconsRef.current.forEach(beacon => {
      try {
        viewerRef.current.entities.remove(beacon);
      } catch (e) {
        console.warn('Error removing beacon:', e);
      }
    });
    beaconsRef.current = [];

    // Create new beacons
    PROBLEM_DATABASE.forEach(problem => {
      const beaconColor = getBeaconColor(problem.stage);
      
      try {
        const beacon = viewerRef.current.entities.add({
          id: `beacon-${problem.id}`,
          position: window.Cesium.Cartesian3.fromDegrees(problem.lon, problem.lat, 100000),
          billboard: {
            image: createBeaconCanvas(beaconColor),
            scale: 1.5,
            pixelOffset: new window.Cesium.Cartesian2(0, -20),
            verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
            horizontalOrigin: window.Cesium.HorizontalOrigin.CENTER,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          },
          point: {
            pixelSize: 15,
            color: window.Cesium.Color.fromCssColorString(beaconColor),
            outlineColor: window.Cesium.Color.WHITE,
            outlineWidth: 3,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          },
          label: {
            text: problem.title,
            font: '14px Space Grotesk, sans-serif',
            fillColor: window.Cesium.Color.WHITE,
            outlineColor: window.Cesium.Color.BLACK,
            outlineWidth: 2,
            style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new window.Cesium.Cartesian2(0, 10),
            scale: 0.8,
            show: false,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          },
          problemData: problem
        });

        beaconsRef.current.push(beacon);
      } catch (error) {
        console.error('Error creating beacon:', error);
      }
    });

    console.log(`Created ${beaconsRef.current.length} beacons`);
  }, [getBeaconColor, createBeaconCanvas]);

  /**
   * Add beacon click and hover handlers
   */
  const addBeaconInteractionHandlers = useCallback(() => {
    if (!interactionHandlerRef.current || !viewerRef.current) {
      console.warn('Cannot add interaction handlers - refs not ready');
      return;
    }

    // Click handler
    interactionHandlerRef.current.setInputAction((event) => {
      const pickedObject = viewerRef.current.scene.pick(event.position);
      if (window.Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.problemData) {
        onProblemClick?.(pickedObject.id.problemData);
      }
    }, window.Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // Hover handler
    let hoverTimeout = null;
    interactionHandlerRef.current.setInputAction((movement) => {
      if (hoverTimeout) clearTimeout(hoverTimeout);

      hoverTimeout = setTimeout(() => {
        const pickedObject = viewerRef.current.scene.pick(movement.endPosition);
        
        // Hide all labels
        beaconsRef.current.forEach(beacon => {
          if (beacon && beacon.label) beacon.label.show = false;
        });

        // Show label for hovered beacon
        if (window.Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.problemData) {
          pickedObject.id.label.show = true;
          document.body.style.cursor = 'pointer';
        } else {
          document.body.style.cursor = 'default';
        }
      }, 50);
    }, window.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }, [onProblemClick]);

  /**
   * Animate beacon blinking
   */
  const animateBeacons = useCallback(() => {
    if (!mountedRef.current || !viewerRef.current || beaconsRef.current.length === 0) return;

    const animate = () => {
      if (!mountedRef.current || !viewerRef.current || beaconsRef.current.length === 0) return;

      const time = Date.now() * 0.005;
      
      beaconsRef.current.forEach((beacon, index) => {
        if (beacon && beacon.billboard && beacon.point && beacon.problemData) {
          const offset = index * 0.3;
          const opacity = 0.7 + 0.3 * Math.sin(time + offset);
          
          try {
            beacon.billboard.color = new window.Cesium.Color(1, 1, 1, opacity);
            beacon.point.color = window.Cesium.Color.fromCssColorString(
              getBeaconColor(beacon.problemData.stage)
            ).withAlpha(opacity);
            
            const scale = 1.5 + 0.3 * Math.sin(time * 2 + offset);
            beacon.billboard.scale = scale;
            beacon.point.pixelSize = 15 + 5 * Math.sin(time * 2 + offset);
          } catch (error) {
            // Silently handle animation errors
          }
        }
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, [getBeaconColor]);

  /**
   * Initialize Cesium viewer
   */
  useEffect(() => {
    mountedRef.current = true;
    
    // Prevent multiple initializations
    if (isInitializingRef.current || viewerRef.current) {
      console.log('Already initialized or initializing');
      return;
    }
    
    if (!window.Cesium) {
      console.error('Cesium library not loaded!');
      return;
    }
    
    if (!containerRef.current) {
      console.error('Container ref not ready');
      return;
    }

    console.log('Initializing Cesium viewer...');
    isInitializingRef.current = true;

    try {
      const envToken = process.env.REACT_APP_CESIUM_ION_ACCESS_TOKEN;
      const fallbackToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkMWY1MGUyNC0wNjFkLTQ1YWMtYTBhNi1mYTRkMTAzNWYzOGEiLCJpZCI6MjYzODA1LCJpYXQiOjE3MzQ2Nzk0ODd9.OvjRSddy3Mt1P1rOGIFKOQQcxIqTX2i7sM1Ha4s7_qs";
      window.Cesium.Ion.defaultAccessToken = (envToken && envToken.trim() !== "") ? envToken : fallbackToken;

      // Create hidden credit container
      const creditContainer = document.createElement("div");
      creditContainer.style.display = "none";

      viewerRef.current = new window.Cesium.Viewer(containerRef.current, {
        terrainProvider: window.Cesium.createWorldTerrain(),
        imageryProvider: window.Cesium.createWorldImagery({
          style: window.Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS
        }),
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        navigationHelpButton: false,
        sceneModePicker: false,
        timeline: false,
        animation: false,
        fullscreenButton: false,
        requestRenderMode: false,
        maximumRenderTimeChange: Infinity,
        creditContainer: creditContainer,
      });

      if (!viewerRef.current || !viewerRef.current.scene) {
        throw new Error('Cesium Viewer scene failed to initialize.');
      }

      console.log('Cesium viewer created successfully');

      // Set initial camera view
      viewerRef.current.camera.setView({
        destination: window.Cesium.Cartesian3.fromDegrees(20, 10, 15000000)
      });

      // Camera controls
      viewerRef.current.scene.screenSpaceCameraController.inertiaSpin = 0.1;
      viewerRef.current.scene.screenSpaceCameraController.inertiaTranslate = 0.1;
      viewerRef.current.scene.screenSpaceCameraController.inertiaZoom = 0.2;
      viewerRef.current.scene.screenSpaceCameraController.minimumZoomDistance = 1000000;
      viewerRef.current.scene.screenSpaceCameraController.maximumZoomDistance = 50000000;

      // Enable post-processing
      viewerRef.current.scene.highDynamicRange = true;
      viewerRef.current.scene.postProcessStages.bloom.enabled = true;
      viewerRef.current.scene.postProcessStages.bloom.uniforms.glowOnly = false;
      viewerRef.current.scene.postProcessStages.bloom.uniforms.contrast = 200;
      viewerRef.current.scene.postProcessStages.bloom.uniforms.brightness = -0.5;

      viewerRef.current.scene.globe.maximumScreenSpaceError = 1.5;
      viewerRef.current.scene.globe.tileCacheSize = 200;

      // Interaction handler
      interactionHandlerRef.current = new window.Cesium.ScreenSpaceEventHandler(viewerRef.current.canvas);

      // Create beacons and start animation after delay
      setTimeout(() => {
        if (mountedRef.current) {
          console.log('Creating beacons...');
          createBeacons();
          addBeaconInteractionHandlers();
          animateBeacons();
          isInitializingRef.current = false;
          console.log('CommandCenterGlobe initialization complete');
        }
      }, 500);

    } catch (error) {
      console.error('Failed to initialize Cesium viewer:', error);
      isInitializingRef.current = false;
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch (e) {
          console.error('Error destroying viewer:', e);
        }
        viewerRef.current = null;
      }
      if (interactionHandlerRef.current) {
        try {
          interactionHandlerRef.current.destroy();
        } catch (e) {
          console.error('Error destroying handler:', e);
        }
        interactionHandlerRef.current = null;
      }
    }

    return () => {
      console.log('Cleaning up CommandCenterGlobe...');
      mountedRef.current = false;
      
      if (interactionHandlerRef.current && !interactionHandlerRef.current.isDestroyed()) {
        interactionHandlerRef.current.destroy();
        interactionHandlerRef.current = null;
      }
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
      isInitializingRef.current = false;
    };
  }, [createBeacons, addBeaconInteractionHandlers, animateBeacons]);

  const classNames = ['command-center-globe', className].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...props}>
      <div 
        ref={containerRef} 
        className="command-center-globe__container"
        id="commandCenterGlobeContainer"
      />
    </div>
  );
};

CommandCenterGlobe.propTypes = {
  currentStage: PropTypes.number,
  onProblemClick: PropTypes.func,
  className: PropTypes.string
};

export default CommandCenterGlobe;