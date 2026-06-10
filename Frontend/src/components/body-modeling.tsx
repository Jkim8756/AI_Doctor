import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useState } from "react";

type BodyModelViewerProps = {
    onSelectBodyPart: (bodyPart: string) => void;
}

type HitzoneProps = {
    zone: (typeof mapping)[number];
    onSelectBodyPart: (bodyPart: string) => void;
}

function Hitzone({ zone, onSelectBodyPart }: HitzoneProps) {
    const rotation = "rotation" in zone ? zone.rotation : [0, 0, 0] as const;
    const [opacityState, setOpacity] = useState(0) 

    function handlePointerOver() {
        if (typeof document !== "undefined") {
            document.body.style.cursor = "pointer";
            setOpacity(0.25)
        }
    }

    function handlePointerOut() {
        if (typeof document !== "undefined") {
            document.body.style.cursor = "default";
            setOpacity(0)
        }
    }

    return (
        <mesh
            visible={true}
            name={zone.id}
            position={zone.position}
            rotation={rotation}
            scale={zone.scale}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onClick={() => onSelectBodyPart(zone.label)}
        >
            <sphereGeometry args={zone.args} />
            <meshBasicMaterial color="red" transparent opacity={opacityState} />
        </mesh>
    )
}

function HumanBodyModel({ onSelectBodyPart }: BodyModelViewerProps) {
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

export default function BodyModelViewer({ onSelectBodyPart }: BodyModelViewerProps) {
    return (
        <Canvas style={{ flex: 1 }} camera={{ position: [0, 1.5, 4], fov: 45 }}>
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
        args: [0.6, 16, 16],
    },
    {
        id: "chest",
        label: "Chest",
        shape: "sphere",
        position: [0, 0.65, 0.2],
        scale: [0.35, 0.35, 0.35],
        args: [0.8, 16, 16],
    },
    {
        id: "torso",
        label: "Torso",
        shape: "sphere",
        position: [0, 0.15, 0.2],
        scale: [0.35, 0.35, 0.35],
        args: [0.8, 16, 16],
    },
    {
        id: "leftarm",
        label: "Left arm",
        shape: "box",
        position: [-0.65, 0.25, 0.2],
        rotation: [1.2, 1, -1.2],
        scale: [0.35, 1.4, 0.35],
        args: [0.65, 1.25, 0.45],
    },
    {
        id: "rightarm",
        label: "Right arm",
        shape: "box",
        position: [0.65, 0.25, 0.2],
        rotation: [1.2, -1, 1.2],
        scale: [0.35, 1.4, 0.35],
        args: [0.65, 1.25, 0.45],
    },
    {
        id: "leftleg",
        label: "Left leg",
        shape: "box",
        position: [-0.25, -0.75, 0.2],
        rotation: [0, 0, 0.06],
        scale: [0.38, 1.55, 0.36],
        args: [0.75, 1.45, 0.45],
    },
    {
        id: "rightleg",
        label: "Right leg",
        shape: "box",
        position: [0.25, -0.75, 0.2],
        rotation: [0, 0, -0.06],
        scale: [0.38, 1.55, 0.36],
        args: [0.75, 1.45, 0.45],
    },
] as const //don't modify this area. 
