"use client";

import { PageLayout } from "@/components/layout/PageLayout";
import { ContentSection } from "@/components/layout/ContentSection";
import { Settings, Zap, Shield, Clock, Users, Headphones } from "lucide-react";

export default function TechnicalSupportPage() {
  const features = [
    {
      title: "24/7 Technical Expertise",
      description:
        "Round-the-clock technical support from certified professionals with deep product knowledge and troubleshooting skills.",
      icon: <Clock className="w-12 h-12" />,
    },
    {
      title: "Multi-Platform Support",
      description:
        "Comprehensive support across web, mobile, desktop, and API platforms with specialized knowledge for each environment.",
      icon: <Settings className="w-12 h-12" />,
    },
    {
      title: "Rapid Issue Resolution",
      description:
        "Advanced diagnostic tools and proven methodologies to identify and resolve technical issues quickly and efficiently.",
      icon: <Zap className="w-12 h-12" />,
    },
    {
      title: "Security-First Approach",
      description:
        "All technical support follows strict security protocols to protect your systems and customer data during troubleshooting.",
      icon: <Shield className="w-12 h-12" />,
    },
    {
      title: "Escalation Management",
      description:
        "Structured escalation paths ensure complex issues reach the right technical experts for swift resolution.",
      icon: <Users className="w-12 h-12" />,
    },
    {
      title: "Proactive Monitoring",
      description:
        "Continuous system monitoring and proactive issue identification to prevent problems before they impact users.",
      icon: <Headphones className="w-12 h-12" />,
    },
  ];

  const benefits = [
    {
      title: "Faster Resolution Times",
      description:
        "Our technical experts resolve 85% of issues on first contact, reducing customer frustration and support costs.",
      metric: "85% FCR",
    },
    {
      title: "Reduced Downtime",
      description:
        "Proactive monitoring and rapid response capabilities minimize system downtime and business disruption.",
      metric: "99.9% Uptime",
    },
    {
      title: "Expert Knowledge Base",
      description:
        "Access to certified technicians with specialized training in your specific technologies and platforms.",
      metric: "500+ Certifications",
    },
    {
      title: "Scalable Support",
      description:
        "Flexible support capacity that scales with your business growth and seasonal demand fluctuations.",
      metric: "24/7 Coverage",
    },
  ];

  const stats = [
    { value: "< 2 min", label: "Average Response Time" },
    { value: "95%", label: "Customer Satisfaction" },
    { value: "24/7", label: "Global Coverage" },
    { value: "15+", label: "Years Experience" },
  ];

  const testimonial = {
    quote:
      "B360's technical support team has been instrumental in maintaining our platform's reliability. Their proactive approach and deep technical expertise have significantly reduced our downtime.",
    author: "Sarah Chen",
    company: "TechFlow Solutions",
  };

  return (
    <PageLayout
      title="Technical Support"
      subtitle="Expert technical support for your products and services"
      description="Delivered by highly trained professionals with deep product knowledge and advanced troubleshooting capabilities."
      heroGradient="from-indigo-50 to-emerald-50"
      ctaTitle="Ready to enhance your technical support?"
      ctaDescription="Let our certified technical experts help you deliver exceptional support experiences."
    >
      <ContentSection
        title="Comprehensive Technical Expertise"
        description="Our technical support specialists combine deep product knowledge with advanced troubleshooting methodologies to resolve complex issues efficiently."
        features={features}
        className="bg-white"
      />

      <ContentSection
        title="Proven Results"
        stats={stats}
        benefits={benefits}
        className="bg-gray-50"
      />

      <ContentSection testimonial={testimonial} className="bg-white" />
    </PageLayout>
  );
}
