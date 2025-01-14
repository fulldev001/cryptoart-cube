import * as THREE from 'three';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import Effects from './Effects';
import { Environment, Stats } from '@react-three/drei';
import CubeCamera from './CubeCamera';
// import { MeshLine, MeshLineMaterial } from 'three.meshline';
import { LineMesh } from './Line';
import { noise } from '../../utils/Noise';
require('./CubeRenderer.css');

import { useActor } from '@xstate/react';
import cryptoCubeMachine from '../../machines/cryptoCube/cryptoCubeMachine';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter';

const isDev = process.env.NODE_ENV === 'development';

// // const RoundedBoxGeometry = require('three-rounded-box')(THREE);
// extend({ MeshLine, MeshLineMaterial });
const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const cubeFacesOrientation = [
  [0, 0, 1],
  [1, 0, 0],
  [0, 0, -1],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
];

let jIncrement = 0;

function Boxes(props) {
  const {
    cubeData,
    toggleMergedCube = false,
    subSquaresScale = 0.9,
    mainCubeSide = 10,
    thickness = 0.01,
    explosion = 0.1,
    backGroundColor = "#f0f0f0",
    subSquareOpacity = 0.9,
    cylinderOpacity = 0.1,
    cylinderThickness = 0.8,
    hideBackground = true,
    // freeze = false,
    previewCube = false,
    active = true,
    previewCubeWireframe = false,
    previewCubeUniqueColor = false,
    // previewCubeAttachBloomToAnimation = false,
    previewCubeAnimationSpeed = 10,
    previewCubeOpacity = 1,
    position = { x: 0, y: 0, z: 0 },
    displacementAnimationDistance = 1,
    displacementIncrementPerFrame = 0.01,
  } = props;
  const [scaleMainCube, setScaleMainCube] = useState(1);
  const [state, send] = useActor(cryptoCubeMachine.service);

  const [cubeVersion] = useState(Math.round(Math.random() * 10));

  const [cubeMatrixes, setCubeMatrixes] = useState([]);

  useEffect(() => {
    console.log(previewCube ? 'previewCube' : 'normalCube', cubeVersion);
  }, [cubeVersion, previewCube]);

  const clampedSubSquaresScale = clamp(subSquaresScale, 0, 1) + (previewCube ? 0.1 : 0);
  const {
    // camera,
    scene,
    gl,
    // gl: { domElement },
    // invalidate,
    // setDefaultCamera,
  } = useThree();


  const exporter = new OBJExporter();
  const result = exporter.parse(scene);
  console.log(result);

  //
  // const renderToJPG = useMemo(() => {
  //   const strMime = 'image/png';
  //   const imgData = gl.domElement.toDataURL(strMime);
  //   // console.log(imgData);
  //   return imgData;
  // }, [gl.domElement]);
  //
  useEffect(() => {
    // if (gl.domElement && !state.domElement){
    //
    //   alert("here");
    //   cryptoCubeMachine.actionCreators.registerGL(gl.domElement)
    // }
    gl.domElement.id = 'canvasGL';
    cryptoCubeMachine.actionCreators.registerGL('canvasGL');
    console.log(gl.domElement);
  }, [gl.domElement]);

  useFrame(({ clock, gl, scene, camera }) => {
    // const isNewFrame = controls.current.update();
    // console.log('frame', freeze, isNewFrame);
    // console.log(previewCube);
    if (
      // freeze ||
      previewCube
    ) {
      return;
    }

    // console.log('normalCube', cubeVersion);

    // console.log('here', cubeMatrixes);
    for (let j = 0; j < cubeMatrixes.length; j++) {
      const matrix = cubeMatrixes[j].clone();
      const position = new THREE.Vector3().setFromMatrixPosition(matrix);
      const increment = j + jIncrement;
      const newX = position.x + noise(increment, 0, 0) * displacementAnimationDistance;
      const newY = position.y + noise(increment, increment, 0) * displacementAnimationDistance;
      const newZ =
        position.z + noise(increment, increment, increment) * displacementAnimationDistance;
      matrix.setPosition(new THREE.Vector3(newX, newY, newZ));
      meshRef.current.setMatrixAt(j, matrix);

      // const incrementedj = j + jIncrement;
      // const x = noise(incrementedj, 0, 0) * 2;
      // const y = noise(incrementedj, incrementedj, 0) * 2;
      // const z = noise(incrementedj, incrementedj, incrementedj) * 2;
      // points.push(
      //   point1Vector.x + point2Vector.x * j + x,
      //   point1Vector.y + point2Vector.y * j + y,
      //   point1Vector.z + point2Vector.z * j + z,
      // );
    }
    // console.log(jIncrement);
    meshRef.current.instanceMatrix.needsUpdate = true;
    jIncrement += displacementIncrementPerFrame;

    // gl.render(scene, camera);
    if ((!toggleMergedCube && scaleMainCube >= 1) || (toggleMergedCube && scaleMainCube <= 0)) {
      // console.log('frame2');
      scaleMainCube === 1 || scaleMainCube === 0
        ? null
        : setScaleMainCube(Math.round(scaleMainCube));
      // if (!freeze) invalidate(!isNewFrame);
      return;
    }
    // console.log(clock.getDelta());
    let scale = scaleMainCube + (toggleMergedCube ? -1 : 1) * 500 * clock.getDelta();
    setScaleMainCube(scale);

    // const scale = 1 + Math.sin(clock.elapsedTime) * 0.3
    // for (let i = 0; i < 10000; ++i) {
    //   vec.copy(positions[i]).multiplyScalar(scale)
    //   transform.setPosition(vec)
    //   ref.current.setMatrixAt(i, transform)
    // }
    // ref.current.instanceMatrix.needsUpdate = true
    // if (!freeze) invalidate(!isNewFrame);
  }, 0);

  useFrame(({ clock, gl, scene, camera }) => {
    // const isNewFrame = controls.current.update();
    // console.log('frame', freeze, isNewFrame);
    if (
      // freeze ||
      !previewCube ||
      !active
    ) {
      return;
    }

    for (let j = 0; j < cubeMatrixes.length; j++) {
      const matrix = cubeMatrixes[j].clone();
      const position = new THREE.Vector3().setFromMatrixPosition(matrix);
      const increment = j + jIncrement;
      const newX = position.x + noise(increment, 0, 0) * displacementAnimationDistance;
      const newY = position.y + noise(increment, increment, 0) * displacementAnimationDistance;
      const newZ =
        position.z + noise(increment, increment, increment) * displacementAnimationDistance;
      matrix.setPosition(new THREE.Vector3(newX, newY, newZ));
      meshRef.current.setMatrixAt(j, matrix);

      // const incrementedj = j + jIncrement;
      // const x = noise(incrementedj, 0, 0) * 2;
      // const y = noise(incrementedj, incrementedj, 0) * 2;
      // const z = noise(incrementedj, incrementedj, incrementedj) * 2;
      // points.push(
      //   point1Vector.x + point2Vector.x * j + x,
      //   point1Vector.y + point2Vector.y * j + y,
      //   point1Vector.z + point2Vector.z * j + z,
      // );
    }
    // console.log(jIncrement);
    meshRef.current.instanceMatrix.needsUpdate = true;
    jIncrement += displacementIncrementPerFrame;
    // console.log('previewCube', cubeVersion, facesMergedCubeActive, facesActive);
    // gl.render(scene, camera);

    // if ((!toggleMergedCube && scaleMainCube >= 1) || (toggleMergedCube && scaleMainCube <= 0)) {
    //   // console.log('frame2');
    //   scaleMainCube === 1 || scaleMainCube === 0
    //     ? null
    //     : setScaleMainCube(Math.round(scaleMainCube));
    //   if (!freeze) invalidate(!isNewFrame);
    //   return;
    // }
    // console.log(clock.getDelta());
    let scale =
      subSquaresScale + Math.sin(clock.elapsedTime * previewCubeAnimationSpeed) * 0.04 + 0.01;
    setScaleMainCube(scale);
    // const scale = 1 + Math.sin(clock.elapsedTime) * 0.3
    // for (let i = 0; i < 10000; ++i) {
    //   vec.copy(positions[i]).multiplyScalar(scale)
    //   transform.setPosition(vec)
    //   ref.current.setMatrixAt(i, transform)
    // }
    // ref.current.instanceMatrix.needsUpdate = true
    // if (!freeze) invalidate(!isNewFrame);
  }, 0);

  // const geometryRef = useRef();

  const facesActive = useMemo(
    () =>
      cubeData.faces.reduce((acc, face) => {
        return [...acc, ...face];
      }, []),
    [cubeData],
  );

  const facesActiveOriginalScale = useMemo(() => [...facesActive], [facesActive]);

  const facesMergedCubeActive = useMemo(() => {
    if (!cubeData.facesMergedCube) return [];
    return cubeData.facesMergedCube.reduce((acc, face) => {
      return [...acc, ...face];
    }, []);
  }, [cubeData]);
  const facesMergedCubeActiveOriginalScale = useMemo(
    () => [...facesMergedCubeActive],
    [facesMergedCubeActive],
  );

  // gets all colors ready to be sent to GPU instances
  const colorArray = useMemo(
    () =>
      Float32Array.from(
        cubeData.faces.reduce((acc, face, index) => {
          const _previewCubeUniqueColor = previewCube && previewCubeUniqueColor;
          const _colorArray = new Array(face.length)
            .fill()
            .flatMap((_, i) =>
              tempColor.set(_previewCubeUniqueColor ? '#ffffff' : cubeData.colors[index]).toArray(),
            );

          const toReturn = [...acc, ..._colorArray];
          return toReturn;
        }, []),
      ),
    [cubeData, previewCube, previewCubeUniqueColor],
  );

  const meshRef = useRef();
  const cylRef = useRef();

  let cylWidth = 0.05;

  const [cylGeometry] = useState(new THREE.CylinderGeometry(cylWidth, cylWidth, 1, 32));
  const [hexColorsArray, setHexColorsArray] = useState(cubeData.colors);

  useEffect(() => {
    setHexColorsArray(cubeData.colors);
    // if (!freeze) invalidate();
  }, [
    cubeData.colors,
    // freeze,
    // invalidate,
  ]);

  // const [roundedGeometry, setRoundedGeometry] = useState(
  //   new RoundedBoxGeometry(mainCubeSide, mainCubeSide, mainCubeSide, 0, 5),
  // );
  // useMemo(() => {
  //   roundedGeometry.computeVertexNormals();
  //   roundedGeometry.setAttribute('color', new THREE.InstancedBufferAttribute(colorArray, 3));
  // }, [roundedGeometry, colorArray]);
  useEffect(() => {
    if (hideBackground) {
      scene.background = null;
    } else {
      scene.background = new THREE.Color(backGroundColor)
    }

    // if (!freeze) invalidate();
  }, [
    scene,
    backGroundColor,
    // freeze,
    // invalidate,
  ]);

  useEffect(() => {
    if (
      !meshRef.current ||
      !cylRef.current
      // || freeze
    ) {
      return;
    }
    let currentFaceId = 0;

    const _cubeMatrixes = [];

    const halfCubeSide = mainCubeSide / 2;

    const _thickness = (previewCube ? thickness - 0.0001 : thickness) || 0.00001; // requested by client.

    const _explosion = previewCube ? explosion - 0.01 : explosion;

    const absoluteThickness = halfCubeSide * _thickness;

    // goes through all the cube faces

    for (let cubeFaceIndex = 0; cubeFaceIndex < cubeFacesOrientation.length; cubeFaceIndex++) {
      const coordsToIncreaseVectors = [
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 1),
      ];

      const faceColor = new THREE.Color(hexColorsArray[cubeFaceIndex]);

      const currentFaceNumberOfSquaresPerLine = Math.sqrt(cubeData.faces[cubeFaceIndex].length);
      const currentFaceOrientationCoords = cubeFacesOrientation[cubeFaceIndex];
      const subFaceRealSideLength = mainCubeSide / currentFaceNumberOfSquaresPerLine;
      const subFaceRelativeSide = 1 / currentFaceNumberOfSquaresPerLine;
      const subFaceRelativeSideScaled = subFaceRelativeSide * clampedSubSquaresScale;

      // get the orientation vectors for moving the  pointer that will draw the subsquares on the correct position
      let nonMovingCoordVector = null;

      let rotationVector;

      let faceDisplacementSignal = 0;

      const mainCubeFaceMovingPointerDirectonVectors = coordsToIncreaseVectors;

      currentFaceOrientationCoords.forEach((coordAxisIsStatic, index) => {
        // if not equal to 0, means this will be the static axis of the pointer.
        // the other 2 remaining axis will be the ones moving
        if (coordAxisIsStatic !== 0) {
          faceDisplacementSignal = coordAxisIsStatic;
          nonMovingCoordVector = mainCubeFaceMovingPointerDirectonVectors.splice(index, 1)[0];
        }
      });

      rotationVector = nonMovingCoordVector.clone();
      rotationVector
        .set(rotationVector.y, rotationVector.x, rotationVector.z)
        .multiplyScalar(faceDisplacementSignal);
      // extracts the face rotation vector - maybe multiply by signal?

      nonMovingCoordVector.multiplyScalar(
        (halfCubeSide + absoluteThickness + _explosion) * faceDisplacementSignal,
      ); // gets the displacement for the static coordinate

      const pointerStartPositionVector = mainCubeFaceMovingPointerDirectonVectors[0]
        .clone()
        .add(mainCubeFaceMovingPointerDirectonVectors[1])
        .multiplyScalar(halfCubeSide - subFaceRealSideLength / 2);

      // iterate on face subfaces
      for (let coord1 = 0; coord1 < currentFaceNumberOfSquaresPerLine; coord1++) {
        for (let coord2 = 0; coord2 < currentFaceNumberOfSquaresPerLine; coord2++) {
          // console.log(
          //   facesActiveOriginalScale[currentFaceId],
          //   facesMergedCubeActiveOriginalScale[currentFaceId],
          // );
          const faceSecondCube = facesMergedCubeActiveOriginalScale[currentFaceId] || 0;
          const compoundScale =
            facesActiveOriginalScale[currentFaceId] * scaleMainCube +
            faceSecondCube * (1 - scaleMainCube);
          tempObject.scale.set(
            facesActiveOriginalScale[currentFaceId] || faceSecondCube
              ? subFaceRelativeSideScaled * clampedSubSquaresScale * compoundScale
              : 0,
            facesActiveOriginalScale[currentFaceId] ||
              facesMergedCubeActiveOriginalScale[currentFaceId]
              ? subFaceRelativeSideScaled * clampedSubSquaresScale * compoundScale
              : 0,
            facesActiveOriginalScale[currentFaceId] || faceSecondCube ? _thickness : 0,
          );

          const coord1PointerVector = mainCubeFaceMovingPointerDirectonVectors[0]
            .clone()
            .multiplyScalar(coord1 * subFaceRealSideLength);

          const coord2PointerVector = mainCubeFaceMovingPointerDirectonVectors[1]
            .clone()
            .multiplyScalar(coord2 * subFaceRealSideLength);

          tempObject.position.copy(
            new THREE.Vector3()
              .add(nonMovingCoordVector)
              .add(pointerStartPositionVector)
              .sub(coord1PointerVector)
              .sub(coord2PointerVector),
          );

          // // const matrix = cubeMatrixes[j].clone();
          // // const position = new THREE.Vector3().setFromMatrixPosition(tempObject.matrix.clone());
          // const increment = currentFaceId + jIncrement;
          // const newX =
          //   tempObject.position.x + noise(increment, 0, 0) * displacementAnimationDistance;
          // const newY =
          //   tempObject.position.y + noise(increment, increment, 0) * displacementAnimationDistance;
          // const newZ =
          //   tempObject.position.z +
          //   noise(increment, increment, increment) * displacementAnimationDistance;
          // tempObject.position.set(newX, newY, newZ);

          tempObject.updateMatrix();
          // meshRef.current.setMatrixAt(j, matrix);

          const angle = Math.PI / 2;
          tempObject.rotation.x = 0;
          tempObject.rotation.y = 0;
          tempObject.rotation.z = 0;
          tempObject.rotateOnAxis(rotationVector, angle);

          tempObject.updateMatrix();

          meshRef.current.setMatrixAt(currentFaceId, tempObject.matrix);

          _cubeMatrixes.push(tempObject.matrix.clone());

          // const cylinderThickness = subSquaresScale * (subFaceRealSideLength / 2);

          tempObject.scale.set(
            facesActiveOriginalScale[currentFaceId] || faceSecondCube
              ? cylinderThickness * compoundScale
              : 0,
            facesActiveOriginalScale[currentFaceId] || faceSecondCube
              ? (mainCubeSide + _explosion * 2) * faceDisplacementSignal * compoundScale
              : 0,
            facesActiveOriginalScale[currentFaceId] || faceSecondCube
              ? cylinderThickness * compoundScale
              : 0,
          );

          const cylinderCornerCoordsSignal = [
            [1, 1],
            [1, -1],
            [-1, -1],
            [-1, 1],
          ];

          const cornerDisplacementScalar =
            subFaceRelativeSideScaled * clampedSubSquaresScale * mainCubeSide;

          for (let cornerId = 0; cornerId < 4; cornerId++) {
            const cornerSignals = cylinderCornerCoordsSignal[cornerId];

            const cylinderCoordPointerVector1 = mainCubeFaceMovingPointerDirectonVectors[0]
              .clone()
              .multiplyScalar(
                (cornerSignals[0] * cornerDisplacementScalar) / 2 -
                  cornerSignals[0] * cylinderThickness * cylWidth,
              );

            const cylinderCoordPointerVector2 = mainCubeFaceMovingPointerDirectonVectors[1]
              .clone()
              .multiplyScalar(
                (cornerSignals[1] * cornerDisplacementScalar) / 2 -
                  cornerSignals[1] * cylinderThickness * cylWidth,
              );

            let cylObj = tempObject.clone();

            cylObj.position.sub(nonMovingCoordVector);
            cylObj.position.add(cylinderCoordPointerVector1);
            cylObj.position.add(cylinderCoordPointerVector2);

            cylObj.rotateX(Math.PI / 2);

            // if (!facesActiveOriginalScale[currentFaceId]) {
            //   cylObj.scale.set(0, 0, 0);
            // }

            cylObj.updateMatrix();
            const cylinderInstanceIndex = currentFaceId * 4 + cornerId;
            cylRef.current.setMatrixAt(cylinderInstanceIndex, cylObj.matrix);
            cylRef.current.setColorAt(cylinderInstanceIndex, faceColor);
          }
          // }
          currentFaceId++;
        }
      }
    }
    // console.log('drawn cube');
    meshRef.current.instanceMatrix.needsUpdate = true;
    cylRef.current.instanceMatrix.needsUpdate = true;
    setCubeMatrixes(_cubeMatrixes);
    // if (!freeze) invalidate();
  }, [
    meshRef,
    cylRef,
    thickness,
    subSquaresScale,
    mainCubeSide,
    explosion,
    cubeData,
    hexColorsArray,
    cylinderThickness,
    scaleMainCube,
    // freeze,
    // invalidate,
    clampedSubSquaresScale,
    cylWidth,
    facesActiveOriginalScale,
    facesMergedCubeActiveOriginalScale,
    previewCube,
  ]);
  // useEffect(() => {
  //   controls.current.addEventListener('change', () => invalidate(false));
  // }, []);

  // useFrame(() => controls.current.update());
  // useEffect(() => void controls.current.addEventListener('change', invalidate), [invalidate]);

  // useFrame((state) => {
  //   const time = state.clock.deltaTime;
  //   // console.log(time);
  //   if (!meshRef.current) {
  //     return;
  //   }
  //   meshRef.current.instanceMatrix.needsUpdate = true;
  // });

  // console.log(active);
  const _previewCubeWireframe = previewCube && previewCubeWireframe;

  const _previewCubeUniqueColor = previewCube && previewCubeUniqueColor;
  return (
    <>
      <instancedMesh
        ref={meshRef}
        args={[null, null, facesActive.length]}
        // onPointerMove={(e) => set(e.instanceId)}
        // onPointerOut={(e) => set(undefined)}
        renderOrder={previewCube ? 1 : 2}
        position={[position.x, position.y, position.z]}
        visible={active}
      >
        <boxGeometry args={[mainCubeSide, mainCubeSide, mainCubeSide]}>
          <instancedBufferAttribute attachObject={['attributes', 'color']} args={[colorArray, 3]} />
        </boxGeometry>
        {!previewCube ? (
          <meshPhysicalMaterial
            vertexColors={THREE.VertexColors}
            // side={THREE.DoubleSide}
            // transmission={0.5}
            roughness={0.1}
            thickness={0.1}
            envMapIntensity={1}
            transparent
            opacity={subSquareOpacity}
            // transmission={0.01}
            // roughness={0.3}
            // thickness={0.5}
            // envMapIntensity={1}
            // clearcoat={0.6}
            // // metalness={0.9}
          />
        ) : (
          <meshBasicMaterial
            vertexColors={THREE.VertexColors}
            // color={_previewCubeUniqueColor && '0xffffff'}
            // side={THREE.DoubleSide}
            transmission={0}
            reflectivity={1}
            envMapIntensity={1}
            transparent
            opacity={previewCubeOpacity}
            roughness={!_previewCubeUniqueColor ? 0.1 : 0}
            thickness={!_previewCubeUniqueColor ? 0.1 : 1}
            wireframe={_previewCubeWireframe}
            // wireframe={previewCube}
            // transmission={0.01}
            // roughness={0.3}
            // thickness={0.5}
            // envMapIntensity={1}
            // clearcoat={0.6}
            // // metalness={0.9}
          />
        )}
      </instancedMesh>

      <instancedMesh
        ref={cylRef}
        args={[cylGeometry, null, facesActive.length * 4]}
        renderOrder={0}
        visible={active}
        // onPointerMove={(e) => set(e.instanceId)}
        // onPointerOut={(e) => set(undefined)}
      >
        {' '}
        {/*<meshBasicMaterial*/}
        {/*  //vertexColors={THREE.VertexColors}*/}
        {/*  side={THREE.DoubleSide}*/}
        {/*  //transmission={0.8}*/}
        {/*  // roughness={0.3}*/}
        {/*  // thickness={2}*/}
        {/*  // envMapIntensity={4}*/}
        {/*  //transparent*/}
        {/*  // // opacity={0.8}*/}
        {/*  // transmission={1}*/}
        {/*  // roughness={0.3}*/}
        {/*  // thickness={0.5}*/}
        {/*  // envMapIntensity={1}*/}
        {/*  // clearcoat={0.6}*/}
        {/*  // // metalness={0.9}*/}
        {/*/>*/}
        {!previewCube ? (
          <meshPhysicalMaterial
            //vertexColors={THREE.VertexColors}
            side={THREE.DoubleSide}
            //transmission={0.8}
            roughness={0.1}
            thickness={0.1}
            envMapIntensity={1}
            transparent
            opacity={cylinderOpacity}
            // transmission={1}
            // roughness={0.3}
            // thickness={0.5}
            // envMapIntensity={1}
            // clearcoat={0.6}
            // // metalness={0.9}
          />
        ) : (
          <meshPhongMaterial
            //vertexColors={THREE.VertexColors}
            side={THREE.DoubleSide}
            //transmission={0.8}
            roughness={0.1}
            thickness={0.1}
            reflectivity={1}
            envMapIntensity={1}
            transparent
            opacity={1}
            // wireframe={previewCube}
            // transmission={0.01}
            // roughness={0.3}
            // thickness={0.5}
            // envMapIntensity={1}
            // clearcoat={0.6}
            // // metalness={0.9}
          />
        )}
      </instancedMesh>

      <React.Suspense fallback={null}>
        <Environment preset="warehouse" />
      </React.Suspense>
    </>
  );
}

export const CubeRenderer = (props) => {
  // const boxes1Position = [0, 0, 0];
  // const boxes2Position = [10, 10, 10];
  return (
    <Canvas
      key={'scene'}
      // invalidateFrameloop={props.freeze}
      linear
      gl={{ antialias: false, alpha: true, preserveDrawingBuffer: true }}
      // camera={{ position: [0, 0, 15], near: 0.1, far: 200 }}
    >
      <ambientLight intensity={0.15} />

      <Boxes
        key={'main'}
        // main cube
        {...props}
        previewCube={false}
        position={props.positionCube1}
      />
      {props.cubeData.facesPreview && (
        <Boxes
          // White preview cube
          {...props}
          key={'preview'}
          cubeData={{
            ...props.cubeData,
            faces: props.cubeData.facesPreview,
            facesMergedCube: null,
          }}
          subSquareOpacity={0.9}
          previewCube={true}
          toggleMergedCube={false}
          active={props.cubeData.facesPreview && props.previewCube}
          position={props.positionCube1}
        />
      )}
      {props.lightningRays ? (
        <>
          <LineMesh
            width={0.1}
            displacement={2}
            color={0xff0000}
            point1={props.positionCube1}
            point2={props.positionCube2}
            dashArray={0.5}
            lineSpeed={0.03}
            dashRatio={0.6}
            // position={[0, 10, 0]}
          />
          <LineMesh
            width={0.1}
            color={0xff0000}
            displacement={0.5}
            incrementedRate={0.01}
            offsetStart={0.2}
            point1={props.positionCube1}
            point2={props.positionCube2}
            // position={[0, 10, 0]}
          />
        </>
      ) : null}

      {/*<mesh>*/}
      {/*  <meshLine attach="geometry" points={points} />*/}
      {/*  <meshLineMaterial*/}
      {/*    attach="material"*/}
      {/*    transparent*/}
      {/*    depthTest={false}*/}
      {/*    lineWidth={10}*/}
      {/*    color={0xff00ff}*/}
      {/*    dashArray={0.05}*/}
      {/*    dashRatio={0.95}*/}
      {/*  />*/}
      {/*</mesh>*/}
      {props.cubeData.facesSecond && (
        <Boxes
          key={'main2'}
          //second cube for merge animation
          {...props}
          previewCube={false}
          toggleMergedCube={false}
          cubeData={{
            ...props.cubeData,
            faces: props.cubeData.facesSecond,
            facesMergedCube: null,
          }}
          position={props.positionCube2}
        />
      )}
      <CubeCamera key={'cubeCamera'} {...props} />
      <Effects key={'effects'} {...props} />
      {isDev ? <Stats className="cubeStats" /> : null}
    </Canvas>
  );
};
