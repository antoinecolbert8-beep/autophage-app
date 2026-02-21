"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";

interface BlurFadeProps {
    children: React.ReactNode;
    className?: string;
    duration?: number;
    delay?: number;
    yOffset?: number;
    blur?: string;
    inView?: boolean;
}

export default function BlurFade({
    children,
    className,
    duration = 0.6,
    delay = 0,
    yOffset = 6,
    blur = "10px",
    inView = true,
}: BlurFadeProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "0px" });
    const shouldAnimate = inView ? isInView : true;

    const variants: Variants = {
        hidden: {
            y: yOffset,
            opacity: 0,
            filter: `blur(${blur})`
        },
        visible: {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: {
                duration: duration,
                ease: [0.25, 0.4, 0.25, 1], // Cubic-bezier for 'circOut' feel
                delay: delay
            }
        },
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={shouldAnimate ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true }}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
}
