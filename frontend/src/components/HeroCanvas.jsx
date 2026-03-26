import { AdaptiveDpr } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const palette = ["#38bdf8", "#22d3ee", "#8b5cf6", "#60a5fa"];

const buildParticleData = (count, spread) => {
  const fieldPositions = new Float32Array(count * 3);
  const shapePositions = new Float32Array(count * 3);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const seeds = new Float32Array(count * 4);
  const color = new THREE.Color();

  for (let index = 0; index < count; index += 1) {
    const i3 = index * 3;
    const i4 = index * 4;

    fieldPositions[i3] = THREE.MathUtils.randFloatSpread(spread * 2);
    fieldPositions[i3 + 1] = THREE.MathUtils.randFloatSpread(spread * 1.25);
    fieldPositions[i3 + 2] = THREE.MathUtils.randFloatSpread(spread * 1.8);

    const progress = index / Math.max(count - 1, 1);
    const y = THREE.MathUtils.lerp(5.9, -5.9, progress);
    const sCurve = Math.sin(y * 0.72) * 2.6 + Math.sin(y * 0.2) * 0.7;

    shapePositions[i3] = sCurve + THREE.MathUtils.randFloatSpread(0.55);
    shapePositions[i3 + 1] = y + THREE.MathUtils.randFloatSpread(0.35);
    shapePositions[i3 + 2] = THREE.MathUtils.randFloatSpread(2.2);

    positions[i3] = shapePositions[i3];
    positions[i3 + 1] = shapePositions[i3 + 1];
    positions[i3 + 2] = shapePositions[i3 + 2];

    color
      .set(palette[index % palette.length])
      .offsetHSL(
        THREE.MathUtils.randFloatSpread(0.03),
        THREE.MathUtils.randFloatSpread(0.08),
        THREE.MathUtils.randFloatSpread(0.08),
      );

    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;

    seeds[i4] = THREE.MathUtils.randFloat(0.45, 1.15);
    seeds[i4 + 1] = THREE.MathUtils.randFloat(0.08, 0.38);
    seeds[i4 + 2] = THREE.MathUtils.randFloat(0, Math.PI * 2);
    seeds[i4 + 3] = THREE.MathUtils.randFloat(0.4, 1.2);
  }

  return { fieldPositions, shapePositions, positions, colors, seeds };
};

const ParticleField = ({ count, isCompact, pointerX, pointerY, smoothY }) => {
  const pointsRef = useRef(null);
  const data = useMemo(
    () => buildParticleData(count, isCompact ? 7.8 : 11.5),
    [count, isCompact],
  );

  useEffect(() => {
    if (!pointsRef.current) {
      return;
    }

    pointsRef.current.geometry.attributes.position.setUsage(THREE.DynamicDrawUsage);
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) {
      return;
    }

    const elapsed = state.clock.elapsedTime;
    const positions = pointsRef.current.geometry.attributes.position.array;
    const cursorX = pointerX?.get ? pointerX.get() : 0;
    const cursorY = pointerY?.get ? pointerY.get() : 0;
    const scrollOffset = smoothY?.get ? smoothY.get() : 0;
    const cursorWorldX = cursorX * (isCompact ? 4.2 : 6.4);
    const cursorWorldY = cursorY * (isCompact ? 2.6 : 3.8);
    const radius = isCompact ? 2.3 : 3.1;
    const radiusSquared = radius * radius;
    const morph = Math.min(elapsed / 2.4, 1);
    const wavePhase = elapsed * 3.4 + scrollOffset * 0.012;

    for (let index = 0; index < count; index += 1) {
      const i3 = index * 3;
      const i4 = index * 4;

      let x = THREE.MathUtils.lerp(
        data.shapePositions[i3],
        data.fieldPositions[i3],
        morph,
      );
      let y = THREE.MathUtils.lerp(
        data.shapePositions[i3 + 1],
        data.fieldPositions[i3 + 1],
        morph,
      );
      let z = THREE.MathUtils.lerp(
        data.shapePositions[i3 + 2],
        data.fieldPositions[i3 + 2],
        morph,
      );

      const speed = data.seeds[i4];
      const amplitude = data.seeds[i4 + 1] * (isCompact ? 0.45 : 0.72);
      const phase = data.seeds[i4 + 2];
      const depth = data.seeds[i4 + 3];

      x += Math.sin(elapsed * speed + phase) * amplitude;
      y += Math.cos(elapsed * speed * 0.9 + phase * 0.8) * amplitude;
      z += Math.sin(elapsed * speed * 0.55 + phase) * amplitude * 2.4;

      const dx = x - cursorWorldX;
      const dy = y - cursorWorldY;
      const distanceSquared = dx * dx + dy * dy;

      if (distanceSquared < radiusSquared) {
        const distance = Math.sqrt(distanceSquared) + 0.0001;
        const force = (radius - distance) / radius;
        const repel = force * force * (isCompact ? 0.45 : 0.8);
        const swirl = force * (isCompact ? 0.04 : 0.06);

        x += (dx / distance) * repel * (1.4 + depth);
        y += (dy / distance) * repel * (1.15 + depth * 0.4);
        x += (-dy / distance) * swirl * 1.8;
        y += (dx / distance) * swirl * 1.8;
        z += Math.sin(distance * 5.4 - wavePhase) * force * 1.4;
      }

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      cursorX * 0.65,
      0.045,
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      cursorY * 0.45,
      0.045,
    );
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      isCompact ? 10.6 : 10.1,
      0.03,
    );
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <fog attach="fog" args={["#05070d", 8, isCompact ? 18 : 24]} />

      <points ref={pointsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[data.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={isCompact ? 0.045 : 0.055}
          sizeAttenuation
          transparent
          opacity={0.95}
          depthWrite={false}
          vertexColors
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
};

const HeroCanvas = ({ pointerX, pointerY, smoothY }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");

    const updateMode = () => {
      const mobile = media.matches;
      const lowPower =
        mobile ||
        (navigator.hardwareConcurrency || 8) <= 4 ||
        /android|iphone|ipad|ipod/i.test(navigator.userAgent);

      setIsMobile(mobile);
      setIsLowPower(lowPower);
    };

    updateMode();

    if (media.addEventListener) {
      media.addEventListener("change", updateMode);
      return () => media.removeEventListener("change", updateMode);
    }

    media.addListener(updateMode);
    return () => media.removeListener(updateMode);
  }, []);

  const particleCount = isLowPower ? 1100 : isMobile ? 1600 : 2800;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ borderRadius: "inherit" }}
      aria-hidden="true"
    >
      <Canvas
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
        }}
        dpr={isLowPower ? [1, 1.2] : [1, 1.8]}
        camera={{ position: [0, 0, isMobile ? 10.6 : 10.1], fov: isMobile ? 56 : 48, near: 0.1, far: 40 }}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <AdaptiveDpr pixelated />
        <ParticleField
          count={particleCount}
          isCompact={isLowPower}
          pointerX={pointerX}
          pointerY={pointerY}
          smoothY={smoothY}
        />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.05),transparent_40%)]" />
    </div>
  );
};

export default HeroCanvas;
