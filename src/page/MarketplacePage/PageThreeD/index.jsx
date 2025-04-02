import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ModelThreeD } from "./PageThreeD";
import { Leva, useControls } from "leva";
import { Suspense, useContext, useEffect, useState } from "react";
import { getData } from "../../../ultils/fetchAPI/fetch_API";
import { API_GET_LINK_THREE_DIMENSION } from "../../../API/api_server";
import { useParams } from "react-router-dom";
import { OwnDataContext } from "../../../provider/own_data";

function Scene() {
  const [link, setLink] = useState("");
  const { id } = useParams();
  const dataOwner = useContext(OwnDataContext);

  useEffect(() => {
    if (dataOwner && id) {
      const fetchData = async () => {
        try {
          const res = await getData(API_GET_LINK_THREE_DIMENSION(id));
          if (res?.status === true || res.statusCode === 200) {
            setLink(res?.data?.glb_file_link);
          }
        } catch (error) {
          console.error("Fetch 3D Model Link Error:", error);
        }
      };
      fetchData();
    }
  }, [id, dataOwner]);

  const controls = useControls({
    ambientIntensity: { value: 3, min: 0, max: 10, step: 0.1 },
    lightIntensity: { value: 5, min: 0, max: 10, step: 0.1 },
    lightPosition: { value: [20, 20, 20], step: 1 },
    lightColor: { value: "#ffffff" },
    modelScale: { value: 0.05, min: 0.001, max: 0.1, step: 0.001 },
    modelPosition: { value: [0, 0, 0], step: 0.1 },
    modelRotation: { value: [0, 0, 0], step: 0.1 },
    cameraPosition: { value: [0, 5, 10], step: 0.5 },
    cameraFov: { value: 50, min: 10, max: 100, step: 1 },
    backgroundColor: { value: "#4b4b4b" },
    showGrid: { value: true, label: "Show Grid" }, // Thêm nút bật/tắt grid
  });

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Suspense fallback={<span style={{padding: '20px'}}>Loading 3D Model...</span>}>
        <Canvas
          camera={{ position: controls.cameraPosition, fov: controls.cameraFov }}
          gl={{ antialias: true }}
          shadows // Bật tính năng bóng
        >
          <color attach="background" args={[controls.backgroundColor]} />
          <ambientLight intensity={controls.ambientIntensity} />
          <directionalLight
            position={controls.lightPosition}
            intensity={controls.lightIntensity}
            color={controls.lightColor}
            shadow-mapSize-width={1024} // Độ phân giải bóng
            shadow-mapSize-height={1024}
          />
          
          {link && (
            <ModelThreeD
              scale={[controls.modelScale, controls.modelScale, controls.modelScale]}
              position={controls.modelPosition}
              rotation={controls.modelRotation}
              url={link}
              castShadow // Model tạo bóng
              receiveShadow // Model nhận bóng
            />
          )}

          {/* Thêm lưới với chiều cao bằng -50% model */}
          {controls.showGrid && (
            <mesh 
              position={[0, -controls.modelScale * 25, 0]} // Giảm 50% chiều cao
              receiveShadow // Nhận bóng từ model
            >
              <planeGeometry args={[100, 100, 10, 10]} />
              <shadowMaterial opacity={0.2} /> {/* Vật liệu bóng */}
              <gridHelper 
                args={[100, 100, '#ffffff', '#666666']} // Kích thước và màu sắc lưới
              />
            </mesh>
          )}

          <OrbitControls />
        </Canvas>
      </Suspense>
      <Leva />
    </div>
  );
}

export default Scene;