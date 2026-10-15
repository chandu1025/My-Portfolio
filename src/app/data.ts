export interface Job {
  role: string;
  company: string;
  place?: string;
  period: string;
  current?: boolean;
  points: string[];
}

export interface Project {
  title: string;
  summary: string;
  stack: string[];
  points: string[];
}

export interface Site {
  name: string;
  kind: string;
  url: string;
  host: string;
  summary: string;
  /** Optional screenshot, e.g. 'images/janasnehichits.png' (put the file in /public/images). */
  image?: string;
}

export interface SkillGroup {
  title: string;
  icon: string;
  items: string[];
  featured?: boolean;
}

export interface Education {
  title: string;
  place: string;
  period: string;
  score: string;
}



export const PROFILE = {
  name: 'Gnana Chandra',
  shortName: 'Chandu',
  fullName: 'Gnana Chandra',
  title: 'Angular Frontend Developer',

  email: 'chandujetty012@gmail.com',
  phone: '+919347731913',
  whatsappNumber: '919347731913',

  location: 'Tirupati, India',

  linkedin: 'https://www.linkedin.com/in/gnana-chandra/',
  github: 'https://github.com/chandu1025',
  instagram: 'https://www.instagram.com/chandu_jetty/',

  resume: '/assets/resume.pdf',
};



export const SKILLS: SkillGroup[] = [
  {
    title: 'Angular',
    icon: 'layers',
    featured: true,
    items: [
      'Angular 19',
      'Components',
      'Data binding',
      'Services and dependency injection',
      'Routing and navigation',
      'Forms and validation',
      'Angular Material',
    ],
  },
  {
    title: 'Frontend',
    icon: 'palette',
    items: ['TypeScript', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'Bootstrap', 'Tailwind CSS', 'Responsive web design'],
  },
  {
    title: 'APIs and data',
    icon: 'database',
    items: ['REST APIs', 'HTTP Client', 'JSON handling', 'SQL', 'MySQL', 'SQLite'],
  },
  {
    title: 'Other languages',
    icon: 'code-slash',
    items: ['Python', 'PHP', 'Java (basic)', 'C# (learning)'],
  },
  {
    title: 'Tools and workflow',
    icon: 'tools',
    items: ['Git', 'GitHub', 'Azure DevOps', 'Visual Studio Code', 'Postman', 'Chrome DevTools', 'XAMPP'],
  },
  {
    title: 'Practices',
    icon: 'diagram-3',
    items: ['Object-oriented programming', 'SDLC', 'Agile development', 'Debugging', 'Problem solving'],
  },
  {
    title: 'CMS and design',
    icon: 'brush',
    items: ['WordPress', 'Canva'],
  },
];

export const JOBS: Job[] = [
  {
    role: 'Angular Frontend Developer',
    company: 'Intelizest Consulting Pvt. Ltd.',
    period: 'August 2026 to present',
    current: true,
    points: [
      'Develop and maintain frontend components with Angular 19 and TypeScript.',
      'Work with Angular services, dependency injection, routing, forms and validation, and REST API integration.',
      'Build responsive interfaces with Angular Material and debug them with Chrome DevTools.',
      'Use Git and Azure DevOps in the team development workflow.',
    ],
  },
  {
    role: 'Web Developer Intern',
    company: 'astTECS',
    place: 'Bangalore, India',
    period: 'February to July 2025',
    points: [
      'Built and maintained secure web applications with PHP and MySQL.',
      'Created registration and login modules connected to the database.',
      'Wrote backend logic to store, retrieve and manage application data.',
      'Built responsive interfaces with HTML, CSS, Bootstrap and JavaScript.',
      'Debugged, tested and optimized the apps for performance and reliability.',
      'Worked with the team across the software development lifecycle.',
    ],
  },
];

export const PROJECTS: Project[] = [
  {
    title: 'Hospital Management System',
    summary: 'An application for managing patients, appointments and doctor schedules.',
    stack: ['PHP', 'MySQL', 'HTML', 'CSS'],
    points: [
      'Role-based authentication and access control.',
      'Relational database design for efficient storage and retrieval.',
      'Responsive interfaces for easier day-to-day use.',
    ],
  },
  {
    title: 'Web-Based Audio Upload System',
    summary: 'A dashboard for uploading and managing audio files, with weekend and custom date selection.',
    stack: ['PHP', 'MySQL', 'HTML', 'CSS', 'Google Sheets API'],
    points: [
      'Backend workflows for file processing and data management.',
      'Google Sheets API integration to keep data in sync.',
      'Database modules that store and track every uploaded record.',
      'Tested and debugged for reliable performance.',
    ],
  },
];

export const SITES: Site[] = [
  {
    name: 'Jana Snehi Chits',
    kind: 'Chit fund company website',
    url: 'https://janasnehichits.com/',
    host: 'janasnehichits.com',
    summary: 'A responsive WordPress site with company information, contact forms and product listings.',
  },
  {
    name: 'AVY Structural Steel',
    kind: 'Steel detailing company website',
    url: 'https://avystructuralsteel.com/',
    host: 'avystructuralsteel.com',
    summary: 'A responsive WordPress site with company information, project details, contact forms and service listings.',
  },
];

export const EDUCATION: Education[] = [
  {
    title: 'B.Tech in Electronics and Communication Engineering',
    place: 'Sree Rama Engineering College, Tirupati',
    period: 'Nov 2021 to Jun 2025',
    score: 'CGPA 7.21 / 10',
  },
  {
    title: 'Intermediate (MPC)',
    place: 'Sri Chaithanya Junior College, Tirupati',
    period: 'Nov 2019 to Jun 2021',
    score: '818 / 1000',
  },
  {
    title: 'SSC',
    place: 'Vijaya Bharathi High School, Tirupati',
    period: '2019',
    score: 'CGPA 9.7 / 10',
  },
];

export const CERTIFICATION = {
  title: 'Artificial Intelligence and Machine Learning',
  issuer: 'Sree Rama Engineering College with AICTE and Eduskills',
  date: 'April 2024',
};
