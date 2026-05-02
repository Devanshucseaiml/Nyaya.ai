"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const problems = [
  "Complex legal language that's hard to understand",
  "Expensive lawyer consultations for basic questions",
  "Lack of awareness about fundamental legal rights",
  "Difficulty in creating legal documents",
  "No accessible platform for legal guidance",
]

const solutions = [
  "AI explains laws in simple, everyday language",
  "Free legal assistance for common queries",
  "Comprehensive rights education framework",
  "Instant document generation with templates",
  "24/7 accessible legal companion platform",
]

export function ProblemSolutionSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 text-sm px-4 py-2">
            The Challenge & Our Solution
          </Badge>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Breaking Down{" "}
            <span className="bg-gradient-to-r from-destructive to-primary bg-clip-text text-transparent">
              Legal Barriers
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Legal knowledge shouldn't be a privilege. We're making it accessible, understandable, and actionable for
            every Indian citizen.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Problem Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 bg-destructive/5 border-destructive/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground">The Problem</h3>
              </div>

              <div className="space-y-4">
                {problems.map((problem, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 p-4 bg-background/50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-foreground leading-relaxed">{problem}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Solution Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground">Our Solution</h3>
              </div>

              <div className="space-y-4 mb-8">
                {solutions.map((solution, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 p-4 bg-background/50 rounded-lg"
                  >
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-foreground leading-relaxed">{solution}</p>
                  </motion.div>
                ))}
              </div>

              <Button className="w-full group">
                Experience the Solution
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Card>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <Card className="p-6 text-center bg-card">
            <div className="text-3xl font-serif font-bold text-primary mb-2">1.4B+</div>
            <p className="text-muted-foreground">Indians need legal awareness</p>
          </Card>
          <Card className="p-6 text-center bg-card">
            <div className="text-3xl font-serif font-bold text-secondary mb-2">₹5000+</div>
            <p className="text-muted-foreground">Average lawyer consultation cost</p>
          </Card>
          <Card className="p-6 text-center bg-card">
            <div className="text-3xl font-serif font-bold text-accent mb-2">24/7</div>
            <p className="text-muted-foreground">AI assistance availability</p>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
