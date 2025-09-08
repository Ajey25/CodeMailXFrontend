import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import { motion } from "framer-motion";
import ScrollFade from "../components/ScrollFade";
import { useEffect, useRef } from "react";
import RippleGrid from "./RippleGrid";
import { Link } from "react-router-dom";
import { useFrame } from "@react-three/fiber";

function MailBotModel() {
  const group = useRef();
  const { scene, animations } = useGLTF("/models/Google G.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // Stop all auto-play animations
    Object.values(actions).forEach((action) => {
      // action.stop(); // don't let them animate at all
    });
  }, [actions]);
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.005; // tweak speed here
    }
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
    <div className="relative w-full bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Full-page RippleGrid Background */}
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

      {/* ✅ Main Content Over the Grid */}
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-10 gap-10 min-h-screen">
          {/* Left Content */}
          <ScrollFade direction="left" className="w-full md:w-1/2">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Meet <span className="text-purple-500">MailBot</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Your AI-powered postal assistant in the digital age. Reliable,
              fast, and always on.
            </p>

            <div className="flex gap-4">
              <Link to="/signin">
                <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition">
                  Sign In
                </button>
              </Link>

              <Link to="/signup">
                <button className="px-6 py-3 border border-purple-500 hover:bg-purple-900 rounded-lg font-semibold transition">
                  Sign Up
                </button>
              </Link>
            </div>
          </ScrollFade>

          {/* Right Model */}
          <motion.div
            className="w-full md:w-1/2 h-[90vh]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={1.5} />
              <MailBotModel />
              <OrbitControls autoRotate={false} enableZoom={false} />
            </Canvas>
          </motion.div>
        </div>

        {/* Attribution */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 text-center z-20">
          Posted Letter by Jarlan Perez [CC-BY] via{" "}
          <a
            href="https://poly.pizza/m/4RKKC0BC4gb"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Poly Pizza
          </a>
        </div>

        {/* Section 1 */}
        <ScrollFade direction="up">
          <section className="py-24 px-6 md:px-20 bg-black bg-opacity-70 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Automated Cold Emailing
              </h2>
              <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
                MailBot streamlines your outreach by automatically sending
                targeted cold emails with smart personalization, AI-written
                content, and real-time analytics.
              </p>
            </div>
          </section>
        </ScrollFade>

        {/* Section 2 */}
        <section className="py-24 px-6 md:px-20 bg-gray-950 bg-opacity-70 text-white">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <ScrollFade direction="right">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Built-in Templates
                </h2>
                <p className="text-gray-400 text-lg">
                  No need to write emails from scratch. Access our hand-crafted,
                  high-converting cold email templates for every industry.
                </p>
              </div>
            </ScrollFade>

            <ScrollFade direction="left">
              <div className="flex flex-col gap-4">
                <div className="bg-gray-800 p-6 rounded-xl shadow-md">
                  <h3 className="font-semibold text-xl mb-2">SaaS Pitch</h3>
                  <p className="text-gray-400 text-sm">
                    Perfect for startups reaching out to early adopters.
                  </p>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl shadow-md">
                  <h3 className="font-semibold text-xl mb-2">
                    Freelancer Proposal
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Great for landing your next client project.
                  </p>
                </div>
              </div>
            </ScrollFade>
          </div>
        </section>

        {/* Section 3 */}
        <section className="py-24 px-6 md:px-20 bg-black bg-opacity-70 text-white">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
            <ScrollFade direction="left" className="md:w-1/2">
              <img
                src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTl1bjU3bnJvNjB1cmt3d2w1aW1vaHB5ZDVwbWE0d3YxbXdiZDFldCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPEqDGUULpEU0aQ/giphy.gif"
                alt="MailBot Dashboard"
                className="rounded-lg shadow-lg"
              />
            </ScrollFade>

            <ScrollFade direction="right" className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Your Command Center
              </h2>
              <p className="text-gray-400 text-lg">
                Track email opens, click-throughs, and replies—all in real-time.
                Control your campaigns with a beautiful, intuitive dashboard.
              </p>
            </ScrollFade>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 bg-opacity-70 py-10 px-6 text-white text-sm">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">MailBot</h3>
              <p className="text-gray-400">
                AI-powered cold emailing, reimagined.
              </p>
            </div>

            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Hero;
