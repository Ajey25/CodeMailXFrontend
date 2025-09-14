import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import { motion } from "framer-motion";
import ScrollFade from "../components/ScrollFade";
import RippleGrid from "./RippleGrid"; // untouched
import { Link } from "react-router-dom";
import template from "../assets/image.png";
import logo from "../assets/unnamed (1).png";
// React Icons
import {
  FaChartBar,
  FaUsers,
  FaPencilRuler,
  FaRocket,
  FaLock,
  FaBullseye,
} from "react-icons/fa";

function MailBotModel() {
  const group = useRef();
  const { scene, animations } = useGLTF("/models/Google G.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    Object.values(actions).forEach((action) => {
      // action.stop();
    });
  }, [actions]);

  useFrame(() => {
    if (group.current) group.current.rotation.y += 0.005;
  });

  return (
    <group ref={group} dispose={null}>
      <primitive
        object={scene}
        scale={[5, 5, 5]}
        position={[0, 0, 0]}
        rotation={[0, Math.PI, 0]}
      />
    </group>
  );
}

const Hero = () => {
  return (
    <div className="relative w-full pt-20 md:pt-0 bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      {/* RippleGrid Background */}
      <div className="absolute inset-0 z-0 h-[100vh] w-full">
        <RippleGrid
          enableRainbow={true}
          gridColor="#333"
          rippleIntensity={0.03}
          gridSize={20}
          gridThickness={20}
          mouseInteraction={true}
          mouseInteractionRadius={1.2}
          opacity={0.9}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 gap-12 min-h-[calc(100vh-80px)] md:pt-12">
          {/* Left Text */}
          <ScrollFade
            direction="left"
            className="w-full md:w-1/2 text-center md:text-left"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-4 leading-tight animate-gradient bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 text-transparent bg-clip-text">
              Unleash Your Outreach with <br />
              <span className="text-cyan-400">ColdMailX</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-xl mx-auto md:mx-0">
              AI-powered platform for automated, personalized, high-converting
              cold email campaigns.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 sm:gap-6">
              <Link to="/signup">
                <button className="px-6 py-3 sm:px-8 sm:py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  Start Free Today
                </button>
              </Link>
            </div>
          </ScrollFade>

          {/* Right 3D Model */}
          <motion.div
            className="w-full md:w-1/2 h-[60vh] sm:h-[70vh] md:h-[90vh] flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
              <ambientLight intensity={0.8} />
              <directionalLight position={[5, 5, 5]} intensity={1.8} />
              <MailBotModel />
              <OrbitControls autoRotate enableZoom={false} enablePan={false} />
            </Canvas>
          </motion.div>
        </div>

        {/* Attribution */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 text-center z-20 hidden">
          3D Model: "Google G" by Jarlan Perez [CC-BY] via{" "}
          <a
            href="https://poly.pizza/m/4RKKC0BC4gb"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-cyan-400 transition-colors duration-300"
          >
            Poly Pizza
          </a>
        </div>

        {/* Features */}
        <section
          id="features"
          className="py-10 px-6 md:px-20 bg-gray-970 text-white"
        >
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Powerful Features to Ignite Your Campaigns
            </h2>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {[
                {
                  icon: FaChartBar,
                  title: "Intelligent Dashboard",
                  desc: "Track opens, clicks, and replies in real-time.",
                },
                {
                  icon: FaUsers,
                  title: "HR List Management",
                  desc: "Build/manage user-specific HR lists or contribute to global database.",
                },
                {
                  icon: FaPencilRuler,
                  title: "AI Template Generator",
                  desc: "Generate high-converting email templates using AI.",
                },
                {
                  icon: FaRocket,
                  title: "Effortless Campaign Creation",
                  desc: "Design and launch targeted campaigns with ease.",
                },
                {
                  icon: FaLock,
                  title: "Secure Mail Keys",
                  desc: "Safely integrate Google app password, encrypted.",
                },
                {
                  icon: FaBullseye,
                  title: "Targeted Personalization",
                  desc: "Craft deeply personalized messages for higher replies.",
                },
              ].map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <ScrollFade direction="up" delay={idx * 0.1} key={idx}>
                    <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-700 hover:border-cyan-500 transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full">
                      <Icon className="text-4xl sm:text-5xl mb-4 mx-auto text-cyan-400" />
                      <h3 className="font-bold text-xl sm:text-2xl mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300 text-base sm:text-lg mt-auto">
                        {feature.desc}
                      </p>
                    </div>
                  </ScrollFade>
                );
              })}
            </div>
          </div>
        </section>

        {/* AI Template Section */}
        <section
          id="templates"
          className="py-10 px-6 md:px-20 bg-gray-950 bg-opacity-90 text-white"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
            <ScrollFade direction="left" className="md:w-1/2">
              <img
                src={template}
                alt="AI Template Generator"
                className="rounded-3xl shadow-2xl border-2 border-cyan-700 transform hover:scale-102 transition-transform duration-500 w-full"
              />
            </ScrollFade>
            <ScrollFade
              direction="right"
              className="md:w-1/2 text-center md:text-left"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text">
                Craft Perfect Emails, Instantly.
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                Never stare at a blank page. Our AI Template Generator empowers
                you to create compelling cold emails in seconds, tailored to any
                industry or purpose.
              </p>
            </ScrollFade>
          </div>
        </section>

        {/* Campaign Management Section */}
        <section
          id="campaigns"
          className="py-10 px-6 md:px-20 bg-gray-970 bg-opacity-90 text-white"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-12 md:gap-16">
            <ScrollFade direction="right" className="md:w-1/2">
              <img
                src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTl1bjU3bnJvNjB1cmt3d2w1aW1vaHB5ZDVwbWE0d3YxbXdiZDFldCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPEqDGUULpEU0aQ/giphy.gif"
                alt="MailBot Dashboard"
                className="rounded-3xl shadow-2xl border-2 border-purple-700 transform hover:scale-102 transition-transform duration-500 w-full"
              />
            </ScrollFade>
            <ScrollFade
              direction="left"
              className="md:w-1/2 text-center md:text-left"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-pink-400 to-cyan-400 text-transparent bg-clip-text">
                Your Central Command for Campaigns
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                From creation to analytics, manage every aspect of your cold
                email campaigns with precision using our intuitive dashboard.
              </p>
            </ScrollFade>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-950 bg-opacity-95 text-white">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-4">
            {/* Top Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-gray-800 pb-2">
              {/* Logo + Info */}
              <div className="text-center md:text-left">
                <div className="flex items-center gap-3">
                  <img
                    src={logo}
                    alt="ColdMailX Logo"
                    className="w-7 h-7 sm:w-12 sm:h-12"
                  />
                  <h1 className="text-xl text-white sm:text-2xl font-bold tracking-wide">
                    <span className="text-purple-500">Cold</span>MailX
                  </h1>
                </div>

                <p className="text-gray-400 mt-1 text-sm md:text-base max-w-md">
                  AI-powered cold emailing, reimagined for your success. Scale
                  smarter. Close faster. Convert better.
                </p>
              </div>

              {/* Contact */}
              <div className="flex flex-col items-center md:items-end">
                <h4 className="text-lg font-semibold text-cyan-300 mb-1">
                  Contact Us
                </h4>
                <a
                  href="mailto:coldmailx512@gmail.com"
                  className="text-purple-300 hover:text-cyan-400 transition-colors duration-300 text-xl sm:text-2xl md:text-2xl font-bold"
                >
                  coldmailx512@gmail.com
                </a>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-2 text-xs md:text-sm text-gray-500">
              <p>
                &copy; {new Date().getFullYear()} ColdMailX. All rights
                reserved.
              </p>
              <p className="mt-1 md:mt-0 text-gray-400">
                Built with ❤️ using React + Tailwind
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Hero;
