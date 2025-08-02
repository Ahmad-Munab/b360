"use client";

import { PageLayout } from "@/components/public/layout/PageLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Settings,
  Code,
  Shield,
  Zap,
  Monitor,
  Database,
  ArrowRight,
  Wrench,
  Bug,
  CheckCircle,
  Clock,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function TechnicalSupportPage() {
  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Expert Technical Knowledge",
      description: "Certified technicians with deep product and system expertise.",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Rapid Issue Resolution",
      description: "Quick diagnosis and resolution of complex technical problems.",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      icon: <Monitor className="w-8 h-8" />,
      title: "Remote Assistance",
      description: "Secure remote access for hands-on troubleshooting and support.",
      gradient: "from-purple-500 to-violet-600",
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Knowledge Base",
      description: "Comprehensive documentation and solution database.",
      gradient: "from-orange-500 to-red-600",
    },
  ];

  const technicalServices = [
    {
      icon: <Bug className="w-6 h-6" />,
      title: "Bug Reporting & Fixes",
      description: "Systematic bug identification, tracking, and resolution",
      features: ["Issue reproduction", "Root cause analysis", "Priority classification", "Fix verification"],
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "System Configuration",
      description: "Expert setup and configuration of complex systems",
      features: ["Initial setup", "Performance optimization", "Security configuration", "Integration support"],
    },
    {
      icon: <Wrench className="w-6 h-6" />,
      title: "Troubleshooting",
      description: "Advanced diagnostic and problem-solving services",
      features: ["System diagnostics", "Performance analysis", "Error resolution", "Preventive maintenance"],
    },
  ];

  const stats = [
    { value: "95%", label: "First Contact Resolution" },
    { value: "< 4hrs", label: "Average Response Time" },
    { value: "99.8%", label: "Issue Resolution Rate" },
    { value: "24/7", label: "Technical Support" },
  ];

  const supportLevels = [
    {
      level: "Level 1",
      title: "Basic Technical Support",
      description: "General technical inquiries and basic troubleshooting",
      responseTime: "< 1 hour",
      availability: "24/7",
    },
    {
      level: "Level 2",
      title: "Advanced Technical Support",
      description: "Complex technical issues requiring specialized knowledge",
      responseTime: "< 4 hours",
      availability: "Business Hours",
    },
    {
      level: "Level 3",
      title: "Expert Technical Support",
      description: "Critical issues requiring senior technical expertise",
      responseTime: "< 2 hours",
      availability: "Priority Support",
    },
  ];

  return (
    <PageLayout
      title="Technical Support"
      subtitle="Expert technical assistance for complex product and system issues"
      description="Our certified technical specialists provide comprehensive support for troubleshooting, configuration, and optimization of your technical systems."
      heroGradient="from-blue-50 to-indigo-50"
      ctaTitle="Need expert technical assistance?"
      ctaDescription="Let our certified technical specialists help you resolve complex issues and optimize your systems."
      ctaButtonText="Get Technical Support"
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
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Advanced Technical Capabilities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our technical support team combines deep expertise with advanced tools
              to solve complex technical challenges efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white mb-4`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Technical Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From bug fixes to system optimization, we provide complete technical support solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {technicalServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                      {service.icon}
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-center">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Levels Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Multi-Tier Technical Support
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Escalating support levels ensure the right expertise for every technical challenge.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {supportLevels.map((level, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium mb-4">
                      {level.level}
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {level.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-center">{level.description}</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Response Time:
                        </span>
                        <span className="text-sm font-medium text-gray-900">{level.responseTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Availability:
                        </span>
                        <span className="text-sm font-medium text-gray-900">{level.availability}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <Settings className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Get Expert Technical Support
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Don't let technical issues slow you down. Our certified specialists are ready
              to help you resolve complex problems and optimize your systems.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="text-3xl font-bold mb-2">10K+</div>
                <div className="opacity-90">Issues Resolved</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">95%</div>
                <div className="opacity-90">First Contact Resolution</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">&lt;4hrs</div>
                <div className="opacity-90">Response Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="opacity-90">Support Available</div>
              </div>
            </div>
            <Link href="/contact">
              <Button className="bg-white text-indigo-600 hover:bg-gray-100 rounded-full px-8 py-3 font-bold text-lg shadow-lg">
                Get Technical Support
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
