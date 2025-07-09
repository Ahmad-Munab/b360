"use client";

import { PageLayout } from "@/components/layout/PageLayout";
import { ContentSection } from "@/components/layout/ContentSection";
import { MessageSquare, Zap, Users, Bot, TrendingUp, Shield } from "lucide-react";

export default function LiveChatPage() {
  const features = [
    {
      title: "Real-Time Chat Support",
      description: "Instant customer assistance through live chat with quick response times and personalized, conversational support experiences.",
      icon: <MessageSquare className="w-12 h-12" />,
    },
    {
      title: "Instant Response",
      description: "Lightning-fast response times with agents ready to assist customers immediately, reducing bounce rates and improving satisfaction.",
      icon: <Zap className="w-12 h-12" />,
    },
    {
      title: "Multi-Chat Management",
      description: "Skilled agents efficiently handle multiple chat conversations simultaneously while maintaining quality and personalization.",
      icon: <Users className="w-12 h-12" />,
    },
    {
      title: "AI-Powered Assistance",
      description: "Smart chatbot integration for initial triage and common queries, seamlessly escalating to human agents when needed.",
      icon: <Bot className="w-12 h-12" />,
    },
    {
      title: "Conversion Optimization",
      description: "Proactive chat engagement and sales-focused conversations to convert website visitors into customers.",
      icon: <TrendingUp className="w-12 h-12" />,
    },
    {
      title: "Secure Conversations",
      description: "End-to-end encrypted chat sessions with secure data handling and compliance with privacy regulations.",
      icon: <Shield className="w-12 h-12" />,
    },
  ];

  const benefits = [
    {
      title: "Increased Conversions",
      description: "Proactive chat engagement and expert sales assistance significantly boost website conversion rates.",
      metric: "35% Higher",
    },
    {
      title: "Faster Resolution",
      description: "Real-time communication enables quick problem-solving and immediate customer satisfaction.",
      metric: "< 2 minutes",
    },
    {
      title: "Cost Effective",
      description: "Live chat support costs significantly less than phone support while delivering superior customer experiences.",
      metric: "60% Savings",
    },
    {
      title: "Customer Preference",
      description: "Modern customers prefer chat support for its convenience, speed, and non-intrusive nature.",
      metric: "87% Prefer Chat",
    },
  ];

  const stats = [
    { value: "< 10 sec", label: "Average Response Time" },
    { value: "96%", label: "Customer Satisfaction" },
    { value: "4.2x", label: "Conversion Increase" },
    { value: "24/7", label: "Availability" },
  ];

  const testimonial = {
    quote: "B360's live chat support has revolutionized our customer engagement. The instant responses and proactive assistance have dramatically improved our conversion rates and customer satisfaction.",
    author: "David Kim",
    company: "E-Commerce Plus",
  };

  return (
    <PageLayout
      title="Live Chat Support"
      subtitle="Instant, personalized customer assistance through live chat"
      description="Real-time chat support that engages customers, resolves issues quickly, and drives conversions with professional, friendly assistance."
      heroGradient="from-purple-50 to-emerald-50"
      ctaTitle="Ready to enhance your live chat experience?"
      ctaDescription="Let our chat specialists help you provide instant, engaging customer support that drives results."
    >
      <ContentSection
        title="Instant Customer Engagement"
        description="Our live chat support services provide immediate, personalized assistance that keeps customers engaged and drives conversions."
        features={features}
        className="bg-white"
      />

      <ContentSection
        title="Chat Support Excellence"
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
