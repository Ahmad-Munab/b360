"use client";

import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Monitor,
  Code,
  Server,
  Shield,
  Cloud,
  Smartphone,
  Database,
  CheckCircle,
  ArrowRight,
  Globe,
  Palette,
  Search,
} from "lucide-react";
import Link from "next/link";

export default function ITSupportPage() {
  const services = [
    {
      title: "Web Development",
      description:
        "Custom web applications, responsive websites, and e-commerce solutions built with modern technologies.",
      icon: <Code className="w-12 h-12" />,
      features: [
        "Custom web applications",
        "Responsive design",
        "E-commerce platforms",
        "CMS development",
        "API integration",
        "Performance optimization",
      ],
      gradient: "from-blue-500 to-cyan-600",
      popular: true,
    },
    {
      title: "Infrastructure Management",
      description:
        "Complete IT infrastructure setup, monitoring, and maintenance for optimal performance.",
      icon: <Server className="w-12 h-12" />,
      features: [
        "Server setup & maintenance",
        "Network configuration",
        "Cloud migration",
        "Backup solutions",
        "Performance monitoring",
        "Security hardening",
      ],
      gradient: "from-purple-500 to-indigo-600",
    },
    {
      title: "Cloud Solutions",
      description:
        "Cloud architecture, migration, and management services for scalable business operations.",
      icon: <Cloud className="w-12 h-12" />,
      features: [
        "Cloud architecture design",
        "AWS/Azure/GCP setup",
        "Migration planning",
        "Cost optimization",
        "Auto-scaling setup",
        "Disaster recovery",
      ],
      gradient: "from-green-500 to-teal-600",
    },
    {
      title: "Cybersecurity",
      description:
        "Comprehensive security solutions to protect your digital assets and sensitive data.",
      icon: <Shield className="w-12 h-12" />,
      features: [
        "Security audits",
        "Penetration testing",
        "Firewall configuration",
        "Compliance management",
        "Incident response",
        "Security training",
      ],
      gradient: "from-red-500 to-orange-600",
    },
  ];

  const webDevServices = [
    {
      title: "Frontend Development",
      description:
        "Modern, responsive user interfaces using React, Vue, and Angular",
      icon: <Palette className="w-8 h-8" />,
    },
    {
      title: "Backend Development",
      description:
        "Robust server-side solutions with Node.js, Python, and .NET",
      icon: <Database className="w-8 h-8" />,
    },
    {
      title: "Mobile Development",
      description: "Cross-platform mobile apps for iOS and Android",
      icon: <Smartphone className="w-8 h-8" />,
    },
    {
      title: "SEO Optimization",
      description: "Search engine optimization for better visibility",
      icon: <Search className="w-8 h-8" />,
    },
  ];

  const stats = [
    { number: "500+", label: "Projects Delivered" },
    { number: "99.9%", label: "Uptime Achieved" },
    { number: "24/7", label: "Support Coverage" },
    { number: "50+", label: "Technologies" },
  ];

  return (
    <PageLayout
      title="IT Support & Digital Solutions"
      subtitle="Comprehensive IT services and web development solutions"
      description="From infrastructure management to custom web development, we provide the complete IT support your business needs to thrive in the digital age."
      heroGradient="from-indigo-50 to-purple-50"
      ctaTitle="Ready to modernize your IT infrastructure?"
      ctaDescription="Let's discuss how our IT support and development services can accelerate your business growth."
      ctaButtonText="Get IT Consultation"
    >
      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold text-indigo-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-heading">
              Complete IT Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From web development to infrastructure management, we provide
              comprehensive IT services that drive business success.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  className={`h-full border-2 hover:shadow-2xl transition-all duration-300 ${
                    service.popular
                      ? "border-blue-200 ring-2 ring-blue-100"
                      : "border-gray-200"
                  }`}
                >
                  <CardContent className="p-8">
                    {service.popular && (
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-4 inline-block">
                        Most Popular
                      </div>
                    )}

                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center text-white mb-6`}
                    >
                      {service.icon}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-4 font-heading">
                      {service.title}
                    </h3>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center space-x-3"
                        >
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-full py-3 font-bold">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Web Development Spotlight */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-700">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center text-white mb-16"
            >
              <Globe className="w-20 h-20 mx-auto mb-8 opacity-90" />
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-heading">
                Web Development Excellence
              </h2>
              <p className="text-xl opacity-90 leading-relaxed max-w-3xl mx-auto">
                We create stunning, high-performance websites and web
                applications that drive business growth and deliver exceptional
                user experiences.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {webDevServices.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center text-white"
                >
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 font-heading">
                    {service.title}
                  </h3>
                  <p className="opacity-90 leading-relaxed">
                    {service.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/contact">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 rounded-full px-8 py-3 font-bold text-lg shadow-lg">
                  Start Your Project
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-heading">
              Modern Technology Stack
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We use cutting-edge technologies and industry best practices to
              deliver robust, scalable solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-6xl mx-auto">
            {[
              "React",
              "Node.js",
              "Python",
              "AWS",
              "Docker",
              "Kubernetes",
              "MongoDB",
              "PostgreSQL",
              "Redis",
              "GraphQL",
              "TypeScript",
              "Next.js",
            ].map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3 hover:bg-indigo-100 transition-colors">
                  <Monitor className="w-8 h-8 text-indigo-600" />
                </div>
                <div className="text-sm font-medium text-gray-700">{tech}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
