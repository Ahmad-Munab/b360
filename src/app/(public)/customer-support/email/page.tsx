"use client";

import { PageLayout } from "@/components/public/layout/PageLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Mail,
  Clock,
  FileText,
  Shield,
  BarChart3,
  Users,
  ArrowRight,
  Inbox,
  Send,
  Archive,
  CheckCircle,
  Tag,
  Search,
} from "lucide-react";
import Link from "next/link";

export default function EmailSupportPage() {
  const features = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Professional Email Management",
      description: "Structured email handling with priority classification and routing.",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Quick Response Times",
      description: "Average response time under 4 hours with priority escalation.",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Detailed Documentation",
      description: "Comprehensive case tracking and detailed response documentation.",
      gradient: "from-purple-500 to-violet-600",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Performance Analytics",
      description: "Detailed metrics on response times, resolution rates, and satisfaction.",
      gradient: "from-orange-500 to-red-600",
    },
  ];

  const emailServices = [
    {
      icon: <Inbox className="w-6 h-6" />,
      title: "Ticket Management",
      description: "Systematic email ticket creation, tracking, and resolution",
      features: ["Automatic ticket creation", "Priority classification", "Status tracking", "SLA monitoring"],
    },
    {
      icon: <Send className="w-6 h-6" />,
      title: "Response Templates",
      description: "Standardized responses for common inquiries and issues",
      features: ["Pre-approved templates", "Personalization options", "Multi-language support", "Brand consistency"],
    },
    {
      icon: <Archive className="w-6 h-6" />,
      title: "Case Documentation",
      description: "Comprehensive documentation and knowledge base integration",
      features: ["Detailed case notes", "Solution database", "Follow-up tracking", "Resolution verification"],
    },
  ];

  const stats = [
    { value: "< 4hrs", label: "Average Response Time" },
    { value: "96%", label: "Customer Satisfaction" },
    { value: "24/7", label: "Email Processing" },
    { value: "92%", label: "First Email Resolution" },
  ];

  const emailWorkflow = [
    {
      step: "1",
      title: "Email Reception",
      description: "Automatic email intake and initial classification",
      icon: <Mail className="w-6 h-6" />,
    },
    {
      step: "2",
      title: "Priority Assignment",
      description: "Smart routing based on urgency and complexity",
      icon: <Tag className="w-6 h-6" />,
    },
    {
      step: "3",
      title: "Agent Assignment",
      description: "Skill-based routing to appropriate support specialist",
      icon: <Users className="w-6 h-6" />,
    },
    {
      step: "4",
      title: "Response & Resolution",
      description: "Professional response with complete issue resolution",
      icon: <CheckCircle className="w-6 h-6" />,
    },
  ];

  return (
    <PageLayout
      title="Email Support"
      subtitle="Professional email support with detailed documentation and quick response times"
      description="Our email support team provides comprehensive assistance through structured ticket management, detailed responses, and thorough case documentation."
      heroGradient="from-blue-50 to-indigo-50"
      ctaTitle="Need professional email support?"
      ctaDescription="Let our email specialists handle your customer inquiries with professionalism and efficiency."
      ctaButtonText="Start Email Support"
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
              Professional Email Support Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our email support platform combines efficient ticket management with
              detailed documentation to provide exceptional customer service.
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
              Comprehensive Email Support Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From ticket management to detailed documentation, we provide complete email support solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {emailServices.map((service, index) => (
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

      {/* Workflow Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Email Support Workflow
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our systematic approach ensures every email is handled efficiently and professionally.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {emailWorkflow.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative">
                  <div className="w-16 h-16 mx-auto rounded-full bg-indigo-600 flex items-center justify-center text-white mb-4">
                    <span className="text-xl font-bold">{step.step}</span>
                  </div>
                  {index < emailWorkflow.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-300 transform -translate-y-0.5"></div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
                <div className="w-8 h-8 mx-auto mt-4 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  {step.icon}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose Our Email Support?
              </h2>
              <p className="text-xl text-gray-600">
                Professional email handling with comprehensive tracking and documentation.
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
                      <Shield className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Secure Communication</h3>
                      <p className="text-gray-600">Encrypted email handling with data protection compliance.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Search className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Searchable History</h3>
                      <p className="text-gray-600">Complete email history with advanced search capabilities.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Performance Tracking</h3>
                      <p className="text-gray-600">Detailed analytics on response times and resolution rates.</p>
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
                <h3 className="text-2xl font-bold mb-6">Email Support Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Daily Email Volume</span>
                    <span className="font-bold">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Response Time</span>
                    <span className="font-bold">3.2 hrs</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Resolution Rate</span>
                    <span className="font-bold">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Customer Satisfaction</span>
                    <span className="font-bold">4.7/5</span>
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
            <Mail className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Professional Email Support Solutions
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Transform your email support with professional handling, detailed documentation,
              and comprehensive tracking. Provide the thorough support your customers deserve.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="text-3xl font-bold mb-2">50K+</div>
                <div className="opacity-90">Emails Processed</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">96%</div>
                <div className="opacity-90">Satisfaction Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">&lt;4hrs</div>
                <div className="opacity-90">Response Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="opacity-90">Processing</div>
              </div>
            </div>
            <Link href="/contact">
              <Button className="bg-white text-indigo-600 hover:bg-gray-100 rounded-full px-8 py-3 font-bold text-lg shadow-lg">
                Start Email Support
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
