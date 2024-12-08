import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import "./login_face_recognition.scss";
import BackButton from "../../../component/BackButton/back_button";
import { getData, postData } from "../../../ultils/fetchAPI/fetch_API";
import {
  API_ALL_FACE_RECOGNITION_BY_USER_ID_ENCODE,
  API_LOGIN_FACE_RECOGNITION,
} from "../../../API/api_server";
;

const LoginFaceRecognition = ({ titlePage }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState(0);
  const [nameUser, setNameUser] = useState("");
  let labeledFaceDescriptors = [];
  const [email, setEmail] = useState(""); // Trạng thái email
  const [accountType, setAccountType] = useState("register"); // Trạng thái loại tài khoản
  const [isDetect, setIsDetect] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);

  // Hàm gửi email và loại tài khoản để kiểm tra
  const handleSubmitCheckEmail = async (e) => {
    e.preventDefault(); // Ngừng hành vi mặc định của form
    try {
      const response = await postData(
        API_ALL_FACE_RECOGNITION_BY_USER_ID_ENCODE,
        {
          user_email: email,
          type_account: accountType,
        }
      );
      console.log(response?.status);
      
      if (response?.status === true || response?.status === 200) {
        setIsDetect(true);
        setImages(response?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Xử lý sự kiện thay đổi email
  const handleEmailChange = (e) => {
    setEmail(e.target.value); // Cập nhật giá trị email
  };

  // Xử lý sự kiện thay đổi loại tài khoản
  const handleAccountTypeChange = (e) => {
    setAccountType(e.target.value); // Cập nhật loại tài khoản
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots + 1) % 4);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isDetect && images?.length <= 0) return;
    const loadFaceAPI = async () => {
      if (!faceapi.nets.faceRecognitionNet.isLoaded) {
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      }
      if (!faceapi.nets.faceLandmark68Net.isLoaded) {
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      }
      if (!faceapi.nets.ssdMobilenetv1.isLoaded) {
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      }

      labeledFaceDescriptors = await loadLabeledImages();
      setLoading(true);
    };

    const loadLabeledImages = async () => {
      try {
        const data = images;
        const descriptors = await Promise.all(
          data.map(async (record) => {
            try {
              const img = await faceapi.fetchImage(record.media_link);
              const detection = await faceapi
                .detectSingleFace(img)
                .withFaceLandmarks()
                .withFaceDescriptor();

              if (detection) {
                return new faceapi.LabeledFaceDescriptors(
                  record.user_id_encode,
                  [detection.descriptor]
                );
              } else {
                console.warn(
                  `Không thể phát hiện khuôn mặt trong ảnh: ${record.media_link}`
                );
                return null;
              }
            } catch (err) {
              console.error(`Lỗi khi xử lý ảnh ${record.media_link}:`, err);
              return null;
            }
          })
        );

        return descriptors.filter((desc) => desc !== null);
      } catch (error) {
        console.error("Lỗi khi tải ảnh và phát hiện khuôn mặt:", error);
        return [];
      }
    };

    const getCameraStream = () => {
      navigator.mediaDevices
        .getUserMedia({ video: { width: 640, height: 480 } })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            startFaceDetection();
          };
        })
        .catch((error) => {
          console.error("Lỗi truy cập camera: ", error);
        });
    };

    const findBestMatch = (descriptor) => {
      if (labeledFaceDescriptors.length === 0) return null;

      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
      const bestMatch = faceMatcher.findBestMatch(descriptor);

      if (bestMatch.label === "unknown" || bestMatch.distance > 0.6) {
        return null;
      }
      return bestMatch;
    };

    const startFaceDetection = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      faceapi.matchDimensions(canvas, {
        width: video.videoWidth,
        height: video.videoHeight,
      });

      const detectionInterval = setInterval(async () => {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.SsdMobilenetv1Options())
          .withFaceLandmarks()
          .withFaceDescriptors();

        const resizedDetections = faceapi.resizeResults(detections, {
          width: video.videoWidth,
          height: video.videoHeight,
        });

        const context = canvas.getContext("2d", { willReadFrequently: true });
        context.clearRect(0, 0, canvas.width, canvas.height);

        let detected = false;
        let bestDistance = null;

        resizedDetections.forEach((detect) => {
          const bestMatch = findBestMatch(detect.descriptor);

          if (bestMatch) {
            const user_id_encode = bestMatch.label;

            if (user_id_encode !== nameUser) {
              setNameUser(user_id_encode);
              loginWithFaceRecognition(user_id_encode);
            }

            detected = true;
          }

          faceapi.draw.drawFaceLandmarks(canvas, detect);
        });

        if (!detected) {
          setNameUser("Không nhận diện được khuôn mặt phù hợp");
        }
      }, 200);

      return () => clearInterval(detectionInterval);
    };

    const loginWithFaceRecognition = async (user_id_encode) => {
      try {
        const response = await postData(API_LOGIN_FACE_RECOGNITION, {
          user_id_encode,
        });
        if (response?.status) {
          console.log("Đăng nhập thành công:", response.data);
          window.location.href = "/";
        } else {
          console.error("Đăng nhập thất bại:", response.message);
        }
      } catch (error) {
        console.error("Lỗi khi gửi yêu cầu đăng nhập:", error);
      }
    };

    loadFaceAPI().then(getCameraStream);

    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      }
    };
  }, [isDetect, images]);

  return (
    <div className="login-face-recognition">
      {isDetect ? (
        <div className="login-face-recognition-container">
          <BackButton />
          <h3>Nhận Diện Khuôn Mặt để Đăng Nhập</h3>
          {!loading ? (
            <div className="loading text-danger">
              Đang tải mô hình nhận diện...
            </div>
          ) : (
            <>
              <div className="video-container">
                <div className="line"></div>
                <video ref={videoRef} autoPlay muted></video>
                <canvas ref={canvasRef} className="overlay"></canvas>
              </div>
              {nameUser === "Không nhận diện được khuôn mặt phù hợp" ? (
                <h6 className="text-warning text-center text-danger">{nameUser}</h6>
              ) : nameUser ? (
                <h4 className="text-warning text-center text-danger">{nameUser}</h4>
              ) : (
                <h6 className="text-danger text-center">
                  Đang kiểm tra dữ liệu khuôn mặt {".".repeat(dots)}
                </h6>
              )}
            </>
          )}
        </div>
      ) : (
        <div id="modal" class="modal">
          <div class="modal-content">
            <div class="header-modal">
              <h2>Nhập email để xác thực</h2>
            </div>
            <div class="content-modal">
              <div class="input-group">
                <span class="icon">📧</span>
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={email} 
                  onChange={handleEmailChange} 
                  required 
                />
              </div>
              <div class="account-type-select">
                <label for="accountType">Loại tài khoản</label>
                <select 
                  id="accountType" 
                  value={accountType} 
                  onChange={handleAccountTypeChange}
                >
                  <option value="register">Đăng ký bằng Email</option>
                  <option value="google">Google</option>
                  <option value="facebook">Facebook</option>
                </select>
              </div>
            </div>
            <div class="footer-modal">
              <a href="/login">
                <button class="cancel-btn">Huỷ</button>
              </a>
              <button class="submit-btn" onClick={handleSubmitCheckEmail}>
                Xong
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginFaceRecognition;
