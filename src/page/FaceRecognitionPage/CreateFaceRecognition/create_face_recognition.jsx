import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import "./create_face_recognition.scss";

const CreateFaceRecognitionPage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUpLoading] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots + 1) % 4); // Tăng số lượng dấu chấm lên 1 và lấy phần dư cho 4
    }, 300);

    return () => clearInterval(interval); // Clear interval khi component bị unmount
  }, []);

  useEffect(() => {
    const setupFaceDetection = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        setLoading(true);
      } catch (err) {
        console.error("Error loading Face API models:", err);
      }
    };

    const startVideo = async () => {
      if (videoRef.current.srcObject) return; // Tránh bật lại video

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          detectFace();
        };
      } catch (err) {
        console.error("Error starting video:", err);
      }
    };

    const detectFace = async () => {
      const displaySize = { width: 640, height: 480 };
      faceapi.matchDimensions(canvasRef.current, displaySize);

      const captureInterval = setInterval(async () => {
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks().withFaceDescriptors();

        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);

        if (resizedDetections.length > 0 && capturedImages.length < 10) {
          await captureImage(videoRef.current);
        }
      }, 500); // Chụp mỗi 2 giây

      return () => clearInterval(captureInterval);
    };

    const captureImage = async (video) => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg');

      setCapturedImages(prevImages => {
        if (prevImages.length < 10) {
          return [...prevImages, imageData];
        } else {
          document.querySelector('.video-container')?.remove();
          setUpLoading(true);
        }
        return prevImages;
      });


    };

    const init = async () => {
      await setupFaceDetection();
      await startVideo();
    };

    init();

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject?.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // Chỉ chạy một lần

  return (
    <React.Fragment>
      <div className="face-recognition--container">

        <div className="face-recognition">
          <h3>Tạo nhận diện khuôn mặt</h3>
          {!loading && <div className="loading text-danger">Đang tải mô hình nhận diện...</div>}
          <div className="video-container">
            <div className="line"></div>
            <video ref={videoRef} autoPlay muted />
            <canvas ref={canvasRef} className="overlay" />
          </div>
          {!uploading && (<h6 className='text-danger'>Đang thu thập dữ liệu khuôn mặt {'.'.repeat(dots)} </h6>) }
            
         
          {capturedImages.length > 0 && (
            <ul className="captured-images">
              {capturedImages.map((img, index) => (
                <li key={index}>
                  <img src={img} alt={`Captured ${index}`} />
                </li>
              ))}
            </ul>
          )}
          {uploading && (<h5>Đang gửi dữ liệu {'.'.repeat(dots)} </h5>) }


        </div>
      </div>
    </React.Fragment>
  );
};

export default CreateFaceRecognitionPage;
