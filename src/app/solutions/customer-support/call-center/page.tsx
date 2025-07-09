"use client";

import { PageLayout } from "@/components/layout/PageLayout";
import { ContentSection } from "@/components/layout/ContentSection";
import { Phone, Headphones, BarChart3, Shield, Clock, Users } from "lucide-react";

export default function CallCenterPage() {
  const features = [
    {
      title: "Inbound Call Management",
      description: "Professional handling of customer inquiries, support requests, and sales calls with advanced call routing and queue management.",
      icon: <Phone className="w-12 h-12" />,
    },
    {
      title: "Outbound Campaigns",
      description: "Strategic outbound calling for customer follow-ups, surveys, appointment scheduling, and proactive customer engagement.",
      icon: <Headphones className="w-12 h-12" />,
    },
    {
      title: "Advanced Analytics",
      description: "Real-time call monitoring, performance metrics, and detailed reporting to optimize call center operations and agent performance.",
      icon: <BarChart3 className="w-12 h-12" />,
    },
    {
      title: "Secure Communications",
      description: "PCI-compliant call handling with secure payment processing and data protection protocols for sensitive customer information.",
      icon: <Shield className="w-12 h-12" />,
    },
    {
      title: "24/7 Operations",
      description: "Round-the-clock call center operations with global coverage to ensure your customers can always reach support when needed.",
      icon: <Clock className="w-12 h-12" />,
    },
    {
      title: "Skilled Agents",
      description: "Highly trained call center agents with excellent communication skills, product knowledge, and customer service expertise.",
      icon: <Users className="w-12 h-12" />,
    },
  ];

  const benefits = [
    {
      title: "Higher Conversion Rates",
      description: "Our skilled agents excel at converting inquiries into sales through effective communication and product knowledge.",
      metric: "25% Higher",
    },
    {
      title: "Reduced Wait Times",
      description: "Efficient call routing and adequate staffing ensure customers spend minimal time waiting for assistance.",
      metric: "< 20 seconds",
    },
    {
      title: "Cost Efficiency",
      description: "Optimized operations and economies of scale provide significant cost savings compared to in-house call centers.",
      metric: "40% Savings",
    },
    {
      title: "Quality Assurance",
      description: "Comprehensive quality monitoring and agent coaching programs maintain consistently high service standards.",
      metric: "95% QA Score",
    },
  ];

  const stats = [
    { value: "99.5%", label: "Call Answer Rate" },
    { value: "< 15 sec", label: "Average Wait Time" },
    { value: "92%", label: "First Call Resolution" },
    { value: "4.9/5", label: "Customer Rating" },
  ];

  const testimonial = {
    quote: "B360's call center services have been a game-changer for our business. Their professional agents and efficient operations have significantly improved our customer satisfaction and sales conversion rates.",
    author: "Jennifer Park",
    company: "RetailMax Solutions",
  };

  return (
    <PageLayout
      title="Call Center Support"
      subtitle="Professional inbound and outbound call center services"
      description="Comprehensive call center solutions with skilled agents, advanced technology, and proven processes to enhance customer experiences."
      heroGradient="from-blue-50 to-emerald-50"
      ctaTitle="Ready to optimize your call center operations?"
      ctaDescription="Let our experienced call center professionals help you deliver exceptional phone-based customer experiences."
    >
      <ContentSection
        title="Complete Call Center Solutions"
        description="Our call center services combine skilled agents, advanced technology, and proven processes to deliver exceptional phone-based customer experiences."
        features={features}
        className="bg-white"
      />

      <ContentSection
        title="Proven Performance"
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
