const ACC_DATA = {
  stats: [
    { count: 140, label: "Active members" },
    { count: 32, label: "Projects shipped" },
    { count: 18, label: "Workshops this year" },
    { count: 9, label: "Hackathons won" }
  ],
  events: {
    ongoing: [
      { dateDay: "NOW", dateMonth: "LIVE", title: "Amity Coding Club Fall Recruitment", desc: "We are currently accepting applications for technical, design, and management roles.", tag: "Recruitment", img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80" },
      { dateDay: "ALL", dateMonth: "MONTH", title: "100 Days of Code Challenge", desc: "Join 200+ members in our Discord tracking their daily coding progress.", tag: "Challenge", img: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80" }
    ],
    upcoming: [
      { dateDay: "14", dateMonth: "Oct", title: "Hack the Weekend", desc: "24-hour build sprint. Bring a team of three, leave with a shipped project.", tag: "Hackathon", img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80" },
      { dateDay: "29", dateMonth: "Oct", title: "Intro to Systems Design", desc: "A hands-on session on designing your first scalable backend.", tag: "Workshop", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" },
      { dateDay: "12", dateMonth: "Nov", title: "Open Source Friday", desc: "Pick an issue, pair up, land your first real pull request.", tag: "Community", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" }
    ],
    past: [
      { dateDay: "02", dateMonth: "Sep", title: "Freshers' Build Night", desc: "60 new members shipped their first web page in one evening.", tag: "Workshop", img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80" },
      { dateDay: "18", dateMonth: "Aug", title: "Smart India Hackathon — Prep", desc: "Mock rounds and mentoring ahead of the national round.", tag: "Hackathon", img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80" }
    ]
  },
  projects: [
    { title: "Algo Visualizer", desc: "Interactive pathfinding and sorting algorithms built with React and D3.js.", tag: "Web App", img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80", stack: ["React", "D3.js", "Vite"] },
    { title: "Campus Connect", desc: "A real-time forum for students to share notes and anonymous feedback.", tag: "Fullstack", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80", stack: ["Next.js", "Supabase", "Tailwind"] },
    { title: "Discord Bot — ACC", desc: "Handles server verification, role assignment, and automated announcements.", tag: "Tool", img: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&w=800&q=80", stack: ["Node.js", "Discord.js", "Redis"] },
    { title: "Smart Mirror UI", desc: "Raspberry Pi-powered mirror interface showing weather, tasks, and news.", tag: "Hardware", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80", stack: ["Vue", "Python", "IoT"] }
  ],
  gallery: [
    { img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80", caption: "Hack Night" },
    { img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80", caption: "Team Collab" },
    { img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80", caption: "Mentoring" },
    { img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80", caption: "Deep Work" },
    { img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80", caption: "Code Review" },
    { img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80", caption: "Shipping" }
  ],
  team: {
    "Admins": [
      { initials: "AK", name: "Aarav Kapoor", role: "President", linkedin: "#", github: "#" },
      { initials: "SR", name: "Saanvi Rao", role: "Vice President", linkedin: "#", github: "#" }
    ],
    "Technical Team": [
      { initials: "DV", name: "Dev Verma", role: "Technical Lead", linkedin: "#", github: "#" },
      { initials: "AM", name: "Aryan Mehta", role: "Frontend Lead", linkedin: "#", github: "#" },
      { initials: "NK", name: "Neha Krishnan", role: "Backend Lead", linkedin: "#", github: "#" }
    ],
    "Management Team": [
      { initials: "PM", name: "Priya Menon", role: "Events Lead", linkedin: "#", github: "#" },
      { initials: "RJ", name: "Rohan Joshi", role: "Operations", linkedin: "#", github: "#" }
    ],
    "Design Team": [
      { initials: "KS", name: "Kavya Singh", role: "UI/UX Lead", linkedin: "#", github: "#" },
      { initials: "VG", name: "Varun Gupta", role: "Motion Designer", linkedin: "#", github: "#" }
    ],
    "PR and Outreach": [
      { initials: "AT", name: "Ananya Tiwari", role: "PR Head", linkedin: "#", github: "#" },
      { initials: "SS", name: "Samir Sharma", role: "Sponsorships", linkedin: "#", github: "#" }
    ],
    "Social Media": [
      { initials: "MT", name: "Meera Thakur", role: "Content Lead", linkedin: "#", github: "#" },
      { initials: "JD", name: "Jay Desai", role: "Video Editor", linkedin: "#", github: "#" }
    ]
  }
};
