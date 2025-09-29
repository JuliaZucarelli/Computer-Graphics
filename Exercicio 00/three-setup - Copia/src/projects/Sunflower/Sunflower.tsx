import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Sunflower = () => {
  const petalGroupRef = useRef<THREE.Group>(null);
  const centerRef = useRef<THREE.Mesh>(null);
  const stemRef = useRef<THREE.Mesh>(null);
  const fallingPetalsRef = useRef<THREE.Group>(null);
  const vaseRef = useRef<THREE.Mesh>(null);

  
  
  // Criar pétalas caindo com posições e velocidades aleatórias
  const fallingPetalsData = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      startY: 3 + Math.random() * 2,
      startX: (Math.random() - 0.5) * 4,
      speed: 0.3 + Math.random() * 0.4,
      rotationSpeed: (Math.random() - 0.5) * 2,
      swayAmount: 0.5 + Math.random() * 0.5,
      swaySpeed: 1 + Math.random() * 2,
      delay: Math.random() * 10,
      scale: 0.3 + Math.random() * 0.2
    }));
  }, []);
  
  // Animação
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Rotação suave das pétalas principais
    if (petalGroupRef.current) {
      petalGroupRef.current.rotation.z = Math.sin(t * 0.3) * 0.1;
    }
    
    // Pulsação do miolo
    if (centerRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.05;
      centerRef.current.scale.set(scale, scale, 1);
    }
    
    // Movimento suave do caule (balanço)
    if (stemRef.current) {
      stemRef.current.rotation.z = Math.sin(t * 0.5) * 0.05;
    }
    
    // Animar pétalas caindo
    if (fallingPetalsRef.current) {
      fallingPetalsRef.current.children.forEach((child, i) => {
        const data = fallingPetalsData[i];
        const time = t - data.delay;
        
        if (time > 0) {
          // Movimento para baixo
          const y = data.startY - (time * data.speed) % 8;
          
          // Movimento de balanço lateral
          const x = data.startX + Math.sin(time * data.swaySpeed) * data.swayAmount;
          
          // Rotação durante a queda
          const rotation = time * data.rotationSpeed;
          
          child.position.set(x, y, -1);
          child.rotation.set(
            rotation * 0.5,
            rotation * 0.3,
            rotation
          );
        } else {
          // Esconder até o delay passar
          child.position.set(0, 10, 0);
        }
      });
    }
  });

// Shader pétalas - atualizado com mesma iluminação do vaso
const petal = {
  uniforms: {
    color1: { value: new THREE.Color(0xaf6722) },
    color2: { value: new THREE.Color(0xcc8a24) },
    color3: { value: new THREE.Color(0xdea92f) },
    center: { value: new THREE.Vector2(0.5, 0.5) },
    time: { value: 0 }
  },

  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float time;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      
      // Movimento sutil nas pétalas
      vec3 pos = position;
      pos.z += sin(time * 2.0 + position.y * 3.0) * 0.05;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,

  fragmentShader: `
    uniform vec3 color1;
    uniform vec3 color2;
    uniform vec3 color3;
    uniform vec2 center;
    uniform float time;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vec2 pos = vUv - center;
      float ellipse = (pos.x * pos.x) / 0.16 + (pos.y * pos.y) / 0.25;
      
      if (ellipse > 1.0) {
        discard;
      }
      
      float dist = distance(vUv, center);
      
      // Brilho animado
      float glow = sin(time * 1.5 + dist * 5.0) * 0.1 + 1.3;
      
      vec3 finalColor;
      if (dist < 0.4) {
        finalColor = mix(color1, color2, dist * 2.5);
      } else {
        finalColor = mix(color2, color3, (dist - 0.4) * 1.67);
      }
      
      finalColor *= glow;
      
      // Iluminação básica (fresnel) 
      vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 1.0);
      finalColor += vec3(fresnel * 0.2);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

  // Shader miolo
  const center = {
    uniforms: {
      color1: { value: new THREE.Color(0x553d2a) },
      color2: { value: new THREE.Color(0x5f4633) },
      color3: { value: new THREE.Color(0x69503c) },
      time: { value: 0 }
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
      uniform float time;
      varying vec2 vUv;
      
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      void main() {
        vec2 pos = vUv * 50.0; 
        vec2 grid = floor(pos);
        
        // Movimento animado
        float offset = sin(time + grid.x * 0.5 + grid.y * 0.3) * 0.5 + 0.5;
        float noise = random(grid) + offset * 0.1;
        
        if (noise < 0.33) {
          gl_FragColor = vec4(color1, 1.0);
        } else if (noise < 0.88) {
          gl_FragColor = vec4(color2, 1.0);
        } else {
          
          gl_FragColor = vec4(color3, 1.0);
        }
      }
    `
  };

  // Shader caule 
  const stemShader = {
    uniforms: {
      color1: { value: new THREE.Color(0x767024) },
      color2: { value: new THREE.Color(0x9d9a2a) },
      color3: { value: new THREE.Color(0xbdb634) },
      time: { value: 0 }
    },
    
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,

    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      uniform vec3 color3;
      uniform float time;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        float gradient = vUv.y;
        vec3 finalColor;
        
        if (gradient < 0.5) {
          finalColor = mix(color1, color2, gradient * 2.0);
        } else {
          finalColor = mix(color2, color3, (gradient - 0.5) * 2.0);
        }
        
        // Iluminação básica (fresnel) - mesma do vaso
        vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
        float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 2.0);
        finalColor += vec3(fresnel * 0.15);
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
  };

  // Shader vaso de cerâmica
  const vaseShader = {
    uniforms: {
      color1: { value: new THREE.Color(0x8B4513) }, // Terracota escuro
      color2: { value: new THREE.Color(0xA0522D) }, // Terracota médio
      color3: { value: new THREE.Color(0xCD853F) }, // Terracota claro
      time: { value: 0 }
    },
    
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vUv = uv;

        vNormal = normalize(normalMatrix * normal);
        vPosition = position;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,

    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      uniform vec3 color3;
      uniform float time;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      void main() {
        // Gradiente vertical
        float gradient = vUv.y;
        
        // Textura de cerâmica (ruído)
        vec2 noisePos = vUv * 15.0;
        float noise = random(floor(noisePos)) * 0.15;
        
        // Faixas decorativas
        float stripe = smoothstep(0.48, 0.5, vUv.y) - smoothstep(0.5, 0.52, vUv.y);
        stripe += smoothstep(0.78, 0.8, vUv.y) - smoothstep(0.8, 0.82, vUv.y);
        
        vec3 baseColor;
        if (gradient < 0.5) {
          baseColor = mix(color1, color2, gradient * 2.0);
        } else {
          baseColor = mix(color2, color3, (gradient - 0.5) * 2.0);
        }
        
        // Adicionar textura e faixas
        baseColor = baseColor * (1.0 - noise * 0.3);
        baseColor = mix(baseColor, color1 * 0.6, stripe * 0.8);
        
        // Iluminação básica (fresnel)
        vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
        float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 2.0);
        baseColor += vec3(fresnel * 0.2);
        
        gl_FragColor = vec4(baseColor, 1.0);
      }
    `
  };


  // Atualiza o uniform de tempo
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Atualiza uniforms dos shaders
    petalGroupRef.current?.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.ShaderMaterial) {
        child.material.uniforms.time.value = t;
      }
    });
    
    if (centerRef.current && centerRef.current.material instanceof THREE.ShaderMaterial) {
      centerRef.current.material.uniforms.time.value = t;
    }

    if (vaseRef.current && vaseRef.current.material instanceof THREE.ShaderMaterial) {
      vaseRef.current.material.uniforms.time.value = t;
    }

  });

  return (
    <group>

      {/* Vaso de cerâmica */}
      <mesh ref={vaseRef} position={[0, -4.2, -0.5]}>
        <cylinderGeometry args={[0.6, 0.5, 1.2, 32]} />
        <shaderMaterial args={[vaseShader]} />
      </mesh>
      
      {/* Borda do vaso */}
      <mesh position={[0, -3.6, -0.5]}>
        <torusGeometry args={[0.6, 0.08, 16, 32]} />
        <shaderMaterial 
          uniforms={{
            color1: { value: new THREE.Color(0x654321) },
            color2: { value: new THREE.Color(0x8B4513) },
            color3: { value: new THREE.Color(0xA0522D) },
            time: { value: 0 }
          }}
          vertexShader={vaseShader.vertexShader}
          fragmentShader={vaseShader.fragmentShader}
        />
      </mesh>

      {/* Centro do girassol */}
      <mesh ref={centerRef} position={[0, 0, 0.05]}>
        <circleGeometry args={[0.95, 32]} />
        <shaderMaterial args={[center]} />
      </mesh>
      
      {/* Grupo de pétalas principais */}
      <group ref={petalGroupRef}>
        {Array.from({ length: 20 }).map((_, i) => {
          const angle = (i / 20) * Math.PI * 2;
          const x = Math.cos(angle) * 1.1;
          const y = Math.sin(angle) * 1.1;
          
          return (
            <mesh
              key={`petal-${i}`}
              position={[x, y, 0]}
              rotation={[0, 0, angle + Math.PI / 2]}
            >
              <planeGeometry args={[0.8, 1.6]} />
              <shaderMaterial args={[petal]} side={THREE.DoubleSide} />
            </mesh>
          );
        })}
      </group>
      
      {/* Caule */}
      <mesh ref={stemRef} position={[0, -2.5, -0.5]}>
        <cylinderGeometry args={[0.15, 0.2, 3, 12]} />
        <shaderMaterial args={[stemShader]} />
      </mesh>
      
      {/* Pétalas caindo */}
      <group ref={fallingPetalsRef}>
        {fallingPetalsData.map((data) => (
          <mesh key={`falling-${data.id}`}>
            <planeGeometry args={[0.8 * data.scale, 1.6 * data.scale]} />
            <shaderMaterial args={[petal]} side={THREE.DoubleSide} transparent opacity={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

export default Sunflower;