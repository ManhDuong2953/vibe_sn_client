import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import './login_face_recognition.scss';

const LoginFaceRecognition = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState(0);
  const [nameUser, setNameUser] = useState('');
  let labeledFaceDescriptors = []; // Store labeled face descriptors

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots + 1) % 4);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadFaceAPI = async () => {
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceExpressionNet.loadFromUri('/models');
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');

      labeledFaceDescriptors = await loadLabeledImages(); // Load labeled images
      setLoading(true);
      console.log("Face API models loaded");
    };

    const loadLabeledImages = async () => {
      try {
        const response = await fetch('http://localhost:8080/images');
        const data = await response.json();

        const descriptors = [];
        for (const record of data) {
          const img = await faceapi.fetchImage(record.image_path);
          const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
          if (detections) {
            descriptors.push(new faceapi.LabeledFaceDescriptors(record.user_name, [detections.descriptor]));
          } else {
            console.log(`Không thể phát hiện khuôn mặt trong ảnh: ${record.image_path}`);
          }
        }
        return descriptors;
      } catch (error) {
        console.error('Lỗi khi tải ảnh và phát hiện khuôn mặt:', error);
        return [];
      }
    };

    const getCameraStream = () => {
      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then((stream) => {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              startFaceDetection(); // Start face detection after video is loaded
            };
          })
          .catch((error) => {
            console.error('Error accessing the camera: ', error);
          });
      }
    };

    const startFaceDetection = async () => {
      const canvas = canvasRef.current; // Use canvasRef here
      faceapi.matchDimensions(canvas, {
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight
      });

      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, {
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight
        });
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        resizedDetections.forEach(detect => {
          const bestMatch = findBestMatch(detect.descriptor);
          faceapi.draw.drawFaceLandmarks(canvas, detect);
          if (bestMatch) {
            const text = bestMatch.toString();
            setNameUser(text);
            console.log("Đã đăng nhập: " + text);
          } else {
            setNameUser('');
          }
        });
      }, 200);
    };

    const findBestMatch = (descriptor) => {
      if (labeledFaceDescriptors.length === 0) return null;
      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);
      const bestMatch = faceMatcher.findBestMatch(descriptor);
      return bestMatch._label === 'unknown' ? null : bestMatch; // Return null if no best match
    };


    loadFaceAPI().then(getCameraStream);
  }, []);

  return (
    <div className="login-face-recognition">
      <div className="login-face-recognition-container">

        <h3>Nhận Diện Khuôn Mặt để Đăng Nhập</h3>
        {!loading && (
          <div className="loading text-danger">Đang tải mô hình nhận diện...</div>
        )}
        <div className="video-container">
          <div className="line"></div>
          <video ref={videoRef} autoPlay muted></video>
          <canvas ref={canvasRef} className="overlay"></canvas>
        </div>
        {nameUser === '' ? (
          <h6 className="text-danger">Đang kiểm tra dữ liệu khuôn mặt {'.'.repeat(dots)}</h6>
        ) : (
          <h4>{nameUser}</h4>
        )}
      </div>
    </div>
  );

};

export default LoginFaceRecognition;