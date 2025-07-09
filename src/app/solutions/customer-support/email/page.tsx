"use client";

import { PageLayout } from "@/components/layout/PageLayout";
import { ContentSection } from "@/components/layout/ContentSection";
import { Mail, Clock, FileText, Users, TrendingUp, Shield } from "lucide-react";

export default function EmailSupportPage() {
  const features = [
    {
      title: "Professional Email Management",
      description: "Expert handling of customer emails with professional tone, accurate information, and timely responses that reflect your brand values.",
      icon: <Mail className="w-12 h-12" />,
    },
    {
      title: "Quick Response Times",
      description: "Rapid email response within SLA commitments, ensuring customers receive timely assistance for their inquiries and concerns.",
      icon: <Clock className="w-12 h-12" />,
    },
    {
      title: "Detailed Documentation",
      description: "Comprehensive email documentation and case tracking for complete conversation history and follow-up management.",
      icon: <FileText className="w-12 h-12" />,
    },
    {
      title: "Specialized Teams",
      description: "Dedicated email support specialists trained in written communication excellence and your specific business requirements.",
      icon: <Users className="w-12 h-12" />,
    },
    {
      title: "Quality Assurance",
      description: "Rigorous quality control processes ensure every email meets high standards for accuracy, tone, and customer satisfaction.",
      icon: <TrendingUp className="w-12 h-12" />,
    },
    {
      title: "Secure Handling",
      description: "Secure email processing with encryption and compliance protocols to protect sensitive customer information.",
      icon: <Shield className="w-12 h-12" />,
    },
  ];

  const benefits = [
    {
      title: "Improved Response Quality",
      description: "Professional, well-crafted email responses that enhance customer perception and satisfaction with your brand.",
      metric: "4.7/5 Quality",
    },
    {
      title: "Faster Turnaround",
      description: "Efficient email processing and response workflows ensure customers receive timely assistance.",
      metric: "< 4 hours",
    },
    {
      title: "Reduced Workload",
      description: "Complete email support management frees your team to focus on core business activities and strategic initiatives.",
      metric: "80% Reduction",
    },
    {
      title: "Consistent Branding",
      description: "All email communications maintain consistent brand voice, tone, and messaging across all customer interactions.",
      metric: "100% Brand Aligned",
    },
  ];

  const stats = [
    { value: "< 2 hours", label: "Average Response Time" },
    { value: "94%", label: "Customer Satisfaction" },
    { value: "99.8%", label: "Accuracy Rate" },
    { value: "24/7", label: "Email Processing" },
  ];

  const testimonial = {
    quote: "B360's email support team has been exceptional. Their professional communication style and quick response times have significantly improved our customer relationships and brand perception.",
    author: "Amanda Foster",
    company: "ServiceFirst Technologies",
  };

  return (
    <PageLayout
      title="Email Support"
      subtitle="Professional email customer support that enhances your brand"
      description="Expert email support services with quick response times, professional communication, and comprehensive case management."
      heroGradient="from-teal-50 to-emerald-50"
      ctaTitle="Ready to optimize your email support?"
      ctaDescription="Let our email specialists help you deliver professional, timely responses that strengthen customer relationships."
    >
      <ContentSection
        title="Professional Email Excellence"
        description="Our email support services deliver professional, timely, and accurate responses that enhance customer satisfaction and brand reputation."
        features={features}
        className="bg-white"
      />

      <ContentSection
        title="Email Support Performance"
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
