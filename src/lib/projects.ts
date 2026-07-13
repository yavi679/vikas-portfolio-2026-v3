export interface Project {
  id: string;
  title: string;
  year: string;
  hook: string;
  videoUrl?: string;
  imageUrl?: string;
  avatarUrl?: string; // rounded avatar shown in the nav (in place of a company logo)
  tryItUrl?: string;
  bg?: string;
  duration?: number; // ms, for image/gif auto-advance
}

export interface CompanyGroup {
  company: string;
  logoUrl: string;
  projects: Project[];
}

export const projectGroups: CompanyGroup[] = [
  {
    company: "Adobe Firefly",
    logoUrl: "/projects/app-logos/adobe-firefly.webp",
    projects: [
      {
        id: "generative-speech",
        title: "Generative Speech",
        year: "2025",
        tryItUrl: "https://firefly.adobe.com/generate/speech",
        hook: "Turning speech generation into a system for orchestration, not just output.",
        videoUrl: "/projects/Gen-audio/02-Generative-speech.mp4",
        bg: "#000000",
      },
      {
        id: "generative-sfx",
        title: "Generative SFX",
        year: "2024, 2025",
        tryItUrl: "https://firefly.adobe.com/generate/sound-effects",
        hook: "Turning sound effects into something you perform in time, not describe in prompts.",
        videoUrl: "/projects/Gen-audio/01-Generative-sound-effects.mp4",
        bg: "#000000",
      },
    ],
  },
  {
    company: "ROPE",
    logoUrl: "/projects/rope/logo.webp",
    projects: [
      {
        id: "rope",
        title: "ROPE",
        year: "2022, 2024",
        hook: "My 5-to-9: design and brand work to help friends' businesses take off.",
      },
    ],
  },
  {
    company: "Microsoft Outlook",
    logoUrl: "/projects/app-logos/microsoft-outlook.webp",
    projects: [
      {
        id: "3d-illustrations",
        title: "3D Illustrations",
        year: "2021, 2022",
        tryItUrl: "https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook?deeplink=%2Fmail%2F&sdf=0",
        hook: "Moving illustrations from decorative assets to integrated product language.",
        videoUrl: "/projects/3d-illustrations/01-3D-Illustrations.mp4",
        bg: "#f4f4f4",
      },
      {
        id: "expressive-theming",
        title: "Expressive Theming",
        year: "2022",
        hook: "Evolving theming from visual decoration to a coherent environment for focused work.",
        imageUrl: "/projects/expressive-theming/02-Cross-platform.png",
        bg: "#f4f4f4",
        duration: 30000,
      },
    ],
  },
  {
    company: "Microsoft Excel",
    logoUrl: "/projects/app-logos/microsoft-excel.webp",
    projects: [
      {
        id: "smart-templates",
        title: "Smart Templates",
        year: "2019",
        hook: "Turning static templates into live, data-connected apps inside the spreadsheet.",
        videoUrl: "/projects/smart-templates/01-Excel-x-Wolfram-templates.mp4",
        bg: "#000000",
      },
      {
        id: "ux-redesigns",
        title: "UX Redesigns",
        year: "2018",
        hook: "Redefining how complexity is experienced in spreadsheets.",
        videoUrl: "/projects/ux-redesigns/01-Core-feature-redesigns.mp4",
        bg: "#ffffff",
      },
    ],
  },
];

/* Standalone "About Me" entry — not tied to a company group. */
export const aboutMe: Project = {
  id: "about-me",
  title: "About Vikas",
  year: "1990",
  hook: "Seattle-based. Cat dad to Miro. Obsessive about good coffee and intentional living space.",
  avatarUrl: "/projects/avatar.png",
};

export function getAllProjects(): Project[] {
  return projectGroups.flatMap((g) => g.projects);
}

/* Nav list: About Me first, then every project. */
export function getNavProjects(): Project[] {
  return [aboutMe, ...getAllProjects()];
}

export function getProjectGroup(id: string): CompanyGroup | null {
  return projectGroups.find((g) => g.projects.some((p) => p.id === id)) ?? null;
}
