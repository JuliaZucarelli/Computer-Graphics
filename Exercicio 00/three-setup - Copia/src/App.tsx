import React, { useState } from 'react';
import { Canvas } from "@react-three/fiber";
import { Sunflower, Robot, Pinwheel, Car, Bresenham } from './projects';
import './App.css';

type Project = 'sunflower' | 'robot' | 'pinwheel' | 'car'  | 'bresenham';

const App: React.FC = () => {
  const [currentProject, setCurrentProject] = useState<Project>('sunflower');

  const projects = {
    sunflower: Sunflower,
    robot: Robot,
    pinwheel: Pinwheel,
    car: Car,
    bresenham: Bresenham
  };

  const projectConfig = {
    sunflower: { color: '#f39c12', icon: '🌻', label: 'Girassol' },
    robot: { color: '#3498db', icon: '🤖', label: 'Robô' },
    pinwheel: { color: '#27ae60', icon: '🎡', label: 'Cata-vento' },
    car: { color: '#e74c3c', icon: '🚗', label: 'Carro' },
    bresenham: { color: '#e67e22', icon: '⭕', label: 'Bresenham' }
  };

  const CurrentProject = projects[currentProject];

  return (
    <div className="app-container">
      
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Projetos 3D</h2>
        {(Object.keys(projects) as Project[]).map((project) => (
          <button
            key={project}
            className={`sidebar-button ${currentProject === project ? 'active' : ''}`}
            style={{ backgroundColor: currentProject === project ? projectConfig[project].color : '' }}
            onClick={() => setCurrentProject(project)}
          >
            <span className="sidebar-icon">{projectConfig[project].icon}</span>
            {projectConfig[project].label}
          </button>
        ))}
      </aside>

      {/* Canvas 3D */}
      <main className="canvas-container">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <CurrentProject />
        </Canvas>
        
        {currentProject === 'bresenham' && (
          <div className="instructions">
            <p>Mova o mouse para deslocar o círculo</p>
            <p>Use a roda do mouse para ajustar o raio</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;