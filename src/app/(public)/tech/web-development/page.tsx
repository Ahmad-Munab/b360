"use client";

import { motion } from "framer-motion";
import { PageLayout } from "../../../components/public/layout/PageLayout";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Code, CheckCircle, ArrowRight, Globe } from "lucide-react";
import Link from "next/link";

export default function WebDevelopmentPage() {
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
        "SEO optimization",
        "Mobile-first development",
        "Progressive Web Apps",
        "Database design",
        "Third-party integrations",
        "Maintenance & support",
      ],
      gradient: "from-blue-500 to-cyan-600",
      popular: true,
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
      title="Web Development Services"
      subtitle="Custom web applications and digital solutions"
      description="Professional web development services to create modern, responsive, and high-performing websites and applications that drive your business forward."
      heroGradient="from-indigo-50 to-purple-50"
      ctaTitle="Ready to build your digital presence?"
      ctaDescription="Let's discuss how our web development expertise can bring your vision to life."
      ctaButtonText="Start Your Project"
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
              Professional Web Development
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Custom web applications, responsive websites, and e-commerce
              solutions built with modern technologies and best practices.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-2 border-blue-200 ring-2 ring-blue-100 hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-10">
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-6 inline-block">
                      Featured Service
                    </div>

                    <div className="flex items-center mb-8">
                      <div
                        className={`w-20 h-20 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center text-white mr-6`}
                      >
                        {service.icon}
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2 font-heading">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 text-lg leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-4 text-lg">
                          Core Features:
                        </h4>
                        <ul className="space-y-3">
                          {service.features
                            .slice(0, 6)
                            .map((feature, featureIndex) => (
                              <li
                                key={featureIndex}
                                className="flex items-center space-x-3"
                              >
                                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-4 text-lg">
                          Additional Services:
                        </h4>
                        <ul className="space-y-3">
                          {service.features
                            .slice(6)
                            .map((feature, featureIndex) => (
                              <li
                                key={featureIndex}
                                className="flex items-center space-x-3"
                              >
                                <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>

                    <div className="text-center">
                      <Button className="bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white rounded-full px-8 py-4 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                        Start Your Project
                      </Button>
                    </div>
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
    </PageLayout>
  );
}
