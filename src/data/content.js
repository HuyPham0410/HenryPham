// CV-based content is kept separate from templates so future updates have one source of truth.
// Project descriptions preserve team contributions and do not claim unverified metrics.
const profile = {
  name: "Huy (Henry) Pham",
  email: "giahuyphamm@gmail.com",
  github: "https://github.com/HuyPham0410",
  cv: "/assets/documents/Huy-Pham-CV.pdf",
  summary:
    "Computer Science graduate exploring the intersection of software, web development, and machine learning. I enjoy connecting the pieces, debugging the details, and turning ideas into working projects.",
  about: [
    "I’m Huy, also known as Henry. Originally from Vietnam, I graduated from The University of Texas at San Antonio with a B.S. in Computer Science in May 2026.",
    "My academic and team projects have taken me from responsive websites and database-backed applications to machine learning experiments and privacy-focused research. I learn by building, testing, and understanding why things work.",
    "Outside of code, I enjoy games, travel, and listening to other people’s stories. I’m looking for an entry-level opportunity in software engineering, web development, or AI/ML.",
  ],
  education: {
    school: "The University of Texas at San Antonio",
    degree: "B.S. in Computer Science",
    date: "Graduated May 2026",
    gpa: "3.50 / 4.00",
    majorGpa: "3.66 / 4.00",
    courses: [
      "Data Structures & Algorithms",
      "Object-Oriented Programming",
      "Artificial Intelligence",
      "Software Engineering",
      "Web Development",
    ],
  },
  skills: [
    {
      title: "Programming",
      items: ["Java", "Python", "SQL", "C", "Bash"],
    },
    {
      title: "Web development",
      items: ["HTML", "CSS", "JavaScript", "EJS", "Node.js", "Bootstrap"],
    },
    {
      title: "Data & tools",
      items: ["MySQL", "Git / GitHub", "VS Code", "IntelliJ IDEA"],
    },
    {
      title: "AI-assisted development",
      items: [
        "Task analysis",
        "Debugging",
        "Technical research",
        "Independent output validation",
      ],
    },
  ],
  languages: [
    "Vietnamese · Native",
    "English · Professional working proficiency",
  ],
};

const projects = [
  {
    title: "NiceFit",
    category: "01 / TEAM WEB APPLICATION",
    status: "Academic project",
    description:
      "A clothing shop management website built with Node.js, EJS, MySQL, and JavaScript.",
    contribution:
      "My contribution: application debugging, data integration, and consistent page rendering.",
    details: [
      "Aligned application logic with EJS views and project requirements.",
      "Integrated and validated team-provided product data and images.",
      "Resolved data-mapping and rendering issues in collaboration with the team.",
    ],
    tags: ["Node.js", "EJS", "MySQL", "JavaScript"],
  },
  {
    title: "Email Classification",
    category: "02 / MACHINE LEARNING",
    status: "Team project",
    description:
      "A Python-based binary classification project focused on training, testing, and validating model behavior.",
    contribution:
      "My contribution: model training, debugging training code, and checking prediction behavior.",
    details: [
      "Trained and tested models using team-defined approaches.",
      "Adjusted training code to produce consistent classification outputs.",
      "Monitored training loss, input data, and predictions to validate execution.",
    ],
    tags: ["Python", "Binary classification", "Model validation"],
  },
  {
    title: "Federated Learning for Healthcare",
    category: "03 / UNDERGRADUATE RESEARCH",
    status: "Research",
    description:
      "An investigation of privacy-preserving machine learning and the tradeoffs between privacy, performance, and communication efficiency.",
    contribution:
      "Research focus: comparing FedAvg, FedProxy, and Secure Aggregation, as described in my CV.",
    details: [
      "Compared approaches across non-IID data, privacy leakage, and predictive performance.",
      "Considered AUC-ROC, AUPRC, F1-score, calibration error, and convergence rounds.",
      "Examined client variance and communication cost alongside model stability.",
    ],
    tags: ["Federated learning", "Privacy", "Technical research"],
  },
  {
    title: "Personal Website",
    category: "04 / PERSONAL PROJECT",
    status: "Evolving",
    description:
      "A responsive home for my background, projects, and next chapter in software development.",
    contribution:
      "Originally built as a static portfolio; this version adds reusable EJS templates and a Node.js contact backend.",
    details: [
      "Created multi-page layouts, navigation, forms, and responsive components.",
      "Used Git and GitHub for version control; the original static version was deployed through GitHub Pages.",
      "The current version uses Bootstrap, Express, EJS, and SQLite; it requires a Node.js server.",
    ],
    tags: ["Bootstrap", "Express", "EJS", "SQLite"],
  },
];

module.exports = { profile, projects };
