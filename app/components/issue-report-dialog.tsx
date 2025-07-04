'use client';

import { AlertCircle, CheckCircle2, MessageSquareWarning } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface FormStatus {
  success: boolean;
  message: string;
}

export function IssueReportDialog() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatus | null>(null);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format the email body
      const emailBody = `Issue Report from: ${email}\n\n${message}`;

      // Encode the subject and body for mailto URL
      const encodedSubject = encodeURIComponent(subject);
      const encodedBody = encodeURIComponent(emailBody);

      // Create mailto link with recipient, subject, and body
      const mailtoLink = `mailto:mobilecibuilder@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;

      // Open the mail client
      window.open(mailtoLink, '_blank');

      // Show success message
      setFormStatus({
        success: true,
        message:
          'Your email client should have opened with the report details. If not, please send an email directly to mobilecibuilder@gmail.com with your report.',
      });

      // Reset the form
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Error opening email client:', error);
      setFormStatus({
        success: false,
        message:
          'There was an error opening your email client. Please try again or send an email directly to mobilecibuilder@gmail.com.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      // Reset form when dialog closes
      setFormStatus(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1 bg-primary/5 hover:bg-primary/10"
        >
          <MessageSquareWarning className="h-4 w-4" />
          Report Issue
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report an Issue</DialogTitle>
          <DialogDescription>
            Found a bug or have a suggestion? Let us know and we'll get back to
            you. You can use this form or create an issue directly on GitHub.
          </DialogDescription>
        </DialogHeader>

        {formStatus ? (
          <div className="py-6">
            <div
              className={`flex items-center gap-2 rounded-md p-4 ${formStatus.success ? 'border border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-900/30 dark:text-green-300' : 'border border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-900/30 dark:text-red-300'}`}
            >
              {formStatus.success ? (
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
              )}
              <p className="text-sm">{formStatus.message}</p>
            </div>

            {formStatus.success && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium">
                  You can also contact us through these alternatives:
                </p>
                <div className="space-y-2">
                  <div className="rounded-md bg-muted p-2">
                    <p className="text-sm">Email: <code>mobilecibuilder@gmail.com</code></p>
                  </div>
                  <div className="rounded-md bg-muted p-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">GitHub Issues:</p>
                      <a 
                        href="https://github.com/kagrawal61/rn-ci-workflow-builder/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        Open GitHub Issues
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5">
                          <path d="M7 7h10v10"></path>
                          <path d="M7 17 17 7"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="mt-6">
              {formStatus.success ? (
                <Button onClick={() => setOpen(false)}>Close</Button>
              ) : (
                <Button onClick={() => setFormStatus(null)}>Try Again</Button>
              )}
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="mb-2 rounded-md border bg-muted/40 p-3">
              <p className="flex items-center gap-2 text-sm font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
                Prefer GitHub Issues?
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                You can also create an issue directly on our GitHub repository:
              </p>
              <a 
                href="https://github.com/kagrawal61/rn-ci-workflow-builder/issues" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-2 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Open GitHub Issues
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5">
                  <path d="M7 7h10v10"></path>
                  <path d="M7 17 17 7"></path>
                </svg>
              </a>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Input
                id="subject"
                placeholder="Brief description of the issue"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="message" className="text-sm font-medium">
                Details
              </label>
              <Textarea
                id="message"
                placeholder="Please provide as much detail as possible..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={5}
                required
              />
            </div>

            <DialogFooter className="mt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Submit Report'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
