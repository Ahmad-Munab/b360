"use client";

import { PageLayout } from "@/components/public/layout/PageLayout";
import { ContentSection } from "@/components/public/layout/ContentSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const generalPlan = {
    name: "General Support",
    price: "$8",
    period: "/hr",
    description: "Flexible, high-quality support for your everyday needs.",
    features: [
      "24/7 Email Support",
      "Live Chat Assistance",
      "Dedicated Account Manager",
      "Monthly Performance Reports",
      "Access to Knowledge Base",
    ],
    ctaText: "Get Started",
    ctaHref: "/contact",
  };

  const features = [
    {
      title: "Pay As You Go",
      description:
        "No long-term contracts. Our hourly rate gives you the flexibility to scale support as you need it.",
      icon: <Check className="w-12 h-12" />,
    },
    {
      title: "Expert Team",
      description:
        "Our support specialists are highly trained and ready to assist your customers with any inquiry.",
      icon: <Check className="w-12 h-12" />,
    },
    {
      title: "Seamless Integration",
      description:
        "We integrate with your existing tools and workflows to provide a seamless support experience.",
      icon: <Check className="w-12 h-12" />,
    },
  ];

  return (
    <PageLayout
      title="Simple & Transparent Pricing"
      subtitle="No contracts, no hidden fees. Just straightforward hourly pricing for top-tier support."
      heroGradient="from-green-50 to-cyan-50"
    >
      {/* Pricing Card */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="max-w-md w-full">
            <Card className="border-2 border-gray-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300 h-full">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 font-heading">
                    {generalPlan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-gray-900">
                      {generalPlan.price}
                    </span>
                    <span className="text-xl text-gray-600">{generalPlan.period}</span>
                  </div>
                  <p className="text-gray-600">{generalPlan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {generalPlan.features.map((feature, featureIndex) => (
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

                <Link href={generalPlan.ctaHref}>
                  <Button className="w-full py-3 font-bold rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                    {generalPlan.ctaText}
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
