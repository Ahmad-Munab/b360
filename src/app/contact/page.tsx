"use client";

import { Header } from "@/components/public/landing";
import { ContactForm } from "@/components/contact/ContactForm";
import { LocationsMap } from "@/components/contact/LocationsMap";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Clock, Headphones, Globe, Award } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const supportFeatures = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Availability",
      description: "Round-the-clock support across all time zones",
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "Expert Team",
      description: "Highly trained professionals ready to help",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Reach",
      description: "Strategic hubs across four continents",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Proven Results",
      description: "98% customer satisfaction rate",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-indigo-50 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-heading">
              Get in Touch
            </h1>
            <p className="text-xl lg:text-2xl text-gray-700 mb-8 font-medium">
              Ready to transform your customer support? Let's discuss how B360 can help you achieve better outcomes.
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Book a demo, ask questions, or learn more about our global customer support solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Support Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          >
            {supportFeatures.map((feature, index) => (
              <Card key={index} className="border-2 border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 text-center">
                <CardContent className="p-6">
                  <div className="text-emerald-500 flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 font-heading">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form and Quick Info */}
      <section className="py-16 bg-gray-50">
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

            {/* Quick Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6 font-heading">
                  Other Ways to Reach Us
                </h3>
                <div className="space-y-6">
                  <Card className="border-2 border-gray-200">
                    <CardContent className="p-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-3 font-heading">
                        Sales Inquiries
                      </h4>
                      <p className="text-gray-600 mb-4">
                        Ready to get started? Our sales team is here to help you find the perfect solution.
                      </p>
                      <div className="space-y-2">
                        <p className="text-gray-900">
                          <strong>Email:</strong> <a href="mailto:sales@b360.com" className="text-emerald-600 hover:text-emerald-700">sales@b360.com</a>
                        </p>
                        <p className="text-gray-900">
                          <strong>Phone:</strong> <a href="tel:+13125550100" className="text-emerald-600 hover:text-emerald-700">+1 (312) 555-0100</a>
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-gray-200">
                    <CardContent className="p-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-3 font-heading">
                        Support & Technical
                      </h4>
                      <p className="text-gray-600 mb-4">
                        Need help with an existing service? Our support team is available 24/7.
                      </p>
                      <div className="space-y-2">
                        <p className="text-gray-900">
                          <strong>Email:</strong> <a href="mailto:support@b360.com" className="text-emerald-600 hover:text-emerald-700">support@b360.com</a>
                        </p>
                        <p className="text-gray-900">
                          <strong>Phone:</strong> <a href="tel:+13125550200" className="text-emerald-600 hover:text-emerald-700">+1 (312) 555-0200</a>
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-gray-200">
                    <CardContent className="p-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-3 font-heading">
                        Partnership Opportunities
                      </h4>
                      <p className="text-gray-600 mb-4">
                        Interested in partnering with B360? Let's explore opportunities together.
                      </p>
                      <div className="space-y-2">
                        <p className="text-gray-900">
                          <strong>Email:</strong> <a href="mailto:partnerships@b360.com" className="text-emerald-600 hover:text-emerald-700">partnerships@b360.com</a>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Locations Map */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <LocationsMap />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Company */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-emerald-indigo rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <span className="text-2xl font-bold font-heading">B360</span>
              </div>
              <p className="text-gray-400">
                Expert customer support coverage with strategic hubs across four continents.
              </p>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-bold mb-4 font-heading">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/solutions/customer-support/general" className="hover:text-white transition-colors">
                    General Support
                  </Link>
                </li>
                <li>
                  <Link href="/solutions/customer-support/technical" className="hover:text-white transition-colors">
                    Technical Support
                  </Link>
                </li>
                <li>
                  <Link href="/solutions/customer-support/call-center" className="hover:text-white transition-colors">
                    Call Center
                  </Link>
                </li>
                <li>
                  <Link href="/solutions/customer-support/live-chat" className="hover:text-white transition-colors">
                    Live Chat
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold mb-4 font-heading">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold mb-4 font-heading">Headquarters</h4>
              <div className="text-gray-400">
                <p>401 N Michigan Ave</p>
                <p>Chicago, IL 60611</p>
                <p className="mt-4">
                  <a href="tel:+13125550100" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                    +1 (312) 555-0100
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center text-gray-400 text-sm">
              <p>© 2025 B360. All Rights Reserved</p>
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <span>Made with ❤️ globally</span>
                <span>|</span>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
