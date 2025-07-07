import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Book, CheckCircle, Clock, Target, TrendingUp } from 'lucide-react';

export default function BenefitsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
         Unlocking Efficiency: The Benefits of Our Tool
        </h1>
      </div>


      <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-6">
        <h2 className="mb-4 text-xl font-semibold">Executive Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">$2K-15K</div>
            <div className="text-sm text-muted-foreground">Annual savings</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">95%</div>
            <div className="text-sm text-muted-foreground">Faster CI/CD setup</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">~5 mins</div>
            <div className="text-sm text-muted-foreground">workflow generation </div>
          </div>
        </div>
      </div>

<div className="space-y-6">
        <h2 className="text-2xl font-semibold">Measurable Benefits</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Time Savings</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Initial Setup </span>
                <Badge variant="outline">Weeks → Hours</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Per Workflow</span>
                <Badge variant="outline">Hours → Minutes</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">YAML Learning Curve</span>
                <Badge variant="outline">Eliminated</Badge>
              </div>
              
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Book className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Learning Benefits</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">GitHub Actions YAML</span>
                <Badge variant="outline">Not required</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Syntax Errors</span>
                <Badge variant="outline">Reduced</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Secret Management</span>
                <Badge variant="outline">Guided</Badge>
              </div>
              
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Cost Analysis </h3>
          </div>
          <div className="space-y-4">
            <div className="text-sm">
             
              <ul className="ml-4 mt-1 space-y-1">
                <li>• Save 12-48 hours per project setup</li>
                <li>• At $100/hour = $1,200-4,800 per project</li>
                <li>• One-time learning investment vs repeated manual work</li>
              </ul>
            </div>
          </div>
        </Card>

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
                  <div className="font-medium">95% Fewer Configuration Errors</div>
                  <div className="text-sm text-muted-foreground">Pre-validated templates eliminate common mistakes</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 text-green-500" />
                <div>
                  <div className="font-medium">80% Faster Development Cycles</div>
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