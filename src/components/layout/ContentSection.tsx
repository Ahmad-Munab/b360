"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import Link from "next/link";

interface Feature {
  title: string;
  description: string;
  icon?: ReactNode;
}

interface Benefit {
  title: string;
  description: string;
  metric?: string;
}

interface ContentSectionProps {
  title?: string;
  description?: string;
  features?: Feature[];
  benefits?: Benefit[];
  testimonial?: {
    quote: string;
    author: string;
    company: string;
  };
  stats?: {
    value: string;
    label: string;
  }[];
  className?: string;
}

export function ContentSection({
  title,
  description,
  features,
  benefits,
  testimonial,
  stats,
  className = "",
}: ContentSectionProps) {
  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        {(title || description) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            {title && (
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-heading">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {description}
              </p>
            )}
          </motion.div>
        )}

        {/* Stats */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-gradient-emerald-indigo mb-2 font-heading">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Features */}
        {features && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          >
            {features.map((feature, index) => (
              <Card key={index} className="border-2 border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8 text-center">
                  {feature.icon && (
                    <div className="flex justify-center mb-6 text-emerald-500">
                      {feature.icon}
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 font-heading">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Benefits */}
        {benefits && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 mb-16"
          >
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-emerald-indigo rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading">
                    {benefit.title}
                    {benefit.metric && (
                      <span className="text-emerald-600 ml-2">{benefit.metric}</span>
                    )}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Testimonial */}
        {testimonial && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-emerald-50 to-indigo-50 rounded-2xl p-8 lg:p-12 text-center"
          >
            <div className="text-6xl text-emerald-200 mb-4">"</div>
            <blockquote className="text-2xl lg:text-3xl text-gray-900 mb-8 font-medium">
              {testimonial.quote}
            </blockquote>
            <div className="text-gray-600">
              <div className="font-bold">{testimonial.author}</div>
              <div>{testimonial.company}</div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
