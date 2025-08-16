"use client";

import { PageLayout } from "@/components/public/layout/PageLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  MessageCircle,
  Phone,
  Mail,
  Globe,
  ArrowRight,
  Headphones,
  Shield,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function GeneralSupportPage() {
  const features = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Availability",
      description: "Round-the-clock support across all time zones with dedicated agents.",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multi-Language Support",
      description: "Support in 15+ languages with native-speaking agents.",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Quick Response",
      description: "Average response time under 2 minutes for urgent inquiries.",
      gradient: "from-purple-500 to-violet-600",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Quality Assurance",
      description: "Every interaction monitored and optimized for customer satisfaction.",
      gradient: "from-orange-500 to-red-600",
    },
  ];

  const supportChannels = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Live Chat",
      description: "Instant messaging with our support team",
      availability: "24/7",
      responseTime: "< 30 seconds",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Support",
      description: "Direct phone line to our support specialists",
      availability: "Business Hours",
      responseTime: "Immediate",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      description: "Detailed support via email with documentation",
      availability: "24/7",
      responseTime: "< 4 hours",
    },
  ];

  const stats = [
    { value: "99.9%", label: "Customer Satisfaction" },
    { value: "< 2min", label: "Average Response Time" },
    { value: "24/7", label: "Support Availability" },
    { value: "15+", label: "Languages Supported" },
  ];

  return (
    <PageLayout
      title="General Customer Support"
      subtitle="Comprehensive support solutions for all your customer service needs"
      description="From basic inquiries to complex issues, our general support team provides exceptional customer service across all channels."
      heroGradient="from-blue-50 to-indigo-50"
      ctaTitle="Ready to enhance your customer support?"
      ctaDescription="Let's discuss how our general support solutions can improve your customer experience."
      ctaButtonText="Start General Support"
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
              Why Choose Our General Support?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive general support service combines human expertise with advanced technology
              to deliver exceptional customer experiences.
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

      {/* Support Channels Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Multiple Support Channels
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the support channel that works best for you and your customers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {supportChannels.map((channel, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                      {channel.icon}
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {channel.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p className="text-gray-600">{channel.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Availability:</span>
                        <span className="text-sm font-medium text-gray-900">{channel.availability}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Response Time:</span>
                        <span className="text-sm font-medium text-gray-900">{channel.responseTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </PageLayout>
  );
}
