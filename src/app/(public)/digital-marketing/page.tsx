"use client";

import { motion } from "framer-motion";
import { PageLayout } from "@/components/public/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Target,
  BarChart3,
  Search,
  Share2,
  Mail,
  Globe,
  CheckCircle,
  ArrowRight,
  Eye,
  MousePointer,
} from "lucide-react";
import Link from "next/link";

export default function DigitalMarketingPage() {
  const services = [
    {
      title: "Search Engine Optimization",
      description:
        "Boost your organic visibility and drive qualified traffic with data-driven SEO strategies.",
      icon: <Search className="w-12 h-12" />,
      features: [
        "Keyword research & strategy",
        "On-page optimization",
        "Technical SEO audits",
        "Link building campaigns",
        "Local SEO optimization",
        "Performance tracking & reporting",
      ],
      gradient: "from-green-500 to-emerald-600",
      popular: true,
    },
    {
      title: "Pay-Per-Click Advertising",
      description:
        "Maximize ROI with targeted PPC campaigns across Google Ads, Facebook, and other platforms.",
      icon: <MousePointer className="w-12 h-12" />,
      features: [
        "Google Ads management",
        "Facebook & Instagram ads",
        "Campaign optimization",
        "A/B testing & analytics",
        "Conversion tracking",
        "Budget optimization",
      ],
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      title: "Social Media Marketing",
      description:
        "Build brand awareness and engage your audience across all major social platforms.",
      icon: <Share2 className="w-12 h-12" />,
      features: [
        "Content strategy & creation",
        "Community management",
        "Influencer partnerships",
        "Social media advertising",
        "Analytics & reporting",
        "Brand reputation management",
      ],
      gradient: "from-purple-500 to-violet-600",
    },
    {
      title: "Content Marketing",
      description:
        "Create compelling content that drives engagement, builds authority, and converts visitors.",
      icon: <Mail className="w-12 h-12" />,
      features: [
        "Content strategy development",
        "Blog writing & optimization",
        "Video content creation",
        "Email marketing campaigns",
        "Lead magnets & resources",
        "Content performance analysis",
      ],
      gradient: "from-orange-500 to-red-600",
    },
  ];

  const benefits = [
    {
      title: "Increased Visibility",
      description:
        "Get found by your ideal customers across all digital channels",
      icon: <Eye className="w-8 h-8" />,
    },
    {
      title: "Higher Conversions",
      description: "Turn more visitors into customers with optimized campaigns",
      icon: <TrendingUp className="w-8 h-8" />,
    },
    {
      title: "Better ROI",
      description: "Maximize your marketing budget with data-driven strategies",
      icon: <BarChart3 className="w-8 h-8" />,
    },
    {
      title: "Brand Authority",
      description: "Establish your business as a trusted industry leader",
      icon: <Target className="w-8 h-8" />,
    },
  ];

  const stats = [
    { number: "300%", label: "Avg Traffic Increase" },
    { number: "150%", label: "ROI Improvement" },
    { number: "24/7", label: "Campaign Monitoring" },
    { number: "50+", label: "Marketing Experts" },
  ];

  const process = [
    {
      step: "01",
      title: "Strategy Development",
      description:
        "We analyze your business, competitors, and target audience to create a comprehensive digital marketing strategy.",
    },
    {
      step: "02",
      title: "Campaign Launch",
      description:
        "Our experts implement and launch your campaigns across selected channels with proper tracking and optimization.",
    },
    {
      step: "03",
      title: "Optimization & Growth",
      description:
        "We continuously monitor, test, and optimize your campaigns to maximize performance and ROI.",
    },
    {
      step: "04",
      title: "Reporting & Analysis",
      description:
        "Receive detailed reports and insights to understand your marketing performance and plan future strategies.",
    },
  ];

  return (
    <PageLayout
      title="Digital Marketing Excellence"
      subtitle="Drive growth with data-driven digital marketing strategies"
      description="From SEO and PPC to social media and content marketing, we help businesses achieve measurable results and sustainable growth online."
      heroGradient="from-purple-50 to-pink-50"
      ctaTitle="Ready to accelerate your digital growth?"
      ctaDescription="Let's create a custom digital marketing strategy that drives real results for your business."
      ctaButtonText="Get Marketing Consultation"
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
                <div className="text-4xl lg:text-5xl font-bold text-purple-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-heading">
              Complete Digital Marketing Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From strategy to execution, we provide comprehensive digital
              marketing services that drive measurable results.
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
                      ? "border-purple-200 ring-2 ring-purple-100"
                      : "border-gray-200"
                  }`}
                >
                  <CardContent className="p-8">
                    {service.popular && (
                      <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-4 inline-block">
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

                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full py-3 font-bold">
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
              Why Choose Our Digital Marketing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We deliver measurable results that drive real business growth and
              long-term success.
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
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mx-auto mb-6">
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

      {/* Process Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-700">
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
                Our Proven Process
              </h2>
              <p className="text-xl opacity-90 leading-relaxed max-w-3xl mx-auto">
                We follow a systematic approach to ensure your digital marketing
                campaigns deliver maximum impact and ROI.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center text-white"
                >
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 font-heading">
                    {step.title}
                  </h3>
                  <p className="opacity-90 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/contact">
                <Button className="bg-white text-purple-600 hover:bg-gray-100 rounded-full px-8 py-3 font-bold text-lg shadow-lg">
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
