import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sunflower, Robot, Pinwheel, Car } from './projects';

type Project = 'sunflower' | 'robot' | 'pinwheel' | 'car';

const App: React.FC = () => {
  const [currentProject, setCurrentProject] = useState<Project>('sunflower');

  const projects = {
    sunflower: Sunflower,
    robot: Robot,
    pinwheel: Pinwheel,
    car: Car
  };

  const projectConfig = {
    sunflower: { color: '#f39c12', icon: '🌻', label: 'Girassol' },
    robot: { color: '#3498db', icon: '🤖', label: 'Robô' },
    pinwheel: { color: '#27ae60', icon: '🎡', label: 'Cata-vento' },
    car: { color: '#e74c3c', icon: '🚗', label: 'Carro' }
  };

  const CurrentProject = projects[currentProject];

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* Barra de navegação MAIOR */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        gap: '12px',
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '18px 25px',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: '600px',
        width: 'auto'
      }}>
        {(Object.keys(projects) as Project[]).map((project) => (
          <button
            key={project}
            style={{
              padding: '12px 18px',
              backgroundColor: currentProject === project 
                ? projectConfig[project].color 
                : '#2c3e50',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              minWidth: project === 'pinwheel' ? '110px' : '90px',
              fontSize: project === 'pinwheel' ? '12px' : '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              lineHeight: '1.2'
            }}
            onClick={() => setCurrentProject(project)}
            onMouseEnter={(e) => {
              if (currentProject !== project) {
                e.currentTarget.style.backgroundColor = '#34495e';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentProject !== project) {
                e.currentTarget.style.backgroundColor = '#2c3e50';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            <span style={{ fontSize: project === 'pinwheel' ? '16px' : '18px' }}>
              {projectConfig[project].icon}
            </span>
            {projectConfig[project].label}
          </button>
        ))}
      </div>

      {/* Canvas 3D */}
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <CurrentProject />
      </Canvas>
    </div>
  );
};

export default App;