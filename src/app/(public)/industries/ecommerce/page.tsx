"use client";

import { PageLayout } from "@/components/public/layout/PageLayout";
import { ContentSection } from "@/components/public/layout/ContentSection";
import {
  ShoppingCart,
  CreditCard,
  Truck,
  MessageCircle,
  BarChart3,
  Shield,
} from "lucide-react";

export default function EcommercePage() {
  const features = [
    {
      title: "Order Management Support",
      description:
        "Expert assistance with order processing, tracking, modifications, and cancellations to ensure smooth customer experiences.",
      icon: <ShoppingCart className="w-12 h-12" />,
    },
    {
      title: "Payment & Billing Support",
      description:
        "Secure handling of payment issues, refunds, billing inquiries, and transaction disputes with PCI compliance.",
      icon: <CreditCard className="w-12 h-12" />,
    },
    {
      title: "Shipping & Returns",
      description:
        "Comprehensive support for shipping inquiries, delivery tracking, return processing, and exchange management.",
      icon: <Truck className="w-12 h-12" />,
    },
    {
      title: "Live Chat Sales Support",
      description:
        "Proactive chat engagement to assist customers with product selection, recommendations, and purchase decisions.",
      icon: <MessageCircle className="w-12 h-12" />,
    },
    {
      title: "Customer Analytics",
      description:
        "Deep insights into customer behavior, purchase patterns, and support metrics to optimize your e-commerce strategy.",
      icon: <BarChart3 className="w-12 h-12" />,
    },
    {
      title: "Fraud Prevention",
      description:
        "Advanced security measures and fraud detection to protect your business and customers from malicious activities.",
      icon: <Shield className="w-12 h-12" />,
    },
  ];

  const benefits = [
    {
      title: "Increased Conversions",
      description:
        "Proactive support and sales assistance significantly boost conversion rates and average order values.",
      metric: "40% Higher",
    },
    {
      title: "Reduced Cart Abandonment",
      description:
        "Real-time assistance helps customers complete purchases and reduces cart abandonment rates.",
      metric: "35% Reduction",
    },
    {
      title: "Customer Retention",
      description:
        "Exceptional support experiences build loyalty and increase customer lifetime value.",
      metric: "60% Retention",
    },
    {
      title: "Response Time",
      description:
        "Lightning-fast support responses keep customers engaged and satisfied throughout their journey.",
      metric: "< 30 seconds",
    },
  ];

  const stats = [
    { value: "24/7", label: "Support Coverage" },
    { value: "98%", label: "Customer Satisfaction" },
    { value: "< 30 sec", label: "Response Time" },
    { value: "40%", label: "Conversion Boost" },
  ];

  const testimonial = {
    quote:
      "B360's e-commerce support has transformed our customer experience. Their team handles everything from order inquiries to payment issues seamlessly. Our conversion rates increased by 40% and customer satisfaction is at an all-time high.",
    author: "Michael Rodriguez",
    company: "ShopSmart Online",
  };

  return (
    <PageLayout
      title="E-commerce Customer Support"
      subtitle="Specialized support solutions for online retailers"
      description="Comprehensive customer support services designed specifically for e-commerce businesses to increase sales, reduce cart abandonment, and build customer loyalty."
      heroGradient="from-emerald-50 to-blue-50"
      ctaTitle="Ready to boost your e-commerce success?"
      ctaDescription="Let our e-commerce specialists help you deliver exceptional customer experiences that drive sales and build loyalty."
    >
      <ContentSection
        title="Complete E-commerce Support Solutions"
        description="Our specialized e-commerce support services are designed to handle every aspect of the online shopping experience, from pre-sale inquiries to post-purchase support."
        features={features}
        className="bg-white"
      />

      <ContentSection
        title="E-commerce Excellence Metrics"
        stats={stats}
        benefits={benefits}
        className="bg-gray-50"
      />

      <ContentSection testimonial={testimonial} className="bg-white" />
    </PageLayout>
  );
}
