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
      icon: <Users className="w-8 h-8" />,
      label: "Expert Teams",
      color: "bg-blue-500",
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      label: "24/7 Support",
      color: "bg-green-500",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      label: "Secure",
      color: "bg-purple-500",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      label: "Analytics",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="relative h-96 lg:h-[500px] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        {/* Central Globe */}
        <motion.div
          animate={{ rotate: animated ? 360 : 0 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-2xl"
        >
          <Globe className="w-16 h-16 text-white" />
        </motion.div>

        {/* Orbiting Feature Cards */}
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            className="absolute"
            style={{
              left: `${Math.cos((i * Math.PI) / 2) * 120 + 50}%`,
              top: `${Math.sin((i * Math.PI) / 2) * 120 + 50}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`w-20 h-20 ${feature.color} rounded-2xl flex flex-col items-center justify-center text-white shadow-lg cursor-pointer`}
            >
              {feature.icon}
              <span className="text-xs font-bold mt-1">{feature.label}</span>
            </motion.div>
          </motion.div>
        ))}

        {/* Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {features.map((_, i) => (
            <motion.line
              key={i}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: animated ? 1 : 0 }}
              transition={{ duration: 1, delay: i * 0.3 }}
              x1="50%"
              y1="50%"
              x2={`${Math.cos((i * Math.PI) / 2) * 120 + 50}%`}
              y2={`${Math.sin((i * Math.PI) / 2) * 120 + 50}%`}
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.6"
            />
          ))}
        </svg>
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
      className="space-y-8"
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
          className="text-6xl lg:text-7xl font-black text-gray-900 leading-tight font-heading"
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
          className="text-2xl text-gray-600 leading-relaxed max-w-2xl font-medium"
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
        className="flex flex-col sm:flex-row gap-4"
      >
        <Link href="/contact">
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-full px-10 py-4 text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 group">
            Get Started Today
            <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>

        <Link href="/about">
          <Button
            variant="outline"
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full px-10 py-4 text-xl font-bold transition-all duration-300"
          >
            Learn More
          </Button>
        </Link>
      </motion.div>

      <StatsCard />
    </motion.div>
  );
};

const StatsCard = () => {
  const stats = [
    {
      number: "50M+",
      label: "Tickets Resolved",
      icon: <MessageCircle className="w-6 h-6" />,
    },
    {
      number: "98%",
      label: "Satisfaction Rate",
      icon: <Shield className="w-6 h-6" />,
    },
    {
      number: "24/7",
      label: "Global Coverage",
      icon: <Clock className="w-6 h-6" />,
    },
    {
      number: "500+",
      label: "Expert Agents",
      icon: <Users className="w-6 h-6" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-2xl"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
          className="text-center"
        >
          <Card className="border-2 border-blue-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-blue-600 flex justify-center mb-2">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
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
    <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 lg:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <HeroContent />
          <AnimatedVisual animated={isHeroAnimated} />
        </div>
      </div>
    </section>
  );
};
