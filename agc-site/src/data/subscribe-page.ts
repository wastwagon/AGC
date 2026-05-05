export type SubscribePageTopic = {
  title: string;
  text: string;
};

export type SubscribePageContent = {
  heroImage?: string;
  heroTitle: string;
  heroSubtitle: string;
  sectionEyebrow: string;
  sectionHeading: string;
  intro: string;
  requiredNote: string;
  topics: SubscribePageTopic[];
  supportEyebrow: string;
  supportBody: string;
};

export const subscribePageContent: SubscribePageContent = {
  heroImage: "",
  heroTitle: "Subscribe to AGC updates",
  heroSubtitle:
    "Subscribe to the Africa Governance Centre’s newsletter and receive the latest insights, research, and analysis shaping governance, policy, and development across the continent.",
  sectionEyebrow: "Stay connected",
  sectionHeading: "Join our mailing lists",
  intro:
    "Join our Events mailing list to be among the first to receive invitations to our roundtables, forums, workshops, and summits.",
  requiredNote: "Fields marked with * are required.",
  topics: [
    {
      title: "AGC insights",
      text: "Research notes, analysis, and thought leadership from across the Centre.",
    },
    {
      title: "Events and Convenings",
      text: "Invitations and reminders for roundtables, forums, workshops, and summits.",
    },
    {
      title: "Governance & Policy Research",
      text: "Updates on policy briefs, reports, and governance research outputs.",
    },
    {
      title: "Global Affairs Briefings",
      text: "Selected briefings on Africa’s role in regional and global affairs.",
    },
  ],
  supportEyebrow: "What we need",
  supportBody:
    "Tell us who you are and which updates matter most so we can route your subscription request to the right AGC team.",
};
