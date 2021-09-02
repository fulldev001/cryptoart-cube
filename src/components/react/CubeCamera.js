import React, { useEffect, useRef, useState } from 'react';

import { useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

export default function CubeCamera(props) {
  const controls = useRef();
  const cameraRef = useRef();
  const {
    gl: { domElement },
  } = useThree();

  const [autoRotate, setAutoRotate] = useState(true);
  useEffect(() => {
    const toggleAutoRotate = () => {
      setAutoRotate(!autoRotate);
    };
    // console.log();
    domElement.removeEventListener('auxclick', toggleAutoRotate);
    domElement.addEventListener('auxclick', toggleAutoRotate);
    // if (!freeze) invalidate();
  }, [domElement, autoRotate]);

  return (
    <>
      <PerspectiveCamera key="camera" position={[0, 0, 25]} makeDefault ref={cameraRef}>
        <pointLight key="light" intensity={0.15} />
      </PerspectiveCamera>
      <OrbitControls
        ref={controls}
        key="controls"
        camera={cameraRef.current}
        enablePan={false}
        autoRotate={autoRotate}
        enableZoom={!props.disableZoom}
      />
    </>
  );
}
