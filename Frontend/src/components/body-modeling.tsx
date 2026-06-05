import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense } from "react";





type bodyprops = {
    zone: (typeof mapping)[number];
    onSelectBodyPart: (bodyPart: string) => void;
}

function Hitzone({ zone, onSelectBodyPart }: bodyprops) {
    return (
        <mesh
            visible={true}
            name={zone.id}
            position={zone.position}
            scale={zone.scale}
            onClick={() => onSelectBodyPart(zone.label)}
        >
            <sphereGeometry args={zone.args} />
            <meshBasicMaterial color="red" transparent opacity={0.25} />
        </mesh>
    )
}



function HumanBodyModel({ onSelectBodyPart }: bodyprops) {
    const gltf = useGLTF("/models/anny_default_body.glb");

    return (
        <>
            <primitive object={gltf.scene} scale={1.8} />;
            {mapping.map((zone) =>
                <Hitzone
                    key={zone.id}
                    zone={zone}
                    onSelectBodyPart={onSelectBodyPart} />
            )}
        </>
    )
}

export default function BodyModelViewer({ onSelectBodyPart }: bodyprops) {
    return (
        <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
            <ambientLight intensity={1} />
            <directionalLight position={[2, 4, 3]} intensity={2} />

            <Suspense fallback={null}>
                <HumanBodyModel onSelectBodyPart={onSelectBodyPart} />
            </Suspense>

            <OrbitControls enablePan={false} />
        </Canvas>
    );
}


const mapping = [
    {
        id: "head",
        label: "Head",
        shape: "sphere",
        position: [0, 1.2, 0.2],
        scale: [0.35, 0.35, 0.35],
        args: [0.7, 16, 16],
    },
    {
        id: "chest",
        label: "Chest",
        shape: "sphere",
        position: [0, 0.35, 0.2],
        scale: [0.8, 1, 0.35],
        args: [0.8, 0.65, 0.5],
    },
    {
        id: "torso",
        label: "Torso",
        shape: "box",
        position: [0, -0.35, 0.2],
        scale: [0.85, 1.05, 0.4],
        args: [0.85, 0.8, 0.5],
    },
    {
        id: "leftarm",
        label: "Left arm",
        shape: "box",
        position: [-0.75, 0.05, 0.2],
        rotation: [0, 0, -0.18],
        scale: [0.35, 1.4, 0.35],
        args: [0.45, 1.25, 0.45],
    },
    {
        id: "rightarm",
        label: "Right arm",
        shape: "box",
        position: [0.75, 0.05, 0.2],
        rotation: [0, 0, 0.18],
        scale: [0.35, 1.4, 0.35],
        args: [0.45, 1.25, 0.45],
    },
    {
        id: "leftleg",
        label: "Left leg",
        shape: "box",
        position: [-0.28, -1.25, 0.2],
        rotation: [0, 0, 0.06],
        scale: [0.38, 1.55, 0.36],
        args: [0.45, 1.45, 0.45],
    },
    {
        id: "rightleg",
        label: "Right leg",
        shape: "box",
        position: [0.28, -1.25, 0.2],
        rotation: [0, 0, -0.06],
        scale: [0.38, 1.55, 0.36],
        args: [0.45, 1.45, 0.45],
    },
] as const //don't modify this area. 
