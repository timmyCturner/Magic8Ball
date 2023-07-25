import logo from './logo.svg';
import './App.css';
import { Canvas, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { Scene } from './Scene';
import React, { Suspense, useState, useCallback, useRef } from 'react';
import { Environment } from '@react-three/drei';

function App() {
  const init = true
  const mouse = useRef([0, 0]);
  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) =>
      (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]),
    []
  );
  return (




      <Canvas
        pixelratio={window.devicePixelRatio}
        camera={{ fov: 100, position: [30, 0, 0] }}
        onCreated={({ gl, size, camera }) => {
          if (size.width < 600) {
            camera.position.z = 45;
          }
          gl.setClearColor(new THREE.Color('#82a2af'));
        }}>
        <Environment files="./belfast_sunset_puresky_1k.hdr" background blur={0}/>
        <Suspense fallback={null}>


        </Suspense>
        <group  rotation = {[0,Math.PI/2,0]}>
           <Scene init={init} mouse={mouse} />
        </group>
      </Canvas>


  );
}

export default App;
