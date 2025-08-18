"use client";

import { PageLayout } from "@/components/public/layout/PageLayout";
import { ContentSection } from "@/components/public/layout/ContentSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Users, Clock, Shield } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const pricingPlans = [
    {
      name: "General Support",
      price: "$8",
      period: "/hr",
      description: "Flexible, high-quality support for your everyday needs with dedicated professionals.",
      features: [
        "24/7 Email Support",
        "Live Chat Assistance", 
        "Phone Support",
        "Dedicated Account Manager",
        "Monthly Performance Reports",
        "Access to Knowledge Base",
        "Multi-language Support",
        "CRM Integration",
      ],
      ctaText: "Get Started",
      ctaHref: "/contact",
      popular: false,
      gradient: "from-blue-500 to-blue-600",
      icon: <Users className="w-8 h-8" />,
    },
    {
      name: "Dedicated Teams",
      price: "$11",
      period: "/hr",
      description: "Full-time, rigorously vetted teams with month-to-month contracts and complete dedication.",
      features: [
        "Omnichannel support",
        "Scale up or down with 24hr notice",
        "Onboarding, Management, QA included",
        "Team lead(s) included",
        "365/24/7 coverage in 60+ languages",
        "100% dedicated to your account",
        "AI-enabled helpdesk solutions",
        "Seasonal & holiday support",
      ],
      ctaText: "Contact for Pricing",
      ctaHref: "/contact",
      popular: true,
      gradient: "from-emerald-500 to-indigo-500",
      icon: <Shield className="w-8 h-8" />,
    },
  ];

  const features = [
    {
      title: "Flexible Pricing",
      description:
        "No long-term contracts or hidden fees. We believe in transparent, flexible pricing that scales with your business needs.",
      icon: <Check className="w-12 h-12" />,
    },
    {
      title: "Outsourced Support, In-House Feel",
      description:
        "Never miss a ping again. We build fully managed teams who embody your voice, align with your values, and bring deep expertise.",
      icon: <Clock className="w-12 h-12" />,
    },
    {
      title: "No Commitment Required",
      description:
        "Start with a demo or consultation. No commitments needed - we'll prove our value before you invest.",
      icon: <Shield className="w-12 h-12" />,
    },
  ];

  return (
    <PageLayout
      title="Simple & Transparent Pricing"
      subtitle="✈️ Outsourced Support, In-House Feel 💗"
      description="No contracts, no hidden fees. Just straightforward hourly pricing for top-tier support that scales with your business."
      heroGradient="from-green-50 to-cyan-50"
    >
      {/* Pricing Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Support Model
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Whether you need flexible hourly support or dedicated teams, we have the perfect solution for your business needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`border-2 hover:shadow-xl transition-all duration-300 h-full ${
                  plan.popular
                    ? "border-emerald-200 shadow-lg scale-105 relative"
                    : "border-gray-200 hover:border-blue-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-emerald-500 to-indigo-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                      Most Popular
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
                      <span className="text-5xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-xl text-gray-600">{plan.period}</span>
                      {plan.name === "Dedicated Teams" && (
                        <div className="text-sm text-gray-500 mt-1">per agent</div>
                      )}
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

                  <Link href={plan.ctaHref}>
                    <Button 
                      className={`w-full py-3 font-bold rounded-full text-white ${
                        plan.popular
                          ? "bg-gradient-to-r from-emerald-500 to-indigo-500 hover:from-emerald-600 hover:to-indigo-600"
                          : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      }`}
                    >
                      {plan.ctaText}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-lg text-gray-600 mb-4">
              Need AI-powered solutions? 
            </p>
            <Link href="/ai-pricing">
              <Button variant="outline" className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-8 py-3 text-lg font-semibold rounded-xl">
                View AI Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <ContentSection
        title="Why Choose B360?"
        description="Our pricing reflects our commitment to delivering exceptional value and measurable results for your business."
        features={features}
        className="bg-gray-50"
      />
    </PageLayout>
  );
}
