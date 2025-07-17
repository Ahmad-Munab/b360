"use client";

import { PageLayout } from "@/components/layout/PageLayout";
import { ContentSection } from "@/components/layout/ContentSection";
import {
  Home,
  Calendar,
  MessageCircle,
  FileText,
  Users,
  MapPin,
} from "lucide-react";

export default function RealEstatePage() {
  const features = [
    {
      title: "Lead Qualification & Nurturing",
      description:
        "Expert lead qualification, follow-up, and nurturing to convert prospects into qualified buyers and sellers.",
      icon: <Users className="w-12 h-12" />,
    },
    {
      title: "Property Inquiry Management",
      description:
        "Professional handling of property inquiries, virtual tour scheduling, and detailed property information delivery.",
      icon: <Home className="w-12 h-12" />,
    },
    {
      title: "Appointment Scheduling",
      description:
        "Seamless coordination of property viewings, consultations, and meetings between agents and clients.",
      icon: <Calendar className="w-12 h-12" />,
    },
    {
      title: "24/7 Live Chat Support",
      description:
        "Round-the-clock chat support to capture leads and provide immediate assistance to website visitors.",
      icon: <MessageCircle className="w-12 h-12" />,
    },
    {
      title: "Document Management",
      description:
        "Assistance with contract processing, document collection, and transaction coordination support.",
      icon: <FileText className="w-12 h-12" />,
    },
    {
      title: "Market Information Support",
      description:
        "Providing clients with market insights, neighborhood information, and property value assessments.",
      icon: <MapPin className="w-12 h-12" />,
    },
  ];

  const benefits = [
    {
      title: "Lead Conversion",
      description:
        "Professional lead handling and follow-up significantly improves conversion rates from inquiries to sales.",
      metric: "45% Higher",
    },
    {
      title: "Response Time",
      description:
        "Immediate response to property inquiries captures more leads and prevents them from going to competitors.",
      metric: "< 2 minutes",
    },
    {
      title: "Client Satisfaction",
      description:
        "Exceptional support throughout the buying/selling process leads to higher client satisfaction and referrals.",
      metric: "95% Satisfaction",
    },
    {
      title: "Agent Productivity",
      description:
        "Support team handles routine inquiries, allowing agents to focus on high-value activities and closings.",
      metric: "60% More Efficient",
    },
  ];

  const stats = [
    { value: "24/7", label: "Lead Capture" },
    { value: "45%", label: "Conversion Boost" },
    { value: "< 2 min", label: "Response Time" },
    { value: "95%", label: "Client Satisfaction" },
  ];

  const testimonial = {
    quote:
      "B360's real estate support team has been a game-changer for our agency. They handle all our lead qualification and initial client interactions, allowing our agents to focus on closings. Our conversion rates have increased by 45% since partnering with them.",
    author: "Jennifer Walsh",
    company: "Premier Properties Group",
  };

  return (
    <PageLayout
      title="Real Estate Customer Support"
      subtitle="Specialized support for real estate professionals"
      description="Comprehensive customer support services designed for real estate agencies, brokers, and property management companies to capture leads, nurture prospects, and enhance client experiences."
      heroGradient="from-blue-50 to-emerald-50"
      ctaTitle="Ready to accelerate your real estate business?"
      ctaDescription="Let our real estate specialists help you capture more leads, improve conversions, and deliver exceptional client experiences."
    >
      <ContentSection
        title="Complete Real Estate Support Solutions"
        description="Our specialized real estate support services help you capture leads, nurture prospects, and provide exceptional client experiences throughout the buying and selling process."
        features={features}
        className="bg-white"
      />

      <ContentSection
        title="Real Estate Success Metrics"
        stats={stats}
        benefits={benefits}
        className="bg-gray-50"
      />

      <ContentSection testimonial={testimonial} className="bg-white" />
    </PageLayout>
  );
}
