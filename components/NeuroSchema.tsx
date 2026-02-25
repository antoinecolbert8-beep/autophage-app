"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function Network({ count = 100 }) {
    const points = useRef<THREE.Points>(null!);
    const linesGeometry = useRef<THREE.BufferGeometry>(null!);

    // Generate random points in a sphere
    const { particles, lines } = useMemo(() => {
        const p = new Float32Array(count * 3);
        const l = [];
        for (let i = 0; i < count; i++) {
            const theta = THREE.MathUtils.randFloatSpread(360);
            const phi = THREE.MathUtils.randFloatSpread(360);
            const r = 2 + Math.random() * 0.5;

            p[i * 3] = Math.sin(theta) * Math.cos(phi) * r;
            p[i * 3 + 1] = Math.sin(theta) * Math.sin(phi) * r;
            p[i * 3 + 2] = Math.cos(theta) * r;
        }

        // Connect random pairs
        for (let i = 0; i < count; i++) {
            if (Math.random() > 0.7) {
                const target = Math.floor(Math.random() * count);
                l.push(p[i * 3], p[i * 3 + 1], p[i * 3 + 2]);
                l.push(p[target * 3], p[target * 3 + 1], p[target * 3 + 2]);
            }
        }
        return { particles: p, lines: new Float32Array(l) };
    }, [count]);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (points.current) {
            points.current.rotation.x = t * 0.05;
            points.current.rotation.y = t * 0.08;
            const scale = 1 + Math.sin(t * 1.5) * 0.02;
            points.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={points} positions={particles} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#66fcf1"
                    size={0.08}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.6}
                />
            </Points>
            <lineSegments>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={lines.length / 3}
                        array={lines}
                        itemSize={3}
                    />
                </bufferGeometry>
                <lineBasicMaterial color="#66fcf1" transparent opacity={0.1} />
            </lineSegments>
        </group>
    );
}

export default function NeuroSchema() {
    return (
        <div className="w-full h-full min-h-[300px] absolute inset-0 pointer-events-none opacity-40">
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-blue-500/20 text-xs">Initialisation du Cortex...</div>}>
                <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                    <fog attach="fog" args={["#000", 5, 15]} />
                    <Network />
                </Canvas>
            </Suspense>
        </div>
    );
}
