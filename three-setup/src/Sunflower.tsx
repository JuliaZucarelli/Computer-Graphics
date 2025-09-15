import * as THREE from 'three';

const Sunflower = () => {
  //shader pétalas
  const petal = {
    uniforms: {
        //define cores e ponto central
        color1: { value: new THREE.Color(0xaf6722) }, // Cor mais escura
        color2: { value: new THREE.Color(0xcc8a24) }, // Cor média
        color3: { value: new THREE.Color(0xdea92f) }, // Cor mais clara
        center: { value: new THREE.Vector2(0.5, 0.5) }
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
      uniform vec2 center;
      varying vec2 vUv;

      void main() {
      
        //formato oval
        vec2 pos = vUv - center;
        float ellipse = (pos.x * pos.x) / 0.16 + (pos.y * pos.y) / 0.25;
        
        //remove pixel fora do formato oval
        if (ellipse > 1.0) {
          discard;
        }
        
        float dist = distance(vUv, center);
        
        //gradiente - do centro para a borda
        vec3 finalColor;
        if (dist < 0.4) {
          finalColor = mix(color1, color2, dist * 2.5);
        } else {
          finalColor = mix(color2, color3, (dist - 0.4) * 1.67);
        }
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
  };

  //shader miolo
  const centerShader = {
    uniforms: {
        //define cores
        color1: { value: new THREE.Color(0x553d2a) }, // Cor mais escura
        color2: { value: new THREE.Color(0x5f4633) }, // Cor média
        color3: { value: new THREE.Color(0x69503c) }  // Cor mais clara
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
      varying vec2 vUv;
      
      //função aleatoriedade 
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      void main() {
        
        vec2 pos = vUv * 20.0; 
        vec2 grid = floor(pos);
        
        //função noise
        float noise = random(grid);
        
        if (noise < 0.33) {
          gl_FragColor = vec4(color1, 1.0);
        } else if (noise < 0.66) {
          gl_FragColor = vec4(color2, 1.0);
        } else {
          gl_FragColor = vec4(color3, 1.0);
        }
      }
    `
  };

  //shader caule
  const stemShader = {
    uniforms: {
         //define cores e ponto central
        color1: { value: new THREE.Color(0x767024) }, // Cor mais escura
        color2: { value: new THREE.Color(0x9d9a2a) }, // Cor média  
        color3: { value: new THREE.Color(0xbdb634) }  // Cor mais clara
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
      varying vec2 vUv;

      void main() {

        //gradiente vertical
        float gradient = vUv.y;
        vec3 finalColor;
        
        if (gradient < 0.5) {
          finalColor = mix(color1, color2, gradient * 2.0);
        } else {
          finalColor = mix(color2, color3, (gradient - 0.5) * 2.0);
        }
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
  };

  return (
    <group>
      {/* centro do girassol */}
      <mesh position={[0, 0, 0.2]}>
        <circleGeometry args={[1.0, 32]} />
        <shaderMaterial args={[centerShader]} />
      </mesh>
      
      {/* pétalas ovais */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const x = Math.cos(angle) * 1.4;
        const y = Math.sin(angle) * 1.4;
        
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
      
      {/* caule */}
      <mesh position={[0, -2.5, -0.5]}>
        <cylinderGeometry args={[0.15, 0.2, 3, 12]} />
        <shaderMaterial args={[stemShader]} />
      </mesh>
    </group>
  );
};

export default Sunflower;