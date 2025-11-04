'use client'

import Link from 'next/link'
import { Linkedin, Instagram, Github, Mail, Phone, MessageSquare } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/gohar-abbas-106519321/',
      color: 'hover:text-blue-600'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://www.instagram.com/goharabbas2122804/',
      color: 'hover:text-pink-500'
    },
    {
      name: 'Threads',
      icon: MessageSquare,
      href: 'https://www.instagram.com/goharabbas2122804/',
      color: 'hover:text-purple-500'
    },
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com/GoharAbbas2122804',
      color: 'hover:text-gray-300'
    },
    {
      name: 'Email',
      icon: Mail,
      href: 'mailto:GoharAbbas2122804@gmail.com',
      color: 'hover:text-yellow-500'
    },
    {
      name: 'Phone',
      icon: Phone,
      href: 'tel:+923193592263',
      color: 'hover:text-green-500'
    }
  ]

  const footerLinks = [
    { name: 'About', href: '/about' },
    { name: 'Contact Us', href: '/contact-us' },
    { name: 'Services', href: '/services' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' }
  ]

  return (
    <footer className="relative mt-auto border-t border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-transparent to-teal-400/5 opacity-50 animate-pulse" />
      
      <div className="container relative z-10 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8">
          {/* Project Name & Description */}
          <div className="lg:col-span-2 space-y-4 animate-fade-in">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
              Signalist
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Track real-time stock prices, get personalized alerts, and explore detailed company insights. 
              Your intelligent companion for smarter stock market decisions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 animate-fade-in-delay-1">
            <h4 className="text-lg font-semibold text-gray-100">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.map((link, index) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-yellow-500 transition-all duration-300 text-sm inline-block hover:translate-x-1 group"
                  >
                    <span className="group-hover:underline">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4 animate-fade-in-delay-2">
            <h4 className="text-lg font-semibold text-gray-100">Connect With Us</h4>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative"
                    aria-label={social.name}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-700/50 border border-gray-600/50 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-yellow-500/50 group-hover:bg-gray-700">
                      <Icon className={`w-5 h-5 text-gray-400 transition-colors duration-300 ${social.color}`} />
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700/50 my-8" />

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500 animate-fade-in-delay-3">
          <p className="text-center sm:text-left">
            © {currentYear} <span className="text-yellow-500 font-semibold">Signalist</span>. All rights reserved.
          </p>
          <p className="text-center sm:text-right">
            Made with <span className="text-red-500 animate-pulse">♥</span> for stock market enthusiasts
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

