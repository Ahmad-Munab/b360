"use client";

import { PageLayout } from "@/components/public/layout/PageLayout";
import { ContentSection } from "@/components/public/layout/ContentSection";
import { Scale, Calendar, Phone, FileText, Users, Shield } from "lucide-react";

export default function LawFirmsPage() {
  const features = [
    {
      title: "Client Intake & Screening",
      description:
        "Professional client intake processes, initial case screening, and qualification to ensure efficient attorney time allocation.",
      icon: <Users className="w-12 h-12" />,
    },
    {
      title: "Appointment Scheduling",
      description:
        "Seamless coordination of consultations, court dates, and client meetings with calendar integration and reminders.",
      icon: <Calendar className="w-12 h-12" />,
    },
    {
      title: "Confidential Communication",
      description:
        "Secure, HIPAA-compliant communication handling with strict confidentiality protocols for sensitive legal matters.",
      icon: <Shield className="w-12 h-12" />,
    },
    {
      title: "Case Status Updates",
      description:
        "Regular client communication regarding case progress, court dates, and important legal developments.",
      icon: <FileText className="w-12 h-12" />,
    },
    {
      title: "Emergency Response",
      description:
        "24/7 emergency contact service for urgent legal matters requiring immediate attorney attention.",
      icon: <Phone className="w-12 h-12" />,
    },
    {
      title: "Legal Consultation Support",
      description:
        "Professional support for initial consultations, document collection, and pre-meeting preparation.",
      icon: <Scale className="w-12 h-12" />,
    },
  ];

  const benefits = [
    {
      title: "Client Acquisition",
      description:
        "Professional intake processes and immediate response significantly improve client acquisition rates.",
      metric: "50% Higher",
    },
    {
      title: "Attorney Efficiency",
      description:
        "Support team handles routine inquiries, allowing attorneys to focus on billable hours and case work.",
      metric: "40% More Efficient",
    },
    {
      title: "Client Satisfaction",
      description:
        "Consistent communication and professional service delivery leads to higher client satisfaction and referrals.",
      metric: "98% Satisfaction",
    },
    {
      title: "Response Time",
      description:
        "Immediate response to client inquiries ensures no potential cases are lost due to delayed communication.",
      metric: "< 1 hour",
    },
  ];

  const stats = [
    { value: "24/7", label: "Emergency Support" },
    { value: "50%", label: "Client Acquisition Boost" },
    { value: "< 1 hour", label: "Response Time" },
    { value: "98%", label: "Client Satisfaction" },
  ];

  const testimonial = {
    quote:
      "B360's legal support team has transformed our client intake process. They handle initial consultations professionally and ensure we never miss a potential case. Our client acquisition has increased by 50% while maintaining the highest standards of confidentiality.",
    author: "David Thompson",
    company: "Thompson & Associates Law Firm",
  };

  return (
    <PageLayout
      title="Law Firm Customer Support"
      subtitle="Specialized support for legal professionals"
      description="Comprehensive customer support services designed specifically for law firms, attorneys, and legal practices to enhance client acquisition, improve efficiency, and maintain professional standards."
      heroGradient="from-indigo-50 to-emerald-50"
      ctaTitle="Ready to enhance your legal practice?"
      ctaDescription="Let our legal support specialists help you improve client acquisition, streamline operations, and deliver exceptional legal services."
    >
      <ContentSection
        title="Complete Legal Support Solutions"
        description="Our specialized legal support services are designed to handle client communications, intake processes, and administrative tasks while maintaining the highest standards of confidentiality and professionalism."
        features={features}
        className="bg-white"
      />

      <ContentSection
        title="Legal Practice Excellence Metrics"
        stats={stats}
        benefits={benefits}
        className="bg-gray-50"
      />

      <ContentSection testimonial={testimonial} className="bg-white" />
    </PageLayout>
  );
}
