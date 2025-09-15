import * as THREE from 'three';
import { useState } from 'react';

const Pinwheel = () => {
  const [trapezoidParams] = useState({
    baseMenor: 0.5,      // base menor
    baseMaior: 0.15,     // base maior
    altura: 1.0,         // comprimento 
    largura: 1.8,        // largura
  });

  //shader pás
  const blade = {
    uniforms: {
        color1: { value: new THREE.Color(0xf8c8d4) }, // rosa claro
        color2: { value: new THREE.Color(0xf06292) }, // rosa médio
        color3: { value: new THREE.Color(0xe91e63) }, // rosa escuro
        baseMenor: { value: trapezoidParams.baseMenor },
        baseMaior: { value: trapezoidParams.baseMaior },
    },

    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,

    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      uniform vec3 color3;
      uniform float baseMenor;
      uniform float baseMaior;
      varying vec2 vUv;

      void main() {

        // lado esquerdo 90º 
        float ladoEsquerdo = 0.5 - baseMenor / 2.0; 
        
        // lado direito
        float larguraDireita = mix(baseMenor / 2.0, baseMaior / 2.0, vUv.y);
        float ladoDireito = 0.5 + larguraDireita; 
        
        // verificação trapézio retângulo
        if (vUv.x < ladoEsquerdo || vUv.x > ladoDireito || vUv.y < 0.0 || vUv.y > 1.0) {
            discard;
        }
        
        float gradiente = vUv.y;
        vec3 finalColor = mix(color1, color3, gradiente);
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
  };

  //shader centro
  const center = {
    uniforms: {
        color1: { value: new THREE.Color(0xffc5d9) }, // rosa claro
        color2: { value: new THREE.Color(0xe4185e) }, // rosa escuro
    },

    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,

    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      varying vec2 vUv;
      
      void main() {

        // distância do centro
        vec2 center = vec2(0.5, 0.5);
        float distanceFromCenter = distance(vUv, center);
        
        // normaliza a distância 
        float normalizedDistance = distanceFromCenter * 2.0;
        normalizedDistance = clamp(normalizedDistance, 0.0, 1.0);

        vec3 finalColor = mix(color1, color2, normalizedDistance);
      
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
  };

  //shader haste
  const steam = {
    uniforms: {
        color1: { value: new THREE.Color(0xd8a778) }, // bege
    },
    
    vertexShader: `
      varying vec2 vUv;

      void main() {

        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,

    fragmentShader: `
      uniform vec3 color1;
      varying vec2 vUv;

      void main() {

        gl_FragColor = vec4(color1, 1.0);
      }
    `
  };

  return (
    <group>
      {/* centro do cata-vento */}
      <mesh position={[0, 0, 0.2]}>
        <circleGeometry args={[0.15, 32]} />
        <shaderMaterial args={[center]} />
      </mesh>
      
      {/* pás */}
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        const offset = 0.68;
        const x = Math.cos(angle) * offset;
        const y = Math.sin(angle) * offset;
        
        return (
          <mesh
            key={`blade-${i}`}
            position={[x, y, 0.1]}
            rotation={[0, 0, angle + Math.PI/3]}
          >
            <planeGeometry args={[trapezoidParams.largura, trapezoidParams.altura]} />
            <shaderMaterial 
              args={[blade]} 
              side={THREE.DoubleSide} 
              transparent={true}
              alphaTest={0.1}
            />
          </mesh>
        );
      })}
      
      {/* mastro fino */}
      <mesh position={[0, -1.5, -0.5]}>
        <cylinderGeometry args={[0.08, 0.1, 3, 12]} />
        <shaderMaterial args={[steam]} />
      </mesh>
    </group>
  );
};

export default Pinwheel;