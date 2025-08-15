import { z } from 'zod';

export const ContactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required').max(200),
  message: z.string().min(1, 'Message is required').max(1000),
});

export const DonationSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('USD'),
  donorName: z.string().min(1, 'Donor name is required'),
  donorEmail: z.string().email('Invalid email address'),
  isAnonymous: z.boolean().default(false),
  message: z.string().optional(),
});

export const VolunteerApplicationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date'),
  address: z.string().min(1, 'Address is required'),
  skills: z.array(z.string()),
  availability: z.string().min(1, 'Availability is required'),
  motivation: z.string().min(1, 'Motivation is required'),
});

export type ContactForm = z.infer<typeof ContactFormSchema>;
export type Donation = z.infer<typeof DonationSchema>;
export type VolunteerApplication = z.infer<typeof VolunteerApplicationSchema>;