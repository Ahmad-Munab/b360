"use client";

import { PageLayout } from "@/components/layout/PageLayout";
import { ContentSection } from "@/components/layout/ContentSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap, Crown } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const pricingPlans = [
    {
      name: "Starter",
      price: "$2,500",
      period: "/month",
      description: "Perfect for small businesses getting started with professional customer support",
      icon: <Star className="w-8 h-8" />,
      features: [
        "Up to 500 tickets/month",
        "Email & chat support",
        "Basic reporting",
        "5 agent team",
        "Standard response time (4 hours)",
        "Business hours coverage",
        "Basic training included",
      ],
      popular: false,
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      name: "Professional",
      price: "$5,500",
      period: "/month",
      description: "Comprehensive support solution for growing businesses with higher volume needs",
      icon: <Zap className="w-8 h-8" />,
      features: [
        "Up to 2,000 tickets/month",
        "All channels (email, chat, phone)",
        "Advanced analytics & reporting",
        "15 agent team",
        "Priority response time (2 hours)",
        "Extended hours coverage (16/7)",
        "Specialized training & onboarding",
        "Dedicated account manager",
        "Custom workflows",
      ],
      popular: true,
      gradient: "from-indigo-500 to-indigo-600",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Fully customized support solutions for large enterprises with complex requirements",
      icon: <Crown className="w-8 h-8" />,
      features: [
        "Unlimited tickets",
        "All channels + custom integrations",
        "Real-time dashboards & BI",
        "Scalable team (25+ agents)",
        "Instant response time (<30 min)",
        "24/7 global coverage",
        "White-label solutions",
        "Dedicated success team",
        "Custom SLAs & KPIs",
        "Advanced security & compliance",
      ],
      popular: false,
      gradient: "from-purple-500 to-purple-600",
    },
  ];

  const features = [
    {
      title: "Transparent Pricing",
      description: "No hidden fees or surprise charges. Our pricing is straightforward and scales with your business needs.",
      icon: <Check className="w-12 h-12" />,
    },
    {
      title: "Flexible Scaling",
      description: "Easily upgrade or downgrade your plan as your business grows. Pay only for what you need.",
      icon: <Zap className="w-12 h-12" />,
    },
    {
      title: "ROI Guarantee",
      description: "We're confident in our value. Most clients see positive ROI within the first 90 days.",
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
              <Card
                key={index}
                className={`relative border-2 hover:shadow-xl transition-all duration-300 ${
                  plan.popular
                    ? "border-indigo-200 shadow-lg scale-105"
                    : "border-gray-200 hover:border-emerald-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${plan.gradient} rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>
                      {plan.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 font-heading">
                      {plan.name}
                    </h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/contact" className="block">
                    <Button
                      className={`w-full py-3 font-bold ${
                        plan.popular
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                          : "bg-gradient-emerald-indigo hover:opacity-90 text-white"
                      }`}
                    >
                      {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
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
