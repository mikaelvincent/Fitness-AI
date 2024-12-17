import { useMotionValue, motion, useSpring, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { FiArrowRight } from "react-icons/fi";

interface LinkProps {
    heading: string;
    imgSrc: string;
    subheading: string;
    href: string;
}

export const ImageLink = ({ heading, imgSrc, subheading, href }: LinkProps) => {
    const ref = useRef<HTMLAnchorElement | null>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const top = useTransform(mouseYSpring, [0.5, -0.5], ["40%", "60%"]);
    const left = useTransform(mouseXSpring, [0.5, -0.5], ["60%", "70%"]);

    const handleMouseMove = (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
        const rect = ref.current!.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    return (
        <motion.a
            href={href}
            target="_blank"
            ref={ref}
            onMouseMove={handleMouseMove}
            initial="initial"
            whileHover="whileHover"
            className="group relative w-full flex items-center justify-between border-b-2 border-neutral-700 py-4 transition-colors duration-500 hover:border-[#cae0ab] md:py-8 mt-12 first:mt-0 hover:dark:bg-dot-white/[0.2] hover:bg-dot-black/[0.5] bg-opacity-0 hover:bg-opacity-100"
        >
            <div>
                <motion.span
                    variants={{
                        initial: { x: 0 },
                        whileHover: { x: -16 },
                    }}
                    transition={{
                        type: "spring",
                        staggerChildren: 0.075,
                        delayChildren: 0.25,
                    }}
                    className="relative z-10 block text-4xl font-bold text-outerCard transition-colors duration-500 group-hover:text-mossGreen md:text-6xl"
                >
                    {heading.split(" ").map((l, i) => (
                        <motion.span
                            variants={{
                                initial: { x: 0 },
                                whileHover: { x: 16 },
                            }}
                            transition={{ type: "spring" }}
                            className="inline-block mr-2"
                            key={i}
                        >
                            {l}
                        </motion.span>
                    ))}
                </motion.span>
                <span className="relative z-10 mt-2 block text-base text-outerCard transition-colors duration-500 group-hover:text-mossGreen">
                    {subheading}
                </span>
            </div>

            <motion.img
                style={{
                    top,
                    left,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                variants={{
                    initial: { scale: 0, rotate: "-12.5deg" },
                    whileHover: { scale: 1, rotate: "12.5deg" },
                }}
                transition={{ type: "spring" }}
                src={imgSrc}
                className="hidden sm:block absolute z-10 h-24 w-32 rounded-lg object-cover md:h-48 md:w-64"
                alt={`Image representing a link for ${heading}`}
            />
            <img
                src={imgSrc}
                className="relative sm:hidden z-0 top-0 right-0 w-20 h-20 object-cover rounded-full p-1 border-4 border-black group-hover:scale-[1.05] transition-all duration-300 group-hover:-translate-y-1"
                alt={`Image representing a link for ${heading}`}
            />

            <motion.div
                variants={{
                    initial: {
                        x: "25%",
                        opacity: 0,
                    },
                    whileHover: {
                        x: "0%",
                        opacity: 1,
                    },
                }}
                transition={{ type: "spring" }}
                className="hidden sm:block relative z-10 p-4"
            >
                <FiArrowRight className="text-5xl text-lightYellow bg-outerCard rounded-full" />
            </motion.div>
        </motion.a>
    );
};