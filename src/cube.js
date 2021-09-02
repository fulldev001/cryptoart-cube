import React from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CubeMain, CubeRenderer } from './components/react/CubeMain';

const loadCubeIntoDomElement = (cubeData, domElement) => {
  ReactDOM.render(<CubeMain key="cubemain" cubeData={cubeData} />, domElement);

  cubeData.cube = true;

  return cubeData;
};

console.log('Importing Cube Module', THREE, {
  loadCubeIntoDomElement,
  CubeMain,
  CubeRenderer,
});
export { loadCubeIntoDomElement, CubeMain, CubeRenderer };
