import React, { useEffect, useRef, useState } from 'react'
import Webcam from "react-webcam";
import * as tf from '@tensorflow/tfjs'
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'
import { drawMesh } from './utils/faceDetectionUtils';

const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
const detectorConfig = {
  runtime: 'mediapipe',
  solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
  refineLandmarks: true
};

export default function FaceRecognitionModal() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [detector, setDetector] = useState(null);
  const [faceData, setFaceData] = useState({
    detectedFaces: 0,
    landmarks: [],
    confidence: 0
  });

  // Advanced detection settings
  const [detectionSettings, setDetectionSettings] = useState({
    maxFaces: 2,
    minConfidence: 0.7,
    refineLandmarks: true
  });

  // Load face mesh modal
  const runFacemesh = async () => {
    try {
      const faceDetector = await faceLandmarksDetection.createDetector(model, detectorConfig);
      setDetector(faceDetector);
    } catch (error) {
      console.error("Face detection model loading failed", error);
    }
  };

  const detect = async () => {
    if (
      detector &&
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Set video width
      video.width = videoWidth;
      video.height = videoHeight;

      // Set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      // const faces = await detector.estimateFaces(video, { flipHorizontal: false });
      const faces = await detector.estimateFaces(video, {
        flipHorizontal: false,
        maxFaces: detectionSettings.maxFaces,
        minConfidence: detectionSettings.minConfidence
      });

      // Process face data
      const processedFaces = faces.map(face => ({
        confidence: face.confidence,
        boundingBox: face.boundingBox,
        landmarks: {
          leftEye: face.keypoints.find(kp => kp.name === 'leftEye'),
          rightEye: face.keypoints.find(kp => kp.name === 'rightEye'),
          nose: face.keypoints.find(kp => kp.name === 'noseTip')
        }
      }));

      setFaceData({
        detectedFaces: faces.length,
        landmarks: processedFaces,
        confidence: processedFaces.reduce((acc, face) => acc + face.confidence, 0) / faces.length
      });


      // Get canvas context
      const ctx = canvasRef.current.getContext("2d");

      // Clear previous frame
      ctx.clearRect(0, 0, videoWidth, videoHeight);

      // Draw mesh
      requestAnimationFrame(() => {
        drawMesh(faces, ctx, faceLandmarksDetection)
      });
    }
  };

  // Performance tracking
  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: 0,
    detectionTime: 0
  });

  const trackPerformance = (startTime, endTime) => {
    setPerformanceMetrics({
      fps: 1000 / (endTime - startTime),
      detectionTime: endTime - startTime
    });
  };

  useEffect(() => {
    const timer = setTimeout(runFacemesh, 1000);
    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    let animationFrameId;

    if (detector) {
      const runDetection = () => {
        const startTime = performance.now();
        detect().then(() => {
          const endTime = performance.now();
          trackPerformance(startTime, endTime);
        });
        animationFrameId = requestAnimationFrame(runDetection);
      };
      animationFrameId = requestAnimationFrame(runDetection);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [detector]);

  // Export face detection results
  const exportFaceData = () => {
    const jsonExport = JSON.stringify(faceData, null, 2);
    const blob = new Blob([jsonExport], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'face_detection_results.json';
    link.click();
  };

  return (
    <>

      <div className='tw-flex tw-items-center tw-gap-4 tw-mb-4'>
        <div>Detected Faces: {faceData?.detectedFaces}</div>
        <div>Avg Confidence: {(faceData?.confidence * 100).toFixed(2)}%</div>
        <button onClick={exportFaceData} className='tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded'>
          Export Data
        </button>
      </div>

      <div className='tw-flex tw-flex-col tw-justify-center tw-items-center tw-relative tw-h-[79dvh]'>

        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
            borderRadius: '30px'
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
      </div>

    </>

  )
}