import React, { useEffect, useRef } from 'react'
import Webcam from "react-webcam";
import * as tf from '@tensorflow/tfjs'
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'
import { drawMesh } from './utils/faceDetectionUtils';

const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
const detectorConfig = {
  runtime: 'mediapipe',
  solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
  refineLandmarks: true // Optional: more precise detection
};


export default function FaceRecognitionModal() {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  //  Load posenet this function load tf meshmesh modal
  const runFacemesh = async () => {
    // NEW MODEL
    const detector = await faceLandmarksDetection.createDetector(model, detectorConfig);

    console.log({ detector })

    setInterval(() => {
      detect(detector);
    }, 10);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const face = await net.estimateFaces(video,
        { flipHorizontal: false }
      );
      // console.log(face);

      // Get canvas context
      const ctx = canvasRef.current.getContext("2d");
      requestAnimationFrame(() => { drawMesh(face, ctx) });
    }
  };

  useEffect(() => { runFacemesh() }, []);



  return (
    <div className='tw-flex tw-justify-center tw-items-center tw-relative tw-h-[79dvh]' >
      <Webcam
        ref={webcamRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
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
          zindex: 9,
          width: 640,
          height: 480,
        }}
      />
    </div>
  )
}
