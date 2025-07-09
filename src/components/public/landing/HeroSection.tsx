import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wifi, Cog, ShieldCheck, BarChart3 } from "lucide-react"

type AnimatedCirclesProps = {
  animated: boolean
}

const AnimatedCircles = ({ animated }: AnimatedCirclesProps) => {
  return (
    <div className="relative h-96 lg:h-[500px]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-16 h-16 border-4 border-yellow-400 rounded-full transition-all duration-1000 ${
                animated ? "animate-pulse" : ""
              }`}
              style={{
                left: `${20 + (i % 3) * 30}%`,
                top: `${20 + Math.floor(i / 3) * 25}%`,
                animationDelay: `${i * 0.2}s`,
              }}
            >
              {i % 3 === 0 && (
                <div className="w-full h-full rounded-full overflow-hidden bg-white p-1">
                  <Image
                    src="/placeholder.svg?height=56&width=56"
                    alt="Team member"
                    width={56}
                    height={56}
                    className="rounded-full"
                  />
                </div>
              )}
            </div>
          ))}

          <svg className="absolute inset-0 w-full h-full">
            {[...Array(6)].map((_, i) => (
              <line
                key={i}
                x1={`${25 + (i % 2) * 40}%`}
                y1={`${30 + Math.floor(i / 2) * 30}%`}
                x2={`${45 + (i % 2) * 20}%`}
                y2={`${50 + Math.floor(i / 2) * 20}%`}
                stroke="#FCD34D"
                strokeWidth="3"
                strokeDasharray="5,5"
                className={`transition-all duration-1000 ${animated ? "animate-pulse" : ""}`}
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  )
}

type HeroContentProps = {
  onElementVisible: (id: string) => void
}

const HeroContent = ({ onElementVisible }: HeroContentProps) => {
  return (
    <div className="space-y-8" id="hero" data-animate>
      <div className="space-y-4">
        <div className="inline-block bg-black text-white px-4 py-2 rounded-full text-sm font-medium">
          Outsourcing+
        </div>
        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
          Built to make
          <br />
          you better.
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
          We're not traditional outsourcers. We build world-class teams—from customer support to AI data
          solutions—helping you scale faster and smarter.
        </p>
      </div>

      <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-3 text-lg">
        Build your Dream Team
      </Button>

      <ContentCard />
    </div>
  )
}

const ContentCard = () => {
  return (
    <Card className="bg-cyan-100 border-0 max-w-md">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-cyan-500 rounded-full flex-shrink-0"></div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">Tariff Economy – The Next Big Thing</h3>
            <p className="text-sm text-gray-600 mb-4">
              The effect of U.S. tariffs runs a little deeper than the average consumer may realize. Here's
              the real issue...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-cyan-500 h-2 rounded-full w-3/4 transition-all duration-1000"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export const HeroSection = () => {
  const [animatedElements, setAnimatedElements] = useState<Set<string>>(new Set())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimatedElements((prev) => new Set(prev).add(entry.target.id))
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll("[data-animate]")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const isHeroAnimated = animatedElements.has("hero")

  return (
    <section className="bg-gradient-to-br from-yellow-50 to-orange-50 py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedCircles animated={isHeroAnimated} />
          <HeroContent onElementVisible={(id) => setAnimatedElements(new Set(animatedElements).add(id))} />
        </div>
      </div>
    </section>
  )
}
