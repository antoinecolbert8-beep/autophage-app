"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Line } from "@react-three/drei";
import * as THREE from "three";

function Network({ count = 100 }) {
    const pointsRef = useRef<THREE.Points>(null!);

    // Generate random points in a sphere
    const { particles, linePoints } = useMemo(() => {
        const p = new Float32Array(count * 3);
        const lineCoords: [number, number, number][] = [];

        for (let i = 0; i < count; i++) {
            const theta = (Math.random() * 2 - 1) * Math.PI;
            const phi = (Math.random() * 2 - 1) * Math.PI;
            const r = 2 + Math.random() * 0.5;

            p[i * 3] = Math.sin(theta) * Math.cos(phi) * r;
            p[i * 3 + 1] = Math.sin(theta) * Math.sin(phi) * r;
            p[i * 3 + 2] = Math.cos(theta) * r;
        }

        // Connect random pairs
        for (let i = 0; i < count; i++) {
            if (Math.random() > 0.85) {
                const target = Math.floor(Math.random() * count);
                lineCoords.push(
                    [p[i * 3], p[i * 3 + 1], p[i * 3 + 2]],
                    [p[target * 3], p[target * 3 + 1], p[target * 3 + 2]]
                );
            }
        }

        return { particles: p, linePoints: lineCoords };
    }, [count]);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (pointsRef.current) {
            pointsRef.current.rotation.x = t * 0.05;
            pointsRef.current.rotation.y = t * 0.08;
            const scale = 1 + Math.sin(t * 1.5) * 0.02;
            pointsRef.current.scale.set(scale, scale, scale);
        }
    });

    // Group line pairs into segments
    const lineSegments = useMemo(() => {
        const segments: [[number, number, number], [number, number, number]][] = [];
        for (let i = 0; i < linePoints.length - 1; i += 2) {
            segments.push([linePoints[i], linePoints[i + 1]]);
        }
        return segments;
    }, [linePoints]);

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={pointsRef} positions={particles} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#66fcf1"
                    size={0.08}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.6}
                />
            </Points>
            {lineSegments.map((seg, i) => (
                <Line
                    key={i}
                    points={seg}
                    color="#66fcf1"
                    lineWidth={0.3}
                    transparent
                    opacity={0.1}
                />
            ))}
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
