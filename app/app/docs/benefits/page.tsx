import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { AlertTriangle, Book, Clock, Target, Users } from 'lucide-react';

export default function BenefitsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          Honest Assessment: What This Tool Actually Does
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Realistic benefits, limitations, and who should (and shouldn't) use this tool
        </p>
      </div>

      <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
        <h2 className="mb-4 text-xl font-semibold text-blue-800 dark:text-blue-200">Who Benefits Most</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">✅ Great For:</h3>
            <ul className="space-y-1 text-sm">
              <li>• Teams new to GitHub Actions/Bitrise</li>
              <li>• Developers who avoid CI/CD due to complexity</li>
              <li>• Projects needing standard React Native workflows</li>
              <li>• Teams wanting consistent setup across projects</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">⚠️ Limited Benefit For:</h3>
            <ul className="space-y-1 text-sm">
              <li>• Teams already expert in CI/CD</li>
              <li>• Projects needing heavy customization</li>
              <li>• Complex enterprise requirements</li>
              <li>• Teams preferring full YAML control</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Measurable Benefits</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Time Savings (Real Numbers)</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Initial Setup (New Teams)</span>
                <Badge variant="outline">2-4 days → 1-2 hours</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Per Workflow (First Time)</span>
                <Badge variant="outline">4-8 hours → 30-60 min</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">YAML Learning Curve</span>
                <Badge variant="outline">Eliminated</Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                <strong>Note:</strong> Experienced teams see minimal time savings
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
              <div className="text-xs text-muted-foreground">
                <strong>Limitation:</strong> Templates may not cover all use cases
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Cost Analysis (Conservative)</h3>
          </div>
          <div className="space-y-4">
            <div className="text-sm">
              <strong>For teams NEW to CI/CD:</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• Save 12-48 hours per project setup</li>
                <li>• At $100/hour = $1,200-4,800 per project</li>
                <li>• One-time learning investment vs repeated manual work</li>
              </ul>
            </div>
            <div className="text-sm">
              <strong>For experienced teams:</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• Minimal time savings (maybe 2-4 hours)</li>
                <li>• Consistency benefits across projects</li>
                <li>• Faster onboarding of new team members</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Realistic Annual Impact</h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Small Team (New to CI/CD)</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">1-2 projects/year</span>
                  <span className="font-medium">$1.2K-4.8K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Plus: Consistency benefits</span>
                  <span className="font-medium">Qualitative</span>
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Annual Savings</span>
                  <span className="text-primary">$1.2K-4.8K</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Active Team (Some CI/CD experience)</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">3-6 projects/year</span>
                  <span className="font-medium">$3.6K-14.4K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Reduced if team learns YAML</span>
                  <span className="font-medium">Variable</span>
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Annual Savings</span>
                  <span className="text-primary">$3.6K-14.4K</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Expert Team</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Minimal time savings</span>
                  <span className="font-medium">$500-2K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Main benefit: consistency</span>
                  <span className="font-medium">Qualitative</span>
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Annual Savings</span>
                  <span className="text-primary">$500-2K</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Honest Comparison</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
            <thead>
              <tr className="bg-muted/50">
                <th className="border border-gray-200 dark:border-gray-700 p-3 text-left">Aspect</th>
                <th className="border border-gray-200 dark:border-gray-700 p-3 text-left">Manual Setup</th>
                <th className="border border-gray-200 dark:border-gray-700 p-3 text-left">This Tool</th>
                <th className="border border-gray-200 dark:border-gray-700 p-3 text-left">Reality Check</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-3 font-medium">Learning Curve</td>
                <td className="border border-gray-200 dark:border-gray-700 p-3">Must learn YAML syntax</td>
                <td className="border border-gray-200 dark:border-gray-700 p-3">Visual form interface</td>
                <td className="border border-gray-200 dark:border-gray-700 p-3 text-green-600 font-medium">Major advantage</td>
              </tr>
              <tr className="bg-muted/25">
                <td className="border border-gray-200 dark:border-gray-700 p-3 font-medium">First-time Setup</td>
                <td className="border border-gray-200 dark:border-gray-700 p-3">2-4 days (new teams)</td>
                <td className="border border-gray-200 dark:border-gray-700 p-3">1-2 hours</td>
                <td className="border border-gray-200 dark:border-gray-700 p-3 text-green-600 font-medium">Substantial savings</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 p-3 font-medium">Customization</td>
                <td className="border border-gray-200 dark:border-gray-700 p-3">Unlimited</td>
                <td className="border border-gray-200 dark:border-gray-700 p-3">Template-limited</td>
                <td className="border border-gray-200 dark:border-gray-700 p-3 text-orange-600 font-medium">Trade-off</td>
              </tr>
              <tr className="bg-muted/25">
                <td className="border border-gray-200 dark:border-gray-700 p-3 font-medium">For Expert Teams</td>
                <td className="border border-gray-200 dark:border-gray-700 p-3">Preferred workflow</td>
                <td className="border border-gray-200 dark:border-gray-700 p-3">Minimal benefit</td>
                <td className="border border-gray-200 dark:border-gray-700 p-3 text-orange-600 font-medium">Honest assessment</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Bottom Line</h3>
        </div>
        <div className="space-y-3">
          <p className="text-muted-foreground">
            This tool genuinely helps teams get started with React Native CI/CD by eliminating the YAML learning curve 
            and providing working templates. The biggest benefits are for teams new to CI/CD automation.
          </p>
          <p className="text-muted-foreground">
            If your team already knows GitHub Actions well, you'll see minimal time savings. The main value would be 
            consistency across projects and faster onboarding of new team members.
          </p>
          <div className="flex gap-2 pt-2">
            <Badge className="bg-green-500 text-white">Best for: New CI/CD teams</Badge>
            <Badge className="bg-blue-500 text-white">Good for: Consistency needs</Badge>
            <Badge className="bg-gray-500 text-white">Limited for: Expert teams</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
} 