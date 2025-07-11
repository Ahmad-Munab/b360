"use client";

import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { ContentSection } from "@/components/layout/ContentSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap, Crown, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const pricingPlans = [
    {
      name: "Starter",
      price: "$2,500",
      period: "/month",
      description:
        "Perfect for small businesses getting started with professional customer support",
      icon: <Star className="w-8 h-8" />,
      features: [
        "Up to 500 tickets/month",
        "Email & live chat support",
        "Basic AI chat integration",
        "5-agent dedicated team",
        "4-hour response time SLA",
        "Business hours coverage (8AM-6PM)",
        "Basic training & onboarding",
        "Monthly performance reports",
        "Standard integrations (5 platforms)",
      ],
      popular: false,
      gradient: "from-blue-500 to-blue-600",
      savings: null,
    },
    {
      name: "Professional",
      price: "$5,500",
      period: "/month",
      description:
        "Comprehensive support solution for growing businesses with higher volume needs",
      icon: <Zap className="w-8 h-8" />,
      features: [
        "Up to 2,000 tickets/month",
        "All channels (email, chat, phone, social)",
        "Advanced AI chat with human escalation",
        "15-agent specialized team",
        "2-hour priority response time SLA",
        "Extended hours coverage (6AM-10PM)",
        "Advanced training & certification",
        "Dedicated account manager",
        "Custom workflows & automations",
        "Advanced analytics & insights",
        "Premium integrations (15+ platforms)",
        "Quality assurance program",
      ],
      popular: true,
      gradient: "from-indigo-500 to-indigo-600",
      savings: "Save 15%",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description:
        "Fully customized support solutions for large enterprises with complex requirements",
      icon: <Crown className="w-8 h-8" />,
      features: [
        "Unlimited tickets & volume",
        "All channels + custom integrations",
        "Real-time dashboards & BI analytics",
        "Scalable team (25+ specialized agents)",
        "Instant response time (<30 minutes)",
        "24/7 global coverage across time zones",
        "White-label & co-branded solutions",
        "Dedicated customer success team",
        "Custom SLAs & performance KPIs",
        "Advanced security & compliance (SOC2, GDPR)",
        "Multi-language support (20+ languages)",
        "Custom API development",
        "Dedicated infrastructure & servers",
      ],
      popular: false,
      gradient: "from-purple-500 to-purple-600",
      savings: "Best Value",
    },
  ];

  const features = [
    {
      title: "Transparent Pricing",
      description:
        "No hidden fees or surprise charges. Our pricing is straightforward and scales with your business needs.",
      icon: <Check className="w-12 h-12" />,
    },
    {
      title: "Flexible Scaling",
      description:
        "Easily upgrade or downgrade your plan as your business grows. Pay only for what you need.",
      icon: <Zap className="w-12 h-12" />,
    },
    {
      title: "ROI Guarantee",
      description:
        "We're confident in our value. Most clients see positive ROI within the first 90 days.",
      icon: <Star className="w-12 h-12" />,
    },
  ];

  const stats = [
    { value: "90%", label: "Client Retention Rate" },
    { value: "< 2 weeks", label: "Implementation Time" },
    { value: "40%", label: "Average Cost Savings" },
    { value: "24/7", label: "Support Availability" },
  ];

  return (
    <PageLayout
      title="Simple, Transparent Pricing"
      subtitle="Choose the perfect plan for your customer support needs"
      description="Flexible pricing options that scale with your business, from startups to enterprise organizations."
      heroGradient="from-emerald-50 to-indigo-50"
      ctaTitle="Ready to get started?"
      ctaDescription="Contact us for a custom quote or to discuss your specific requirements."
      ctaButtonText="Get Custom Quote"
    >
      {/* Pricing Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  className={`relative border-2 hover:shadow-xl transition-all duration-300 h-full ${
                    plan.popular
                      ? "border-indigo-200 shadow-lg scale-105"
                      : "border-gray-200 hover:border-blue-200"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {plan.savings && !plan.popular && (
                    <div className="absolute -top-4 right-4">
                      <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                        {plan.savings}
                      </span>
                    </div>
                  )}

                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <div
                        className={`w-16 h-16 bg-gradient-to-r ${plan.gradient} rounded-full flex items-center justify-center mx-auto mb-4 text-white`}
                      >
                        {plan.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 font-heading">
                        {plan.name}
                      </h3>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-gray-900">
                          {plan.price}
                        </span>
                        <span className="text-gray-600">{plan.period}</span>
                      </div>
                      <p className="text-gray-600">{plan.description}</p>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start space-x-3"
                        >
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href="/contact" className="block">
                      <Button
                        className={`w-full py-3 font-bold rounded-full ${
                          plan.popular
                            ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                            : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                        }`}
                      >
                        {plan.price === "Custom"
                          ? "Contact Sales"
                          : "Get Started"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ContentSection
        title="Why Choose B360?"
        description="Our pricing reflects our commitment to delivering exceptional value and measurable results for your business."
        features={features}
        stats={stats}
        className="bg-gray-50"
      />
    </PageLayout>
  );
}
