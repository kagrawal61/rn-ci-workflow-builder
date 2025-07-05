import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CheckCircle, Clock, DollarSign, Target, TrendingUp, Users } from 'lucide-react';

export default function BenefitsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          ROI & Benefits Analysis
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Quantifiable benefits of using the React Native CI Workflow Builder
        </p>
      </div>

      <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-6">
        <h2 className="mb-4 text-xl font-semibold">Executive Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">300-500%</div>
            <div className="text-sm text-muted-foreground">Typical ROI within Q1</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">$25K-50K</div>
            <div className="text-sm text-muted-foreground">Annual savings (5-person team)</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">95%</div>
            <div className="text-sm text-muted-foreground">Faster CI/CD setup</div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Detailed Cost-Benefit Analysis</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Time Savings</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Initial CI/CD Setup</span>
                <Badge variant="outline">2-3 days → 15 min</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Per Workflow Configuration</span>
                <Badge variant="outline">2-4 hours → 5-10 min</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Documentation & Secrets</span>
                <Badge variant="outline">30-60 min → Auto-generated</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Debugging & Fixes</span>
                <Badge variant="outline">80% reduction</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Cost Savings</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Developer Time (@$100/hr)</span>
                <Badge variant="outline">$2,000-6,000/project</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">DevOps Expertise Need</span>
                <Badge variant="outline">70% reduction</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">CI/CD Runtime Costs</span>
                <Badge variant="outline">30-40% reduction</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Maintenance Overhead</span>
                <Badge variant="outline">50% reduction</Badge>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Efficiency Improvements</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 text-green-500" />
                <div>
                  <div className="font-medium">Faster Time-to-Market</div>
                  <div className="text-sm text-muted-foreground">Deploy 2-3 weeks earlier with automated CI/CD</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 text-green-500" />
                <div>
                  <div className="font-medium">90% Fewer Configuration Errors</div>
                  <div className="text-sm text-muted-foreground">Pre-validated templates eliminate common mistakes</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 text-green-500" />
                <div>
                  <div className="font-medium">40% Faster Development Cycles</div>
                  <div className="text-sm text-muted-foreground">Reliable automated workflows boost productivity</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 text-green-500" />
                <div>
                  <div className="font-medium">10x Project Scalability</div>
                  <div className="text-sm text-muted-foreground">Handle more projects with same resources</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">ROI by Team Size</h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Small Team (2-5 devs)</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Annual Setup Cost Savings</span>
                  <span className="font-medium">$8K-15K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Maintenance Savings</span>
                  <span className="font-medium">$5K-10K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Faster Delivery Value</span>
                  <span className="font-medium">$10K-25K</span>
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Total Annual Savings</span>
                  <span className="text-primary">$23K-50K</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Medium Team (6-15 devs)</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Annual Setup Cost Savings</span>
                  <span className="font-medium">$20K-40K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Maintenance Savings</span>
                  <span className="font-medium">$15K-30K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Faster Delivery Value</span>
                  <span className="font-medium">$25K-60K</span>
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Total Annual Savings</span>
                  <span className="text-primary">$60K-130K</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Enterprise (15+ devs)</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Annual Setup Cost Savings</span>
                  <span className="font-medium">$50K-100K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Maintenance Savings</span>
                  <span className="font-medium">$30K-60K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Faster Delivery Value</span>
                  <span className="font-medium">$100K-200K</span>
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Total Annual Savings</span>
                  <span className="text-primary">$180K-360K</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Manual vs Automated Comparison</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
            <thead>
              <tr className="bg-muted/50">
                <th className="border border-gray-200 dark:border-gray-700 p-3 text-left">Aspect</th>
                <th className="border border-gray-200 dark:border-gray-700 p-3 text-left">Manual Setup</th>
                <th className="border border-gray-200 dark:border-gray-700 p-3 text-left">Workflow Builder</th>
                <th className="border border-gray-200 dark:border-gray-700 p-3 text-left">Improvement</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-3 font-medium">Initial Setup Time</td>
                <td className="border border-gray-200 dark:border-gray-700 p-3">2-3 days</td>
                <td className="border border-gray-200 dark:border-gray-700 p-3">15 minutes</td>
                <td className="border border-gray-200 dark:border-gray-700 p-3 text-green-600 font-medium">95% faster</td>
              </tr>
              <tr className="bg-muted/25">
                <td className="border border-gray-200 dark:border-gray-700 p-3 font-medium">Per Workflow Time</td>
                <td className="border border-gray-200 dark:border-gray-700 p-3">4-8 hours</td>
                <td className="border border-gray-200 dark:border-gray-700 p-3">5-10 minutes</td>
                <td className="border border-gray-200 dark:border-gray-700 p-3 text-green-600 font-medium">96% faster</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-3 font-medium">Error Rate</td>
                <td className="border border-gray-200 dark:border-gray-700 p-3">30-40%</td>
                <td className="border border-gray-200 dark:border-gray-700 p-3">&lt;5%</td>
                <td className="border border-gray-200 dark:border-gray-700 p-3 text-green-600 font-medium">90% reduction</td>
              </tr>
              <tr className="bg-muted/25">
                <td className="border border-gray-200 dark:border-gray-700 p-3 font-medium">Expertise Required</td>
                <td className="border border-gray-200 dark:border-gray-700 p-3">DevOps specialist</td>
                <td className="border border-gray-200 dark:border-gray-700 p-3">Any developer</td>
                <td className="border border-gray-200 dark:border-gray-700 p-3 text-green-600 font-medium">70% less expertise</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-3 font-medium">Maintenance Effort</td>
                <td className="border border-gray-200 dark:border-gray-700 p-3">High</td>
                <td className="border border-gray-200 dark:border-gray-700 p-3">Low</td>
                <td className="border border-gray-200 dark:border-gray-700 p-3 text-green-600 font-medium">50% reduction</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Card className="p-6 bg-gradient-to-r from-primary/10 to-green-500/10">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Ready to Start Saving?</h3>
        </div>
        <p className="text-muted-foreground mb-4">
          The numbers speak for themselves. Start generating workflows today and see immediate 
          impact on your team's productivity and your project's bottom line.
        </p>
        <div className="flex gap-4">
          <Badge className="bg-primary text-primary-foreground">
            First workflow: 15 minutes
          </Badge>
          <Badge className="bg-green-500 text-white">
            Immediate 95% time savings
          </Badge>
          <Badge className="bg-blue-500 text-white">
            $2K-6K saved per project
          </Badge>
        </div>
      </Card>
    </div>
  );
} 