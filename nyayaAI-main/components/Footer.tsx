"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Scale, Mail, Phone, MapPin, Twitter, Linkedin, Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <Scale className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-serif font-bold text-foreground">Nyaya.ai</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Democratizing legal knowledge in India through AI-powered assistance, education, and professional
              connections.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Github className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-foreground">Quick Links</h3>
            <div className="space-y-2">
              {["Features", "How it Works", "Pricing", "About Us", "Contact"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-foreground">Legal</h3>
            <div className="space-y-2">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Disclaimer", "Support"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-foreground">Stay Updated</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>hello@nyaya.ai</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Mumbai, India</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Subscribe for legal updates</p>
              <div className="flex gap-2">
                <Input placeholder="Enter your email" className="flex-1" />
                <Button size="sm">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2024 Nyaya.ai. All rights reserved. Made with ❤️ for India.</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Available in Hindi & English</span>
            <span>•</span>
            <span>Powered by AI</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
