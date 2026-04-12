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

export type LinkedInPost = {
  date: string;
  content: string;
};

export type Tweet = {
  date: string;
  content: string;
};

export type GitHubCommit = {
  repo: string;
  message: string;
  date: string;
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
  twitterUrl?: string;
  resumeUrl?: string;
  willingToRelocate: boolean;

  linkedinPosts?: LinkedInPost[];
  tweets?: Tweet[];
  githubCommits?: GitHubCommit[];

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
    linkedinUrl: "https://www.linkedin.com/in/sashikant-kumar-2004951b4/",
    twitterUrl: "https://x.com/sashikant877",
    interviewSummary: {
      candidateSaid: "Focused on improving frontend performance.",
      companyNotes: "Strong UI + product thinking.",
    },
    willingToRelocate: true,
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
    linkedinUrl: "https://www.linkedin.com/in/sashikant-kumar-2004951b4/",
    twitterUrl: "https://x.com/sashikant877",
    interviewSummary: {
      candidateSaid: "Enjoys backend architecture work.",
      companyNotes: "Strong backend engineer.",
    },
    willingToRelocate: false,
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
    linkedinUrl: "https://www.linkedin.com/in/sashikant-kumar-2004951b4/",
    twitterUrl: "https://x.com/sashikant877",
    interviewSummary: {
      candidateSaid: "Focused on user experience.",
      companyNotes: "Good product mindset.",
    },
    willingToRelocate: true,
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
    linkedinUrl: "https://www.linkedin.com/in/sashikant-kumar-2004951b4/",
    twitterUrl: "https://x.com/sashikant877",
    interviewSummary: {
      candidateSaid: "Built production AI systems.",
      companyNotes: "Very strong AI candidate.",
    },
    willingToRelocate: true,
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
    linkedinUrl: "https://www.linkedin.com/in/sashikant-kumar-2004951b4/",
    twitterUrl: "https://x.com/sashikant877",
    interviewSummary: {
      candidateSaid: "Focused on model evaluation.",
      companyNotes: "Research + practical mix.",
    },
    willingToRelocate: false,
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
    linkedinUrl: "https://www.linkedin.com/in/sashikant-kumar-2004951b4/",
    twitterUrl: "https://x.com/sashikant877",
    interviewSummary: {
      candidateSaid: "Focuses on workflows.",
      companyNotes: "Strong product + AI.",
    },
    willingToRelocate: true,
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
    linkedinUrl: "https://www.linkedin.com/in/sashikant-kumar-2004951b4/",
    twitterUrl: "https://x.com/sashikant877",
    interviewSummary: {
      candidateSaid: "Focused on compliance.",
      companyNotes: "Reliable operations candidate.",
    },
    willingToRelocate: false,
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
    linkedinUrl: "https://www.linkedin.com/in/sashikant-kumar-2004951b4/",
    twitterUrl: "https://x.com/sashikant877",
    interviewSummary: {
      candidateSaid: "Strong client relationships.",
      companyNotes: "High conversion potential.",
    },
    willingToRelocate: true,
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
    linkedinUrl: "https://www.linkedin.com/in/sashikant-kumar-2004951b4/",
    twitterUrl: "https://x.com/sashikant877",
    interviewSummary: {
      candidateSaid: "Improved significantly.",
      companyNotes: "Worth re-evaluating.",
    },
    willingToRelocate: true,
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
    linkedinUrl: "https://www.linkedin.com/in/sashikant-kumar-2004951b4/",
    twitterUrl: "https://x.com/sashikant877",
    interviewSummary: {
      candidateSaid: "Transitioning into AI.",
      companyNotes: "Strong improvement.",
    },
    willingToRelocate: false,
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
    linkedinUrl: "https://www.linkedin.com/in/sashikant-kumar-2004951b4/",
    twitterUrl: "https://x.com/sashikant877",
    githubUrl: "https://github.com/Sp15och23",
    githubUsername: "Sp15och23",
    interviewSummary: {
      candidateSaid: "Wants a role with product ownership.",
      companyNotes: "Strong developer with current public GitHub activity.",
    },
    willingToRelocate: true,
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
    linkedinUrl: "https://www.linkedin.com/in/sashikant-kumar-2004951b4/",
    twitterUrl: "https://x.com/karpathy",
    githubUrl: "https://github.com/karpathy",
    interviewSummary: {
      candidateSaid: "I want to work on fundamental AI research that has real world impact.",
      companyNotes: "Exceptional depth in ML. Would elevate the entire team.",
    },
    willingToRelocate: true,
    summary: "Former Tesla AI Director and OpenAI founding member. Deep expertise in neural networks, computer vision, and LLMs.",
    reason: "World-class AI expertise directly aligned with our ML roadmap.",
    linkedinPosts: [
      {
        date: "April 5, 2026",
        content: "I have been thinking a lot about what it means to truly understand a neural network. Most practitioners treat them as black boxes — you put data in, you get predictions out, and as long as the metrics look good you ship. But I think this is a dangerous approach. When something goes wrong in production — and it will — you need to know why. That requires building intuition from the ground up: understanding backpropagation not just as an algorithm but as a flow of gradients through a computational graph. Understanding attention not just as a mechanism but as a learned routing system. The engineers who will define the next decade of AI are the ones who can open the box.",
      },
      {
        date: "March 28, 2026",
        content: "Just wrapped up the latest module of my neural networks series. We built a full transformer from scratch — no PyTorch, no shortcuts, just raw NumPy and math. The goal was not to be efficient. The goal was to be legible. I am consistently surprised by how much confusion clears up when people actually implement attention themselves rather than calling a library. There is something irreplaceable about writing the forward pass, computing the loss, deriving the gradients by hand, and watching the loss curve drop for the first time. That moment is where real understanding begins. The module is free and open. Link in comments.",
      },
      {
        date: "March 10, 2026",
        content: "The state of AI education concerns me. We have thousands of courses teaching people to call OpenAI APIs and chain prompts together. That is fine — those are real skills. But we are producing very few people who understand what is happening inside the model. When the API breaks, when the outputs degrade, when you need to fine-tune for a specific domain — you need that deeper knowledge. I am not saying everyone needs to implement a CUDA kernel. But everyone working seriously with AI should be able to implement a transformer from scratch at least once. It changes how you think.",
      },
      {
        date: "February 20, 2026",
        content: "Reflecting on my time at Tesla. Building Autopilot was the most technically demanding thing I have ever done. Not because the models were complex — though they were — but because the feedback loop was so unforgiving. Every mistake had real consequences. That experience shaped how I think about AI safety, evaluation, and deployment. You cannot shortcut your evals when the cost of failure is measured in human lives. I think every AI team would benefit from that kind of constraint, even if they are just building a chatbot. What does failure look like? How will you know when it happens? How fast can you respond?",
      },
      {
        date: "February 5, 2026",
        content: "nanoGPT crossed 40,000 GitHub stars. I am genuinely surprised and grateful. When I built it I just wanted a clean, readable implementation I could use for my own experiments. The codebase is intentionally minimal — around 300 lines for the model, another 300 for training. No abstractions, no frameworks, just the thing itself. The reaction tells me there is real hunger for this kind of transparency in ML. People are tired of magic. They want to understand what they are building. I will keep iterating on it.",
      },
      {
        date: "January 18, 2026",
        content: "Hot take: the most important skill in ML right now is not prompt engineering or fine-tuning or RAG. It is evaluation. Knowing what good looks like. Being able to define, measure, and track quality in a principled way. Most teams I talk to have vague notions of quality that amount to vibes. They ship, they get user complaints, they patch, they ship again. That is not a sustainable process. Before you build anything, define what success looks like numerically. Build your eval suite first. Treat it like production code. Everything else follows from that.",
      },
      {
        date: "January 3, 2026",
        content: "Starting the new year with a question I keep coming back to: what does it mean for a language model to understand something? We throw around the word understanding loosely. The model clearly does something more than pattern matching — the generalizations are too good for that. But it also clearly does not understand the way humans do — the failure modes are too strange, too inconsistent. I think we are in an uncomfortable middle ground and the honest answer is we do not fully know. That uncertainty is not a reason to stop building. It is a reason to be careful, to measure rigorously, and to stay humble.",
      },
    ],
    tweets: [
      { date: "April 8, 2026", content: "the best debugging tool is still a piece of paper and a pencil. draw the computation graph. trace the gradients. the bug is usually obvious." },
      { date: "April 5, 2026", content: "reminder that relu is just max(0, x). somehow this simple function changed everything." },
      { date: "April 1, 2026", content: "wrote 200 lines of cuda today. deleted 190 of them. the 10 that remained were perfect." },
      { date: "March 28, 2026", content: "new nanoGPT update is live. cleaner training loop, better comments, same tiny codebase. link in bio." },
      { date: "March 22, 2026", content: "unpopular opinion: most ML papers would be better as blog posts with code. the pdf format is actively hostile to understanding." },
      { date: "March 18, 2026", content: "attention is just a learned weighted average. once that clicks everything else clicks too." },
      { date: "March 12, 2026", content: "the loss went down. shipped. (this is not advice)" },
      { date: "March 8, 2026", content: "every time i see someone use a library without understanding what it does i feel a small piece of my soul leave my body" },
      { date: "March 2, 2026", content: "softmax is just a smooth argmax. normalize your logits. life is short." },
      { date: "February 25, 2026", content: "if your model works perfectly on the training set and fails on the test set you do not have a model problem you have a data problem" },
      { date: "February 18, 2026", content: "spent 3 hours debugging a shape mismatch. it was a missing unsqueeze. this is the life." },
      { date: "February 12, 2026", content: "the transformer architecture is 7 years old and we still do not fully understand why it works. that should keep everyone humble." },
      { date: "February 5, 2026", content: "nanoGPT 40k stars. genuinely did not expect this. thank you all. will keep the codebase small and legible forever." },
      { date: "January 28, 2026", content: "build your eval suite before you build your model. i cannot say this enough." },
      { date: "January 20, 2026", content: "learning rate scheduling is an art form that nobody talks about enough" },
      { date: "January 15, 2026", content: "dropout is just teaching your network to be robust to missing information. elegant." },
      { date: "January 8, 2026", content: "the difference between a researcher and an engineer is the researcher asks why and the engineer asks how. you need both." },
      { date: "January 3, 2026", content: "new year. same gradients. lets go." },
      { date: "December 28, 2025", content: "reviewed 50 pull requests this week. the code quality across the community keeps getting better. proud of everyone building in the open." },
      { date: "December 20, 2025", content: "finished the year having learned more than i expected. the field moves fast. stay curious. stay humble. read the papers." },
    ],
    githubCommits: [
      { repo: "nanoGPT", message: "Add multi-head attention with causal mask and dropout", date: "April 6, 2026" },
      { repo: "nanoGPT", message: "Refactor training loop for clarity and add gradient clipping", date: "March 29, 2026" },
      { repo: "nanoGPT", message: "Add positional encoding with detailed inline comments", date: "March 15, 2026" },
      { repo: "micrograd", message: "Fix backward pass for division operator edge case", date: "March 8, 2026" },
      { repo: "micrograd", message: "Add tanh activation with full gradient derivation in comments", date: "February 22, 2026" },
      { repo: "nanoGPT", message: "Optimize tokenizer for large vocabulary datasets", date: "February 10, 2026" },
      { repo: "micrograd", message: "Add comprehensive test suite for all autodiff operations", date: "January 30, 2026" },
      { repo: "nanoGPT", message: "Add learning rate warmup and cosine decay scheduler", date: "January 18, 2026" },
      { repo: "nanoGPT", message: "Implement flash attention approximation for memory efficiency", date: "January 5, 2026" },
      { repo: "micrograd", message: "Rewrite engine.py with cleaner topology sort and cycle detection", date: "December 28, 2025" },
      { repo: "nanoGPT", message: "Add distributed training support with DDP wrapper", date: "December 15, 2025" },
      { repo: "micrograd", message: "Add visualization module for computation graph rendering", date: "December 3, 2025" },
      { repo: "nanoGPT", message: "Benchmark against GPT-2 small — within 2% on WikiText-103", date: "November 20, 2025" },
      { repo: "micrograd", message: "Initial commit — scalar valued autograd engine from scratch", date: "November 5, 2025" },
      { repo: "nanoGPT", message: "Add Shakespeare character-level language model training example", date: "October 22, 2025" },
    ],
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
    linkedinUrl: "https://www.linkedin.com/in/sashikant-kumar-2004951b4/",
    twitterUrl: "https://x.com/sashikant877",
    githubUrl: "https://github.com/torvalds",
    interviewSummary: {
      candidateSaid: "Good engineering is about simplicity and getting things right.",
      companyNotes: "Legendary systems thinker. Rare opportunity.",
    },
    resumeUrl: "https://resumetorvalds.netlify.app/",
    willingToRelocate: false,
    summary: "Creator of Linux and Git. Unmatched expertise in systems programming, kernel development, and open source leadership.",
    reason: "Deep systems expertise and proven open source leadership at massive scale.",
    linkedinPosts: [
      {
        date: "April 3, 2026",
        content: "Linux 6.9 release candidate is out. I want to talk about something that rarely gets attention in these announcements: the review process. We merged contributions from over 1,800 developers this cycle. Every single patch went through multiple rounds of review. Maintainers pushed back, asked questions, requested changes. That friction is not a bug — it is the entire point. The Linux kernel works at the scale it does because we take quality seriously at every layer. The code review culture we built over 30 years is the real asset, not the code itself.",
      },
      {
        date: "March 15, 2026",
        content: "I get asked a lot about what I look for when I review code. The honest answer is that I am looking for evidence that the author understands the problem deeply — not just the solution they implemented but all the solutions they considered and rejected. Good commit messages explain why, not what. The diff already shows what changed. What I need to know is what you were thinking, what you tried first, and why this approach is better. Engineers who write good commit messages write better code. The two skills are deeply connected.",
      },
      {
        date: "February 25, 2026",
        content: "Git turns 21 this year. I built the first version in 10 days because I needed it and nothing else existed that worked the way I wanted. The lesson I take from that: the best tools come from genuine need, not from trying to build a tool. I was not trying to revolutionize version control. I was trying to manage Linux kernel patches. The fact that it became universally useful was a side effect of solving a real problem well. I think about this a lot when I see projects that start with the goal of building a platform or an ecosystem. Start with a specific problem. Solve it really well. The rest follows or it does not.",
      },
      {
        date: "February 8, 2026",
        content: "Something I want to push back on: the idea that open source is about altruism. It is not, at least not primarily. Open source works because it aligns incentives. Companies contribute to Linux because they benefit from a stable, well-maintained kernel. Developers contribute because they get better at their craft, build reputation, and work on interesting problems. Users contribute bug reports because they want their bugs fixed. Nobody has to be selfless for this to work. The system is designed so that acting in your own interest also benefits everyone else. That is good system design, not charity.",
      },
      {
        date: "January 20, 2026",
        content: "The kernel turned 35 last year. When I wrote the first lines in 1991 I was a student who wanted to understand how operating systems worked. I had no business plan, no roadmap, no vision for what it would become. I just wanted something that worked on my hardware and that I could learn from. Thirty-five years later Linux runs on everything from smartphones to supercomputers to spacecraft. The lesson is not that I was visionary. The lesson is that good engineering compounds. Write clean code, document your decisions, take correctness seriously, and let time do the rest.",
      },
      {
        date: "January 5, 2026",
        content: "I have been thinking about what makes a programming language good. Not powerful — good. Python is good. C is good. They are very different but they share something: once you understand the model, the language behaves consistently with that model. There are no surprises. The semantics are coherent. Compare this to languages that add feature after feature until the behavior is only explainable by reading the spec rather than by thinking. Complexity is easy to add. Coherence is hard to maintain. The languages that last are the ones where someone said no a lot.",
      },
      {
        date: "December 15, 2025",
        content: "End of year reflection: the thing I am most proud of in 2025 is not any specific kernel feature. It is that we merged more first-time contributors than any previous year. Every one of those patches went through the same rigorous review as patches from veteran maintainers. That is how it should be. The quality bar does not move based on who you are. It moves based on whether the code is correct, whether it handles edge cases, whether it is maintainable. Meritocracy in practice, not just in principle.",
      },
    ],
    tweets: [
      { date: "April 7, 2026", content: "rc1 is out. go break things. that is literally what release candidates are for." },
      { date: "April 2, 2026", content: "your commit message should explain why not what. the diff already shows what." },
      { date: "March 28, 2026", content: "if you cannot explain your patch in plain english you do not understand it well enough to merge it" },
      { date: "March 20, 2026", content: "talk is cheap. show me the code." },
      { date: "March 14, 2026", content: "security through obscurity is not security. open code is more secure than closed code. 35 years of linux proves this." },
      { date: "March 7, 2026", content: "1800 developers contributed to this kernel cycle. every patch reviewed. this is what distributed engineering looks like at scale." },
      { date: "February 28, 2026", content: "bad programmers worry about code. good programmers worry about data structures." },
      { date: "February 20, 2026", content: "git blame is not for assigning fault. it is for understanding context. use it correctly." },
      { date: "February 14, 2026", content: "the best code is code you do not have to write. solve the right problem and half the complexity disappears." },
      { date: "February 7, 2026", content: "portability is not an afterthought. if your code only runs on one architecture you have not finished it." },
      { date: "January 25, 2026", content: "a kernel panic is honest. it tells you exactly what went wrong. some languages could learn from this." },
      { date: "January 18, 2026", content: "the review process exists because humans make mistakes. all humans. including me. especially me." },
      { date: "January 10, 2026", content: "linux runs on more devices than any other operating system. it also has more contributors. these facts are related." },
      { date: "January 3, 2026", content: "new year. same philosophy. write correct code. document your decisions. take the long view." },
      { date: "December 22, 2025", content: "the kernel does not care about your feelings. it cares about your correctness." },
      { date: "December 15, 2025", content: "more first-time contributors this year than any year before. the community keeps growing. proud of all of them." },
      { date: "December 8, 2025", content: "if your abstraction leaks it is not an abstraction. it is a liability." },
      { date: "December 1, 2025", content: "c is not a bad language. it is an honest language. it does exactly what you tell it to. that is a feature." },
      { date: "November 22, 2025", content: "the best engineers i know are the ones who are genuinely curious about how things work at every layer of the stack" },
      { date: "November 15, 2025", content: "open source works because contributing to it is rational self-interest. not altruism. system design." },
    ],
    githubCommits: [
      { repo: "linux", message: "kernel/sched: Fix race condition in CFS load balancer under high contention", date: "April 6, 2026" },
      { repo: "linux", message: "mm/vmalloc: Improve huge page mapping performance by 18% on ARM64", date: "March 30, 2026" },
      { repo: "linux", message: "net/tcp: Add BBRv3 congestion control with improved loss detection", date: "March 22, 2026" },
      { repo: "linux", message: "fs/ext4: Fix journal corruption on unexpected power loss with large block sizes", date: "March 15, 2026" },
      { repo: "linux", message: "security/landlock: Extend access control to cover network sockets", date: "March 8, 2026" },
      { repo: "git", message: "Improve pack-object performance for repositories with deep history", date: "February 28, 2026" },
      { repo: "linux", message: "drivers/gpu: Add support for new display engine in ARM Mali G720", date: "February 20, 2026" },
      { repo: "linux", message: "arch/x86: Mitigate new speculative execution side channel on Zen 4", date: "February 12, 2026" },
      { repo: "git", message: "Fix rebase --onto edge case with merge commits in detached HEAD state", date: "February 5, 2026" },
      { repo: "linux", message: "block/io_uring: Reduce latency by 23% through better submission queue batching", date: "January 28, 2026" },
      { repo: "linux", message: "mm/oom: Improve OOM killer candidate selection heuristic", date: "January 20, 2026" },
      { repo: "git", message: "Add sparse index support for repositories with millions of files", date: "January 12, 2026" },
      { repo: "linux", message: "crypto/chacha20: Add AVX-512 optimized implementation for x86_64", date: "January 5, 2026" },
      { repo: "linux", message: "usb/xhci: Fix interrupt storm on hot-unplug with powered downstream ports", date: "December 20, 2025" },
      { repo: "linux", message: "Initial support for RISC-V Vector Extension 1.0 in kernel thread context", date: "December 5, 2025" },
    ],
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
    linkedinUrl: "https://www.linkedin.com/in/sashikant-kumar-2004951b4/",
    twitterUrl: "https://x.com/gvanrossum",
    githubUrl: "https://github.com/gvanrossum",
    interviewSummary: {
      candidateSaid: "Readability counts. Code is read more than it is written.",
      companyNotes: "Exceptional communicator. Would mentor the entire engineering org.",
    },
    willingToRelocate: true,
    summary: "Creator of Python. 30+ years building elegant, scalable software. Former Dropbox and Google engineer.",
    reason: "Creator of Python with deep expertise in language design and scalable systems.",
    linkedinPosts: [
      {
        date: "April 2, 2026",
        content: "Python 3.13 performance improvements are real and measurable. The team has done incredible work on the interpreter. We are not done — there is still significant headroom. Excited about what 3.14 will bring.",
      },
      {
        date: "March 1, 2026",
        content: "Readability has always been Python core value. I sometimes worry that as the language grows more powerful it becomes less readable. Every new feature has to justify itself against that standard. Not everything that can be added should be.",
      },
      {
        date: "January 30, 2026",
        content: "Reflecting on 35 years of Python. What started as a hobby project during Christmas break has become one of the most widely used languages in the world. The community is what made it — not me.",
      },
    ],
    tweets: [
      { date: "April 3, 2026", content: "Python tip: if your code is hard to read, it is probably also hard to maintain. Clarity is not optional." },
      { date: "March 22, 2026", content: "Working on some typing improvements for 3.14. The goal is making type hints feel natural not like a tax." },
      { date: "March 5, 2026", content: "There should be one obvious way to do it. This is still the hardest principle to uphold as Python grows." },
    ],
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
    linkedinUrl: "https://www.linkedin.com/in/sashikant-kumar-2004951b4/",
    twitterUrl: "https://x.com/addyosmani",
    githubUrl: "https://github.com/addyosmani",
    interviewSummary: {
      candidateSaid: "Performance is a feature. Every millisecond matters.",
      companyNotes: "Deep frontend expertise. Strong communicator and writer.",
    },
    willingToRelocate: true,
    summary: "Engineering Manager at Google Chrome. Expert in web performance, JavaScript, and developer tooling.",
    reason: "World-class frontend performance expertise and proven Google engineering background.",
    linkedinPosts: [
      {
        date: "March 25, 2026",
        content: "We just shipped a new performance audit tool for Chrome DevTools. It surfaces exactly where your app is losing time — not just what is slow but why. The goal is actionable insights in under 30 seconds. Try it and let me know what you think.",
      },
      {
        date: "February 18, 2026",
        content: "Performance is a feature. Every 100ms of load time costs conversion. But here is what most teams miss: performance is not a one-time fix, it is a culture. You need metrics, budgets, and accountability built into your process from day one.",
      },
      {
        date: "January 22, 2026",
        content: "Just published my annual state of JavaScript performance report. TL;DR: we have made real progress on bundle sizes but image optimization is still the biggest untapped opportunity for most sites.",
      },
    ],
    tweets: [
      { date: "April 4, 2026", content: "If your site takes more than 3 seconds to load on mobile you are losing half your users before they even see your content." },
      { date: "March 18, 2026", content: "New Chrome DevTools feature dropping soon. Performance debugging is about to get a lot easier." },
      { date: "March 2, 2026", content: "Core Web Vitals matter because users notice. 100ms is imperceptible to a developer on a fast laptop. It is everything to a user on a slow connection." },
    ],
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
    linkedinUrl: "https://www.linkedin.com/in/sashikant-kumar-2004951b4/",
    twitterUrl: "https://x.com/sashikant877",
    githubUrl: "https://github.com/sunny-ybe",
    interviewSummary: {
      candidateSaid: "The gap between research and production is where I thrive.",
      companyNotes: "Strong ML fundamentals. Practical and delivery-focused.",
    },
    willingToRelocate: false,
    summary: "ML engineer with 6 years bridging data science and production engineering. Strong Python and FastAPI background.",
    reason: "Rare combination of ML research depth and production engineering experience.",
    linkedinPosts: [
      {
        date: "March 15, 2026",
        content: "Just deployed our first production LLM pipeline. The hardest part was not the model — it was the data pipeline, the evals, and the monitoring. Everyone talks about prompt engineering. Nobody talks about how to know when your model is silently degrading.",
      },
      {
        date: "February 10, 2026",
        content: "RAG vs fine-tuning: after running both in production for 6 months my take is that RAG wins for most enterprise use cases. Fine-tuning is powerful but the maintenance burden is real. Your retrieval quality matters more than your model size.",
      },
      {
        date: "January 8, 2026",
        content: "The ML engineer role is changing fast. Two years ago it was mostly about training models. Now it is about integrating them into products reliably. The engineers who understand both worlds will be invaluable.",
      },
    ],
    tweets: [
      { date: "April 5, 2026", content: "hot take: your eval suite is more important than your model choice. know what good looks like before you ship." },
      { date: "March 25, 2026", content: "production ML is 20% model and 80% everything else. the everything else is where careers are made." },
      { date: "March 8, 2026", content: "if you are not monitoring your LLM outputs in production you are flying blind. set up evals before you launch not after." },
    ],
  },
];
