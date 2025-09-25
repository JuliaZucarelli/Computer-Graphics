import * as THREE from "three";

const Robot = () => {

  const basicShader = {
  uniforms: {
    color1: { value: new THREE.Color("#ebf1e3") }, // cinza claro
    color2: { value: new THREE.Color("#c7c9d6") } // cinza escuro
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform vec3 color1;
    uniform vec3 color2;

    void main() {
      vec3 color = mix(color1, color2, vUv.y);

      gl_FragColor = vec4(color, 1.0);
    }
  `
  };

  const eye = {
    uniforms: {
      glowColor: { value: new THREE.Color("#00CFFF") }
    },
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      uniform vec3 glowColor;

      void main() {
        // teste com efeito glow
        float intensity = pow(0.9 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        vec3 color = glowColor * intensity * 2.0;
        gl_FragColor = vec4(color, 1.0);
      }
    `
  };

  const metal = {
    uniforms: {
      color1: { value: new THREE.Color("#1c3b72") },
      color2: { value: new THREE.Color("#1f2b51") }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() {
        vUv = uv;
        vPosition = position;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform vec3 color1;
      uniform vec3 color2;

      void main() {
        // noise
        float noise = fract(sin(dot(vPosition.xy, vec2(12.9898, 78.233))) * 43758.5453) * 0.1;
        vec3 color = mix(color1, color2, vUv.y) + noise;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `
  };

  return (
      <group>
        {/* corpo */}
        <mesh position={[0, -0.8, 0]} scale={[1, 0.47, 2]}>
          <capsuleGeometry args={[0.7, 1.5, 16, 32]} />
          <shaderMaterial
            uniforms={basicShader.uniforms}
            vertexShader={basicShader.vertexShader}
            fragmentShader={basicShader.fragmentShader}
          />
        </mesh>

        {/* cabeça */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.6, 1.0, 1.0]} />
          <shaderMaterial
            uniforms={basicShader.uniforms}
            vertexShader={basicShader.vertexShader}
            fragmentShader={basicShader.fragmentShader}
          />
        </mesh>

        {/* tela da cabeça */}
        <mesh position={[0, 0.5, 0.51]}>
          <planeGeometry args={[1.4, 0.8]} />
          <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* olho esquerdo - primeira barra do X */}
        <mesh position={[-0.4, 0.5, 0.52]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.2, 0.05, 0.05]} />
          <meshBasicMaterial color="#00CFFF" />
        </mesh>
        
        {/* olho esquerdo - segunda barra do X */}
        <mesh position={[-0.4, 0.5, 0.52]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.2, 0.05, 0.05]} />
          <meshBasicMaterial color="#00CFFF" />
        </mesh>

        {/* olho direito - primeira barra do X */}
        <mesh position={[0.4, 0.5, 0.52]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.2, 0.05, 0.05]} />
          <meshBasicMaterial color="#00CFFF" />
        </mesh>
        
        {/* olho direito - segunda barra do X */}
        <mesh position={[0.4, 0.5, 0.52]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.2, 0.05, 0.05]} />
          <meshBasicMaterial color="#00CFFF" />
        </mesh>

        {/* braços - parte superior */}
        <mesh position={[-1.0, -0.5, 0]}>
          <capsuleGeometry args={[0.2, 0.4, 16, 32]} />
          <shaderMaterial
            uniforms={basicShader.uniforms}
            vertexShader={basicShader.vertexShader}
            fragmentShader={basicShader.fragmentShader}
          />
        </mesh>

        <mesh position={[1.0, -0.5, 0]}>
          <capsuleGeometry args={[0.2, 0.4, 16, 32]} />
          <shaderMaterial
            uniforms={basicShader.uniforms}
            vertexShader={basicShader.vertexShader}
            fragmentShader={basicShader.fragmentShader}
          />
        </mesh>

        {/* ombros */}
        <mesh position={[-1.0, -0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
          <sphereGeometry args={[0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI]} />
          <shaderMaterial
            uniforms={metal.uniforms}
            vertexShader={metal.vertexShader}
            fragmentShader={metal.fragmentShader}
          />
        </mesh>

        <mesh position={[1.0, -0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
          <sphereGeometry args={[0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI]} />
          <shaderMaterial
            uniforms={metal.uniforms}
            vertexShader={metal.vertexShader}
            fragmentShader={metal.fragmentShader}
          />
        </mesh>

        {/* braços - parte inferior */}
        <mesh position={[-1.0, -1.1, 0]}>
          <capsuleGeometry args={[0.18, 0.5, 16, 32]} />
          <shaderMaterial
            uniforms={basicShader.uniforms}
            vertexShader={basicShader.vertexShader}
            fragmentShader={basicShader.fragmentShader}
          />
        </mesh>

        <mesh position={[1.0, -1.1, 0]}>
          <capsuleGeometry args={[0.18, 0.5, 16, 32]} />
          <shaderMaterial
            uniforms={basicShader.uniforms}
            vertexShader={basicShader.vertexShader}
            fragmentShader={basicShader.fragmentShader}
          />
        </mesh>

        {/* mãos */}
        <mesh position={[-1.0, -1.4, 0]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <shaderMaterial
            uniforms={basicShader.uniforms}
            vertexShader={basicShader.vertexShader}
            fragmentShader={basicShader.fragmentShader}
          />
        </mesh>

        <mesh position={[1.0, -1.5, 0]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <shaderMaterial
            uniforms={basicShader.uniforms}
            vertexShader={basicShader.vertexShader}
            fragmentShader={basicShader.fragmentShader}
          />
        </mesh>

        {/* orelhas */}
        <mesh position={[-0.95, 0.5, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <shaderMaterial
            uniforms={basicShader.uniforms}
            vertexShader={basicShader.vertexShader}
            fragmentShader={basicShader.fragmentShader}
          />
        </mesh>

        <mesh position={[0.95, 0.5, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <shaderMaterial
            uniforms={basicShader.uniforms}
            vertexShader={basicShader.vertexShader}
            fragmentShader={basicShader.fragmentShader}
          />
        </mesh>

        {/* antena */}
        <mesh position={[0, 1.1, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <shaderMaterial
            uniforms={metal.uniforms}
            vertexShader={metal.vertexShader}
            fragmentShader={metal.fragmentShader}
          />
        </mesh>
      </group>
    );
}

export default Robot;
