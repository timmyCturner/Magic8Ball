import * as THREE from 'three';
import {mapRange, lerp } from 'canvas-sketch-util/math';
import Random from 'canvas-sketch-util/random';
import React, { useRef, useEffect, useMemo, useState } from 'react';
import {OrbitControls, useGLTF, useAnimations, MeshTransmissionMaterial, Center, Decal, Text3D } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber';



let display = "Hello"

export function Scene({ init = false, mouse }) {


  const [magicResponse, setMagicResponse] = useState([])

  const group = useRef()
  const text = useRef()
  const { nodes, materials, animations } = useGLTF('/8ball.glb')
  const { actions } = useAnimations(animations, group)
  const canvas = document.querySelector('canvas')


  const fontProps = { fontSize: 0.5, letterSpacing: -0.05, lineHeight: 1, 'material-toneMapped': false }
  const { ...props } = {


    precise: true

  }

  const config = {
    meshPhysicalMaterial: false,
    transmissionSampler: true,
    backside: false,
    samples: 32,//{ value: 32, min: 1, max: 32, step: 1 },
    resolution: 2048,//{ value: 2048, min: 256, max: 2048, step: 256 },
    transmission:1,// { value: 1, min: 0, max: 5 },
    roughness: 0.0,//{ value: 0.0, min: 0, max: 1, step: 0.01 },
    thickness: 3.5,//{ value: 3.5, min: 0, max: 10, step: 0.01 },
    ior: 1,//{ value: 1, min: 1, max: 5, step: 0.01 },
    chromaticAberration: 0.04,//{ value: 0.04, min: 0, max: 1 },
    anisotropy: 0.0,//{ value: 0.0, min: 0, max: 1, step: 0.01 },
    distortion: 0.0,//{ value: 0.0, min: 0, max: 1, step: 0.01 },
    distortionScale: 0.3,//{ value: 0.3, min: 0.01, max: 1, step: 0.01 },
    temporalDistortion:0.5,// { value: 0.5, min: 0, max: 1, step: 0.01 },
    clearcoat: 0,//{ value: 0, min: 0, max: 1 },
    attenuationDistance: 0.5,//{ value: 0.5, min: 0, max: 10, step: 0.01 },
    attenuationColor: '#FFFFFF',
    color: '#5a9093',
    bg: '#6d807e'
  }

  const setDisplay = (data) => {

    if( data){
      let displayHelp = data.magic
      return addNewlines(data.magic,10)
      // return displayHelp;
    }

  };

  const setSize = () => {


      //let displayHelp = data.magic
      if(text.current.children[0].children[0].children[0].geometry.boundingSphere){
        //console.log(countNewlines(display));
        //console.log(text.current.position.x, text.current.children[0].children[0].children[0].geometry.boundingSphere.radius);
        text.current.position.x =  0.1-1*text.current.children[0].children[0].children[0].geometry.boundingSphere.radius/2
        text.current.position.z =  -0.1*countNewlines(display)

      }



  };



  const makeAPICall = async () => {
      try {
        //const string = "Ask a Question"
        let question = "hello"
        if (document.querySelector('#question').value)
          question = document.querySelector('#question').value
        //console.log(question.value);
        const response = await fetch('http://localhost:5000/magic/'+question, {mode:'cors'});
        const data = await response.json();
        //console.log({ data })
        setMagicResponse(data)
        display = setDisplay(data)
        //setSize2()

      }
      catch (e) {
        console.log(e)
      }
    }

    // useEffect(() => {
    //   makeAPICall();
    // }, [])


  useFrame((state) => {
    if (group){
      //console.log(canvas.dataset.fire);
      if(canvas.dataset.fire == "fire"){
        console.log('fire!');
        makeAPICall();


          canvas.dataset.fire = "wait"
        // Object.entries(actions).forEach(([key, value]) => {
          // console.log(key);
          //   console.log(actions[key]);
           actions['Fire'].stop()
           actions['Fire'].enabled = true
           actions['Fire'].play()
           actions['Fire'].loop = THREE.LoopOnce
           //actions['Fire'].timeScale = 5
           //actions[key].loop = THREE.LoopRepeat
           //if
           //actions[key].repetitions = 1
           actions['Fire'].clampWhenFinished = true
         }
        if(canvas.dataset.fire == "wait"){
            setSize()
          if(actions['Fire'].paused){
            canvas.dataset.fire = "ready"
          }
        }


      }
    })


    //console.log(display);

  return (

    <>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableRotate={true}
        enableZoom={true}
      />



      <pointLight distance={100} intensity={2} color="white" />
      <ambientLight intensity={1} color="white" />
      <group  rotation = {[Math.PI,0,0]} dispose={null} position={[0, 10, 0]} scale = {10}>
        <group ref={group} dispose={null}>
          <group name="Scene">
            <group name="Armature" position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <primitive object={nodes.Bone} />
              <mesh rotation = {[Math.PI/2,Math.PI,0]} position= {[0,0.7,0]} scale = {.7}>
                <circleGeometry radius = {1} />
                {config.meshPhysicalMaterial ? <meshPhysicalMaterial {...config} /> : <MeshTransmissionMaterial background={new THREE.Color(config.bg)} {...config} />}
              </mesh>
              <group name="Ball001">
                <skinnedMesh name="Sphere002" geometry={nodes.Sphere002.geometry} material={materials.White} skeleton={nodes.Sphere002.skeleton} />
                <skinnedMesh name="Sphere002_1" geometry={nodes.Sphere002_1.geometry} material={materials.Black} skeleton={nodes.Sphere002_1.skeleton} />
                <skinnedMesh name="Sphere002_2" geometry={nodes.Sphere002_2.geometry} material={materials.Blue} skeleton={nodes.Sphere002_2.skeleton} />
              </group>

              {      <Center position = {[0,0.6,0]} rotation = {[Math.PI/2,Math.PI,Math.PI]} {...props} ref = {text}>
                      <Text3D
                        bevelEnabled
                        bevelSize={0.01}
                        bevelThickness={0.05}
                        width={0.1}
                        height={0.01}
                        lineHeight={0.75}
                        letterSpacing={0.01}
                        size={0.15}
                        font={'/Roboto_Bold_Italic.json'}>
                          {display}
                          <meshStandardMaterial color="white" />
                      </Text3D>
                    </Center>}

              <skinnedMesh name="Text001" geometry={nodes.Text001.geometry} material={materials.Black} skeleton={nodes.Text001.skeleton} />

            </group>

          </group>
        </group>
      </group>

    </>
  );
}



function addNewlines(inputString, maxCharsPerLine) {
  if (!inputString || typeof inputString !== 'string' || maxCharsPerLine <= 0) {
    return inputString; // Return the input as it is if it's not a valid string or maxCharsPerLine is non-positive.
  }

  let words = inputString.split(' ');
  let result = '';
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    let word = words[i];

    if (currentLine.length + word.length <= maxCharsPerLine) {
      currentLine += word + ' ';
    } else {
      result += currentLine.trim() + '\n';
      currentLine = word + ' ';
    }
  }

  result += currentLine.trim(); // Add the last line

  return result;
}

function countNewlines(inputString) {
  if (!inputString || typeof inputString !== 'string') {
    return 0; // Return 0 if the input is not a valid string.
  }

  const newLineRegex = /\n/g;
  const newLineMatches = inputString.match(newLineRegex);

  return newLineMatches ? newLineMatches.length : 0;
}
