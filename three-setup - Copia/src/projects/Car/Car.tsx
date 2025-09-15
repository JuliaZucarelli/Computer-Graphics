import * as THREE from 'three';
import { useState } from 'react';

const Car: React.FC = () => {
  const [trapezoidParams] = useState({
      baseMenor: 0.5,      // base menor
      baseMaior: 0.15,     // base maior
      altura: 1.0,         // comprimento 
      largura: 1.8,        // largura
    });

    const porta = {
      uniforms: {
        color1: { 
          value: new THREE.Color(0xf8c8d4) }, // rosa claro
          color2: { value: new THREE.Color(0xf06292) }, // rosa médio
          color3: { value: new THREE.Color(0xe91e63) }, // rosa escuro
          baseMenor: { value: trapezoidParams.baseMenor },
          baseMaior: { value: trapezoidParams.baseMaior },
      },

      
    }

  return (
    <group>
      {/* Parte inferior do carro (chassi) */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[2.2, 0.5, 1]} />
        <meshStandardMaterial color="#FF0000" metalness={0.3} roughness={0.4} />
      </mesh>

      {/* porta do carro (trapézio) */}
      <mesh position={[0.1, 0.55, 0]}>
        <boxGeometry args={[2, 0.9, 0.95]} />
        <meshStandardMaterial color="#FF0000" metalness={0.3} roughness={0.4} />
      </mesh>


      {/* Janela (trapézio) */}
      <mesh position={[0.1, 0.65, 0.1]}>
        <boxGeometry args={[1.5, 0.45, 0.8]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          transparent 
          opacity={0.3}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>


      {/* Rodas (esferas achatadas) */}
      <mesh position={[-0.7, 0.1, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 32]} />
        <meshStandardMaterial color="#000000" roughness={0.8} />
      </mesh>
      <mesh position={[0.7, 0.1, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 32]} />
        <meshStandardMaterial color="#000000" roughness={0.8} />
      </mesh>
      <mesh position={[-0.7, 0.1, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 32]} />
        <meshStandardMaterial color="#000000" roughness={0.8} />
      </mesh>
      <mesh position={[0.7, 0.1, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 32]} />
        <meshStandardMaterial color="#000000" roughness={0.8} />
      </mesh>

    </group>
  );
};

export default Car;