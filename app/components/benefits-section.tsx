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
          <Badge className="mb-4 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <DollarSign className="h-3 w-3 mr-1" />
            Quantifiable ROI
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
            Why Teams Choose Our Workflow Builder
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stop spending weeks on CI/CD setup. Get quantifiable results that impact your bottom line.
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
    title: "Time Savings",
    metric: "95% Faster",
    description: "Reduce CI/CD setup from 2-3 days to just 15 minutes. Generate complex workflows in 5-10 minutes vs 2-4 hours manually.",
    icon: Clock,
  },
  {
    title: "Cost Reduction",
    metric: "$2K-6K Saved",
    description: "Save $2,000-6,000 per project in developer costs. Reduce need for specialized DevOps engineers by 70%.",
    icon: DollarSign,
  },
  {
    title: "Error Reduction",
    metric: "90% Fewer Errors",
    description: "Pre-validated configurations and templates eliminate 90% of common configuration errors and debugging time.",
    icon: CheckCircle,
  },
  {
    title: "Team Productivity",
    metric: "40% Faster Cycles",
    description: "Accelerate development cycles by 40% with reliable automated workflows and faster deployments.",
    icon: TrendingUp,
  },
  {
    title: "Scalability",
    metric: "10x More Projects",
    description: "Scale to 10x more projects with same DevOps resources. Standardized workflows reduce maintenance by 50%.",
    icon: Users,
  },
  {
    title: "ROI",
    metric: "300-500% ROI",
    description: "Typical 300-500% return on investment within the first quarter. Faster time-to-market by 2-3 weeks.",
    icon: BarChart3,
  },
];

const manualSetupItems = [
  "2-3 days initial setup",
  "4-8 hours per workflow",
  "High error rate (30-40%)",
  "Requires DevOps expertise",
  "Complex YAML debugging",
  "Manual secret management",
  "Platform-specific configs"
];

const workflowBuilderItems = [
  "15 minutes setup",
  "5-10 minutes per workflow",
  "<5% error rate",
  "No specialized knowledge needed",
  "Visual interface with validation",
  "Auto-detected secrets guide",
  "Cross-platform templates"
];

const impactMetrics = [
  {
    value: "$25K-50K",
    label: "Annual savings for 5-person team"
  },
  {
    value: "$100K+",
    label: "Enterprise cost reduction"
  },
  {
    value: "2-3 weeks",
    label: "Faster time-to-market"
  }
]; 