import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type DropdownItem = {
  name: string;
  href: string;
  icon?: React.ReactNode;
};

type DropdownProps = {
  title: string;
  items: DropdownItem[];
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  hasIcons?: boolean;
  submenu?: Record<string, DropdownItem[]>;
};

const servicesSubmenus = {
  "Customer Support": [
    { name: "General Support", href: "/solutions/customer-support/general" },
    {
      name: "Call Center Support",
      href: "/solutions/customer-support/call-center",
    },
    {
      name: "Technical Support",
      href: "/solutions/customer-support/technical",
    },
    {
      name: "Live Chat Support",
      href: "/solutions/customer-support/live-chat",
    },
    { name: "Email Support", href: "/solutions/customer-support/email" },
  ],
};

const Dropdown = ({
  title,
  items,
  isOpen,
  onOpen,
  onClose,
  hasIcons = false,
  submenu,
}: DropdownProps) => {
  const [submenuOpen, setSubmenuOpen] = useState<string | null>(null);
  return (
    <div
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={() => {
        onClose();
        setSubmenuOpen(null);
      }}
    >
      <button
        className={`flex items-center space-x-1 cursor-pointer hover:text-emerald-600 transition-colors font-medium ${
          isOpen ? "text-emerald-600" : ""
        }`}
        tabIndex={0}
        onFocus={onOpen}
        onBlur={onClose}
      >
        <span>{title}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-30"
          >
            {items.map((item: any, i: number) => (
              <div
                key={i}
                className="relative group"
                onMouseEnter={() => submenu && setSubmenuOpen(item.name)}
                onMouseLeave={() => submenu && setSubmenuOpen(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors group"
                >
                  {hasIcons && item.icon}
                  <span className="group-hover:text-emerald-600 transition-colors">
                    {item.name}
                  </span>
                  {submenu && submenu[item.name] && (
                    <ChevronDown className="w-4 h-4 ml-auto rotate-[-90deg] text-gray-400" />
                  )}
                </Link>
                {submenu && submenu[item.name] && (
                  <AnimatePresence>
                    {submenuOpen === item.name && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-0 left-full ml-2 w-60 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-40"
                      >
                        {submenu[item.name].map((sub: any, j: number) => (
                          <Link
                            key={j}
                            href={sub.href}
                            className="block px-4 py-2 hover:bg-gray-50 text-gray-700"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const servicesDropdown = [
    {
      name: "Customer Support",
      icon: <Users className="w-5 h-5 text-emerald-500" />,
      href: "/services/customer-support",
    },
  ];

  const industriesDropdown = [
    { name: "Gaming", href: "/industries/gaming" },
    { name: "Crypto", href: "/industries/crypto" },
    { name: "Ecommerce", href: "/industries/ecommerce" },
    { name: "Health & Wellness", href: "/industries/health-wellness" },
    { name: "SaaS", href: "/industries/saas" },
    { name: "Fintech", href: "/industries/fintech" },
    { name: "Edtech", href: "/industries/edtech" },
    { name: "Online Subscriptions", href: "/industries/subscriptions" },
    { name: "Rewards & GPT Platforms", href: "/industries/rewards-gpt" },
  ];

  const aboutDropdown = [
    { name: "About Us", href: "/about" },
    { name: "Our Team", href: "/about/team" },
    { name: "Careers", href: "/about/careers" },
    { name: "News & Press", href: "/about/news" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-emerald-indigo rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 font-heading">
              B360
            </span>
          </Link>

          <nav
            className="hidden md:flex items-center space-x-8"
            ref={dropdownRef}
          >
            <Dropdown
              title="Services"
              items={servicesDropdown}
              isOpen={activeDropdown === "services"}
              onOpen={() => setActiveDropdown("services")}
              onClose={() => setActiveDropdown(null)}
              hasIcons
              submenu={servicesSubmenus}
            />

            <Dropdown
              title="Industries"
              items={industriesDropdown}
              isOpen={activeDropdown === "industries"}
              onOpen={() => setActiveDropdown("industries")}
              onClose={() => setActiveDropdown(null)}
            />

            <Link
              href="/pricing"
              className="hover:text-emerald-600 transition-colors font-medium"
            >
              Pricing
            </Link>

            <Dropdown
              title="About"
              items={aboutDropdown}
              isOpen={activeDropdown === "about"}
              onOpen={() => setActiveDropdown("about")}
              onClose={() => setActiveDropdown(null)}
            />
          </nav>

          <Link href="/contact">
            <Button className="bg-gradient-emerald-indigo text-white hover:opacity-90 rounded-full px-8 py-2 font-bold shadow-lg">
              Book a Demo Now
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
