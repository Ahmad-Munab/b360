"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, Database, Shield, Settings } from "lucide-react";
import { Header, HeroSection, CompanyLogos } from "@/components/public/landing";

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [email, setEmail] = useState("");

  const testimonials = [
    {
      name: "SAKARA",
      quote:
        "The B360 team is always flexible with process changes and commits 100% to making every interaction the best our clients have ever had on a daily basis.",
      author: "Sarah B.",
      image: "/placeholder.svg?height=120&width=120",
    },
    {
      name: "TECHCORP",
      quote:
        "B360 transformed our customer support operations. Their proactive approach and dedication to excellence is unmatched.",
      author: "Mike R.",
      image: "/placeholder.svg?height=120&width=120",
    },
    {
      name: "INNOVATE",
      quote:
        "Working with B360 has been a game-changer. They understand our business needs and deliver exceptional results consistently.",
      author: "Lisa K.",
      image: "/placeholder.svg?height=120&width=120",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <CompanyLogos />

      {/* Mission Section */}
      <section className="bg-gradient-to-br from-emerald-100 to-indigo-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 font-heading">
              <span className="text-gradient-emerald-indigo">Your</span> success
              is <span className="text-gradient-emerald-indigo">our</span>{" "}
              mission
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h3 className="text-4xl font-bold text-gray-900 font-heading">
                You deserve better.
              </h3>
              <div className="space-y-4 text-lg text-gray-700">
                <p>
                  You deserve better outcomes, insights, and conversations. You
                  deserve to work with the best proactive teams that embrace
                  complexity, adapt to ambiguity, and flex to your needs with
                  just 24 hours notice. You should be obsessed over, not
                  struggling to scale or sacrificing quality for speed.
                </p>
                <p>
                  Whether you&apos;re a disruptive startup or an iconic brand,
                  with B360 you get more than outsourcing - you get what you
                  deserve.
                </p>
              </div>
            </div>

            {/* Process Diagram */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-emerald-indigo rounded-full flex items-center justify-center text-white font-bold text-xs text-center">
                      SELECT
                      <br />
                      TEAM
                    </div>
                  </div>
                  <div className="flex-1 border-t-2 border-dashed border-emerald-300 mx-4"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-emerald-indigo rounded-full flex items-center justify-center text-white font-bold">
                      LAUNCH
                    </div>
                  </div>
                  <div className="flex-1 border-t-2 border-dashed border-emerald-300 mx-4"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-emerald-indigo rounded-full flex items-center justify-center text-white font-bold">
                      ITERATE
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-gray-900 font-heading">
                    - 2 WEEKS -
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-emerald-indigo py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 font-heading">
                Ready to transform your operations?
              </h3>
              <p className="text-white/90">
                Let&apos;s discuss how B360 can help you build better teams and
                achieve better outcomes.
              </p>
            </div>
            <Button className="bg-white text-emerald-600 hover:bg-gray-100 rounded-full px-8 py-3 font-bold">
              Take B360 for a spin
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-yellow-400 p-2">
                  <Image
                    src={
                      testimonials[currentTestimonial].image ||
                      "/placeholder.svg"
                    }
                    alt={testimonials[currentTestimonial].author}
                    width={120}
                    height={120}
                    className="rounded-full"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-400 rounded-full border-4 border-white"></div>
              </div>

              <div className="flex-1">
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-gray-500 tracking-wider mb-2">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <blockquote className="text-2xl text-gray-900 leading-relaxed">
                    &ldquo;{testimonials[currentTestimonial].quote}&rdquo;
                  </blockquote>
                </div>
                <p className="text-gray-500">
                  {testimonials[currentTestimonial].author}
                </p>
              </div>

              <div className="text-6xl text-gray-200 font-serif">&ldquo;</div>
            </div>

            {/* Testimonial indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i === currentTestimonial ? "bg-emerald-400" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 font-heading">
              + More Growth, Less Risk
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Focus on growth, we&apos;ll take care of the many small tasks that
              make the difference between awesome and awful.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Customer Support",
                description:
                  "Across time zones, languages, cultures, and channels, we&apos;ll leave your customers feeling great about your brand...even if it&apos;s a bad day.",
                icon: <Users className="w-12 h-12" />,
                color: "border-emerald-200 bg-emerald-50",
                iconColor: "text-emerald-500",
              },
              {
                title: "Data & AI",
                description:
                  "Process and build with better, less biased, more accurate training data. You know your end product depends on it; we do too.",
                icon: <Database className="w-12 h-12" />,
                color: "border-indigo-200 bg-indigo-50",
                iconColor: "text-indigo-500",
              },
              {
                title: "Trust & Safety",
                description:
                  "Better compliance, higher engagement, and safer spaces. We&apos;ll keep your users playing by your rules.",
                icon: <Shield className="w-12 h-12" />,
                color: "border-purple-200 bg-purple-50",
                iconColor: "text-purple-500",
              },
              {
                title: "Digital Operations",
                description:
                  "Crash costs cut friction, and boost efficiency. We&apos;ll help you scale your operations faster and more profitably... and put years back on your life.",
                icon: <Settings className="w-12 h-12" />,
                color: "border-teal-200 bg-teal-50",
                iconColor: "text-teal-500",
              },
            ].map((service, i) => (
              <Card
                key={i}
                className={`${service.color} border-2 hover:shadow-lg transition-all duration-300 group`}
              >
                <CardContent className="p-8 text-center space-y-6">
                  <div className={`${service.iconColor} flex justify-center`}>
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 font-heading">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                  <Button className="bg-gradient-emerald-indigo text-white hover:opacity-90 rounded-full px-6 group-hover:scale-105 transition-transform font-medium">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Footer with Animated Background */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-indigo-50 py-20 overflow-hidden">
        {/* Animated Smiley Faces Background */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl opacity-20 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              😊
            </div>
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 font-heading">
              Outsourcing +<br />
              built to make you better.
            </h2>
            <Button className="bg-gradient-emerald-indigo text-white hover:opacity-90 rounded-full px-8 py-3 text-lg font-bold">
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          {/* Footer Links */}
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Solutions */}
            <div>
              <h4 className="font-bold text-white mb-4 font-heading">
                Services
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/customer-support/general"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    General Support
                  </Link>
                </li>
                <li>
                  <Link
                    href="/customer-support/technical"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Technical Support
                  </Link>
                </li>
                <li>
                  <Link
                    href="/customer-support/call-center"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Call Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/customer-support/live-chat"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Live Chat
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold text-white mb-4 font-heading">
                Company
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-white mb-4 font-heading">
                Contact
              </h4>
              <div className="text-gray-400">
                <p>401 N Michigan Ave</p>
                <p>Chicago, IL 60611</p>
                <p className="mt-4">
                  <Link
                    href="/contact"
                    className="text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Get in Touch →
                  </Link>
                </p>
              </div>
            </div>

            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-emerald-indigo rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <span className="text-2xl font-bold text-white font-heading">
                  B360
                </span>
              </div>
              <p className="text-gray-400">
                Expert customer support coverage with strategic hubs across four
                continents.
              </p>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center text-gray-400 text-sm">
              <p>© 2025 B360. All Rights Reserved</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
