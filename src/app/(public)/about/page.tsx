"use client";

import { motion } from "framer-motion";
import { PageLayout } from "@/components/public/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import {
  Globe,
  Users,
  Target,
  Award,
  Heart,
  Shield,
  Zap,
  TrendingUp,
  MapPin,
} from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      title: "Customer First",
      description:
        "Every decision we make is guided by what's best for our clients and their customers.",
      icon: <Heart className="w-12 h-12" />,
      gradient: "from-red-500 to-pink-600",
    },
    {
      title: "Excellence",
      description:
        "We strive for perfection in every interaction, constantly improving our services.",
      icon: <Award className="w-12 h-12" />,
      gradient: "from-yellow-500 to-orange-600",
    },
    {
      title: "Innovation",
      description:
        "We embrace cutting-edge technology to deliver superior customer experiences.",
      icon: <Zap className="w-12 h-12" />,
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      title: "Integrity",
      description:
        "We operate with transparency, honesty, and ethical practices in everything we do.",
      icon: <Shield className="w-12 h-12" />,
      gradient: "from-green-500 to-emerald-600",
    },
  ];

  const stats = [
    { number: "2018", label: "Founded" },
    { number: "50M+", label: "Tickets Resolved" },
    { number: "500+", label: "Global Clients" },
    { number: "15+", label: "Countries Served" },
  ];

  const milestones = [
    {
      year: "2018",
      title: "Company Founded",
      description:
        "B360 was established with a vision to revolutionize customer support through global expertise.",
    },
    {
      year: "2019",
      title: "First International Office",
      description:
        "Expanded operations to Asia-Pacific region, establishing our first offshore support center.",
    },
    {
      year: "2020",
      title: "AI Integration",
      description:
        "Launched our AI-powered customer support platform, reducing response times by 70%.",
    },
    {
      year: "2021",
      title: "Global Expansion",
      description:
        "Opened offices across four continents, providing 24/7 coverage for enterprise clients.",
    },
    {
      year: "2022",
      title: "Industry Recognition",
      description:
        "Received multiple awards for customer service excellence and innovation in support technology.",
    },
    {
      year: "2023",
      title: "50M Milestone",
      description:
        "Successfully resolved over 50 million customer tickets with 98% satisfaction rate.",
    },
  ];

  const locations = [
    { city: "Chicago", country: "USA", role: "Global Headquarters" },
    { city: "Manila", country: "Philippines", role: "Asia-Pacific Hub" },
    { city: "Bangalore", country: "India", role: "Technology Center" },
    { city: "Dublin", country: "Ireland", role: "European Operations" },
  ];

  return (
    <PageLayout
      title="About B360"
      subtitle="Transforming customer experiences across the globe"
      description="We're a global team of customer experience experts, technologists, and innovators dedicated to helping businesses deliver exceptional support."
      heroGradient="from-blue-50 to-indigo-50"
      ctaTitle="Ready to join our mission?"
      ctaDescription="Let's work together to create exceptional customer experiences that drive business growth."
      ctaButtonText="Partner With Us"
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
                <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Globe className="w-20 h-20 text-blue-600 mx-auto mb-8" />
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-heading">
                Our Mission
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                To empower businesses worldwide with exceptional customer
                support solutions that build lasting relationships, drive
                growth, and create meaningful connections between brands and
                their customers.
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading">
                    Vision
                  </h3>
                  <p className="text-gray-600">
                    To be the global leader in customer experience solutions.
                  </p>
                </div>
                <div className="text-center">
                  <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading">
                    Purpose
                  </h3>
                  <p className="text-gray-600">
                    Connecting businesses with their customers through
                    exceptional service.
                  </p>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading">
                    Impact
                  </h3>
                  <p className="text-gray-600">
                    Driving business growth through superior customer
                    experiences.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-heading">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These values guide everything we do and shape how we serve our
              clients and their customers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-2 border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${value.gradient} rounded-2xl flex items-center justify-center text-white mx-auto mb-6`}
                    >
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 font-heading">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-heading">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From a startup vision to a global leader in customer support
              solutions.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex items-center mb-12 ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? "pr-8" : "pl-8"}`}>
                  <Card className="border-2 border-blue-200 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 font-heading">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {milestone.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="w-4 h-4 bg-blue-600 rounded-full flex-shrink-0 relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="flex-1"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-heading">
              Global Presence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              With strategic locations across four continents, we provide 24/7
              support coverage worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {locations.map((location, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading">
                  {location.city}
                </h3>
                <p className="text-gray-600 mb-1">{location.country}</p>
                <p className="text-sm text-blue-600 font-medium">
                  {location.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
