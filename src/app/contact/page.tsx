"use client";

import { PageLayout } from "@/components/layout/PageLayout";
import { ContactForm } from "@/components/contact/ContactForm";
import { Globe } from "@/components/ui/globe";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Clock,
  MapPin,
  Award,
  Mail,
  Phone,
  MessageCircle,
  ArrowRight,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const supportFeatures = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Availability",
      description: "Round-the-clock support across all time zones",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Team",
      description: "Highly trained professionals ready to help",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Global Reach",
      description: "Strategic hubs across four continents",
      gradient: "from-purple-500 to-violet-600",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Proven Results",
      description: "98% customer satisfaction rate",
      gradient: "from-orange-500 to-red-600",
    },
  ];

  const contactMethods = [
    {
      icon: <Mail className="w-12 h-12" />,
      title: "Email Us",
      description: "Get detailed responses to your inquiries",
      action: "sales@b360.com",
      href: "mailto:sales@b360.com",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: <Phone className="w-12 h-12" />,
      title: "Call Us",
      description: "Speak directly with our experts",
      action: "+1 (312) 555-0100",
      href: "tel:+13125550100",
      gradient: "from-green-500 to-green-600",
    },
    {
      icon: <MessageCircle className="w-12 h-12" />,
      title: "Live Chat",
      description: "Instant support through our AI chat",
      action: "Start Chat",
      href: "#",
      gradient: "from-purple-500 to-purple-600",
    },
  ];

  const locations = [
    {
      city: "Chicago",
      country: "USA",
      role: "Global Headquarters",
      address: "401 N Michigan Ave, Chicago, IL 60611",
      phone: "+1 (312) 555-0100",
      email: "chicago@b360.com",
    },
    {
      city: "Manila",
      country: "Philippines",
      role: "Asia-Pacific Hub",
      address: "Makati Business District, Manila",
      phone: "+63 2 555-0100",
      email: "manila@b360.com",
    },
    {
      city: "Bangalore",
      country: "India",
      role: "Technology Center",
      address: "Electronic City, Bangalore",
      phone: "+91 80 555-0100",
      email: "bangalore@b360.com",
    },
    {
      city: "Dublin",
      country: "Ireland",
      role: "European Operations",
      address: "Dublin Business District",
      phone: "+353 1 555-0100",
      email: "dublin@b360.com",
    },
  ];

  return (
    <PageLayout
      title="Get in Touch"
      subtitle="Ready to transform your customer support experience?"
      description="Connect with our global team of experts and discover how B360 can help you deliver exceptional customer experiences that drive business growth."
      heroGradient="from-blue-50 to-indigo-50"
      ctaTitle="Ready to get started?"
      ctaDescription="Let's discuss how our comprehensive support solutions can transform your customer experience."
      ctaButtonText="Schedule a Demo"
    >
      {/* Contact Methods */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-heading">
              How Can We Help You?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the best way to connect with our team and get the support
              you need.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-2 border-gray-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-20 h-20 bg-gradient-to-r ${method.gradient} rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {method.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 font-heading">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {method.description}
                    </p>
                    <Link href={method.href}>
                      <Button
                        className={`w-full bg-gradient-to-r ${method.gradient} hover:opacity-90 text-white rounded-full py-3 font-bold`}
                      >
                        {method.action}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Support Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center text-white mx-auto mb-4`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-heading">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Globe Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white"
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-heading">
                Global Presence, Local Expertise
              </h2>
              <p className="text-xl mb-8 opacity-90 leading-relaxed">
                With strategic locations across four continents, we provide 24/7
                support coverage and local expertise wherever your customers
                are.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold mb-2">15+</div>
                  <div className="opacity-90">Countries Served</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">24/7</div>
                  <div className="opacity-90">Global Coverage</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">4</div>
                  <div className="opacity-90">Continents</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">500+</div>
                  <div className="opacity-90">Expert Agents</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-96"
            >
              <Globe
                className="w-full h-full"
                globeConfig={{
                  pointSize: 2,
                  globeColor: "#1e3a8a",
                  showAtmosphere: true,
                  atmosphereColor: "#3b82f6",
                  autoRotate: true,
                  autoRotateSpeed: 0.5,
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form and Locations */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <ContactForm />
            </motion.div>

            {/* Global Locations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6 font-heading">
                  Our Global Offices
                </h3>
                <div className="space-y-6">
                  {locations.map((location, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="border-2 border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-xl font-bold text-gray-900 mb-1 font-heading">
                                {location.city}
                              </h4>
                              <p className="text-blue-600 font-medium">
                                {location.role}
                              </p>
                            </div>
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-blue-600" />
                            </div>
                          </div>
                          <p className="text-gray-600 mb-4">
                            {location.address}
                          </p>
                          <div className="space-y-2">
                            <p className="text-gray-900">
                              <strong>Phone:</strong>{" "}
                              <a
                                href={`tel:${location.phone.replace(
                                  /\s/g,
                                  ""
                                )}`}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                {location.phone}
                              </a>
                            </p>
                            <p className="text-gray-900">
                              <strong>Email:</strong>{" "}
                              <a
                                href={`mailto:${location.email}`}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                {location.email}
                              </a>
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
