/**
 * Seed initial content for AGC website
 * Run: npx prisma db seed
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Page content (about, contact, get-involved)
  const pages = [
    {
      slug: "about",
      title: "About Us",
      heroSubtitle: "Advancing Democratic Governance",
      intro:
        "Africa Governance Centre is an independent think tank committed to promoting governance excellence, policy development, and institutional capacity building to support Africa's economic transformation.",
      description:
        "Through research, capacity development, and strategic collaborations, we aim to strengthen government institutions and facilitate systemic change to achieve a prosperous and inclusive continent.",
      mission:
        "Our mission is to equip African nations with the tools, knowledge, and partnerships necessary to transform governance into a catalyst for economic prosperity and sustainable development.",
      objectivesTitle: "Mission and Strategic Objectives",
      objectivesContent:
        "Our primary mission is to promote governance excellence as a key driver of economic transformation and sustainable development across Africa.",
      objectivesPrinciples: "Upholding principles of excellence, transparency, and intellectual rigor.",
      objectivesAgenda2063:
        "Aligned with the vision of the African Union's Agenda 2063: The Africa We Want.",
      status: "published",
    },
    {
      slug: "contact",
      title: "Contact",
      heroTitle: "Contact Us",
      heroSubtitle: "Get in touch with the Africa Governance Centre",
      intro: "We welcome your inquiries and look forward to hearing from you.",
      status: "published",
    },
    {
      slug: "get-involved",
      title: "Get Involved",
      heroTitle: "Get Involved",
      heroSubtitle: "Join us in advancing governance excellence across Africa",
      status: "published",
    },
    {
      slug: "home",
      title: "Homepage",
      status: "published",
    },
  ];

  for (const p of pages) {
    await prisma.pageContent.upsert({
      where: { slug: p.slug },
      create: p,
      update: { title: p.title, heroSubtitle: p.heroSubtitle, intro: p.intro },
    });
  }
  // Home: set heroSliderImages in CMS so admin can edit/replace images (Admin → Page Content → home)
  const homeRow = await prisma.pageContent.findUnique({ where: { slug: "home" } });
  if (homeRow) {
    const current = (homeRow.contentJson as Record<string, unknown>) ?? {};
    await prisma.pageContent.update({
      where: { slug: "home" },
      data: {
        contentJson: JSON.parse(
          JSON.stringify({
            ...current,
            heroSliderImages: ["/uploads/placeholder.svg"],
          })
        ),
      },
    });
  }
  console.log(`  Page content: ${pages.length} pages (home has heroSliderImages)`);

  // Programs (image optional; set /uploads/... in Admin to replace)
  const programs = [
    { title: "Youth and Women Empowerment Workshops", description: "AGC organizes workshops and forums dedicated to empowering youth and women in governance and leadership positions.", order: 1, status: "published" as const, image: "/uploads/placeholder.svg" },
    { title: "Research and Policy Forums", description: "AGC hosts research and policy forums to highlight recent findings, policy analyses, and best practices in governance.", order: 2, status: "published" as const, image: "/uploads/placeholder.svg" },
    { title: "Annual Summits and Meetings", description: "AGC organizes annual meetings and events that bring together distinguished leaders, experts, and policymakers.", order: 3, status: "published" as const, image: "/uploads/placeholder.svg" },
    { title: "Public-Private Dialogues", description: "AGC organizes public-private dialogues to promote collaboration between government entities and the private sector.", order: 4, status: "published" as const, image: "/uploads/placeholder.svg" },
    { title: "Expert Forums on Good Governance", description: "AGC conducts regular forums focused on good governance, bringing together policymakers, experts, civil society organizations, and stakeholders from across Africa.", order: 5, status: "published" as const, image: "/uploads/placeholder.svg" },
    { title: "Regional Governance Conferences", description: "AGC collaborates with regional organizations such as the African Union, ECOWAS, and SADC to convene governance conferences.", order: 6, status: "published" as const, image: "/uploads/placeholder.svg" },
    { title: "Sector-Specific Roundtables", description: "AGC organizes expert roundtables focused on sector-specific governance challenges, involving key stakeholders from sectors such as health, education, infrastructure, agriculture, and energy.", order: 7, status: "published" as const, image: "/uploads/placeholder.svg" },
  ];

  const existingPrograms = await prisma.program.count();
  if (existingPrograms === 0) {
    await prisma.program.createMany({ data: programs });
  }
  console.log(`  Programs: ${programs.length}`);

  // Projects (image optional; replace in Admin)
  const projects = [
    { title: "Africa Governance Review", description: "The Africa Governance Review Project is a comprehensive initiative dedicated to conducting detailed assessments, offering policy recommendations, and facilitating discussions on governance challenges and opportunities across African nations.", order: 1, status: "published" as const, image: "/uploads/placeholder.svg" },
    { title: "Media and Democracy Initiative", description: "The Media and Democracy Initiative of the Africa Governance Centre seeks to empower media professionals, support independent journalism, and strengthen the media's ability to facilitate informed citizen participation in governance processes.", order: 2, status: "published" as const, image: "/uploads/placeholder.svg" },
    { title: "Public Sector Efficiency and Innovation Project", description: "The Public Sector Efficiency and Innovation Project is dedicated to addressing the critical need for streamlined operations, improved public service delivery, and the integration of innovative solutions to support Africa's development.", order: 3, status: "published" as const, image: "/uploads/placeholder.svg" },
    { title: "African Political Parties Initiative", description: "The African Political Parties Initiative (APPI) is a project developed by the Africa Governance Centre dedicated to supporting the role of political parties in Africa's development.", order: 4, status: "published" as const, image: "/uploads/placeholder.svg" },
    { title: "Africa Resource Governance Initiative", description: "The Africa Resource Governance Initiative (ARGI), a project of the Africa Governance Centre, is dedicated to promoting transparency, accountability, and sustainable management of natural resources across Africa.", order: 5, status: "published" as const, image: "/uploads/placeholder.svg" },
  ];

  const existingProjects = await prisma.project.count();
  if (existingProjects === 0) {
    await prisma.project.createMany({ data: projects });
  }
  console.log(`  Projects: ${projects.length}`);

  // Partners
  const partners = [
    { name: "African Union", url: "https://au.int", order: 1, status: "published" as const },
    { name: "ECOWAS", url: "https://ecowas.int", order: 2, status: "published" as const },
    { name: "SADC", url: "https://www.sadc.int", order: 3, status: "published" as const },
    { name: "UNCTAD", url: "https://unctad.org", order: 4, status: "published" as const },
  ];

  const existingPartners = await prisma.partner.count();
  if (existingPartners === 0) {
    await prisma.partner.createMany({ data: partners });
  }
  console.log(`  Partners: ${partners.length}`);

  // Team (advisory board)
  const team = [
    { name: "Dr. Mamphela Ramphele", role: "Advisory Board Member", bio: "Dr. Mamphela Ramphele is a respected activist, medical professional, academic, business leader, and thought leader. She holds a PhD in Social Anthropology, a BCom degree, as well as diplomas in Tropical Hygiene and Public Health. Her notable career includes serving as Vice Chancellor of the University of Cape Town in 1996 and as Managing Director of the World Bank from 2000 to 2004.", order: 1, status: "published" as const },
    { name: "Most Honourable Percival Noel James Patterson", role: "Advisory Board Member", bio: "Most Honorable Percival Noel James Patterson is a former Jamaican politician who served as the sixth Prime Minister of Jamaica from 1992 to 2006, becoming the longest-serving Prime Minister in Jamaica's history.", order: 2, status: "published" as const },
    { name: "His Excellency Dr. Thomas Yayi Boni", role: "Advisory Board Member", bio: "His Excellency Dr. Thomas Yayi Boni is a Beninese politician and banker. He served as the President of Benin from 2006 to 2016.", order: 3, status: "published" as const },
    { name: "Dr. Muhkisa Kituyi", role: "Advisory Board Member", bio: "Dr. Muhkisa Kituyi was the seventh Secretary-General of UNCTAD from 1 September 2013 to 15 February 2021. He has extensive experience as an academic, public servant, trade negotiator, and diplomat.", order: 4, status: "published" as const },
    { name: "Prof. Alex Kwaku Danso-Boafo", role: "Advisory Board Member", bio: "Prof. Danso-Boafo began his academic career at the University of Ghana in 1982, contributing extensively as a Political Science lecturer.", order: 5, status: "published" as const },
    { name: "H.E Jeffrey Thamsanqa Radebe", role: "Advisory Board Member", bio: "H.E. Jeffrey Thamsanqa Radebe is a distinguished South African political leader and experienced government official. He is currently serving as a Special Investment Envoy for President Cyril Ramaphosa.", order: 6, status: "published" as const },
  ];

  const existingTeam = await prisma.team.count();
  if (existingTeam === 0) {
    await prisma.team.createMany({ data: team });
  }
  console.log(`  Team: ${team.length} members`);

  // News (replace images in Admin → News; image paths point to /uploads/)
  const existingNews = await prisma.news.count();
  if (existingNews === 0) {
    const now = new Date();
    await prisma.news.createMany({
      data: [
        {
          title: "Summary Report of the African Political Parties Summit (APPS) 2025",
          slug: "summary-report-apps-2025",
          excerpt: "Key outcomes and reflections from the 2025 African Political Parties Summit in Accra.",
          content: "<p>Full report content. Edit in Admin → News. Replace the cover image via the image field (e.g. /uploads/report-cover.jpg).</p>",
          image: "/uploads/placeholder.svg",
          datePublished: now,
          author: "AGC Research Team",
          categories: ["reports", "events"],
          tags: ["political parties", "summit", "Accra Declaration"],
          status: "published",
        },
        {
          title: "Governance and Economic Transformation in Africa",
          slug: "governance-economic-transformation-2025",
          excerpt: "Exploring the links between strong institutions and inclusive growth.",
          content: "<p>Article content. Edit and add images via Admin.</p>",
          image: "/uploads/placeholder.svg",
          datePublished: now,
          categories: ["announcements"],
          tags: ["governance", "economic transformation"],
          status: "published",
        },
      ],
    });
    console.log("  News: 2 sample items");
  }

  // Events (replace image in Admin → Events)
  const existingEvents = await prisma.event.count();
  if (existingEvents === 0) {
    const start = new Date();
    const end = new Date(start);
    end.setDate(end.getDate() + 2);
    await prisma.event.createMany({
      data: [
        {
          title: "African Political Parties Summit 2025",
          slug: "african-political-parties-summit-2025",
          description: "Continental convening on democratic governance. Edit in Admin → Events.",
          location: "Accra, Ghana",
          startDate: start,
          endDate: end,
          image: "/uploads/placeholder.svg",
          eventType: "summit",
          venueName: "Accra International Conference Centre",
          status: "published",
        },
      ],
    });
    console.log("  Events: 1 sample item");
  }

  // Publications (replace image and file in Admin → Publications)
  const existingPubs = await prisma.publication.count();
  if (existingPubs === 0) {
    const now = new Date();
    await prisma.publication.createMany({
      data: [
        {
          title: "Africa Governance Review 2024",
          slug: "africa-governance-review-2024",
          excerpt: "Annual assessment of governance trends across the continent.",
          type: "report",
          image: "/uploads/placeholder.svg",
          datePublished: now,
          author: "Africa Governance Centre",
          status: "published",
        },
      ],
    });
    console.log("  Publications: 1 sample item");
  }

  console.log("\nSeed complete. Replace images and edit content via Admin (Media, News, Events, Publications, Partners, Page Content → home).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
