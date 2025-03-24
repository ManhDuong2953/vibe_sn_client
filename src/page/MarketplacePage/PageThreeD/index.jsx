import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ModelThreeD } from "./PageThreeD";
import { Leva, useControls } from "leva";
import { Suspense } from "react";

function Scense() {
  const url =
    "https://res.cloudinary.com/der2ygna3/image/upload/v1741794430/e4whaubmbjvhdtgnu21p.glb";
  const controls = useControls({
    // Ánh sáng
    ambientIntensity: { value: 3, min: 0, max: 10, step: 0.1 }, // Độ sáng môi trường
    lightIntensity: { value: 5, min: 0, max: 10, step: 0.1 }, // Độ sáng ánh sáng định hướng
    lightPosition: { value: [20, 20, 20], step: 1 }, // Vị trí ánh sáng
    lightColor: { value: "#ffffff" }, // Màu ánh sáng

    // Mô hình
    modelScale: { value: 0.05, min: 0.001, max: 0.1, step: 0.001 }, // Tỷ lệ
    modelPosition: { value: [0, 0, 0], step: 0.1 }, // Vị trí
    modelRotation: { value: [0, 0, 0], step: 0.1 }, // Xoay (radian)

    // Camera
    cameraPosition: { value: [0, 5, 10], step: 0.5 }, // Vị trí camera
    cameraFov: { value: 50, min: 10, max: 100, step: 1 }, // Góc nhìn

    // Nền
    backgroundColor: { value: "#313131" }, // Màu nền
  });

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Suspense fallback={<span>Loading 3D Model...</span>}>
        <Canvas
          camera={{
            position: controls.cameraPosition,
            fov: controls.cameraFov,
          }}
          gl={{ antialias: true }}
          style={{ background: controls.backgroundColor }}
        >
          <ambientLight intensity={controls.ambientIntensity} />
          <directionalLight
            position={controls.lightPosition}
            intensity={controls.lightIntensity}
            color={controls.lightColor}
          />
          <ModelThreeD
            scale={[
              controls.modelScale,
              controls.modelScale,
              controls.modelScale,
            ]}
            position={controls.modelPosition}
            rotation={controls.modelRotation}
            url={url}
          />
          <OrbitControls />
        </Canvas>
      </Suspense>
      <Leva />
    </div>
  );
}

export default Scense;
