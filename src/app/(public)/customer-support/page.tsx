"use client";

import { motion } from "framer-motion";
import { PageLayout } from "@/components/public/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  Bot,
  Clock,
  Users,
  Shield,
  Zap,
  CheckCircle,
  Star,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function CustomerSupportPage() {
  const supportTypes = [
    {
      title: "Live Chat AI Support",
      description:
        "Advanced AI-powered chat support with human oversight for instant, accurate responses 24/7.",
      icon: <Bot className="w-12 h-12" />,
      features: [
        "AI-powered instant responses",
        "Human agent escalation",
        "24/7 availability",
        "Multi-language support",
        "Real-time sentiment analysis",
        "Automated ticket routing",
      ],
      gradient: "from-blue-500 to-indigo-600",
      popular: true,
    },
    {
      title: "Email Support",
      description:
        "Professional email support with quick response times and detailed documentation.",
      icon: <Mail className="w-12 h-12" />,
      features: [
        "4-hour response time",
        "Professional communication",
        "Detailed case tracking",
        "Template customization",
        "Priority queue management",
        "Follow-up automation",
      ],
      gradient: "from-green-500 to-emerald-600",
    },
    {
      title: "Phone Support",
      description:
        "Direct phone support with trained professionals for complex issues and urgent matters.",
      icon: <Phone className="w-12 h-12" />,
      features: [
        "Trained support agents",
        "Call recording & analysis",
        "IVR system integration",
        "Escalation protocols",
        "Quality assurance",
        "Performance metrics",
      ],
      gradient: "from-purple-500 to-violet-600",
    },
    {
      title: "Technical Support",
      description:
        "Specialized technical support for complex product issues and troubleshooting.",
      icon: <Shield className="w-12 h-12" />,
      features: [
        "Expert technical knowledge",
        "Advanced troubleshooting",
        "Product integration help",
        "Bug report handling",
        "Documentation updates",
        "Developer liaison",
      ],
      gradient: "from-orange-500 to-red-600",
    },
  ];

  const benefits = [
    {
      title: "24/7 Availability",
      description: "Round-the-clock support across all time zones",
      icon: <Clock className="w-8 h-8" />,
    },
    {
      title: "Multilingual Team",
      description: "Support in 15+ languages worldwide",
      icon: <Users className="w-8 h-8" />,
    },
    {
      title: "Fast Response",
      description: "Average response time under 2 minutes",
      icon: <Zap className="w-8 h-8" />,
    },
    {
      title: "High Satisfaction",
      description: "98% customer satisfaction rating",
      icon: <Star className="w-8 h-8" />,
    },
  ];

  const stats = [
    { number: "50M+", label: "Tickets Resolved" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "2min", label: "Avg Response Time" },
    { number: "24/7", label: "Support Coverage" },
  ];

  return (
    <PageLayout
      title="Customer Support Excellence"
      subtitle="Comprehensive support solutions that delight your customers"
      description="From AI-powered live chat to specialized technical support, we provide the complete customer service experience your business needs."
      heroGradient="from-blue-50 to-indigo-50"
      ctaTitle="Ready to transform your customer support?"
      ctaDescription="Let's discuss how our comprehensive support solutions can enhance your customer experience."
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
                <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-heading">
              Complete Support Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our comprehensive range of customer support services,
              each designed to meet specific business needs and customer
              expectations.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {supportTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  className={`h-full border-2 hover:shadow-2xl transition-all duration-300 ${
                    type.popular
                      ? "border-blue-200 ring-2 ring-blue-100"
                      : "border-gray-200"
                  }`}
                >
                  <CardContent className="p-8">
                    {type.popular && (
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-4 inline-block">
                        Most Popular
                      </div>
                    )}

                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${type.gradient} rounded-2xl flex items-center justify-center text-white mb-6`}
                    >
                      {type.icon}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-4 font-heading">
                      {type.title}
                    </h3>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {type.description}
                    </p>

                    <ul className="space-y-3 mb-8">
                      {type.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center space-x-3"
                        >
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3 font-bold">
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

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-heading">
              Why Choose Our Support
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We deliver exceptional customer support experiences that build
              loyalty and drive business growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-heading">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Support Spotlight */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Bot className="w-20 h-20 mx-auto mb-8 opacity-90" />
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-heading">
                AI-Powered Live Chat Support
              </h2>
              <p className="text-xl mb-8 opacity-90 leading-relaxed">
                Our advanced AI chat system combines machine learning with human
                expertise to deliver instant, accurate responses while
                maintaining the personal touch your customers expect.
              </p>
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div>
                  <div className="text-3xl font-bold mb-2">99.9%</div>
                  <div className="opacity-90">Uptime Guarantee</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">&lt;30s</div>
                  <div className="opacity-90">Response Time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">15+</div>
                  <div className="opacity-90">Languages</div>
                </div>
              </div>
              <Link href="/contact">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 rounded-full px-8 py-3 font-bold text-lg shadow-lg">
                  Try AI Chat Support
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
