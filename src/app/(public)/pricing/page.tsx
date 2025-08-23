"use client";

import { PageLayout } from "@/components/public/layout/PageLayout";
import { ContentSection } from "@/components/public/layout/ContentSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Users, Clock, Shield } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const plan = {
    name: "Support On Demand",
    price: "$8",
    period: "/hr",
    description:
      "One simple hourly plan. World-class agents ready when you are.",
    features: [
      "24/7 Email & Live Chat",
      "Phone Support",
      "Dedicated Account Manager",
      "Performance Reporting",
      "Knowledge Base Access",
      "Multi-language Support",
    ],
    ctaText: "Get Started",
    ctaHref: "/contact",
    gradient: "from-blue-500 to-blue-600",
    icon: <Users className="w-8 h-8" />,
  };

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
      {/* Pricing */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              One Simple Plan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transparent hourly pricing. No contracts. Scale up or down anytime.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Card className="border-2 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${plan.gradient} rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 font-heading">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-xl text-gray-600">{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <ul className="grid md:grid-cols-2 gap-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.ctaHref}>
                  <Button className="w-full py-3 font-bold rounded-full text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                    {plan.ctaText}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
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
