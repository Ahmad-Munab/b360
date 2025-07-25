"use client";

import { motion } from "framer-motion";
import { PageLayout } from "@/components/public/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, ArrowRight, Target } from "lucide-react";
import Link from "next/link";

export default function EmailMarketingPage() {
  const services = [
    {
      title: "Email Marketing",
      description:
        "Engage your audience with personalized email campaigns, automation, and detailed analytics.",
      icon: <Mail className="w-12 h-12" />,
      features: [
        "Custom HTML templates",
        "Personalized content (user's name, offers, etc.)",
        "Product picture integration",
        "Sales and subscription emails",
        "Reminder and cart abandonment emails",
        "A/B testing and optimization",
        "Audience segmentation",
        "Campaign automation",
        "Performance analytics",
        "Compliance and deliverability",
        "Lead nurturing campaigns",
        "Transactional emails",
      ],
      gradient: "from-green-500 to-teal-600",
      popular: true,
    },
  ];

  const stats = [
    { number: "1M+", label: "Emails Sent Monthly" },
    { number: "25%", label: "Avg. Open Rate" },
    { number: "5%", label: "Avg. Click-Through" },
    { number: "100+", label: "Happy Clients" },
  ];

  return (
    <PageLayout
      title="Email Marketing Services"
      subtitle="Connect with your customers through targeted email campaigns"
      description="From personalized newsletters to automated marketing funnels, we help you build lasting relationships and drive conversions with our expert email marketing services."
      heroGradient="from-green-50 to-teal-50"
      ctaTitle="Ready to boost your engagement?"
      ctaDescription="Let's create an email marketing strategy that delivers results."
      ctaButtonText="Get Started"
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
                <div className="text-4xl lg:text-5xl font-bold text-green-600 mb-2">
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
              Comprehensive Email Marketing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide end-to-end email marketing solutions to help you
              connect with your audience and grow your business.
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
                <Card className="border-2 border-green-200 ring-2 ring-green-100 hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-10">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-6 inline-block">
                      Core Service
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
                          Key Features:
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
                          Advanced Capabilities:
                        </h4>
                        <ul className="space-y-3">
                          {service.features
                            .slice(6)
                            .map((feature, featureIndex) => (
                              <li
                                key={featureIndex}
                                className="flex items-center space-x-3"
                              >
                                <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0" />
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>

                    <div className="text-center">
                      <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-full px-8 py-4 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                        Launch Your Campaign
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Email Marketing Spotlight */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-teal-700">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center text-white mb-16"
            >
              <Target className="w-20 h-20 mx-auto mb-8 opacity-90" />
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-heading">
                Targeted Email Strategies
              </h2>
              <p className="text-xl opacity-90 leading-relaxed max-w-3xl mx-auto">
                We craft data-driven email campaigns that resonate with your
                audience, drive engagement, and deliver measurable results.
              </p>
            </motion.div>

            <div className="text-center">
              <Link href="/contact">
                <Button className="bg-white text-green-600 hover:bg-gray-100 rounded-full px-8 py-3 font-bold text-lg shadow-lg">
                  Start Your Campaign
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
