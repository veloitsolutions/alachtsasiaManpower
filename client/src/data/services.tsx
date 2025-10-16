// import { Code, Shield, Hotel, Stethoscope, Plane, HardHat, Fuel, Camera, UserPlus, Package, PenTool, Coffee, Users } from 'lucide-react';

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: any;
  iconUrl: string;
  fullDescription: string;
  benefits: string[];
  process: string[];
}

const services: Service[] = [

  {
    id: "security-guard",
    name: "SECURITY GUARD",
    description: "Professional security personnel for all security needs",
     icon: () => <img src="/tinified/secur.webp" alt="Software Development" />,
     iconUrl: "/tinified/secur.webp",
    fullDescription: "Our security guard manpower recruitment agency specializes in providing highly trained, professional security personnel for various industries and settings. From event security to facility protection, our guards are rigorously screened and trained to ensure maximum protection and peace of mind.",
    benefits: [
      "Thoroughly vetted and background-checked security professionals",
      "Customized security solutions based on risk assessment",
      "24/7 availability for both short-term and long-term assignments",
      "Regular training and upskilling of security personnel",
      "Compliance with all relevant security regulations and standards"
    ],
    process: [
      "Security needs assessment",
      "Candidate screening and selection",
      "Specialized training and preparation",
      "Deployment and supervision",
      "Regular performance reviews and reporting",
      "Continuous improvement of security protocols"
    ]
  },
  {
    id: "hotel-staff",
    name: "HOTEL STAFF",
    description: "Experienced hospitality professionals for your establishment",
     icon: () => <img src="/tinified/hotel.webp" alt="Software Development" />,
     iconUrl: "/tinified/hotel.webp",
    fullDescription: "Our hotel staff recruitment agency connects hospitality businesses with qualified professionals across all positions. From management to housekeeping, front desk to food service, we provide thoroughly vetted candidates who bring excellence and dedication to your establishment.",
    benefits: [
      "Access to a wide pool of hospitality professionals",
      "Specialized recruitment for each hotel department",
      "Reduced training time with experienced candidates",
      "Scalable staffing solutions for seasonal demands",
      "Industry-specific screening and evaluation processes"
    ],
    process: [
      "Hospitality staffing needs assessment",
      "Targeted recruitment and candidate sourcing",
      "Comprehensive interviewing and evaluation",
      "Reference checks and background verification",
      "Candidate matching and introduction",
      "Onboarding assistance and follow-up"
    ]
  },
  {
    id: "medical-manpower",
    name: "MEDICAL MANPOWER",
    description: "Healthcare professionals for hospitals, clinics, and care facilities",
    icon: () => <img src="/tinified/medical.webp" alt="Software Development" />,
    iconUrl: "/tinified/medical.webp",
    fullDescription: "Our medical manpower recruitment agency specializes in connecting healthcare facilities with qualified medical professionals. We provide staffing solutions for hospitals, clinics, rehabilitation centers, and other healthcare settings, ensuring that your facility is equipped with competent medical staff.",
    benefits: [
      "Access to certified and licensed healthcare professionals",
      "Rigorous verification of medical credentials",
      "Specialized recruitment for various medical departments",
      "Temporary, permanent, and locum tenens placement options",
      "Compliance with healthcare regulations and standards"
    ],
    process: [
      "Healthcare facility needs assessment",
      "Targeted medical professional sourcing",
      "Credential verification and background checks",
      "Clinical skills assessment when applicable",
      "Candidate-facility matching and interviews",
      "Placement, onboarding, and follow-up support"
    ]
  },
  {
    id: "aviation-airline",
    name: "AVIATION & AIRLINE",
    description: "Specialized recruitment for the aviation industry",
     icon: () => <img src="/tinified/plane.webp" alt="Software Development" />,
     iconUrl: "/tinified/plane.webp",
    fullDescription: "Our aviation and airline manpower agency provides specialized recruitment services for the aviation sector. We connect airlines, airports, and aviation service companies with qualified professionals, from pilots and flight attendants to ground staff and maintenance technicians.",
    benefits: [
      "Industry-specific recruitment expertise",
      "Comprehensive verification of aviation certifications",
      "Global network of aviation professionals",
      "Compliance with international aviation standards",
      "Specialized screening for safety-critical positions"
    ],
    process: [
      "Aviation staffing requirements analysis",
      "Targeted recruitment through industry channels",
      "Verification of licenses, certifications, and experience",
      "Technical assessment and evaluations",
      "Comprehensive background and security checks",
      "Placement and regulatory compliance assistance"
    ]
  },
  {
    id: "construction-manpower",
    name: "CONSTRUCTION MANPOWER",
    description: "Skilled workers for construction projects of all sizes",
     icon: () => <img src="/tinified/construction.webp" alt="Software Development" />,
     iconUrl: "/tinified/construction.webp",
    fullDescription: "Our construction manpower recruitment agency specializes in providing skilled labor for construction projects of all sizes. From general laborers to specialized tradespeople, project managers to site engineers, we connect construction companies with reliable, experienced professionals.",
    benefits: [
      "Access to pre-vetted construction professionals",
      "Trade-specific skill verification and testing",
      "Compliance with safety regulations and certifications",
      "Flexible staffing solutions for project-based needs",
      "Reduced hiring time to keep projects on schedule"
    ],
    process: [
      "Project staffing requirements assessment",
      "Targeted recruitment of construction professionals",
      "Skills verification and safety certification checks",
      "Experience validation and reference checking",
      "On-site deployment and supervision options",
      "Project completion evaluations"
    ]
  },
  {
    id: "oil-and-gas",
    name: "OIL AND GAS",
    description: "Specialized professionals for the energy sector",
    icon: () => <img src="/tinified/oil.webp" alt="Software Development" />,
    iconUrl: "/tinified/oil.webp",
    fullDescription: "Our oil and gas recruitment agency connects energy companies with specialized professionals for upstream, midstream, and downstream operations. We provide staffing solutions for exploration, drilling, production, refining, and related technical and managerial positions.",
    benefits: [
      "Industry-specific technical screening processes",
      "Safety certification verification and compliance",
      "International recruitment capabilities",
      "Experience-verified candidates for specialized roles",
      "Both onshore and offshore staffing solutions"
    ],
    process: [
      "Energy sector staffing needs analysis",
      "Targeted recruitment through industry networks",
      "Technical skills assessment and verification",
      "Safety certification and compliance checks",
      "Logistics coordination for remote site placements",
      "Ongoing support and performance monitoring"
    ]
  },
  {
    id: "surveillance-security",
    name: "SURVEILLANCE AND SECURITY STAFF",
    description: "Advanced security personnel with surveillance expertise",
    icon: () => <img src="/tinified/security.webp" alt="Software Development" />,
    iconUrl: "/tinified/security.webp",
    fullDescription: "Our surveillance and security staff recruitment agency specializes in providing highly trained personnel equipped with the latest surveillance techniques and security protocols. We offer staffing solutions for electronic security operations, monitoring centers, and integrated security systems.",
    benefits: [
      "Personnel trained in advanced surveillance technologies",
      "Experience with various security system platforms",
      "Background-verified and security-cleared professionals",
      "24/7 staffing capabilities for continuous monitoring",
      "Regular training updates on emerging security threats"
    ],
    process: [
      "Security system staffing needs assessment",
      "Specialized recruitment for surveillance expertise",
      "Technical skills evaluation and testing",
      "Security clearance and background verification",
      "System-specific training and certification",
      "Deployment and performance monitoring"
    ]
  },
    {
    id: "software-development",
    name: "SOFTWARE DEVELOPMENT SERVICES",
    description: "Custom software solutions for businesses of all sizes",
    icon: () => <img src="/tinified/software.webp" alt="Software Development" />,
    iconUrl: "/tinified/software.webp",
    fullDescription: "Our software development services offer end-to-end solutions for businesses seeking custom applications, web platforms, mobile apps, and enterprise software. We employ agile methodologies and the latest technologies to deliver high-quality, scalable software products.",
    benefits: [
      "Custom-tailored solutions to match your specific business needs",
      "Expert team of developers, designers, and project managers",
      "Agile development process with regular updates and iterations",
      "Comprehensive quality assurance and testing",
      "Post-launch support and maintenance packages"
    ],
    process: [
      "Requirements gathering and analysis",
      "Solution architecture and design",
      "Development and implementation",
      "Testing and quality assurance",
      "Deployment and integration",
      "Ongoing support and maintenance"
    ]
  },
  {
    id: "senior-level",
    name: "SENIOR LEVEL EXECUTIVES",
    description: "C-level and senior management talent acquisition",
    icon: () => <img src="/tinified/senior.webp" alt="Software Development" />,
    iconUrl: "/tinified/senior.webp",
    fullDescription: "Our executive search and recruitment agency specializes in identifying and placing senior-level executives and C-suite professionals. We employ a comprehensive approach to match companies with transformative leaders who can drive organizational success and growth.",
    benefits: [
      "Access to an exclusive network of executive talent",
      "Rigorous leadership assessment methodologies",
      "Confidential search and placement processes",
      "Industry-specific executive recruitment expertise",
      "Long-term placement success tracking and guarantee"
    ],
    process: [
      "Executive position profiling and requirements analysis",
      "Strategic search and targeted headhunting",
      "Comprehensive leadership assessment",
      "In-depth reference and background verification",
      "Executive-level interviews and cultural fit evaluation",
      "Offer negotiation and onboarding assistance"
    ]
  },
  {
    id: "transport-logistics",
    name: "TRANSPORT AND LOGISTICS",
    description: "Staffing solutions for transportation and logistics operations",
    icon: () => <img src="/tinified/transport.webp" alt="Software Development" />,
    iconUrl: "/tinified/transport.webp",
    fullDescription: "Our transport and logistics recruitment agency provides staffing solutions for the entire supply chain ecosystem. From drivers and warehouse staff to logistics coordinators and supply chain managers, we connect companies with qualified professionals to optimize their operations.",
    benefits: [
      "Industry-specific recruitment expertise",
      "Verification of licenses and certifications",
      "Background checks and safety record verification",
      "Scalable staffing for seasonal logistics demands",
      "Both temporary and permanent placement options"
    ],
    process: [
      "Logistics operation staffing needs assessment",
      "Targeted recruitment of industry professionals",
      "License and certification verification",
      "Safety record and driving history checks",
      "Skill-based testing and evaluation",
      "Placement and performance monitoring"
    ]
  },
  // {
  //   id: "engineers",
  //   name: "ENGINEERS",
  //   description: "Qualified engineers across all disciplines",
  //   icon: () => <img src="/tinified/engineer.webp" alt="Software Development" />,
  //   iconUrl: "/tinified/engineer.webp",
  //   fullDescription: "Our engineering recruitment agency specializes in connecting companies with qualified engineers across all disciplines. From civil and mechanical to electrical and software engineering, we provide staffing solutions for companies seeking technical talent for projects and permanent roles.",
  //   benefits: [
  //     "Technical qualification verification and assessment",
  //     "Engineering specialization matching",
  //     "Project-based or permanent placement options",
  //     "Access to engineers with niche expertise",
  //     "International recruitment capabilities"
  //   ],
  //   process: [
  //     "Engineering talent requirements analysis",
  //     "Specialized technical recruitment",
  //     "Qualification verification and technical assessment",
  //     "Project experience validation",
  //     "Technical interviews and evaluation",
  //     "Placement and integration support"
  //   ]
  // },
  {
    id: "hospitality",
    name: "HOSPITALITY SEGMENT",
    description: "Staffing for hotels, restaurants, and leisure businesses",
     icon: () => <img src="/tinified/hospitality.webp" alt="Software Development" />,
     iconUrl: "/tinified/hospitality.webp",
    fullDescription: "Our hospitality recruitment agency specializes in providing staff for hotels, restaurants, catering companies, and leisure businesses. We connect hospitality establishments with professionals at all levels, from entry positions to management, ensuring excellent service delivery.",
    benefits: [
      "Hospitality-specific skill assessment",
      "Customer service orientation evaluation",
      "Flexible staffing options for seasonal demands",
      "Reduced turnover through careful candidate matching",
      "Access to trained professionals across all departments"
    ],
    process: [
      "Hospitality establishment needs analysis",
      "Targeted recruitment for specific positions",
      "Skill assessment and service orientation testing",
      "Reference checking and experience verification",
      "Role-specific interview processes",
      "Placement, training support, and follow-up"
    ]
  },
  {
    id: "skilled-workers",
    name: "SKILLED WORKERS",
    description: "Access to India's vast pool of skilled labor",
     icon: () => <img src="/tinified/skilled.webp" alt="Software Development" />,
     iconUrl: "/tinified/skilled.webp",
    fullDescription: "Our specialized recruitment agency focuses on connecting businesses with skilled workers from India. We provide comprehensive recruitment solutions that handle everything from candidate selection to visa processing and relocation assistance, giving you access to India's rich talent pool.",
    benefits: [
      "Access to India's diverse skilled workforce",
      "Comprehensive visa and immigration assistance",
      "Cultural integration and relocation support",
      "Cost-effective staffing solutions",
      "Rigorous pre-screening and skill verification"
    ],
    process: [
      "Staffing needs and eligibility assessment",
      "Targeted recruitment across Indian regions",
      "Skill testing and certification verification",
      "Pre-selection and client interviews",
      "Visa processing and documentation assistance",
      "Relocation support and cultural orientation"
    ]
  }
];

export default services;
