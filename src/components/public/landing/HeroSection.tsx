import { useState, useEffect } from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Users,
  MessageCircle,
  Shield,
  BarChart3,
  ArrowRight,
  Globe,
  Clock,
} from "lucide-react";

type AnimatedCirclesProps = {
  animated: boolean;
};

const AnimatedVisual = ({ animated }: AnimatedCirclesProps) => {
  const features = [
    {
      icon: <Users className="w-4 h-4 lg:w-5 lg:h-5" />,
      label: "Expert Teams",
      color: "bg-gradient-to-br from-blue-500 to-blue-700",
      position: { top: "10%", left: "20%" },
    },
    {
      icon: <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5" />,
      label: "24/7 Support", 
      color: "bg-gradient-to-br from-emerald-500 to-emerald-700",
      position: { top: "15%", right: "15%" },
    },
    {
      icon: <Shield className="w-4 h-4 lg:w-5 lg:h-5" />,
      label: "Secure",
      color: "bg-gradient-to-br from-purple-500 to-purple-700",
      position: { bottom: "20%", left: "15%" },
    },
    {
      icon: <BarChart3 className="w-4 h-4 lg:w-5 lg:h-5" />,
      label: "Analytics",
      color: "bg-gradient-to-br from-orange-500 to-orange-700",
      position: { bottom: "10%", right: "20%" },
    },
    {
      icon: <Clock className="w-4 h-4 lg:w-5 lg:h-5" />,
      label: "Real-time",
      color: "bg-gradient-to-br from-indigo-500 to-indigo-700",
      position: { top: "45%", left: "5%" },
    },
  ];

  return (
    <div className="relative h-96 w-96 lg:h-[500px] lg:w-[500px] mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full h-full"
      >
        {/* Central Earth/Globe */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <motion.div
            animate={{ rotate: animated ? 360 : 0 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 lg:w-28 lg:h-28 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20 relative overflow-hidden"
          >
            {/* Earth-like texture */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-transparent to-blue-900/50 rounded-full"></div>
            <div className="absolute top-2 left-3 w-2 h-3 bg-green-400/60 rounded-full"></div>
            <div className="absolute bottom-3 right-2 w-3 h-2 bg-green-400/60 rounded-full"></div>
            <div className="absolute top-1/2 left-1 w-1 h-4 bg-green-400/40 rounded-full"></div>
            <Globe className="w-10 h-10 lg:w-14 lg:h-14 text-white relative z-10" />
          </motion.div>
        </div>

        {/* Connection Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 500 500"
        >
          {features.map((feature, i) => {
            // Calculate connection points
            const centerX = 250;
            const centerY = 250;
            
            // Calculate feature position based on percentages
            let featureX, featureY;
            if (feature.position.top) {
              featureY = (parseFloat(feature.position.top) / 100) * 500;
            } else if (feature.position.bottom) {
              featureY = 500 - (parseFloat(feature.position.bottom) / 100) * 500;
            } else {
              featureY = centerY;
            }
            
            if (feature.position.left) {
              featureX = (parseFloat(feature.position.left) / 100) * 500;
            } else if (feature.position.right) {
              featureX = 500 - (parseFloat(feature.position.right) / 100) * 500;
            } else {
              featureX = centerX;
            }

            return (
              <motion.g key={i}>
                {/* Curved connection line */}
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: animated ? 1 : 0, opacity: animated ? 0.6 : 0 }}
                  transition={{ duration: 2, delay: i * 0.3, ease: "easeInOut" }}
                  d={`M ${centerX} ${centerY} Q ${(centerX + featureX) / 2} ${(centerY + featureY) / 2 - 50} ${featureX} ${featureY}`}
                  stroke="url(#gradient)"
                  strokeWidth="2"
                  strokeDasharray="8 4"
                  fill="none"
                />
                {/* Animated dots along the path */}
                <motion.circle
                  initial={{ offset: 0, opacity: 0 }}
                  animate={{ 
                    offset: animated ? 1 : 0, 
                    opacity: animated ? [0, 1, 0] : 0 
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    delay: i * 0.5,
                    ease: "linear"
                  }}
                  r="3"
                  fill="#3B82F6"
                >
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    begin={`${i * 0.5}s`}
                  >
                    <mpath href={`#path-${i}`} />
                  </animateMotion>
                </motion.circle>
                <defs>
                  <path id={`path-${i}`} d={`M ${centerX} ${centerY} Q ${(centerX + featureX) / 2} ${(centerY + featureY) / 2 - 50} ${featureX} ${featureY}`} />
                </defs>
              </motion.g>
            );
          })}
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating Feature Cards */}
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: i * 0.2,
              type: "spring",
              stiffness: 100 
            }}
            className="absolute z-30"
            style={{
              top: feature.position.top,
              bottom: feature.position.bottom,
              left: feature.position.left,
              right: feature.position.right,
            }}
          >
            <motion.div
              whileHover={{ 
                scale: 1.1, 
                y: -5,
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)"
              }}
              animate={{
                y: animated ? [0, -8, 0] : 0,
              }}
              transition={{
                y: {
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut"
                }
              }}
              className={`${feature.color} rounded-2xl p-3 lg:p-4 text-white shadow-xl cursor-pointer backdrop-blur-sm border border-white/20 min-w-[80px] lg:min-w-[100px]`}
            >
              <div className="flex flex-col items-center text-center space-y-1">
                <div className="p-1 bg-white/20 rounded-lg">
                  {feature.icon}
                </div>
                <span className="text-xs lg:text-sm font-bold leading-tight">
                  {feature.label}
                </span>
              </div>
            </motion.div>
          </motion.div>
        ))}

        {/* Orbital Rings */}
        <motion.div
          animate={{ rotate: animated ? 360 : 0 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 lg:w-64 lg:h-64 border border-blue-200/30 rounded-full"
        />
        <motion.div
          animate={{ rotate: animated ? -360 : 0 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 lg:w-80 lg:h-80 border border-purple-200/20 rounded-full border-dashed"
        />
      </motion.div>
    </div>
  );
};

const HeroContent = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-8 text-center lg:text-left"
      id="hero"
      data-animate
    >
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-block bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg"
        >
          🚀 Global Customer Experience Leaders
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight font-heading"
        >
          Transform Your
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Customer Experience
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl font-medium mx-auto lg:mx-0"
        >
          We deliver world-class customer support and IT solutions that scale
          with your business. From AI-powered chat support to comprehensive
          technical services—we&apos;ve got you covered.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
      >
        <Link href="/contact">
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-full px-6 sm:px-8 lg:px-10 py-3 sm:py-4 text-lg sm:text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 group">
            Get Started Today
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>

        <Link href="/about">
          <Button
            variant="outline"
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full px-6 sm:px-8 lg:px-10 py-3 sm:py-4 text-lg sm:text-xl font-bold transition-all duration-300"
          >
            Learn More
          </Button>
        </Link>
      </motion.div>

    </motion.div>
  );
};

export const HeroSection = () => {
  const [animatedElements, setAnimatedElements] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimatedElements((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const isHeroAnimated = animatedElements.has("hero");

  return (
    <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 lg:py-32 relative overflow-hidden min-h-[80vh] lg:min-h-[100vh]">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10 h-full">
        <div className="lg:grid lg:grid-cols-2 gap-12 items-center h-full">
          {/* Content Section */}
          <div className="flex items-center h-full">
            <HeroContent />
          </div>
          
          {/* Visual Section */}
          <div className="flex items-center justify-center mt-12 lg:mt-0 h-full">
            <AnimatedVisual animated={isHeroAnimated} />
          </div>
        </div>
      </div>
    </section>
  );
};
