"use client";

import { motion } from "framer-motion";
import { PageLayout } from "../../components/public/layout/PageLayout";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Code, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TechPage() {
  const services = [
    {
      title: "Web Development",
      description:
        "Custom web applications, responsive websites, and e-commerce solutions built with modern technologies.",
      icon: <Code className="w-12 h-12" />,
      link: "/tech/web-development",
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      title: "Email Marketing",
      description:
        "Engage your audience with personalized email campaigns, automation, and detailed analytics.",
      icon: <Mail className="w-12 h-12" />,
      link: "/tech/email-marketing",
      gradient: "from-green-500 to-teal-600",
    },
  ];

  return (
    <PageLayout
      title="Tech Services"
      subtitle="Innovative solutions to power your business"
      description="We provide a range of technology services, from custom web development to strategic email marketing, to help you achieve your goals."
      heroGradient="from-gray-50 to-slate-50"
      ctaTitle="Ready to elevate your technology?"
      ctaDescription="Explore our services and find out how we can help you succeed."
      ctaButtonText="Explore Services"
    >
      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-heading">
              Our Tech Offerings
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our specialized tech services designed to deliver
              performance, engagement, and growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-10 flex flex-col flex-grow">
                    <div className="flex items-center mb-6">
                      <div
                        className={`w-20 h-20 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center text-white mr-6`}
                      >
                        {service.icon}
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-gray-900 font-heading">
                          {service.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed mb-8 flex-grow">
                      {service.description}
                    </p>
                    <div className="mt-auto">
                      <Link href={service.link}>
                        <Button
                          variant="outline"
                          className="w-full text-lg py-6 font-bold border-2 border-gray-300 hover:bg-gray-100"
                        >
                          Learn More
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
