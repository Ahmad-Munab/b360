"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronDown, Users, Database, Shield, Settings, Facebook, Linkedin, X } from "lucide-react"
import { Header, AnnouncementBar, HeroSection, CompanyLogos } from "@/components/public/landing"

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [email, setEmail] = useState("")

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
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <AnnouncementBar />
      <HeroSection />
      <CompanyLogos />

      {/* Mission Section */}
      <section className="bg-gradient-to-br from-yellow-200 to-yellow-300 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
              <span className="underline decoration-4 decoration-gray-900">Your</span> success is{" "}
              <span className="underline decoration-4 decoration-gray-900">our</span> mission
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h3 className="text-4xl font-bold text-gray-900">You deserve better.</h3>
              <div className="space-y-4 text-lg text-gray-700">
                <p>
                  You deserve better outcomes, insights, and conversations. You deserve to work with the best proactive
                  teams that embrace complexity, adapt to ambiguity, and flex to your needs with just 24 hours notice.
                  You should be obsessed over, not struggling to scale or sacrificing quality for speed.
                </p>
                <p>
                  Whether you're a disruptive startup or an iconic brand, with B360 you get more than outsourcing - you
                  get what you deserve.
                </p>
              </div>
            </div>

            {/* Process Diagram */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-xs text-center">
                      SELECT
                      <br />
                      TEAM
                    </div>
                  </div>
                  <div className="flex-1 border-t-2 border-dashed border-gray-300 mx-4"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold">
                      LAUNCH
                    </div>
                  </div>
                  <div className="flex-1 border-t-2 border-dashed border-gray-300 mx-4"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold">
                      ITERATE
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-gray-900">- 2 WEEKS -</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-yellow-200 to-yellow-300 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to transform your operations?</h3>
              <p className="text-gray-700">
                Let's discuss how B360 can help you build better teams and achieve better outcomes.
              </p>
            </div>
            <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-3">
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
                    src={testimonials[currentTestimonial].image || "/placeholder.svg"}
                    alt={testimonials[currentTestimonial].author}
                    width={120}
                    height={120}
                    className="rounded-full"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full border-4 border-white"></div>
              </div>

              <div className="flex-1">
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-gray-500 tracking-wider mb-2">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <blockquote className="text-2xl text-gray-900 leading-relaxed">
                    "{testimonials[currentTestimonial].quote}"
                  </blockquote>
                </div>
                <p className="text-gray-500">{testimonials[currentTestimonial].author}</p>
              </div>

              <div className="text-6xl text-gray-200 font-serif">"</div>
            </div>

            {/* Testimonial indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i === currentTestimonial ? "bg-yellow-400" : "bg-gray-300"
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
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">+ More Growth, Less Risk</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Focus on growth, we'll take care of the many small tasks that make the difference between awesome and
              awful.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Customer Support",
                description:
                  "Across time zones, languages, cultures, and channels, we'll leave your customers feeling great about your brand...even if it's a bad day.",
                icon: <Users className="w-12 h-12" />,
                color: "border-cyan-200 bg-cyan-50",
                iconColor: "text-cyan-500",
              },
              {
                title: "Data & AI",
                description:
                  "Process and build with better, less biased, more accurate training data. You know your end product depends on it; we do too.",
                icon: <Database className="w-12 h-12" />,
                color: "border-red-200 bg-red-50",
                iconColor: "text-red-500",
              },
              {
                title: "Trust & Safety",
                description:
                  "Better compliance, higher engagement, and safer spaces. We'll keep your users playing by your rules.",
                icon: <Shield className="w-12 h-12" />,
                color: "border-purple-200 bg-purple-50",
                iconColor: "text-purple-500",
              },
              {
                title: "Digital Operations",
                description:
                  "Crash costs cut friction, and boost efficiency. We'll help you scale your operations faster and more profitably... and put years back on your life.",
                icon: <Settings className="w-12 h-12" />,
                color: "border-green-200 bg-green-50",
                iconColor: "text-green-500",
              },
            ].map((service, i) => (
              <Card key={i} className={`${service.color} border-2 hover:shadow-lg transition-all duration-300 group`}>
                <CardContent className="p-8 text-center space-y-6">
                  <div className={`${service.iconColor} flex justify-center`}>{service.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                  <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6 group-hover:scale-105 transition-transform">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Footer with Animated Background */}
      <section className="relative bg-gradient-to-br from-yellow-50 to-orange-50 py-20 overflow-hidden">
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
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
              Outsourcing +<br />
              built to make you better.
            </h2>
            <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-3 text-lg">
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-yellow-50 to-orange-50 py-16">
        <div className="container mx-auto px-4">
          {/* Newsletter Section */}
          <div className="text-center mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Sign up to our newsletter and stay hip.</h3>
            <form onSubmit={handleNewsletterSubmit} className="flex justify-center items-center gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="flex-1 bg-white border-gray-300 rounded-full px-6 py-3"
                required
              />
              <Button
                type="submit"
                className="bg-cyan-400 hover:bg-cyan-500 text-black rounded-full px-8 py-3 font-semibold"
              >
                Sign Up
              </Button>
            </form>
          </div>

          {/* Footer Links */}
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Solutions */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Solutions</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-700 hover:text-gray-900 transition-colors flex items-center">
                    Customer Support <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-700 hover:text-gray-900 transition-colors flex items-center">
                    Digital Operations <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-700 hover:text-gray-900 transition-colors flex items-center">
                    Trust & Safety <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-700 hover:text-gray-900 transition-colors flex items-center">
                    Data & AI <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <Link href="#" className="hover:text-gray-900 transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-900 transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-900 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <Link href="#" className="hover:text-gray-900 transition-colors">
                    Resources
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-900 transition-colors">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Headquarters */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Headquarters</h4>
              <div className="text-gray-700">
                <p>401 N Michigan Ave</p>
                <p>Chicago, IL 60611</p>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col lg:flex-row justify-between items-center pt-8 border-t border-gray-200">
            {/* Logo and Social */}
            <div className="flex items-center space-x-8 mb-8 lg:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">B360</span>
              </div>

              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors cursor-pointer">
                  <X className="w-5 h-5 text-black" />
                </div>
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors cursor-pointer">
                  <Facebook className="w-5 h-5 text-black" />
                </div>
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors cursor-pointer">
                  <Linkedin className="w-5 h-5 text-black" />
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="flex items-center space-x-6">
              {["ISO 27001", "MBE CERTIFIED", "HIPAA COMPLIANT", "AICPA SOC"].map((cert, i) => (
                <div
                  key={i}
                  className="w-16 h-16 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center"
                >
                  <span className="text-xs font-bold text-gray-600 text-center">{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-col lg:flex-row justify-between items-center text-gray-600 text-sm">
              <p>© 2025 Copyright | All Rights Reserved</p>
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <span>Made with ❤️ in Africa and beyond</span>
                <span>|</span>
                <Link href="#" className="hover:text-gray-900 transition-colors">
                  Privacy Policy
                </Link>
                <span>|</span>
                <Link href="#" className="hover:text-gray-900 transition-colors">
                  Menu Item
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
