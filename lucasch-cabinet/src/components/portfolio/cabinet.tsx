import { motion } from "motion/react";
import File from "./file";
import cabinetLayout from "./cabinet-layout";

const Cabinet = () => {
    return (
        <>
            <motion.div className="flex flex-col items-center space-y-[-380px] px-16 [clip-path:inset(-1000px_0_360px_0)] md:pt-[30vh]">
                {cabinetLayout.map((file, i) => (
                    <File
                        key={i}
                        title={file.title}
                        tabLocation={file.tabLocation}
                        isDivider={file.isDivider}
                        index={i}
                    >
                        {file.content}
                    </File>
                ))}
            </motion.div>
            <div className="absolute bottom-0">
                <div className="relative mb-[240px] flex h-[120px] w-[930px] justify-center">
                    {/* The 3 Outline Vectors */}
                    <div className="absolute -top-[290px] left-[67px] -z-10">
                        <div className="bg-primary h-[1.5px] w-[290px] origin-top-left rotate-[92.5deg]"></div>
                    </div>
                    <div className="absolute right-[53px] -z-10">
                        <div className="bg-primary h-[1.5px] w-[290px] origin-top-right rotate-[87.5deg]"></div>
                    </div>
                    <div className="absolute -top-[290px] right-[66px] -z-10">
                        <div className="bg-primary h-[1.5px] w-[797px]"></div>
                    </div>

                    {/* Gradient Fill Isometric Trapezoid */}
                    <div
                        className="absolute top-0 left-[36px] -z-20 h-[400px] w-[858px]"
                        style={{ filter: "drop-shadow(0px 25px 40px rgba(0,0,0,0.25))" }}
                    >
                        <div
                            className="h-full w-full bg-gradient-to-b from-[#443b3a] to-[#7b7170]"
                            style={{ clipPath: "polygon(2.1% 0%, 97.9% 0%, 100% 100%, 0% 100%)" }}
                        ></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cabinet;
