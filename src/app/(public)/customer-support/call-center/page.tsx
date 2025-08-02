"use client";

import { PageLayout } from "@/components/public/layout/PageLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Phone,
  Clock,
  Users,
  BarChart3,
  Headphones,
  Globe,
  ArrowRight,
  PhoneCall,
  Shield,
  Zap,
  Target,
  Award,
} from "lucide-react";
import Link from "next/link";

export default function CallCenterSupportPage() {
  const features = [
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Professional Call Handling",
      description: "Trained agents with excellent communication skills and product knowledge.",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Real-time call monitoring, recording, and performance analytics.",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multi-Channel Integration",
      description: "Seamless integration with your existing CRM and support systems.",
      gradient: "from-purple-500 to-violet-600",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Quality Assurance",
      description: "Continuous monitoring and coaching to ensure service excellence.",
      gradient: "from-orange-500 to-red-600",
    },
  ];

  const callCenterServices = [
    {
      icon: <PhoneCall className="w-6 h-6" />,
      title: "Inbound Support",
      description: "Handle customer inquiries, complaints, and support requests",
      features: ["24/7 availability", "Multi-language support", "CRM integration"],
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: "Outbound Campaigns",
      description: "Proactive customer outreach and follow-up services",
      features: ["Lead qualification", "Customer surveys", "Appointment setting"],
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Technical Support",
      description: "Specialized technical assistance and troubleshooting",
      features: ["Product expertise", "Remote assistance", "Escalation protocols"],
    },
  ];

  const stats = [
    { value: "98.5%", label: "Call Answer Rate" },
    { value: "< 20s", label: "Average Wait Time" },
    { value: "95%", label: "First Call Resolution" },
    { value: "4.9/5", label: "Customer Satisfaction" },
  ];

  return (
    <PageLayout
      title="Call Center Support"
      subtitle="Professional call center services that deliver exceptional customer experiences"
      description="Our experienced call center agents provide comprehensive phone support with advanced technology and proven methodologies."
      heroGradient="from-blue-50 to-indigo-50"
      ctaTitle="Ready to upgrade your call center operations?"
      ctaDescription="Let's discuss how our professional call center services can enhance your customer support."
      ctaButtonText="Get Started Today"
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
              Advanced Call Center Capabilities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our state-of-the-art call center infrastructure combined with skilled agents
              delivers superior customer service experiences.
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
              Comprehensive Call Center Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From inbound support to outbound campaigns, we provide complete call center solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {callCenterServices.map((service, index) => (
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
                          <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
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

      {/* Technology Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Cutting-Edge Call Center Technology
              </h2>
              <p className="text-xl text-gray-600">
                Our advanced technology stack ensures optimal performance and customer satisfaction.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Cloud-Based Infrastructure</h3>
                      <p className="text-gray-600">Scalable, reliable, and secure cloud platform for optimal performance.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Real-Time Analytics</h3>
                      <p className="text-gray-600">Live dashboards and reporting for continuous optimization.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Quality Monitoring</h3>
                      <p className="text-gray-600">Automated call scoring and agent performance tracking.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-8 text-white"
              >
                <h3 className="text-2xl font-bold mb-6">Call Center Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Handle Time</span>
                    <span className="font-bold">3:45</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Service Level (20s)</span>
                    <span className="font-bold">95.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Abandonment Rate</span>
                    <span className="font-bold">1.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Customer Satisfaction</span>
                    <span className="font-bold">4.9/5</span>
                  </div>
                </div>
              </motion.div>
            </div>
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
            <Phone className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Transform Your Call Center Operations
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Experience the difference professional call center services make.
              Improve customer satisfaction and operational efficiency today.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="text-3xl font-bold mb-2">1M+</div>
                <div className="opacity-90">Calls Handled</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">98.5%</div>
                <div className="opacity-90">Answer Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">&lt;20s</div>
                <div className="opacity-90">Wait Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="opacity-90">Availability</div>
              </div>
            </div>
            <Link href="/contact">
              <Button className="bg-white text-indigo-600 hover:bg-gray-100 rounded-full px-8 py-3 font-bold text-lg shadow-lg">
                Start Call Center Service
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
