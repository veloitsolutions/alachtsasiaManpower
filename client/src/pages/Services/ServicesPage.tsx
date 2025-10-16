import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Users,
  Home,
  Baby,
  ChefHat,
  Heart,
  Car,
  Shirt,
  Brush,
  Flower2,
  GraduationCap,
  UserCog,
  Wrench,
  CalendarDays,
  UtensilsCrossed,
  UserCircle,
  Building,
  Briefcase,
  Activity,
  Globe,
  Truck,
  Database,
  ShoppingBag ,
} from "lucide-react";
import Button from "../../components/Button/Button";
import services from "../../data/services";
import "./ServicesPage.css";

interface DropdownProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  title,
  icon,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="service-dropdown">
      <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="dropdown-title">
          {icon}
          {title}
        </div>
        <ChevronDown
          className={`dropdown-icon ${isOpen ? "open" : ""}`}
          size={24}
        />
      </div>
      <div className={`dropdown-content ${isOpen ? "open" : ""}`}>
        {children}
      </div>
    </div>
  );
};

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();

  const domesticStaffList = [
    { icon: <Home size={24} />, title: "Maid / Housemaid" },
    { icon: <Baby size={24} />, title: "Nanny / Babysitter" },
    {
      icon: <ChefHat size={24} />,
      title: "Cook / Personal Chef / Kitchen Staff",
    },
    {
      icon: <Heart size={24} />,
      title: "Nurse / Caregiver / Elder Care Companion",
    },
    { icon: <Car size={24} />, title: "Driver / Chauffeur" },
    { icon: <Shirt size={24} />, title: "Housekeeper / Laundry Worker" },
    { icon: <Brush size={24} />, title: "Houseboy / Cleaner" },
    { icon: <Flower2 size={24} />, title: "Gardener / Pet Sitter" },
    { icon: <GraduationCap size={24} />, title: "Tutor / Teacher / Trainer" },
    { icon: <UserCog size={24} />, title: "Butler / House Manager" },
    { icon: <Wrench size={24} />, title: "Maintenance Worker / Handyman" },
    { icon: <CalendarDays size={24} />, title: "Event Coordinator" },
    { icon: <UtensilsCrossed size={24} />, title: "Dining Room Attendant" },
    { icon: <UserCircle size={24} />, title: "Tailor / Personal Assistant" },
  ];

  const industries = [
    {
      icon: <Building size={36} />,
      title: "Construction",
      tagline: "Building excellence with skilled workers",
      roles: ["Masons", "Electricians", "Plumbers", "Welders", "General Labor"],
    },
    {
      icon: <UtensilsCrossed size={36} />,
      title: "Hospitality",
      tagline: "Elevate guest experience with professionals",
      roles: [
        "Front Office",
        "Housekeeping",
        "Kitchen Staff",
        "Waiters",
        "Event Staff",
      ],
    },
    {
      icon: <Heart size={36} />,
      title: "Healthcare",
      tagline: "Compassionate healthcare staffing solutions",
      roles: ["Nurses", "Caregivers", "Assistants", "Home Health Aides"],
    },
    {
      icon: <Activity size={36} />,
      title: "Manufacturing",
      tagline: "Boost productivity with industrial talent",
      roles: ["Machine Operators", "Assemblers", "Technicians"],
    },
    {
      icon: <Truck size={36} />,
      title: "Logistics & Transport",
      tagline: "Efficient manpower for your supply chain",
      roles: ["Drivers", "Loaders", "Delivery Assistants", "Warehouse Staff"],
    },
     {
    icon: <ShoppingBag size={36} />,
    title: "Retail",
    tagline: "Empowering retail with smart staffing",
    roles: ["Cashiers", "Sales Associates", "Inventory Staff", "Store Managers"],
  },
  ];

  const businessServices = [
    {
      icon: <Globe size={36} />,
      title: "General Trading",
      since: "2000",
      description:
        "Sourcing and supplying products for local and international markets",
    },
    {
      icon: <Building size={36} />,
      title: "Construction Services",
      since: "2002",
      description:
        "Manpower to full project support in residential and commercial construction",
    },
    {
      icon: <Database size={36} />,
      title: "Export & Import",
      since: "2010",
      description:
        "Global trade in consumer goods, construction materials, industrial equipment",
    },
    // {
    //   icon: <Truck size={36} />,
    //   title: "Transport Services",
    //   since: "2014",
    //   description:
    //     "Logistics solutions with reliable fleets and licensed drivers",
    // },
  ];

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="services-hero-section">
        <div className="container">
          <div className="services-hero-content">
            <h1>Our Services</h1>
            <p>
              Comprehensive recruitment and business solutions for every need
            </p>
          </div>
        </div>
      </section>

      {/* Services Sections */}
      <section className="service-section">
        <div className="container">
          <h2 className="section-title">Our Services</h2>

          {/* Specialized Services Tree */}
          <Dropdown
            title="Specialized Industry Solutions"
            icon={<Briefcase size={24} className="text-primary-red" />}
            defaultOpen={true}
          >
            <div className="tree-container">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="tree-node"
                  onClick={() => navigate(`/services/${service.id}`)}
                >
                  <div className="tree-node-icon">
                    <service.icon />
                  </div>
                  <h3 className="tree-node-title">{service.name}</h3>
                  <p className="tree-node-description">{service.description}</p>
                </div>
              ))}
            </div>
          </Dropdown>

          {/* Domestic Staff Section */}
          <Dropdown
            title="Domestic & Support Staff Recruitment"
            icon={<Users size={24} className="text-primary-red" />}
          >
            <p className="mb-4">
              Reliable, trained professionals for every household and lifestyle
              need.
            </p>
            <div className="domestic-staff-grid">
              {domesticStaffList.map((staff, index) => (
                <div key={index} className="staff-item">
                  <span className="staff-icon">{staff.icon}</span>
                  <span>{staff.title}</span>
                </div>
              ))}
            </div>
          </Dropdown>

          {/* Industry Section */}
          <Dropdown
            title="Skilled Worker Recruitment by Industry"
            icon={<Briefcase size={24} className="text-primary-red" />}
          >
            <div className="industry-grid">
              {industries.map((industry, index) => (
                <div key={index} className="industry-card">
                  <div className="industry-icon">{industry.icon}</div>
                  <h3 className="industry-title">{industry.title}</h3>
                  <p className="industry-tagline">{industry.tagline}</p>
                  <ul className="industry-roles">
                    {industry.roles.map((role, roleIndex) => (
                      <li key={roleIndex}>{role}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Dropdown>

          {/* Business Services Section */}
          <Dropdown
            title="Additional Business Services"
            icon={<Building size={24} className="text-primary-red" />}
          >
            <div className="business-services-grid">
              {businessServices.map((service, index) => (
                <div key={index} className="business-service-card">
                  <div className="card-icon">{service.icon}</div>
                  <h3>{service.title}</h3>
                  <span className="service-since">Since {service.since}</span>
                  <p>{service.description}</p>
                </div>
              ))}
            </div>
          </Dropdown>
        </div>
      </section>

      {/* Process Section */}
      <section className="section process-section">
        <div className="container">
          <h2 className="section-title">Our Recruitment Process</h2>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">01</div>
              <h3>Needs Assessment</h3>
              <p>
                We begin by understanding your specific requirements through
                detailed consultation.
              </p>
            </div>

            <div className="process-step">
              <div className="step-number">02</div>
              <h3>Candidate Sourcing</h3>
              <p>
                Our extensive network allows us to identify qualified candidates
                matching your criteria.
              </p>
            </div>

            <div className="process-step">
              <div className="step-number">03</div>
              <h3>Rigorous Screening</h3>
              <p>
                Candidates undergo thorough verification, skills assessment, and
                background checks.
              </p>
            </div>

            <div className="process-step">
              <div className="step-number">04</div>
              <h3>Client Selection</h3>
              <p>
                We present the best candidates for your review and facilitate
                the interview process.
              </p>
            </div>

            <div className="process-step">
              <div className="step-number">05</div>
              <h3>Visa & Documentation</h3>
              <p>
                We handle all necessary paperwork and visa processing for
                international workers.
              </p>
            </div>

            <div className="process-step">
              <div className="step-number">06</div>
              <h3>Deployment & Support</h3>
              <p>
                We ensure smooth transition and provide ongoing support for both
                employers and employees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section services-cta-section">
        <div className="container">
          <div className="services-cta-content">
            <h2>Ready to Get Started?</h2>
            <p>
              Contact us today to discuss your staffing needs and discover how
              we can help.
            </p>
            <Button
              variant="primary"
              size="large"
              onClick={() => navigate("/contact")}
            >
              Contact Us Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
