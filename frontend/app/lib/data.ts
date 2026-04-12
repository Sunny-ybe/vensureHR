export type RoleId =
  | "software-dev"
  | "ai-dev"
  | "payroll"
  | "sales";

export type Role = {
  id: RoleId;
  title: string;
  description: string;
  skills: string[];
};

export type Candidate = {
  id: string;
  name: string;
  roleId: RoleId;
  currentTitle: string;
  location: string;
  appliedAgoMonths: number;
  status: "Active" | "Rediscovered";
  matchScore: number;
  growthPercent: number;
  skills: string[];

  linkedinUpdate: string;
  githubUpdate: string;
  twitterUpdate: string;

  githubUrl?: string;
  githubUsername?: string;
  linkedinUrl?: string;

  interviewSummary: {
    candidateSaid: string;
    companyNotes: string;
  };

  summary: string;
  reason: string;
};

export const roles: Role[] = [
  {
    id: "software-dev",
    title: "Software Development",
    description: "Frontend + Backend engineers building products",
    skills: ["React", "Node.js", "TypeScript", "APIs"],
  },
  {
    id: "ai-dev",
    title: "AI Development",
    description: "ML + AI product engineers",
    skills: ["Python", "LLMs", "Prompting", "RAG"],
  },
  {
    id: "payroll",
    title: "Payroll Specialist",
    description: "Payroll and tax operations",
    skills: ["Payroll", "Tax Filing", "Excel", "Compliance"],
  },
  {
    id: "sales",
    title: "Sales Consultant",
    description: "Client acquisition and growth",
    skills: ["Communication", "CRM", "Negotiation", "B2B Sales"],
  },
];

export const candidates: Candidate[] = [
  {
    id: "1",
    name: "Maya Singh",
    roleId: "software-dev",
    currentTitle: "Frontend Engineer",
    location: "San Francisco",
    appliedAgoMonths: 2,
    status: "Active",
    matchScore: 94,
    growthPercent: 20,
    skills: ["React", "TypeScript", "UI Design"],
    linkedinUpdate: "Shared a dashboard redesign project.",
    githubUpdate: "Added a reusable component library.",
    twitterUpdate: "Talking about design systems.",
    interviewSummary: {
      candidateSaid: "Focused on improving frontend performance.",
      companyNotes: "Strong UI + product thinking.",
    },
    summary: "Strong frontend candidate with product thinking and clean UI execution.",
    reason: "Good fit for modern frontend-heavy software development roles.",
  },
  {
    id: "2",
    name: "Daniel Roy",
    roleId: "software-dev",
    currentTitle: "Full Stack Developer",
    location: "Austin",
    appliedAgoMonths: 5,
    status: "Active",
    matchScore: 90,
    growthPercent: 25,
    skills: ["Node.js", "PostgreSQL", "APIs"],
    linkedinUpdate: "Led a product sprint.",
    githubUpdate: "Refactored backend APIs.",
    twitterUpdate: "Discussing backend reliability.",
    interviewSummary: {
      candidateSaid: "Enjoys backend architecture work.",
      companyNotes: "Strong backend engineer.",
    },
    summary: "Balanced full stack candidate with strong backend depth.",
    reason: "Useful for software roles needing API and system thinking.",
  },
  {
    id: "3",
    name: "Priya Nair",
    roleId: "software-dev",
    currentTitle: "Software Engineer",
    location: "NYC",
    appliedAgoMonths: 1,
    status: "Active",
    matchScore: 88,
    growthPercent: 15,
    skills: ["React", "Accessibility"],
    linkedinUpdate: "Posted about accessibility improvements.",
    githubUpdate: "Added testing coverage.",
    twitterUpdate: "Talking about UX.",
    interviewSummary: {
      candidateSaid: "Focused on user experience.",
      companyNotes: "Good product mindset.",
    },
    summary: "Product-focused engineer with strong UI quality.",
    reason: "Good fit when accessibility and UX matter.",
  },
  {
    id: "4",
    name: "Ethan Brooks",
    roleId: "ai-dev",
    currentTitle: "ML Engineer",
    location: "Seattle",
    appliedAgoMonths: 3,
    status: "Active",
    matchScore: 95,
    growthPercent: 22,
    skills: ["Python", "RAG", "LLMs"],
    linkedinUpdate: "Built a search assistant.",
    githubUpdate: "Added RAG system.",
    twitterUpdate: "Talking about AI reliability.",
    interviewSummary: {
      candidateSaid: "Built production AI systems.",
      companyNotes: "Very strong AI candidate.",
    },
    summary: "Very strong AI candidate with practical retrieval experience.",
    reason: "Best fit for AI product and LLM workflow work.",
  },
  {
    id: "5",
    name: "Lina Chen",
    roleId: "ai-dev",
    currentTitle: "AI Scientist",
    location: "Boston",
    appliedAgoMonths: 4,
    status: "Active",
    matchScore: 89,
    growthPercent: 18,
    skills: ["Python", "Evaluation"],
    linkedinUpdate: "Posted about model evaluation.",
    githubUpdate: "Shared ML experiments.",
    twitterUpdate: "Discussing hallucination issues.",
    interviewSummary: {
      candidateSaid: "Focused on model evaluation.",
      companyNotes: "Research + practical mix.",
    },
    summary: "Research-minded AI builder with evaluation strength.",
    reason: "Good fit for evaluation-heavy AI roles.",
  },
  {
    id: "6",
    name: "Omar Khan",
    roleId: "ai-dev",
    currentTitle: "AI Engineer",
    location: "Chicago",
    appliedAgoMonths: 2,
    status: "Active",
    matchScore: 85,
    growthPercent: 17,
    skills: ["Prompting", "Automation"],
    linkedinUpdate: "Built internal AI tools.",
    githubUpdate: "Added agent workflows.",
    twitterUpdate: "Talking about AI UX.",
    interviewSummary: {
      candidateSaid: "Focuses on workflows.",
      companyNotes: "Strong product + AI.",
    },
    summary: "AI product engineer who cares about workflows and usability.",
    reason: "Good fit for practical AI tooling work.",
  },
  {
    id: "7",
    name: "Ava Johnson",
    roleId: "payroll",
    currentTitle: "Payroll Specialist",
    location: "Phoenix",
    appliedAgoMonths: 6,
    status: "Active",
    matchScore: 87,
    growthPercent: 10,
    skills: ["Payroll", "Tax Filing"],
    linkedinUpdate: "Discussed payroll automation.",
    githubUpdate: "N/A",
    twitterUpdate: "Talking about HR tech.",
    interviewSummary: {
      candidateSaid: "Focused on compliance.",
      companyNotes: "Reliable operations candidate.",
    },
    summary: "Reliable payroll operations candidate with compliance knowledge.",
    reason: "Good fit for payroll and tax administration roles.",
  },
  {
    id: "8",
    name: "Chris Miller",
    roleId: "sales",
    currentTitle: "Sales Consultant",
    location: "Dallas",
    appliedAgoMonths: 3,
    status: "Active",
    matchScore: 91,
    growthPercent: 12,
    skills: ["CRM", "Negotiation"],
    linkedinUpdate: "Closed multiple deals.",
    githubUpdate: "N/A",
    twitterUpdate: "Talking about B2B sales.",
    interviewSummary: {
      candidateSaid: "Strong client relationships.",
      companyNotes: "High conversion potential.",
    },
    summary: "Strong sales consultant with client-facing experience.",
    reason: "Good fit for growth and client acquisition roles.",
  },
  {
    id: "9",
    name: "Zoe Bennett",
    roleId: "software-dev",
    currentTitle: "Junior Engineer",
    location: "Denver",
    appliedAgoMonths: 8,
    status: "Rediscovered",
    matchScore: 83,
    growthPercent: 30,
    skills: ["React", "Git"],
    linkedinUpdate: "Finished capstone project.",
    githubUpdate: "Built dashboard app.",
    twitterUpdate: "Learning full-stack dev.",
    interviewSummary: {
      candidateSaid: "Improved significantly.",
      companyNotes: "Worth re-evaluating.",
    },
    summary: "Candidate who grew a lot since the first interview.",
    reason: "Worth re-engaging because of strong growth.",
  },
  {
    id: "10",
    name: "Noah Patel",
    roleId: "ai-dev",
    currentTitle: "AI Learner",
    location: "San Jose",
    appliedAgoMonths: 8,
    status: "Rediscovered",
    matchScore: 81,
    growthPercent: 28,
    skills: ["Python", "RAG"],
    linkedinUpdate: "Built AI search tool.",
    githubUpdate: "Added ML repo.",
    twitterUpdate: "Discussing AI journey.",
    interviewSummary: {
      candidateSaid: "Transitioning into AI.",
      companyNotes: "Strong improvement.",
    },
    summary: "Rediscovered candidate who has improved into a stronger AI fit.",
    reason: "Good to reopen because the skill growth is clear.",
  },
  {
    id: "11",
    name: "Sarah P",
    roleId: "software-dev",
    currentTitle: "Software Engineer",
    location: "Remote",
    appliedAgoMonths: 2,
    status: "Active",
    matchScore: 92,
    growthPercent: 16,
    skills: ["TypeScript", "Next.js", "GitHub"],
    linkedinUpdate: "Posted a new update about a product launch.",
    githubUpdate: "Active on GitHub with recent repo activity.",
    twitterUpdate: "Sharing build notes and project updates.",
    githubUrl: "https://github.com/Sp15och23",
    githubUsername: "Sp15och23",
    interviewSummary: {
      candidateSaid: "Wants a role with product ownership.",
      companyNotes: "Strong developer with current public GitHub activity.",
    },
    summary: "Strong developer profile with live GitHub presence.",
    reason: "Great fit for software roles that need active coding and ownership.",
  },
  {
    id: "83cbc69d-8a56-47e2-8426-8317d1dc87fb",
    name: "Andrej Karpathy",
    roleId: "ai-dev",
    currentTitle: "AI Research Engineer",
    location: "San Francisco, CA",
    appliedAgoMonths: 2,
    status: "Active",
    matchScore: 97,
    growthPercent: 34,
    skills: ["Python", "LLMs", "Neural Networks", "Computer Vision"],
    linkedinUpdate: "Just published a new lecture on backpropagation and neural net training.",
    githubUpdate: "Active commits to micrograd and nanoGPT repositories.",
    twitterUpdate: "Tweeted about the future of AI education and open source models.",
    linkedinUrl: "https://www.linkedin.com/in/andrej-karpathy-9a650716/",
    githubUrl: "https://github.com/karpathy",
    interviewSummary: {
      candidateSaid: "I want to work on fundamental AI research that has real world impact.",
      companyNotes: "Exceptional depth in ML. Would elevate the entire team.",
    },
    summary: "Former Tesla AI Director and OpenAI founding member. Deep expertise in neural networks, computer vision, and LLMs.",
    reason: "World-class AI expertise directly aligned with our ML roadmap.",
  },
  {
    id: "d897df48-928f-4486-bd71-a08c1e20620e",
    name: "Linus Torvalds",
    roleId: "software-dev",
    currentTitle: "Principal Systems Engineer",
    location: "Portland, OR",
    appliedAgoMonths: 3,
    status: "Active",
    matchScore: 95,
    growthPercent: 28,
    skills: ["C", "Linux", "Git", "Systems Programming"],
    linkedinUpdate: "Shared thoughts on modern kernel development practices.",
    githubUpdate: "Recent commits to Linux kernel subsystems.",
    twitterUpdate: "Commented on the state of open source software development.",
    linkedinUrl: "https://www.linkedin.com/in/linustorvalds/",
    githubUrl: "https://github.com/torvalds",
    interviewSummary: {
      candidateSaid: "Good engineering is about simplicity and getting things right.",
      companyNotes: "Legendary systems thinker. Rare opportunity.",
    },
    summary: "Creator of Linux and Git. Unmatched expertise in systems programming, kernel development, and open source leadership.",
    reason: "Deep systems expertise and proven open source leadership at massive scale.",
  },
  {
    id: "52da3164-f14a-4f66-b3c0-97eb78b2fb18",
    name: "Guido van Rossum",
    roleId: "software-dev",
    currentTitle: "Senior Software Architect",
    location: "Belmont, CA",
    appliedAgoMonths: 5,
    status: "Active",
    matchScore: 93,
    growthPercent: 22,
    skills: ["Python", "Language Design", "APIs", "TypeScript"],
    linkedinUpdate: "Discussing Python 4.0 and the future of the language.",
    githubUpdate: "Active contributions to CPython and typing improvements.",
    twitterUpdate: "Engaged with the Python community on PEP proposals.",
    linkedinUrl: "https://www.linkedin.com/in/guido-van-rossum-4a0756/",
    githubUrl: "https://github.com/gvanrossum",
    interviewSummary: {
      candidateSaid: "Readability counts. Code is read more than it is written.",
      companyNotes: "Exceptional communicator. Would mentor the entire engineering org.",
    },
    summary: "Creator of Python. 30+ years building elegant, scalable software. Former Dropbox and Google engineer.",
    reason: "Creator of Python with deep expertise in language design and scalable systems.",
  },
  {
    id: "cdae9e51-65a1-4163-9e0f-26b9a1d3b71c",
    name: "Addy Osmani",
    roleId: "software-dev",
    currentTitle: "Senior Frontend Engineer",
    location: "Seattle, WA",
    appliedAgoMonths: 4,
    status: "Active",
    matchScore: 88,
    growthPercent: 19,
    skills: ["JavaScript", "React", "Web Performance", "Node.js"],
    linkedinUpdate: "Published new article on Core Web Vitals optimization.",
    githubUpdate: "New commits to open source performance tooling projects.",
    twitterUpdate: "Shared insights on modern frontend architecture patterns.",
    linkedinUrl: "https://www.linkedin.com/in/addyosmani/",
    githubUrl: "https://github.com/addyosmani",
    interviewSummary: {
      candidateSaid: "Performance is a feature. Every millisecond matters.",
      companyNotes: "Deep frontend expertise. Strong communicator and writer.",
    },
    summary: "Engineering Manager at Google Chrome. Expert in web performance, JavaScript, and developer tooling.",
    reason: "World-class frontend performance expertise and proven Google engineering background.",
  },
  {
    id: "7c275e3b-32e9-41ea-9a31-386367c1ae4a",
    name: "Priya Nair",
    roleId: "ai-dev",
    currentTitle: "AI/ML Engineer",
    location: "Austin, TX",
    appliedAgoMonths: 4,
    status: "Active",
    matchScore: 84,
    growthPercent: 31,
    skills: ["Python", "RAG", "FastAPI", "LLMs"],
    linkedinUpdate: "Posted about deploying LLMs at production scale.",
    githubUpdate: "Recent commits to ML pipeline and model serving repositories.",
    twitterUpdate: "Discussing the tradeoffs between fine-tuning and RAG approaches.",
    linkedinUrl: "https://www.linkedin.com/in/sashikantkumar/",
    githubUrl: "https://github.com/sunny-ybe",
    interviewSummary: {
      candidateSaid: "The gap between research and production is where I thrive.",
      companyNotes: "Strong ML fundamentals. Practical and delivery-focused.",
    },
    summary: "ML engineer with 6 years bridging data science and production engineering. Strong Python and FastAPI background.",
    reason: "Rare combination of ML research depth and production engineering experience.",
  },
];