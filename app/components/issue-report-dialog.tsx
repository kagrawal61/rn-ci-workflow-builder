'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle2, MessageSquareWarning } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

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
      const mailtoLink = `mailto:kagrawal61@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;

      // Open the mail client
      window.open(mailtoLink, '_blank');

      // Show success message
      setFormStatus({
        success: true,
        message:
          'Your email client should have opened with the report details. If not, please send an email directly to kagrawal61@gmail.com with your report.',
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
          'There was an error opening your email client. Please try again or send an email directly to kagrawal61@gmail.com.',
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
            you.
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
                  You can also send an email manually to:
                </p>
                <div className="rounded-md bg-muted p-2">
                  <code>kagrawal61@gmail.com</code>
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
