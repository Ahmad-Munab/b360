import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronDown, Wifi, Cog, ShieldCheck, BarChart3 } from "lucide-react"

type DropdownItem = {
  name: string
  href: string
  icon?: React.ReactNode
}

type DropdownProps = {
  title: string
  items: DropdownItem[]
  isOpen: boolean
  onToggle: () => void
  hasIcons?: boolean
}

const Dropdown = ({ title, items, isOpen, onToggle, hasIcons = false }: DropdownProps) => {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center space-x-1 cursor-pointer hover:text-yellow-600 transition-colors ${
          isOpen ? "text-yellow-600" : ""
        }`}
      >
        <span>{title}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 animate-in slide-in-from-top-2 duration-200">
          {items.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors group"
            >
              {hasIcons && item.icon}
              <span className="group-hover:text-yellow-600 transition-colors">{item.name}</span>
              {hasIcons && <ChevronDown className="w-4 h-4 ml-auto rotate-[-90deg] text-gray-400" />}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const solutionsDropdown = [
    { name: "Customer Support", icon: <Wifi className="w-5 h-5 text-cyan-500" />, href: "#" },
    { name: "Digital Operations", icon: <Cog className="w-5 h-5 text-green-500" />, href: "#" },
    { name: "Trust & Safety", icon: <ShieldCheck className="w-5 h-5 text-purple-500" />, href: "#" },
    { name: "Data & AI", icon: <BarChart3 className="w-5 h-5 text-red-500" />, href: "#" },
  ]

  const industriesDropdown = [
    { name: "Gaming", href: "#" },
    { name: "Crypto", href: "#" },
    { name: "Ecommerce", href: "#" },
    { name: "Health & Wellness", href: "#" },
    { name: "SaaS", href: "#" },
    { name: "Fintech", href: "#" },
    { name: "Edtech", href: "#" },
    { name: "Online Subscriptions", href: "#" },
    { name: "Rewards & GPT Platforms", href: "#" },
  ]

  const companyDropdown = [
    { name: "About", href: "#" },
    { name: "Careers", href: "#" },
    { name: "News", href: "#" },
    { name: "Contact", href: "#" },
  ]

  const resourcesDropdown = [
    { name: "Blog", href: "#" },
    { name: "Case Studies", href: "#" },
    { name: "Documentation", href: "#" },
    { name: "Support", href: "#" },
    { name: "FAQs", href: "#" },
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name)
  }

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">B360</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8" ref={dropdownRef}>
            <Dropdown
              title="Solutions"
              items={solutionsDropdown}
              isOpen={activeDropdown === "solutions"}
              onToggle={() => toggleDropdown("solutions")}
              hasIcons
            />

            <Dropdown
              title="Industries"
              items={industriesDropdown}
              isOpen={activeDropdown === "industries"}
              onToggle={() => toggleDropdown("industries")}
            />

            <Link href="#" className="hover:text-yellow-600 transition-colors">
              Our Agents
            </Link>
            <Link href="#" className="hover:text-yellow-600 transition-colors">
              Pricing
            </Link>

            <Dropdown
              title="Company"
              items={companyDropdown}
              isOpen={activeDropdown === "company"}
              onToggle={() => toggleDropdown("company")}
            />

            <Dropdown
              title="Resources"
              items={resourcesDropdown}
              isOpen={activeDropdown === "resources"}
              onToggle={() => toggleDropdown("resources")}
            />
          </nav>

          <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6">Get Started</Button>
        </div>
      </div>
    </header>
  )
}
