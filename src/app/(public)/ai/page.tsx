"use client";

import { PageLayout } from "@/components/public/layout/PageLayout";
import { ContentSection } from "@/components/public/layout/ContentSection";
import {
  MessageSquare,
  Zap,
  Users,
  Bot,
  TrendingUp,
  Shield,
  Brain,
  Cpu,
  Sparkles,
} from "lucide-react";

export default function AIPage() {
  const features = [
    {
      title: "AI Chat Support",
      description:
        "Advanced AI-powered chat support with natural language processing for instant, accurate responses to customer inquiries.",
      icon: <Bot className="w-12 h-12" />,
    },
    {
      title: "Intelligent Automation",
      description:
        "Smart automation that learns from interactions to provide increasingly personalized and efficient customer experiences.",
      icon: <Brain className="w-12 h-12" />,
    },
    {
      title: "Real-Time Processing",
      description:
        "Lightning-fast AI processing that delivers instant responses while maintaining context and conversation flow.",
      icon: <Zap className="w-12 h-12" />,
    },
    {
      title: "Multi-Language Support",
      description:
        "AI that communicates fluently in multiple languages, breaking down barriers for global customer support.",
      icon: <MessageSquare className="w-12 h-12" />,
    },
    {
      title: "Seamless Escalation",
      description:
        "Smart escalation to human agents when needed, with full context transfer for smooth conversation handoffs.",
      icon: <Users className="w-12 h-12" />,
    },
    {
      title: "Advanced Analytics",
      description:
        "Deep insights into customer interactions, sentiment analysis, and performance metrics to optimize support quality.",
      icon: <TrendingUp className="w-12 h-12" />,
    },
    {
      title: "Enterprise Security",
      description:
        "Bank-level security with end-to-end encryption and compliance with global data protection regulations.",
      icon: <Shield className="w-12 h-12" />,
    },
    {
      title: "Continuous Learning",
      description:
        "AI that continuously learns and improves from every interaction, becoming smarter and more effective over time.",
      icon: <Cpu className="w-12 h-12" />,
    },
    {
      title: "Personalized Experiences",
      description:
        "AI that remembers customer preferences and history to deliver highly personalized support experiences.",
      icon: <Sparkles className="w-12 h-12" />,
    },
  ];

  const benefits = [
    {
      title: "Instant Response",
      description:
        "AI provides immediate answers to customer queries, eliminating wait times and improving satisfaction.",
      metric: "< 1 second",
    },
    {
      title: "24/7 Availability",
      description:
        "Round-the-clock AI support ensures customers get help whenever they need it, across all time zones.",
      metric: "Always On",
    },
    {
      title: "Cost Reduction",
      description:
        "AI handles routine inquiries efficiently, reducing operational costs while maintaining high service quality.",
      metric: "70% Savings",
    },
    {
      title: "Accuracy Rate",
      description:
        "Advanced AI algorithms deliver highly accurate responses, continuously improving through machine learning.",
      metric: "95% Accurate",
    },
  ];

  const stats = [
    { value: "< 1 sec", label: "Response Time" },
    { value: "95%", label: "Accuracy Rate" },
    { value: "24/7", label: "Availability" },
    { value: "50+ Languages", label: "Supported" },
  ];

  const testimonial = {
    quote:
      "B360's AI chat support has revolutionized our customer service. The AI handles 80% of our inquiries instantly while seamlessly escalating complex issues to our human agents. Our customers love the immediate responses.",
    author: "Sarah Chen",
    company: "TechFlow Solutions",
  };

  return (
    <PageLayout
      title="AI-Powered Customer Support"
      subtitle="Intelligent chat support that never sleeps"
      description="Advanced AI technology that provides instant, accurate, and personalized customer support experiences while seamlessly integrating with human agents."
      heroGradient="from-emerald-50 to-indigo-50"
      ctaTitle="Ready to transform your support with AI?"
      ctaDescription="Let our AI specialists help you implement intelligent customer support that delights customers and reduces costs."
      ctaButtonText="Get Started with AI"
      secondaryCtaButtonText="View AI Pricing"
      secondaryCtaHref="/ai-pricing"
    >
      <ContentSection
        title="Next-Generation AI Support"
        description="Our AI-powered chat support combines cutting-edge technology with human expertise to deliver exceptional customer experiences."
        features={features}
        className="bg-white"
      />

      <ContentSection
        title="AI Support Excellence"
        stats={stats}
        benefits={benefits}
        className="bg-gray-50"
      />

      <ContentSection testimonial={testimonial} className="bg-white" />
    </PageLayout>
  );
}
