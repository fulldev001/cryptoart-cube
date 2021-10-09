import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { button, LevaPanel, useControls, useCreateStore } from 'leva';
import { CubeRenderer } from './CubeRenderer';
import { generateCubes, generateRandomFaces } from '../../utils/cubeGeneration';
import { CubeMainStudio } from './CubeMainStudio';
import cryptoCubeMachine from '../../machines/cryptoCube/cryptoCubeMachine';
import { CUBE_CONSTANTS } from '../../constants/constants';

const initialCubeConfig = {
  colors: CUBE_CONSTANTS.Defaults.colors,
  ...generateCubes(),
};

CubeMain.propTypes = {
  colors: PropTypes.array,
  faces: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  facesMergedCube: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  facesPreview: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  freeze: PropTypes.bool,
  disableZoom: PropTypes.bool,
  subSquaresScale: PropTypes.number,
  mainCubeSide: PropTypes.number,
  thickness: PropTypes.number,
  explosion: PropTypes.number,
  subSquareOpacity: PropTypes.number,
  cylinderThickness: PropTypes.number,
  cylinderOpacity: PropTypes.number,
};

function CubeMain(props) {
  const {
    colors = CUBE_CONSTANTS.Defaults.colors,
    faces = CUBE_CONSTANTS.Defaults.faces,
    facesMergedCube = generateRandomFaces(),
    facesPreview = generateRandomFaces(),
    freeze = CUBE_CONSTANTS.Defaults.freeze,
    disableZoom = CUBE_CONSTANTS.Defaults.disableZoom,
    subSquaresScale = CUBE_CONSTANTS.Defaults.subSquaresScale,
    mainCubeSide = CUBE_CONSTANTS.Defaults.mainCubeSide,
    thickness = CUBE_CONSTANTS.Defaults.thickness,
    explosion = CUBE_CONSTANTS.Defaults.explosion,
    subSquareOpacity = CUBE_CONSTANTS.Defaults.subSquareOpacity,
    cylinderThickness = CUBE_CONSTANTS.Defaults.cylinderThickness,
    cylinderOpacity = CUBE_CONSTANTS.Defaults.cylinderOpacity,
    lightningRays = CUBE_CONSTANTS.Defaults.lightningRays,
  } = props;

  console.log('colors', colors, CUBE_CONSTANTS.Defaults.colors);

  // const [_cubeData, setCubeData] = useState(initialCubeConfig);
  const [_cubeData, setCubeData] = useState({
    colors,
    faces,
    facesMergedCube,
    facesPreview,
    facesSecond: facesPreview,
  });

  // const [state, send] = useActor(cryptoCubeMachine.service);
  const store = useCreateStore();
  const [data, set] = useControls(
    () => ({
      lightningRays: lightningRays,
      positionCube1: { x: 0, y: 0, z: 0 },
      positionCube2: { x: 20, y: 20, z: 20 },
      displacementAnimationDistance: {
        value: 1,
        min: 0,
        max: 10,
      },
      displacementIncrementPerFrame: {
        value: 0.01,
        min: 0,
        max: 1,
      },
      toggleMergedCube: CUBE_CONSTANTS.Defaults.toggleMergedCube,
      previewCube: CUBE_CONSTANTS.Defaults.previewCube,
      previewCubeWireframe: CUBE_CONSTANTS.Defaults.previewCubeWireframe,
      previewCubeUniqueColor: CUBE_CONSTANTS.Defaults.previewCubeUniqueColor,
      previewCubeBloomAnimation: CUBE_CONSTANTS.Defaults.previewCubeBloomAnimation,
      previewCubeAnimationSpeed: {
        value: 10,
        min: 0,
        max: 20,
      },
      previewCubeOpacity: {
        value: 0.9,
        min: 0,
        max: 1,
      },
      hideControls: false,
      freeze,
      disableZoom,
      backGroundColor: '#202426',
      subSquaresScale: {
        value: subSquaresScale,
        min: 0,
        max: 1,
      },
      mainCubeSide: mainCubeSide,
      thickness: {
        value: thickness,
        min: -1,
        max: 1,
      },
      explosion: {
        value: explosion,
        min: 0,
        max: 10,
      },
      subSquareOpacity: {
        value: subSquareOpacity,
        min: 0,
        max: 1,
      },
      cylinderThickness: {
        value: cylinderThickness,
        min: 0,
        max: 1,
      },
      cylinderOpacity: {
        value: cylinderOpacity,
        min: 0,
        max: 1,
      },
      color0: {
        value: colors[0],
        onChange: (color) => {
          colors[0] = color;
          setCubeData({
            colors,
            faces: _cubeData.faces,
            facesMergedCube: _cubeData.facesMergedCube,
            facesSecond: _cubeData.facesSecond,
            facesPreview: _cubeData.facesPreview,
          });
        },
      },
      color1: {
        value: colors[1],
        onChange: (color) => {
          colors[1] = color;
          setCubeData({
            colors,
            faces: _cubeData.faces,
            facesMergedCube: _cubeData.facesMergedCube,
            facesSecond: _cubeData.facesSecond,
            facesPreview: _cubeData.facesPreview,
          });
        },
      },
      color2: {
        value: colors[2],
        onChange: (color) => {
          colors[2] = color;
          setCubeData({
            colors,
            faces: _cubeData.faces,
            facesMergedCube: _cubeData.facesMergedCube,
            facesSecond: _cubeData.facesSecond,
            facesPreview: _cubeData.facesPreview,
          });
        },
      },
      color3: {
        value: colors[3],
        onChange: (color) => {
          colors[3] = color;
          setCubeData({
            colors,
            faces: _cubeData.faces,
            facesMergedCube: _cubeData.facesMergedCube,
            facesSecond: _cubeData.facesSecond,
            facesPreview: _cubeData.facesPreview,
          });
        },
      },
      color4: {
        value: colors[4],
        onChange: (color) => {
          colors[4] = color;
          setCubeData({
            colors,
            faces: _cubeData.faces,
            facesMergedCube: _cubeData.facesMergedCube,
            facesSecond: _cubeData.facesSecond,
            facesPreview: _cubeData.facesPreview,
          });
        },
      },
      color5: {
        value: colors[5],
        onChange: (color) => {
          colors[5] = color;
          setCubeData({
            colors,
            faces: _cubeData.faces,
            facesMergedCube: _cubeData.facesMergedCube,
            facesSecond: _cubeData.facesSecond,
            facesPreview: _cubeData.facesPreview,
          });
        },
      },
      regenerate: button(() => {
        setCubeData({
          colors,

          ...generateCubes(),
        });
      }),
      takeScreenShot: button(() => {
        cryptoCubeMachine.actionCreators.takeScreenShot();
      }),
      merge: button(() => {
        cryptoCubeMachine.actionCreators.mergeCubes();
      }),
    }),
    { store },
  );
  // console.log('data', data, set);
  console.log('data', _cubeData, data);

  // _cubeData has a generated data
  // cubeData is the data from html - Variable cube : true ?
  // data has all props except cubeConfig

  return (
    <>
      {process.env.REACT_APP_DEBUG_CUBE && !data.hideControls && (
        <LevaPanel key="panel" store={store} titleBar={true} />
      )}
      <CubeRenderer key={'renderer'} cubeData={_cubeData || props} {...data} />
      <CubeMainStudio set={set} data={data} />
    </>
  );
}

const { mergeCubes, takeScreenShot } = cryptoCubeMachine.actionCreators;

export { CubeMain, CubeRenderer, mergeCubes, takeScreenShot };
