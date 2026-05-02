"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, BookOpen, FileText, Users, TrendingUp, Shield, Smartphone, Globe } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Legal Chatbot",
    description:
      "Get instant answers to legal questions in plain language. Our AI understands Indian law and provides simplified explanations.",
    badge: "Smart AI",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: BookOpen,
    title: "Know Your Rights Framework",
    description:
      "Comprehensive database of legal rights categorized by Family, Labour, Property, and Criminal Law with real examples.",
    badge: "Educational",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: FileText,
    title: "Legal Document Generator",
    description: "Create FIRs, complaint letters, rental agreements, and more with our AI-powered document wizard.",
    badge: "Automated",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Users,
    title: "Verified Lawyer Network",
    description: "Connect with qualified lawyers for professional consultation and legal representation when needed.",
    badge: "Professional",
    color: "bg-chart-1/10 text-chart-1",
  },
  {
    icon: TrendingUp,
    title: "Legal Wellness Tracker",
    description:
      "Gamified learning experience that tracks your legal awareness progress and awards achievement badges.",
    badge: "Gamified",
    color: "bg-chart-2/10 text-chart-2",
  },
  {
    icon: Shield,
    title: "V-KYC Verification",
    description: "Secure identity verification system ensuring authentic user interactions and document generation.",
    badge: "Secure",
    color: "bg-chart-3/10 text-chart-3",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4 text-sm px-4 py-2">
            Comprehensive Features
          </Badge>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Everything You Need for{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Legal Empowerment
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From AI-powered assistance to professional lawyer connections, we provide all the tools you need to
            understand and exercise your legal rights.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full bg-card hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`p-3 rounded-xl ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-serif font-semibold text-lg text-foreground">{feature.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Smartphone className="h-5 w-5" />
              <span>Mobile First</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-muted-foreground rounded-full"></div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe className="h-5 w-5" />
              <span>Available in Hindi & English</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-muted-foreground rounded-full"></div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="h-5 w-5" />
              <span>Bank-Grade Security</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
