"use client";

import { PageLayout } from "@/components/layout/PageLayout";
import { ContentSection } from "@/components/layout/ContentSection";
import { MessageCircle, Globe, Heart, TrendingUp, Users, Award } from "lucide-react";

export default function GeneralSupportPage() {
  const features = [
    {
      title: "Omnichannel Support",
      description: "Seamless customer support across email, chat, phone, and social media channels with unified conversation history.",
      icon: <MessageCircle className="w-12 h-12" />,
    },
    {
      title: "Global Coverage",
      description: "24/7 support in multiple languages and time zones, ensuring your customers always have access to help when they need it.",
      icon: <Globe className="w-12 h-12" />,
    },
    {
      title: "Empathetic Service",
      description: "Customer-first approach with agents trained in emotional intelligence and conflict resolution for positive interactions.",
      icon: <Heart className="w-12 h-12" />,
    },
    {
      title: "Performance Analytics",
      description: "Detailed reporting and analytics to track support metrics, customer satisfaction, and identify improvement opportunities.",
      icon: <TrendingUp className="w-12 h-12" />,
    },
    {
      title: "Scalable Teams",
      description: "Flexible team scaling to handle seasonal peaks, product launches, and business growth without compromising quality.",
      icon: <Users className="w-12 h-12" />,
    },
    {
      title: "Quality Assurance",
      description: "Rigorous quality monitoring and continuous training programs to maintain high service standards and customer satisfaction.",
      icon: <Award className="w-12 h-12" />,
    },
  ];

  const benefits = [
    {
      title: "Improved Customer Satisfaction",
      description: "Our empathetic approach and quick resolution times consistently achieve high customer satisfaction scores.",
      metric: "4.8/5 CSAT",
    },
    {
      title: "Reduced Response Times",
      description: "Efficient ticket routing and skilled agents ensure customers receive prompt responses to their inquiries.",
      metric: "< 1 hour",
    },
    {
      title: "Cost Optimization",
      description: "Streamlined processes and efficient resource allocation reduce your overall customer support costs.",
      metric: "30% Savings",
    },
    {
      title: "Brand Protection",
      description: "Professional, consistent service delivery protects and enhances your brand reputation across all touchpoints.",
      metric: "99% Brand Compliance",
    },
  ];

  const stats = [
    { value: "98%", label: "Customer Satisfaction" },
    { value: "< 30 sec", label: "Average Response Time" },
    { value: "50+", label: "Languages Supported" },
    { value: "24/7", label: "Global Availability" },
  ];

  const testimonial = {
    quote: "B360 transformed our customer support experience. Their team's professionalism and genuine care for our customers has significantly improved our brand reputation and customer loyalty.",
    author: "Michael Rodriguez",
    company: "GrowthTech Inc.",
  };

  return (
    <PageLayout
      title="General Customer Support"
      subtitle="Comprehensive customer support that puts your customers first"
      description="Professional, empathetic support across all channels, designed to enhance customer satisfaction and build lasting relationships."
      heroGradient="from-emerald-50 to-blue-50"
      ctaTitle="Ready to elevate your customer support?"
      ctaDescription="Let us help you create exceptional customer experiences that drive loyalty and growth."
    >
      <ContentSection
        title="Complete Customer Care Solution"
        description="Our general customer support services provide comprehensive assistance across all customer touchpoints, ensuring consistent, high-quality experiences."
        features={features}
        className="bg-white"
      />

      <ContentSection
        title="Measurable Impact"
        stats={stats}
        benefits={benefits}
        className="bg-gray-50"
      />

      <ContentSection
        testimonial={testimonial}
        className="bg-white"
      />
    </PageLayout>
  );
}
