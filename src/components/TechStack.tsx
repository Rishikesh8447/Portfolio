import * as THREE from "three";
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { BallCollider, Physics, RigidBody, RapierRigidBody } from "@react-three/rapier";

const textureLoader = new THREE.TextureLoader();

const imageTech = [
  { label: "React", url: "/images/react2.webp" },
  { label: "TypeScript", url: "/images/typescript.webp" },
  { label: "Node.js", url: "/images/node2.webp" },
  { label: "Express.js", url: "/images/express.webp" },
  { label: "MongoDB", url: "/images/mongo.webp" },
  { label: "JavaScript", url: "/images/javascript.webp" },
];

const textTech = ["Socket.io", "Tailwind CSS", "GitHub", "REST APIs"];
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

const spheres = [...Array(22)].map((_, index) => ({
  textureIndex: index % (imageTech.length + textTech.length),
  scale: [0.44, 0.5, 0.54, 0.58, 0.62][index % 5],
}));

function createTextTexture(label: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(256, 220, 10, 256, 256, 255);
  gradient.addColorStop(0, "#ffffff");
  gradient.addColorStop(0.52, "#c2a4ff");
  gradient.addColorStop(1, "#6f35ff");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);
  ctx.fillStyle = "#100817";
  ctx.font = "700 54px Geist, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const words = label.split(" ");
  if (words.length > 1) {
    ctx.fillText(words[0], 256, 224, 360);
    ctx.fillText(words.slice(1).join(" "), 256, 292, 360);
  } else {
    ctx.fillText(label, 256, 256, 380);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

type TechSphereProps = {
  material: THREE.MeshPhysicalMaterial;
  scale: number;
  index: number;
  vec?: THREE.Vector3;
};

function TechSphere({ material, scale, index, vec = new THREE.Vector3() }: TechSphereProps) {
  const api = useRef<RapierRigidBody | null>(null);
  const start = useMemo<[number, number, number]>(
    () => [
      THREE.MathUtils.randFloatSpread(9),
      THREE.MathUtils.randFloatSpread(3.1) - 2.4,
      THREE.MathUtils.randFloatSpread(5) - 2,
    ],
    []
  );

  useFrame(({ clock }, delta) => {
    const body = api.current;
    if (!body) return;
    const time = clock.getElapsedTime();
    const current = body.translation();
    vec
      .set(
        Math.sin(time * 0.45 + index) * 0.8 - current.x * 0.16,
        Math.cos(time * 0.5 + index * 0.7) * 0.5 - (current.y + 1.75) * 0.13,
        -current.z * 0.08
      )
      .multiplyScalar(Math.min(delta, 0.08) * scale);
    body.applyImpulse(vec, true);
  });

  return (
    <RigidBody
      linearDamping={1.55}
      angularDamping={0.75}
      friction={0.45}
      restitution={0.28}
      position={start}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <mesh castShadow receiveShadow scale={scale} geometry={sphereGeometry} material={material} />
    </RigidBody>
  );
}

function Pointer({ vec = new THREE.Vector3() }: { vec?: THREE.Vector3 }) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2 - 1.25,
        0
      ),
      0.16
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody position={[100, 100, 100]} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[1.35]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const materials = useMemo(() => {
    const imageTextures = imageTech.map((tech) => textureLoader.load(tech.url));
    const textTextures = textTech.map(createTextTexture);
    return [...imageTextures, ...textTextures].map(
      (texture) =>
        new THREE.MeshPhysicalMaterial({
          map: texture,
          emissive: "#ffffff",
          emissiveMap: texture,
          emissiveIntensity: 0.22,
          metalness: 0.38,
          roughness: 0.48,
          clearcoat: 0.34,
          transparent: true,
          opacity: 0.9,
        })
    );
  }, []);

  return (
    <section className="techstack">
      <div className="techstack-bg-glow"></div>
      <div className="techstack-copy">
        <p>Technologies</p>
        <h2>TECH STACK</h2>
        <span>Technologies I use to build scalable and modern web applications.</span>
      </div>

      <Canvas
        shadows
        gl={{ alpha: true, stencil: false, depth: true, antialias: true }}
        camera={{ position: [0, 0, 11], fov: 34, near: 0.1, far: 100 }}
        onCreated={(state) => (state.gl.toneMappingExposure = 1.35)}
        className="tech-canvas"
      >
        <ambientLight intensity={1.15} />
        <spotLight
          position={[18, 20, 22]}
          penumbra={1}
          angle={0.28}
          color="#f2e8ff"
          intensity={2.2}
          castShadow
          shadow-mapSize={[512, 512]}
        />
        <pointLight position={[0, -1.5, 5]} intensity={10} color="#8f77ff" />
        <Physics gravity={[0, 0, 0]}>
          <Pointer />
          {spheres.map((sphere, index) => (
            <TechSphere
              key={`${sphere.textureIndex}-${index}`}
              index={index}
              scale={sphere.scale}
              material={materials[sphere.textureIndex]}
            />
          ))}
        </Physics>
        <Environment files="/models/char_enviorment.hdr" environmentIntensity={0.46} />
      </Canvas>
    </section>
  );
};

export default TechStack;
