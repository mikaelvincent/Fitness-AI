import { Button } from "@/components/ui/button";
import WordPullUp from "@/components/ui/word-pull-up";
import { ArrowRightIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { MdTrackChanges } from "react-icons/md";
import { GiInspiration, GiFist } from "react-icons/gi";
import { ContainerScroll } from "@/components/ui/container-scroll";
import { ImageLink } from "@/components/ui/image-links";
import { LuSwords } from "react-icons/lu";
import no_text from "@/assets/images/no_text.svg";
import chat_img from "@/assets/images/chat_img.png";
import tj from "@/assets/images/tj.png";
import jericho from "@/assets/images/jericho.png";
import mikael from "@/assets/images/mikael.png";
const LandingPage: React.FC = () => {
    return (
        <div className="w-full flex flex-col pt-24 bg-outerCard gap-10">
            <img src={no_text} className="w-[1000px] h-[1000px] text-lightYellow fixed -z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5" />
            <section className="z-50 flex flex-col lg:flex-row items-center justify-center lg:items-start gap-5 lg:px-10 px-5">
                <div className="py-5 lg:px-8 sm:px-6 px-6 rounded-2xl ">
                    <section className="font-medium w-full max-w-lg md:max-w-2xl text-lightYellow flex flex-col gap-6">
                        <WordPullUp
                            className="text-center xl:text-6xl lg:text-5xl sm:text-4xl text-4xl font-medium tracking-[-0.02em] md:text-6xl md:leading-[4rem]"
                            words="Transform Your Fitness Journey with GymGenie"
                        />
                        <p className="lg:leading-[2rem] sm:leading-[1.5rem] leading-[1.5rem] lg:text-md sm:text-sm text-sm text-center">
                            GymGenie is your AI-powered fitness assistant that helps you achieve your goals effortlessly. Create personalized workout plans, track progress, and stay motivated—whether you're a beginner or a pro. Let GymGenie make fitness easy, effective, and tailored for you.
                        </p>

                        <Link to="/login" className="flex justify-center">
                            <Button
                                variant="outline"
                                size="lg"
                                className="lg:py-6 sm:py-4 py-4 px-8 rounded-md border-lightYellow hover:bg-lightYellow hover:text-outerCard"
                            >
                                Get Started
                                <ArrowRightIcon className="w-4 h-4" />
                            </Button>
                        </Link>
                    </section>
                </div>
            </section>

            <section className="z-50 xl:rounded-md md:h-[450px] w-full bg-lightYellow dark:bg-dot-white/[0.2] bg-dot-black/[0.2] mx-auto py-10 mt-20 lg:mb-20 shadow-[4px_4px_0px_black] shadow-black">
                <h1 className="text-center font-bold tracking-widest text-outerCard text-xl">REACH YOUR FITNESS GOALS</h1>
                <div className="w-full grid grid-cols-1 grid-rows-3 md:grid-cols-3 md:grid-rows-1 p-5 gap-5 md:gap-8 lg:gap-10">
                    <div className="flex flex-col transition-all duration-300 hover:scale-[1.05] justify-center gap-5 items-center py-0">
                        <MdTrackChanges className="h-32 w-32 flex-shrink-0 text-outerCard" />
                        <section className="space-y-3">
                            <h2 className="text-3xl font-medium text-center text-outerCard">Track Your Workouts</h2>
                            <p className="text-base text-center font-normal text-outerCard max-w-64 md:max-w-xs">
                                Stay on top of your fitness progress with detailed tracking of your workouts and achievements.
                            </p>
                        </section>
                    </div>
                    <div className="flex flex-col transition-all duration-300 hover:scale-[1.05] justify-center gap-5 items-center py-5">
                        <GiInspiration className="h-32 w-32 flex-shrink-0 text-outerCard" />
                        <section className="space-y-3">
                            <h2 className="text-3xl font-medium text-center text-outerCard">Stay Motivated</h2>
                            <p className="text-base text-center font-normal text-outerCard max-w-64 md:max-w-xs">
                                AI-powered plans and real-time updates keep you inspired and pushing toward your goals.
                            </p>
                        </section>
                    </div>
                    <div className="flex flex-col transition-all duration-300 hover:scale-[1.05] justify-center gap-5 items-center py-5">
                        <GiFist className="h-32 w-32 flex-shrink-0 text-outerCard" />
                        <section className="space-y-3">
                            <h2 className="text-3xl font-medium text-center text-outerCard">Build Strength & Consistency</h2>
                            <p className="text-base text-center font-normal text-outerCard max-w-64 md:max-w-xs">
                                Develop healthy workout habits and routines that stick—no matter your fitness level.
                            </p>
                        </section>
                    </div>
                </div>
            </section>

            <ContainerScroll
                titleComponent={
                    <>
                        <h1 className="text-2xl md:text-4xl font-medium text-lightYellow">
                            Your Personalized Trainer<br />
                            <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                                Chat with GymGenie
                            </span>
                        </h1>
                    </>
                }
            >
                <img
                    src={chat_img}
                    alt="GymGenie Dashboard"
                    className="mx-auto rounded-2xl object-cover h-full"
                    draggable={false}
                />
            </ContainerScroll>

            <section className="bg-lightYellow p-4 md:px-8 md:py-16 h-[900px] w-full mx-auto rounded-[4rem] relative">
                <div className="py-12">
                    <LuSwords className="w-28 h-28 mx-auto text-outerCard" />
                    <h1 className="text-5xl md:text-6xl lg:text-7xl text-outerCard text-center font-bold">
                        Meet the Team
                    </h1>
                </div>
                <div className="mx-auto max-w-5xl">
                    <ImageLink
                        heading="T-jay Abunales"
                        subheading="Fullstack Developer"
                        imgSrc={tj}
                        href="https://github.com/Yaj-t"
                    />
                    <ImageLink
                        heading="Jericho Pasco"
                        subheading="Fullstack Developer"
                        imgSrc={jericho}
                        href="https://github.com/Jpasco31"
                    />
                    <ImageLink
                        heading="Mikael Tumampos"
                        subheading="Fullstack Developer"
                        imgSrc={mikael}
                        href="https://github.com/mikaelvincent"
                    />
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
