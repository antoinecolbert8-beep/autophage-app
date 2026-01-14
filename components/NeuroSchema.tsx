"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function Network({ count = 100 }) {
    const points = useRef<THREE.Points>(null!);
    const linesGeometry = useRef<THREE.BufferGeometry>(null!);

    // Generate random points in a sphere
    const particles = useMemo(() => {
        const temp = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const theta = THREE.MathUtils.randFloatSpread(360);
            const phi = THREE.MathUtils.randFloatSpread(360);

            // Sphere distribution
            const x = Math.sin(theta) * Math.cos(phi) * 2;
            const y = Math.sin(theta) * Math.sin(phi) * 2;
            const z = Math.cos(theta) * 2;

            temp[i * 3] = x;
            temp[i * 3 + 1] = y;
            temp[i * 3 + 2] = z;
        }
        return temp;
    }, [count]);

    // Connect close points
    const connections = useMemo(() => {
        // This is a simplified static connection for performance
        // Real-time dynamic connections are CPU heavy for JS
        return particles;
    }, [particles]);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // Breathing rotation
        if (points.current) {
            points.current.rotation.x = t * 0.05;
            points.current.rotation.y = t * 0.03;

            // Breathing scale (Pulsation)
            const scale = 1 + Math.sin(t * 1.5) * 0.05;
            points.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={points} positions={particles} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#3b82f6" // Blue-500
                    size={0.05}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.8}
                />
            </Points>
        </group>
    );
}

export default function NeuroSchema() {
    return (
        <div className="w-full h-full min-h-[300px] absolute inset-0 pointer-events-none opacity-40">
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                <fog attach="fog" args={["#000", 5, 15]} />
                <Network />
            </Canvas>
        </div>
    );
}
