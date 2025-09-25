import * as THREE from 'three';

const Bresenham = () => {
  // variáveis para armazenar posição do mouse e raio
  let mousePos = { x: 0.5, y: 0.5 };
  let radius = 0.2;

  const circleShader = {
    uniforms: {
      uMousePos: { value: new THREE.Vector2(0.5, 0.5) },
      uRadius: { value: 0.2 },
      uResolution: { value: new THREE.Vector2(800, 600) },
      circleColor: { value: new THREE.Color(0xff0000) },
      bgColor: { value: new THREE.Color(0x222222) }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,

    fragmentShader: `
        uniform vec2 uMousePos;
        uniform float uRadius;
        uniform vec2 uResolution;
        uniform vec3 circleColor;
        uniform vec3 bgColor;
        varying vec2 vUv;

        void main() {

          // coordenadas normalizadas - normalização 
          vec2 pixelCoord = vUv * uResolution;
          vec2 center = uMousePos * uResolution;
          float radius = uRadius * min(uResolution.x, uResolution.y);
          
          // algoritmo de Bresenham -> algoritmo de rasterização que permite desenhar linhas retas em uma grade de pixels
          int x = 0;
          int y = int(radius);
          int d = int(3.0 - 2.0 * radius); // inicio
          
          bool isOnCircle = false;
          
          // loop para calcular pontos do círculo  -> em C não utilizar 'round' dentro do laço de repetição
          while (y >= x) {
            // verifica os pontos simétricos do círculo
            ivec2 currentPixel = ivec2(pixelCoord);
            
            if (currentPixel == ivec2(center + vec2(x, y))) isOnCircle = true; // oct 1
            if (currentPixel == ivec2(center + vec2(y, x))) isOnCircle = true; // oct 2
            if (currentPixel == ivec2(center + vec2(-y, x))) isOnCircle = true; // oct 3
            if (currentPixel == ivec2(center + vec2(-x, y))) isOnCircle = true; // oct 4
            if (currentPixel == ivec2(center + vec2(-x, -y))) isOnCircle = true; // oct 5
            if (currentPixel == ivec2(center + vec2(-y, -x))) isOnCircle = true; // oct 6
            if (currentPixel == ivec2(center + vec2(y, -x))) isOnCircle = true; // oct 7
            if (currentPixel == ivec2(center + vec2(x, -y))) isOnCircle = true; // oct 8
            
            if (isOnCircle) break;
            
            // atualização do parâmetro de decisão -> escolhe pelo if por "erro padrão"
            if (d < 0) {
              d = d + 4 * x + 6;
            } else {
              d = d + 4 * (x - y) + 10;
              y--;
            }
            x++;
          }
          
          if (isOnCircle) {
            gl_FragColor = vec4(circleColor, 1.0);
          } 
          else {
            gl_FragColor = vec4(bgColor, 1.0);

          }
        }
      `
  };
  

  return (
    <mesh
      onPointerMove = { (e) => {
        // atualiza a posição do mouse
        const x = (e.point.x + 1) / 2;
        const y = (e.point.y + 1) / 2;
        mousePos = { x, y };
        
        // atualiza o uniform direto
        const mesh = e.object as THREE.Mesh;
        const material = mesh.material as THREE.ShaderMaterial;
        material.uniforms.uMousePos.value.set(x, y);
      }}

      onWheel = {(e) => {
        // ajusta o raio com o scroll do mouse
        e.stopPropagation();
        radius = Math.max(0.05, Math.min(0.5, radius + e.deltaY * 0.001));
        
        // atualiza o uniform direto
        const mesh = e.object as THREE.Mesh;
        const material = mesh.material as THREE.ShaderMaterial;
        material.uniforms.uRadius.value = radius;
      }}
    >
      <planeGeometry args={[2, 2]} />
      <shaderMaterial args={[circleShader]} />
    </mesh>
  );
};

export default Bresenham;