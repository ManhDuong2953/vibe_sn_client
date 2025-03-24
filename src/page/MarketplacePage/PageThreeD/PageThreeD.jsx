import React from 'react';
import { useGLTF } from '@react-three/drei';

export function ModelThreeD(props) {
  // Gọi useGLTF ở cấp cao nhất, không trong try-catch hay điều kiện
  const { nodes, materials } = useGLTF(props.url);

  // Kiểm tra dữ liệu sau khi Hook được gọi
  if (!nodes || !materials) {
    console.error('GLTF data is invalid:', { nodes, materials });
    return <group {...props} dispose={null}><mesh /></group>; // Placeholder nếu dữ liệu không hợp lệ
  }

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_4?.geometry}
        material={materials.airframe}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_6?.geometry}
        material={materials.Glass}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_8?.geometry}
        material={materials.airframe}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_10?.geometry}
        material={materials.material}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_12?.geometry}
        material={materials.Glass}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_14?.geometry}
        material={materials.airframe}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_16?.geometry}
        material={materials.airframe}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_18?.geometry}
        material={materials.lights}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
}

useGLTF.preload('');