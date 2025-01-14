import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { button, LevaPanel, useControls, useCreateStore } from 'leva';
import { CubeRenderer } from './CubeRenderer';
import {
  adjustedFragmentProperties,
  generateCubes,
  generateRandomFaces,
  translateSizeToConfig,
} from '../../utils/cubeGeneration';
import { CubeMainStudio } from './CubeMainStudio';
import cryptoCubeMachine from '../../machines/cryptoCube/cryptoCubeMachine';
import { CUBE_CONSTANTS } from '../../constants/constants';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter';


const initialCubeConfig = {
  colors: CUBE_CONSTANTS.Defaults.colors,
  ...generateCubes(),
};

CubeMain.propTypes = {
  colors: PropTypes.array,
  // TODO: New
  frag1Config: PropTypes.arrayOf(PropTypes.number),
  isCombined: PropTypes.bool,
  // TODO: remove if square count works
  // faces: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  facesSecond: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  facesMergedCube: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  facesPreview: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  freeze: PropTypes.bool,
  disableZoom: PropTypes.bool,
  hideBackground: PropTypes.bool,
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
    // TODO: new value that holds square count
    frag1Config = null,
    isCombined = false,
    // TODO: Remove if not needed
    // faces = CUBE_CONSTANTS.Defaults.faces,
    facesMergedCube,
    facesPreview,
    previewCube = CUBE_CONSTANTS.Defaults.previewCube,
    facesSecond,
    freeze = CUBE_CONSTANTS.Defaults.freeze,
    hideBackground = true,
    disableZoom = CUBE_CONSTANTS.Defaults.disableZoom,
    subSquaresScale = CUBE_CONSTANTS.Defaults.subSquaresScale,
    mainCubeSide = CUBE_CONSTANTS.Defaults.mainCubeSide,
    thickness = CUBE_CONSTANTS.Defaults.thickness,
    explosion = CUBE_CONSTANTS.Defaults.explosion,
    subSquareOpacity = CUBE_CONSTANTS.Defaults.subSquareOpacity,
    cylinderThickness = CUBE_CONSTANTS.Defaults.cylinderThickness,
    cylinderOpacity = CUBE_CONSTANTS.Defaults.cylinderOpacity,
    displacementAnimationDistance = 0,
    lightningRays = CUBE_CONSTANTS.Defaults.lightningRays,
    orbitControls = CUBE_CONSTANTS.Defaults.orbitControls,
  } = props;


  // TODO: NEW CODE – lift up?
  const frag1faces = (frag1Config !== null) ?
    translateSizeToConfig(frag1Config) :
    translateSizeToConfig([9, 16, 25, 36, 49, 64]);
  const frag1properties = isCombined ? adjustedFragmentProperties(frag1Config) : {};
  const colors = (frag1Config === null) ?
    ['#555', '#555', '#555', '#555', '#555', '#555'] :
    frag1properties.colors || CUBE_CONSTANTS.Defaults.colors;
  // TODO: END NEW CODE

  console.log(colors);

  // const [_cubeData, setCubeData] = useState(initialCubeConfig);
  const [_cubeData, setCubeData] = useState({
    colors,
    faces: frag1faces,
    previewCube,
    facesMergedCube,
    facesPreview,
    facesSecond,
  });

  useEffect(() => {
    setCubeData({
      colors,
      faces: frag1faces,
      facesMergedCube,
      facesSecond,
      facesPreview,
      previewCube,
    });
  }, [facesMergedCube, facesPreview, facesSecond, previewCube]);

  // const [state, send] = useActor(cryptoCubeMachine.service);
  const store = useCreateStore();
  const [data, set] = useControls(
    () => ({
      lightningRays: lightningRays,
      positionCamera: { x: 0, y: 0, z: 25 },
      positionCube1: { x: 0, y: 0, z: 0 },
      positionCube2: { x: 20, y: 20, z: 20 },
      displacementAnimationDistance: {
        value: displacementAnimationDistance,
        min: 0,
        max: 10,
      },
      displacementIncrementPerFrame: {
        value: frag1properties.displacementIncrementPerFrame || 0,
        min: 0,
        max: 1,
      },
      hideBackground,
      toggleMergedCube: CUBE_CONSTANTS.Defaults.toggleMergedCube,
      previewCube: previewCube,
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
      hideControls: true,
      freeze,
      disableZoom,
      backGroundColor: '#202426',
      subSquaresScale: {
        value: subSquaresScale,
        min: 0,
        max: 1,
      },
      mainCubeSide: frag1properties.mainCubeSide || mainCubeSide,
      thickness: {
        value: frag1properties.thickness || thickness,
        min: -1,
        max: 1,
      },
      explosion: {
        value: frag1properties.explosion ||  explosion,
        min: -10,
        max: 10,
      },
      subSquareOpacity: {
        value: frag1properties.subSquareOpacity || subSquareOpacity,
        min: 0,
        max: 1,
      },
      cylinderThickness: {
        value: frag1properties.cylinderThickness || cylinderThickness,
        min: 0,
        max: 1,
      },
      cylinderOpacity: {
        value: frag1properties.cylinderOpacity || cylinderOpacity,
        min: 0,
        max: 1,
      },
      orbitControls: orbitControls,
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
      exportObj: button(() => {
        const exporter = new OBJExporter();
        alert(scene);
      }),
      mergeCubesIntro: button(() => {
        cryptoCubeMachine.actionCreators.mergeCubesIntro(() => {
          alert('completed intro');
        });
      }),
      mergeCubesConclusion: button(() => {
        cryptoCubeMachine.actionCreators.mergeCubesConclusion(() => {
          alert('completed conclusion');
        });
      }),
    }),
    { store },
  );
  // console.log('data', data, set);
  // console.log('data', _cubeData, data);

  // _cubeData has a generated data
  // cubeData is the data from html - Variable cube : true ?
  // data has all props except cubeConfig

  return (
    <>
      {process.env.REACT_APP_DEBUG_CUBE && (
        <LevaPanel key="panel" store={store} titleBar={true}/>
      )}
      <CubeRenderer key={'renderer'} cubeData={_cubeData || props} {...data} />
      <CubeMainStudio set={set} data={data}/>
    </>
  );
}

const { mergeCubesIntro, mergeCubesConclusion, takeScreenShot } = cryptoCubeMachine.actionCreators;

export { CubeMain, CubeRenderer, mergeCubesIntro, mergeCubesConclusion, takeScreenShot };
