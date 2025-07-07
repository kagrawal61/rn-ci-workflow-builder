'use client';

import { motion } from "framer-motion";
import {
  BarChart3,
  CheckCircle,
  Clock,
  DollarSign,
  Plug,
  TrendingUp
} from "lucide-react";
import { Card } from "./ui/card";

export function BenefitsSection() {
  return (
    <div className="w-full py-16 md:py-24 bg-gradient-to-br from-background via-background/95 to-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
            Realistic Benefits for React Native Teams
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Genuine time and cost savings for teams new to CI/CD automation.
          </p>
        </motion.div>

        {/* Main Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="p-6 h-full border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all">
                    <benefit.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{benefit.title}</h3>
                </div>
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-primary">{benefit.metric}</div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}

const benefits = [
{
  title: "Setup Time",
  metric: "85-95% Faster",
  description: "Create workflows in under 10 minutes, significantly reducing the hours typically spent on manual setup.",
  icon: Clock,
},
  {
    title: "Cost Savings",
    metric: "$1.2K-4.8K",
    description: "Save $1,200-4,800 per project in developer time (12-48 hours × $100/hour). Most benefit for teams new to CI/CD.",
    icon: DollarSign,
  },
  {
    title: "Learning Curve",
    metric: "Faster Onboarding",
    description: "Visual interface eliminates need to learn GitHub Actions YAML syntax. Reduces syntax errors through validation.",
    icon: CheckCircle,
  },
  {
    title: "Consistency",
    metric: "Standardized Setup",
    description: "Templates ensure similar configuration across projects. Auto-detects required secrets and provides guidance.",
    icon: TrendingUp,
  },
  {
    title: "Seamless Integration",
    metric: "Effortless Transition",
    description: "Integrate seamlessly with existing workflows, minimizing disruption and maximizing efficiency for teams transitioning to CI/CD.",
    icon: Plug,
  },
  {
    title: "Annual Impact",
    metric: "$2K-15K",
    description: "For small teams managing 1-2 projects, the annual savings range from $2,000 to $6,000. For more active teams handling 3-6 projects, the savings can increase to $6,000 to $15,000 annually.",
    icon: BarChart3,
  },
];
