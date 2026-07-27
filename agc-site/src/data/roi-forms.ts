export type RoiEventType = "apps" | "aypf" | "awpls";

export type RoiFormConfig = {
  eventType: RoiEventType;
  shortName: string;
  fullName: string;
  year: string;
  path: string;
  parentPath: string;
  parentLabel: string;
  fromEmail: string;
  secretariatLabel: string;
  welcomeIntro: string;
  welcomeBody: string;
  noteItems: string[];
  titles: string[];
  organisationTypes: string[];
  organisationTypeLabel: string;
  participationTypes: string[];
  areasOfInterest: string[];
  howHeardOptions: string[];
  previousQuestion: string;
  howHeardQuestion: string;
  confirmationTitle: string;
  confirmationBody: string[];
  declarationEventLabel: string;
};

const SHARED_PARTICIPATION = [
  "Delegate",
  "Speaker",
  "Moderator",
  "Partner Organisation",
  "Sponsor",
  "Exhibitor",
  "Media",
  "Observer",
  "Other",
] as const;

function howHeardOptions(websiteLabel: string, previousLabel: string): string[] {
  return [
    websiteLabel,
    "Social Media",
    "Email Communication",
    "Partner Organisation",
    "Political Party",
    "Government Institution",
    previousLabel,
    "Referral",
    "Media",
    "Other",
  ];
}

export const ROI_FORMS: Record<RoiEventType, RoiFormConfig> = {
  apps: {
    eventType: "apps",
    shortName: "APPS",
    fullName: "African Political Parties Summit (APPS)",
    year: "2026",
    path: "/app-summit/register",
    parentPath: "/app-summit",
    parentLabel: "APP Summit",
    fromEmail: "appi@africagovernancecentre.org",
    secretariatLabel: "APPS Secretariat",
    welcomeIntro:
      "Thank you for your interest in participating in the African Political Parties Summit (APPS) 2026.",
    welcomeBody:
      "APPS is a high-level, invitation-only continental platform that convenes political party leaders, policymakers, governments, electoral institutions, academia, civil society, development partners, youth and women leaders, and the private sector to advance political cooperation and Africa's development agenda.",
    noteItems: [
      "Submission of this form does not guarantee participation.",
      "All applications will undergo review by the APPS Secretariat.",
      "Successful applicants will receive an official invitation and further participation instructions.",
      "The Secretariat reserves the right to determine participation based on the Summit's objectives, stakeholder balance, and available capacity.",
    ],
    titles: ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof.", "Hon.", "H.E.", "Other"],
    organisationTypeLabel: "Organisation Type",
    organisationTypes: [
      "Political Party",
      "Government",
      "Parliament",
      "Electoral Management Body",
      "Regional/Continental Organisation",
      "Civil Society Organisation",
      "Development Partner",
      "International Organisation",
      "Diplomatic Mission",
      "Academic/Research Institution",
      "Think Tank",
      "Private Sector",
      "Media",
      "Youth Organisation",
      "Women's Organisation",
      "Other",
    ],
    participationTypes: [...SHARED_PARTICIPATION],
    areasOfInterest: [
      "Political Parties and Democratic Governance",
      "Youth Political Participation",
      "Women in Political Leadership",
      "Economic Governance",
      "Trade and AfCFTA",
      "Peace and Security",
      "Elections and Electoral Integrity",
      "Political Financing",
      "Digital Democracy",
      "Leadership Development",
      "Local Governance",
      "Research and Policy",
      "Innovation and Technology",
      "Other",
    ],
    howHeardOptions: howHeardOptions("APPS Website", "Previous APPS Participant"),
    previousQuestion: "Have you participated in APPS before?",
    howHeardQuestion: "How did you hear about APPS 2026?",
    confirmationTitle: "Thank you for your interest in the African Political Parties Summit (APPS) 2026.",
    confirmationBody: [
      "Your Registration of Interest has been successfully received by the APPS Secretariat.",
      "Your submission will now undergo an assessment process. If your application is approved, you will receive an official invitation with further information regarding participation, accreditation, logistics, and next steps.",
      "Please note that submission of this form does not guarantee participation.",
    ],
    declarationEventLabel: "APPS 2026",
  },
  aypf: {
    eventType: "aypf",
    shortName: "AYPF",
    fullName: "African Youth in Politics Forum (AYPF)",
    year: "2026",
    path: "/aypf/register",
    parentPath: "/aypf",
    parentLabel: "AYPF",
    fromEmail: "aypf@africagovernancecentre.org",
    secretariatLabel: "AGC Secretariat",
    welcomeIntro:
      "Thank you for your interest in participating in the African Youth in Politics Forum (AYPF) 2026.",
    welcomeBody:
      "AYPF is a dedicated continental platform bringing together emerging political leaders, young elected officials, youth wings of political parties, governance practitioners, civil society, academia, and development partners to advance meaningful youth participation in democratic governance across Africa. AYPF is a curated forum. Submission of this Registration of Interest does not guarantee participation. All applications will be reviewed by the Africa Governance Centre's (AGC) Secretariat, and only approved applicants will receive an official invitation.",
    noteItems: [
      "Submission of this form does not guarantee participation.",
      "All applications will undergo review by the AGC Secretariat.",
      "Successful applicants will receive an official invitation and further participation instructions.",
      "The Secretariat reserves the right to determine participation based on the Forum's objectives, stakeholder balance, and available capacity.",
    ],
    titles: ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof.", "Hon.", "Other"],
    organisationTypeLabel: "Which best describes you?",
    organisationTypes: [
      "Youth Wing of a Political Party",
      "Young Elected Official",
      "Parliamentarian",
      "Regional/Continental Organisation",
      "Civil Society Organisation",
      "Development Partner",
      "International Organisation",
      "Diplomatic Mission",
      "Academic/Research Institution",
      "Think Tank",
      "Private Sector",
      "Media",
      "Youth Organisation",
      "Women's Organisation",
      "Youth Council",
      "Student Union",
      "Other",
    ],
    participationTypes: [...SHARED_PARTICIPATION],
    areasOfInterest: [
      "Political Parties and Democratic Governance",
      "Youth Political Participation",
      "Women in Political Leadership",
      "Economic Governance",
      "Political Party Development and Youth Wings",
      "Digital Democracy and Civic Technology",
      "Peace and Security",
      "Advocacy, Campaigns and Political Communication",
      "Political Financing",
      "Leadership Development",
      "Local Governance",
      "Research and Policy",
      "Innovation and Technology",
      "Other",
    ],
    howHeardOptions: howHeardOptions("AGC Website", "Previous AYPF Participant"),
    previousQuestion: "Have you participated in AYPF before?",
    howHeardQuestion: "How did you hear about AYPF 2026?",
    confirmationTitle: "Thank you for your interest in the African Youth in Politics Forum (AYPF) 2026.",
    confirmationBody: [
      "Your Registration of Interest has been successfully received by the AGC Secretariat.",
      "Your submission will now undergo an assessment process. If your application is approved, you will receive an official invitation with further information regarding participation, accreditation, logistics, and next steps.",
      "Please note that submission of this form does not guarantee participation.",
    ],
    declarationEventLabel: "AYPF 2026",
  },
  awpls: {
    eventType: "awpls",
    shortName: "AWPLS",
    fullName: "Africa Women Political Leadership Summit (AWPLS)",
    year: "2026",
    path: "/awpls/register",
    parentPath: "/awpls",
    parentLabel: "AWPLS",
    fromEmail: "awpls@africagovernancecentre.org",
    secretariatLabel: "AGC Secretariat",
    welcomeIntro:
      "Thank you for your interest in participating in the Africa Women Political Leadership Summit (AWPLS) 2026.",
    welcomeBody:
      "The Africa Women Political Leadership Summit (AWPLS) is a high-level platform that convenes women political leaders, elected officials, political party representatives, policymakers, governance practitioners, civil society leaders, academics, development partners, and other stakeholders committed to advancing women's political leadership and inclusive governance across Africa. AWPLS is a curated, invitation-only summit. Submission of this Registration of Interest does not guarantee participation. All applications will be reviewed by the Africa Governance Centre's (AGC) Secretariat, and only approved applicants will receive an official invitation.",
    noteItems: [
      "Submission of this form does not guarantee participation.",
      "All applications will undergo review by the AGC Secretariat.",
      "Successful applicants will receive an official invitation and further participation instructions.",
      "The Secretariat reserves the right to determine participation based on the Summit's objectives, stakeholder balance, and available capacity.",
    ],
    titles: ["Mrs.", "Ms.", "Dr.", "Prof.", "Hon.", "Other"],
    organisationTypeLabel: "Which best describes you?",
    organisationTypes: [
      "Women Wing of a Political Party",
      "Woman Elected Official",
      "Women's Organisation or Network",
      "Parliamentarian",
      "Regional/Continental Organisation",
      "Civil Society Organisation",
      "Development Partner",
      "International Organisation",
      "Diplomatic Mission",
      "Academic/Research Institution",
      "Private Sector",
      "Media",
      "Other",
    ],
    participationTypes: [...SHARED_PARTICIPATION],
    areasOfInterest: [
      "Women's Political Leadership",
      "Women's Economic Empowerment",
      "Economic Governance",
      "Political Party Development and Women Wings",
      "Digital Democracy and Civic Technology",
      "Peace and Security",
      "Advocacy, Campaigns and Political Communication",
      "Political Financing",
      "Leadership Development",
      "Local Governance",
      "Research and Policy",
      "Innovation and Technology",
      "Other",
    ],
    howHeardOptions: howHeardOptions("AGC Website", "Previous AWPLS Participant"),
    previousQuestion: "Have you participated in AWPLS before?",
    howHeardQuestion: "How did you hear about AWPLS 2026?",
    confirmationTitle:
      "Thank you for your interest in the Africa Women Political Leadership Summit (AWPLS) 2026.",
    confirmationBody: [
      "Your Registration of Interest has been successfully received by the AGC Secretariat.",
      "Your submission will now undergo an assessment process. If your application is approved, you will receive an official invitation with further information regarding participation, accreditation, logistics, and next steps.",
      "Please note that submission of this form does not guarantee participation.",
    ],
    declarationEventLabel: "AWPLS 2026",
  },
};

export const ROI_EVENT_TYPES = Object.keys(ROI_FORMS) as RoiEventType[];

export const ROI_REVIEW_STATUSES = ["pending", "under_review", "approved", "declined"] as const;
export type RoiReviewStatus = (typeof ROI_REVIEW_STATUSES)[number];

export const ROI_REVIEW_STATUS_LABELS: Record<RoiReviewStatus, string> = {
  pending: "Pending",
  under_review: "Under review",
  approved: "Approved",
  declined: "Declined",
};

export function getRoiFormConfig(eventType: string): RoiFormConfig | null {
  if (eventType === "apps" || eventType === "aypf" || eventType === "awpls") {
    return ROI_FORMS[eventType];
  }
  return null;
}

/** Prefer dedicated ROI routes when CMS still points at /contact or is empty. */
export function resolveRoiRegisterHref(
  eventType: RoiEventType,
  cmsHref?: string | null
): string {
  const fallback = ROI_FORMS[eventType].path;
  const href = cmsHref?.trim() || "";
  if (!href || href === "/contact") return fallback;
  return href;
}
