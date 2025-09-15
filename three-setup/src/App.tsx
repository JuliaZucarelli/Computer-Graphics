import { Canvas } from '@react-three/fiber';
import Sunflower from './Sunflower';
import './App.css';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Sunflower />
      </Canvas>
    </div>
  );
}

export default App;