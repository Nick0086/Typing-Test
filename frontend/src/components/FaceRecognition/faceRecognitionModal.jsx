import React, { useEffect, useRef, useState } from 'react';
import Webcam from "react-webcam";
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { drawMesh } from './utils/faceDetectionUtils';

// Configuration for the face mesh model
const modelConfig = {
  model: faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
  detectorConfig: {
    runtime: 'mediapipe',
    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
    refineLandmarks: true,
  },
};

const useFaceDetector = () => {
  const [detector, setDetector] = useState(null);

  useEffect(() => {
    const loadDetector = async () => {
      try {
        const faceDetector = await faceLandmarksDetection.createDetector(
          modelConfig.model,
          modelConfig.detectorConfig
        );
        setDetector(faceDetector);
      } catch (error) {
        console.error("Face detection model loading failed", error);
      }
    };

    loadDetector();
  }, []);

  return detector;
};

const useAnimationFrame = (callback, dependencies) => {
  useEffect(() => {
    let animationFrameId;

    const animate = () => {
      callback();
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, dependencies);
};

const FaceRecognitionModal = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const detector = useFaceDetector();

  const detectFaces = async () => {
    if (
      detector &&
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Set video and canvas dimensions
      video.width = videoWidth;
      video.height = videoHeight;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Detect faces
      const faces = await detector.estimateFaces(video, { flipHorizontal: false });

      // Draw detections
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, videoWidth, videoHeight); // Clear previous frame
      drawMesh(faces, ctx, faceLandmarksDetection);
    }
  };

  // Run face detection in a loop
  useAnimationFrame(detectFaces, [detector]);

  return (
    <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-relative tw-h-[79dvh]">
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
          borderRadius: '30px',
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
  );
};

export default FaceRecognitionModal;
