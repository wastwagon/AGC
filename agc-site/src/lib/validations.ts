import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Valid email is required"),
  subject: z.string().max(200).optional(),
  message: z.string().min(1, "Message is required").max(5000),
});

export const newsletterSchema = z.object({
  email: z.string().email("Valid email is required"),
});

export const applicationSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(200),
  email: z.string().email("Valid email is required"),
  phone: z.string().max(50).optional(),
  position: z.string().max(200).optional(),
  organization: z.string().max(200).optional(),
  country: z.string().min(1, "Country is required").max(100),
  city: z.string().min(1, "City is required").max(100),
  experience: z.string().max(2000).optional(),
  skills: z.string().max(2000).optional(),
  motivation: z.string().min(1, "Motivation is required").max(2000),
  availability: z.string().max(50).optional(),
});

export const eventRegistrationSchema = z.object({
  eventSlug: z.string().min(1, "Event is required").max(200),
  eventId: z.number().optional(),
  eventTitle: z.string().min(1).max(500),
  eventStartDate: z.string(),
  eventEndDate: z.string().optional(),
  eventLocation: z.string().max(200).optional(),
  registrationDeadline: z.string().optional(),
  capacity: z.number().optional(),
  fullName: z.string().min(1, "Full name is required").max(200),
  email: z.string().email("Valid email is required"),
  phone: z.string().max(50).optional(),
  organization: z.string().max(200).optional(),
  dietaryReqs: z.string().max(500).optional(),
});

export const eventFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z.string().max(255).optional(),
  description: z.string().max(5000).optional(),
  location: z.string().max(255).optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  image: z.string().max(500).optional(),
  link: z.string().max(255).optional(),
  category: z.string().max(255).optional(),
  eventType: z.string().max(100).optional(),
  venueName: z.string().max(255).optional(),
  venueAddress: z.string().max(500).optional(),
  capacity: z.string().optional().transform((v) => {
    if (v === "" || !v) return undefined;
    const n = parseInt(v, 10);
    return isNaN(n) ? undefined : n;
  }),
  registrationDeadline: z.string().optional(),
  status: z.enum(["draft", "published"]),
});

export const newsFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z.string().max(255).optional(),
  image: z.string().max(500).optional(),
  excerpt: z.string().max(1000).optional(),
  content: z.string().optional(),
  author: z.string().max(255).optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]),
  datePublished: z.string().optional(),
});

export const teamFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  role: z.string().max(255).optional(),
  bio: z.string().max(5000).optional(),
  image: z.string().max(500).optional(),
  order: z.string().optional().transform((v) => {
    if (v === "" || !v) return 0;
    const n = parseInt(v, 10);
    return isNaN(n) ? 0 : n;
  }),
  status: z.enum(["draft", "published"]),
});

export const publicationFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z.string().max(255).optional(),
  excerpt: z.string().max(2000).optional(),
  type: z.string().max(100).optional(),
  file: z.string().max(500).optional(),
  image: z.string().max(500).optional(),
  datePublished: z.string().optional(),
  author: z.string().max(255).optional(),
  status: z.enum(["draft", "published"]),
});

export const programFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().max(5000).optional(),
  image: z.string().max(500).optional(),
  order: z.string().optional().transform((v) => {
    if (v === "" || !v) return 0;
    const n = parseInt(v, 10);
    return isNaN(n) ? 0 : n;
  }),
  status: z.enum(["draft", "published"]),
});

export const projectFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().max(5000).optional(),
  image: z.string().max(500).optional(),
  order: z.string().optional().transform((v) => {
    if (v === "" || !v) return 0;
    const n = parseInt(v, 10);
    return isNaN(n) ? 0 : n;
  }),
  status: z.enum(["draft", "published"]),
});

export const partnerFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  logo: z.string().max(500).optional(),
  url: z.string().max(500).optional(),
  order: z.string().optional().transform((v) => {
    if (v === "" || !v) return 0;
    const n = parseInt(v, 10);
    return isNaN(n) ? 0 : n;
  }),
  status: z.enum(["draft", "published"]),
});

export const pageContentFormSchema = z.object({
  slug: z.string().min(1, "Slug is required").max(100),
  title: z.string().max(255).optional(),
  status: z.enum(["draft", "published"]),
  heroSubtitle: z.string().max(1000).optional(),
  heroTitle: z.string().max(255).optional(),
  intro: z.string().max(5000).optional(),
  description: z.string().max(10000).optional(),
  mission: z.string().max(5000).optional(),
  objectivesTitle: z.string().max(255).optional(),
  objectivesContent: z.string().max(10000).optional(),
  objectivesPrinciples: z.string().max(10000).optional(),
  objectivesAgenda2063: z.string().max(10000).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type ApplicationInput = z.infer<typeof applicationSchema>;
export type EventRegistrationInput = z.infer<typeof eventRegistrationSchema>;
export type EventFormInput = z.infer<typeof eventFormSchema>;
export type NewsFormInput = z.infer<typeof newsFormSchema>;
