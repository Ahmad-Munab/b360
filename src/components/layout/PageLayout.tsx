"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/public/landing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ReactNode } from "react";

interface PageLayoutProps {
  title: string;
  subtitle: string;
  description?: string;
  heroGradient?: string;
  children: ReactNode;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaButtonHref?: string;
}

export function PageLayout({
  title,
  subtitle,
  description,
  heroGradient = "from-emerald-50 to-indigo-50",
  children,
  ctaTitle = "Ready to get started?",
  ctaDescription = "Let's discuss how B360 can help you achieve better outcomes.",
  ctaButtonText = "Book a Demo Now",
  ctaButtonHref = "/contact",
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className={`bg-gradient-to-br ${heroGradient} pt-24 pb-16`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-heading">
              {title}
            </h1>
            <p className="text-xl lg:text-2xl text-gray-700 mb-8 font-medium">
              {subtitle}
            </p>
            {description && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-16">
        {children}
      </main>

      {/* CTA Section */}
      <section className="bg-gradient-emerald-indigo py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 font-heading">
              {ctaTitle}
            </h2>
            <p className="text-xl text-white/90 mb-8">
              {ctaDescription}
            </p>
            <Link href={ctaButtonHref}>
              <Button className="bg-white text-emerald-600 hover:bg-gray-100 rounded-full px-8 py-3 font-bold text-lg shadow-lg">
                {ctaButtonText}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Simple Footer Component
function Footer() {
  return (
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
                <Link href="/contact" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  Get in Touch →
                </Link>
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
  );
}
