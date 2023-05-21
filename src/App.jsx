/* eslint-disable react/no-unknown-property */
/* eslint-disable no-undef */
import { useEffect, useRef, useMemo, useLayoutEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { AsciiEffect } from "three-stdlib";

function Cube(props) {
  const mesh = useRef();
  useFrame(
    (state, delta) => (
      (mesh.current.rotation.x += delta), (mesh.current.rotation.y += delta)
    )
  );

  return (
    <mesh {...props} ref={mesh}>
      <torusGeometry args={[1, 0.2, 128, 32]} />
      <meshStandardMaterial color={"orange"} />
    </mesh>
  );
}

function AsciiRenderer({
  renderIndex = 1,
  bgColor = "black",
  fgColor = "white",
  characters = " .:-+*=%@#",
  invert = true,
  color = false,
  resolution = 0.15,
}) {
  // Reactive state
  const { size, gl, scene, camera } = useThree();

  // Create effect
  const effect = useMemo(() => {
    const effect = new AsciiEffect(gl, characters, {
      invert,
      color,
      resolution,
    });
    effect.domElement.style.position = "absolute";
    effect.domElement.style.top = "0px";
    effect.domElement.style.left = "0px";
    effect.domElement.style.pointerEvents = "none";
    return effect;
  }, [characters, invert, color, resolution]);

  // Styling
  useLayoutEffect(() => {
    effect.domElement.style.color = fgColor;
    effect.domElement.style.backgroundColor = bgColor;
  }, [fgColor, bgColor]);

  // Append on mount, remove on unmount
  useEffect(() => {
    gl.domElement.style.opacity = "0";
    gl.domElement.parentNode.appendChild(effect.domElement);
    return () => {
      gl.domElement.style.opacity = "1";
      gl.domElement.parentNode.removeChild(effect.domElement);
    };
  }, [effect]);

  // Set size
  useEffect(() => {
    effect.setSize(size.width, size.height);
  }, [effect, size]);

  // Take over render-loop (that is what the index is for)
  useFrame(() => {
    effect.render(scene, camera);
  }, renderIndex);

  // This component returns nothing, it is a purely logical
}

function App() {
  return (
    <Canvas camera={{ position: [0, 0, 4] }}>
      <color attach="background" args={["black"]} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Cube position={[0, 0, 0]} />
      <OrbitControls />
      <AsciiRenderer fgColor="white" bgColor="black" />
    </Canvas>
  );
}

export default App;
