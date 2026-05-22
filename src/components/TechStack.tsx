import * as THREE from "three";
import { type MutableRefObject, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Decal, Environment } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  type RapierRigidBody,
} from "@react-three/rapier";

type LogoKind =
  | "react"
  | "typescript"
  | "javascript"
  | "node"
  | "mongodb"
  | "tailwind"
  | "express"
  | "github";

type TechItem = {
  label: string;
  kind: LogoKind;
  size: number;
  tint: string;
  glow: string;
};

type ClusterNode = TechItem & {
  home: THREE.Vector3;
  start: [number, number, number];
  driftPhase: number;
  spinPhase: number;
};

type InteractionState = {
  active: boolean;
  lastMove: number;
};

const techItems: TechItem[] = [
  { label: "React", kind: "react", size: 0.82, tint: "#eefaff", glow: "#62dafb" },
  { label: "TypeScript", kind: "typescript", size: 0.74, tint: "#edf5ff", glow: "#3178c6" },
  { label: "JavaScript", kind: "javascript", size: 0.69, tint: "#fff8dd", glow: "#f7df1e" },
  { label: "Node.js", kind: "node", size: 0.77, tint: "#f0ffe8", glow: "#7cc84b" },
  { label: "MongoDB", kind: "mongodb", size: 0.66, tint: "#ecffef", glow: "#47a248" },
  { label: "Tailwind CSS", kind: "tailwind", size: 0.72, tint: "#eaf8ff", glow: "#38bdf8" },
  { label: "Express.js", kind: "express", size: 0.64, tint: "#f5efff", glow: "#c8b6ff" },
  { label: "GitHub", kind: "github", size: 0.7, tint: "#f6f3ff", glow: "#ffffff" },
];

const sphereGeometry = new THREE.SphereGeometry(1, 72, 72);
const pointerDepth = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function generateCluster(items: TechItem[]) {
  const random = seededRandom(8447);
  const nodes: ClusterNode[] = [];
  const maxAttempts = 90;

  items.forEach((item, index) => {
    let home = new THREE.Vector3();

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const angle = random() * Math.PI * 2;
      const radius = 0.12 + Math.sqrt(random()) * 1.42;
      const verticalCompression = 0.78 + random() * 0.18;
      const candidate = new THREE.Vector3(
        Math.cos(angle) * radius + (random() - 0.5) * 0.28,
        Math.sin(angle) * radius * verticalCompression + (random() - 0.5) * 0.24,
        (random() - 0.5) * 1.42
      );

      const nearestGap = nodes.reduce((gap, node) => {
        const distance = candidate.distanceTo(node.home);
        const softTouch = (item.size + node.size) * 0.72;
        return Math.min(gap, distance - softTouch);
      }, Number.POSITIVE_INFINITY);

      if (nearestGap > -0.18 || attempt === maxAttempts - 1) {
        home = candidate;
        break;
      }
    }

    const start = home
      .clone()
      .add(
        new THREE.Vector3(
          (random() - 0.5) * 0.72,
          (random() - 0.5) * 0.62,
          (random() - 0.5) * 0.5
        )
      );

    nodes.push({
      ...item,
      home,
      start: [start.x, start.y, start.z],
      driftPhase: random() * Math.PI * 2 + index * 0.41,
      spinPhase: random() * Math.PI * 2,
    });
  });

  const center = nodes.reduce((sum, node) => sum.add(node.home), new THREE.Vector3()).divideScalar(nodes.length);
  nodes.forEach((node) => {
    node.home.sub(center);
    node.home.multiply(new THREE.Vector3(0.98, 0.9, 1.04));
    node.start = [node.start[0] - center.x, node.start[1] - center.y, node.start[2] - center.z];
  });

  return nodes;
}

function drawCenteredText(
  ctx: CanvasRenderingContext2D,
  text: string,
  y: number,
  size: number,
  color = "#151220",
  weight = 800
) {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 256, y);
}

function createLogoTexture(kind: LogoKind, label: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, 512, 512);
  ctx.shadowColor = "rgba(255, 255, 255, 0.55)";
  ctx.shadowBlur = 18;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (kind === "react") {
    ctx.strokeStyle = "#62dafb";
    ctx.lineWidth = 18;
    [0, Math.PI / 3, -Math.PI / 3].forEach((rotation) => {
      ctx.save();
      ctx.translate(256, 226);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.ellipse(0, 0, 132, 48, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });
    ctx.fillStyle = "#62dafb";
    ctx.beginPath();
    ctx.arc(256, 226, 20, 0, Math.PI * 2);
    ctx.fill();
    drawCenteredText(ctx, label, 364, 42);
  }

  if (kind === "typescript" || kind === "javascript") {
    const isTs = kind === "typescript";
    ctx.fillStyle = isTs ? "#3178c6" : "#f7df1e";
    ctx.roundRect(142, 112, 228, 228, 38);
    ctx.fill();
    drawCenteredText(ctx, isTs ? "TS" : "JS", 252, 118, isTs ? "#ffffff" : "#151515");
    drawCenteredText(ctx, label, 386, 35);
  }

  if (kind === "node") {
    ctx.strokeStyle = "#7cc84b";
    ctx.fillStyle = "rgba(124, 200, 75, 0.14)";
    ctx.lineWidth = 18;
    ctx.beginPath();
    for (let i = 0; i < 6; i += 1) {
      const angle = Math.PI / 6 + (Math.PI * 2 * i) / 6;
      const x = 256 + Math.cos(angle) * 118;
      const y = 228 + Math.sin(angle) * 118;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    drawCenteredText(ctx, "node", 228, 60, "#7cc84b", 900);
    drawCenteredText(ctx, ".js", 292, 42, "#171220", 800);
  }

  if (kind === "mongodb") {
    ctx.fillStyle = "#47a248";
    ctx.beginPath();
    ctx.moveTo(260, 92);
    ctx.bezierCurveTo(334, 178, 330, 288, 258, 374);
    ctx.bezierCurveTo(182, 292, 184, 178, 260, 92);
    ctx.fill();
    ctx.strokeStyle = "rgba(18, 36, 19, 0.42)";
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(258, 132);
    ctx.bezierCurveTo(252, 214, 257, 290, 258, 392);
    ctx.stroke();
    drawCenteredText(ctx, label, 420, 36);
  }

  if (kind === "tailwind") {
    ctx.fillStyle = "#38bdf8";
    [226, 306].forEach((y) => {
      ctx.beginPath();
      ctx.moveTo(122, y);
      ctx.bezierCurveTo(164, y - 76, 216, y - 76, 278, y);
      ctx.bezierCurveTo(312, y + 42, 344, y + 42, 390, y);
      ctx.bezierCurveTo(348, y + 76, 296, y + 76, 234, y);
      ctx.bezierCurveTo(200, y - 42, 168, y - 42, 122, y);
      ctx.fill();
    });
    drawCenteredText(ctx, "Tailwind", 414, 36);
  }

  if (kind === "express") {
    drawCenteredText(ctx, "ex", 236, 144, "#17111f", 500);
    drawCenteredText(ctx, "Express", 370, 44);
  }

  if (kind === "github") {
    ctx.fillStyle = "#171515";
    ctx.beginPath();
    ctx.arc(256, 230, 112, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f7f2ff";
    ctx.beginPath();
    ctx.arc(256, 242, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#171515";
    ctx.beginPath();
    ctx.moveTo(184, 176);
    ctx.lineTo(222, 202);
    ctx.lineTo(196, 218);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(328, 176);
    ctx.lineTo(290, 202);
    ctx.lineTo(316, 218);
    ctx.closePath();
    ctx.fill();
    drawCenteredText(ctx, label, 396, 38);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function createSphereMaterial(item: TechItem) {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(item.tint),
    emissive: new THREE.Color(item.glow),
    emissiveIntensity: item.kind === "github" ? 0.018 : 0.04,
    metalness: 0.08,
    roughness: 0.14,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    transmission: 0.08,
    ior: 1.48,
    reflectivity: 0.52,
    sheen: 0.24,
    sheenColor: new THREE.Color(item.glow),
  });
}

type TechSphereProps = {
  node: ClusterNode;
  texture: THREE.Texture;
  material: THREE.MeshPhysicalMaterial;
  index: number;
  interactionRef: MutableRefObject<InteractionState>;
};

function TechSphere({ node, texture, material, index, interactionRef }: TechSphereProps) {
  const bodyRef = useRef<RapierRigidBody | null>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const pointerWorld = useRef(new THREE.Vector3());
  const current = useRef(new THREE.Vector3());
  const home = useRef(new THREE.Vector3());
  const spring = useRef(new THREE.Vector3());
  const repulsion = useRef(new THREE.Vector3());
  const { camera, pointer, raycaster } = useThree();

  useFrame(({ clock }, delta) => {
    const body = bodyRef.current;
    const mesh = meshRef.current;
    if (!body || !mesh) return;

    const time = clock.getElapsedTime();
    const p = body.translation();
    const v = body.linvel();
    current.current.set(p.x, p.y, p.z);

    home.current
      .copy(node.home)
      .add({
        x: Math.sin(time * 0.42 + node.driftPhase) * 0.16,
        y: Math.cos(time * 0.36 + node.driftPhase * 0.8) * 0.13,
        z: Math.sin(time * 0.3 + node.driftPhase * 1.2) * 0.1,
      });

    spring.current
      .copy(home.current)
      .sub(current.current)
      .multiplyScalar(1.18)
      .add({ x: -v.x * 0.78, y: -v.y * 0.78, z: -v.z * 0.72 });

    const pointerRecent = interactionRef.current.active && performance.now() - interactionRef.current.lastMove < 950;

    if (pointerRecent) {
      raycaster.setFromCamera(pointer, camera);
      raycaster.ray.intersectPlane(pointerDepth, pointerWorld.current);
      pointerWorld.current.z = current.current.z;

      const distance = current.current.distanceTo(pointerWorld.current);
      const radius = 2.45 + node.size * 0.3;

      if (distance < radius) {
        const influence = 1 - distance / radius;
        const softened = influence * influence * (3 - 2 * influence);
        repulsion.current
          .copy(current.current)
          .sub(pointerWorld.current)
          .normalize()
          .multiplyScalar((2.25 + node.size * 0.55) * softened);

        repulsion.current.z += Math.sin(time * 1.4 + index) * 0.24 * softened;
        spring.current.add(repulsion.current);
      }
    }

    const centerPull = current.current.clone().multiplyScalar(-0.08);
    spring.current.add(centerPull);

    body.addForce(spring.current, true);
    body.setAngvel(
      {
        x: Math.sin(time * 0.24 + node.spinPhase) * 0.14,
        y: 0.16 + Math.cos(time * 0.22 + index) * 0.08,
        z: Math.sin(time * 0.2 + node.spinPhase) * 0.1,
      },
      true
    );

    const speed = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    if (speed > 2.15) {
      body.setLinvel({ x: (v.x / speed) * 2.15, y: (v.y / speed) * 2.15, z: (v.z / speed) * 2.15 }, true);
    }

    const breath = 1 + Math.sin(time * 0.72 + node.driftPhase) * 0.012;
    mesh.scale.lerp(new THREE.Vector3(node.size * breath, node.size * breath, node.size * breath), Math.min(delta * 5, 1));
  });

  return (
    <RigidBody
      ref={bodyRef}
      colliders={false}
      position={node.start}
      linearDamping={2.35}
      angularDamping={3.2}
      friction={0.42}
      restitution={0.18}
      canSleep={false}
    >
      <BallCollider args={[node.size * 0.92]} />
      <mesh ref={meshRef} castShadow receiveShadow geometry={sphereGeometry} material={material} scale={node.size}>
        <Decal
          position={[0, 0, 0.99]}
          rotation={[0, 0, 0]}
          scale={[1.08, 1.08, 0.38]}
          map={texture}
        />
      </mesh>
    </RigidBody>
  );
}

function ClusterRig() {
  useFrame(({ camera, clock }) => {
    const time = clock.getElapsedTime();
    camera.position.x = Math.sin(time * 0.12) * 0.12;
    camera.position.y = 0.2 + Math.cos(time * 0.1) * 0.07;
    camera.lookAt(0, -0.08, 0);
  });

  return null;
}

function AmbientParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const particles = useMemo(() => {
    const random = seededRandom(2026);
    const positions = new Float32Array(120 * 3);

    for (let i = 0; i < 120; i += 1) {
      positions[i * 3] = (random() - 0.5) * 8.4;
      positions[i * 3 + 1] = (random() - 0.5) * 4.8;
      positions[i * 3 + 2] = (random() - 0.5) * 4.2 - 0.7;
    }

    return positions;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const time = clock.getElapsedTime();
    pointsRef.current.rotation.y = Math.sin(time * 0.08) * 0.08;
    pointsRef.current.rotation.x = Math.cos(time * 0.07) * 0.035;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particles.length / 3} array={particles} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        color="#c8b6ff"
        transparent
        opacity={0.42}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

const TechStack = () => {
  const interactionRef = useRef<InteractionState>({ active: false, lastMove: 0 });
  const nodes = useMemo(() => generateCluster(techItems), []);
  const logoTextures = useMemo(() => nodes.map((node) => createLogoTexture(node.kind, node.label)), [nodes]);
  const sphereMaterials = useMemo(() => nodes.map(createSphereMaterial), [nodes]);

  return (
    <section className="techstack" aria-labelledby="techstack-title">
      <div className="techstack-bg-glow"></div>
      <div className="techstack-depth techstack-depth-one"></div>
      <div className="techstack-depth techstack-depth-two"></div>
      <div className="techstack-copy">
        
        <h2 id="techstack-title"> Tech Stack</h2>
       
      </div>

      <Canvas
        shadows
        dpr={[1, 1.65]}
        gl={{ alpha: false, stencil: false, depth: true, antialias: true }}
        camera={{ position: [0, 0.2, 7.45], fov: 33, near: 0.1, far: 80 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.88;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.setClearColor("#06050d", 1);
        }}
        className="tech-canvas"
        onPointerMove={() => {
          interactionRef.current.active = true;
          interactionRef.current.lastMove = performance.now();
        }}
        onPointerEnter={() => {
          interactionRef.current.active = true;
          interactionRef.current.lastMove = performance.now();
        }}
        onPointerLeave={() => {
          interactionRef.current.active = false;
        }}
      >
        <color attach="background" args={["#06050d"]} />
        <fog attach="fog" args={["#06050d", 4.8, 13]} />
        <ambientLight intensity={0.2} />
        <hemisphereLight args={["#bca6ff", "#05040a", 0.42]} />
        <directionalLight position={[-4.5, 4.4, 5.8]} intensity={0.48} color="#d8caff" />
        <spotLight
          position={[5.6, 6.8, 6.4]}
          penumbra={0.88}
          angle={0.36}
          color="#dac7ff"
          intensity={2.15}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-3.6, -1.6, 3.2]} intensity={3.7} color="#865cff" />
        <pointLight position={[3.2, 1.3, 2.6]} intensity={1.55} color="#cbb8ff" />
        <Environment preset="city" />
        <ClusterRig />
        <AmbientParticles />

        <Physics gravity={[0, 0, 0]} timeStep={1 / 60} interpolate>
          {nodes.map((node, index) => (
            <TechSphere
              key={node.kind}
              node={node}
              texture={logoTextures[index]}
              material={sphereMaterials[index]}
              index={index}
              interactionRef={interactionRef}
            />
          ))}
        </Physics>

        <ContactShadows
          position={[0, -2.02, -0.45]}
          opacity={0.34}
          scale={5.6}
          blur={3.2}
          far={3.2}
          color="#2b124d"
        />
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.22} luminanceThreshold={0.62} luminanceSmoothing={0.32} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </section>
  );
};

export default TechStack;
