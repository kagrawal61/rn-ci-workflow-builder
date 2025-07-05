'use client';

import { motion } from "framer-motion";
import {
  BarChart3,
  CheckCircle,
  Clock,
  DollarSign,
  Timer,
  TrendingUp,
  Users
} from "lucide-react";
import { Badge } from "./ui/badge";
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
          <Badge className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            <DollarSign className="h-3 w-3 mr-1" />
            Honest Estimates
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
            Realistic Benefits for React Native Teams
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Genuine time and cost savings, especially for teams new to CI/CD automation.
          </p>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl mx-auto">
            <em>Conservative estimates based on real-world scenarios. Your results will vary.</em>
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

        {/* ROI Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="p-8 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-green-500/5">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Manual Setup vs Workflow Builder</h3>
              <p className="text-muted-foreground">See the dramatic difference in time and cost</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <Timer className="h-4 w-4" />
                  <span className="font-semibold">Manual Setup</span>
                </div>
                {manualSetupItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-semibold">With Workflow Builder</span>
                </div>
                {workflowBuilderItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Impact Numbers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold mb-8">Real-World Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {impactMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl font-bold text-primary">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const benefits = [
  {
    title: "Setup Time",
    metric: "75-85% Faster",
    description: "Reduce initial CI/CD setup from 2-4 days to 1-2 hours. Generate workflows in 30-60 minutes vs 4-8 hours manually.",
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
    title: "For New Teams",
    metric: "Major Advantage",
    description: "Biggest benefits for teams new to CI/CD. Experienced teams will see smaller improvements.",
    icon: Users,
  },
  {
    title: "Annual Impact",
    metric: "$2K-15K",
    description: "Small teams (1-2 projects): $2K-6K annually. Active teams (3-6 projects): $6K-15K annually.",
    icon: BarChart3,
  },
];

const manualSetupItems = [
  "2-4 days initial setup",
  "4-8 hours per workflow", 
  "Requires learning YAML syntax",
  "High syntax error rate",
  "Manual secret management",
  "Platform-specific knowledge needed"
];

const workflowBuilderItems = [
  "1-2 hours setup",
  "30-60 minutes per workflow",
  "Visual form interface",
  "Validation prevents syntax errors", 
  "Auto-detected secrets guide",
  "Cross-platform templates"
];

const impactMetrics = [
  {
    value: "$2K-6K",
    label: "Small teams (1-2 projects/year)"
  },
  {
    value: "$6K-15K", 
    label: "Active teams (3-6 projects/year)"
  },
  {
    value: "1-2 hours",
    label: "Typical setup time"
  }
]; 