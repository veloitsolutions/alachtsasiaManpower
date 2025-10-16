import React from "react";
import { MapPin, Phone, Mail, Smartphone, Clock } from "lucide-react";
import ContactForm from "../../components/ContactForm/ContactForm";
import "./ContactPage.css";

const ContactPage: React.FC = () => {
  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero-section">
        <div className="container">
          <div className="contact-hero-content">
            <h1>Contact Us</h1>
            <p>We're ready to support your manpower and staffing needs</p>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="section contact-info-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2 className="section-title">Get In Touch</h2>
              <p className="contact-intro">
                Whether you're an individual looking for domestic help or a
                business seeking skilled workers, our team is ready to assist
                you with professional care.
              </p>

              <div className="contact-details">
                <div className="contact-detail-item">
                  <div className="contact-icon">
                    <Mail size={24} />
                  </div>
                  <div className="contact-text">
                    <h3>Email Us</h3>
                    <p>
                      <a href="mailto:Info@alikhtsasy.com">
                        Info@alikhtsasy.com
                      </a>
                    </p>
                    <p>
                      {/* <a href="mailto:Info@alikhtsasy.com">
                        Info@alikhtsasy.com
                      </a> */}
                    </p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon">
                    <Phone size={24} />
                  </div>
                  <div className="contact-text">
                    <h3>Call Us</h3>
                    <p>
                      <a href="tel:+1234567890">+1-234-567-890</a>
                      <br />
                      <a href="tel:+1234567891">+1-234-567-891</a>
                    </p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon">
                    <Smartphone size={24} />
                  </div>
                  <div className="contact-text">
                    <h3>WhatsApp</h3>
                    <p>
                      <a href="https://wa.me/1234567890">+1-234-567-890</a>
                      <br />
                      <a href="https://wa.me/1234567891">+1-234-567-891</a>
                    </p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon">
                    <MapPin size={24} />
                  </div>
                  <div className="contact-text">
                    <h3>Visit Us</h3>
                    <address>
                     Alachtsasi Office,
                      <br />
                      Business District, City Center, Country.
                    </address>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon">
                    <Clock size={24} />
                  </div>
                  <div className="contact-text">
                    <h3>Business Hours</h3>
                    <p>
                      Sunday - Thursday: 09:00 AM to 06:00 PM
                      <br />
                      Friday: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* <div className="business-hours">
                <h3>Business Hours</h3>
                <ul>
                  <li><span>Monday - Friday:</span> 9:00 AM - 6:00 PM</li>
                  <li><span>Saturday:</span> 10:00 AM - 4:00 PM</li>
                  <li><span>Sunday:</span> Closed</li>
                </ul>
              </div> */}
            </div>

            <div className="contact-form-wrapper">
              <h2>Send Us A Message</h2>
              <p>Fill out the form below and we'll get back to you shortly.</p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section map-section">
        <div className="map-container">
          {/* <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.2714799277714!2d51.53238797538755!3d25.28691477716745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e45c534f39974c7%3A0x2c49f4d7083e8889!2sDoha%2C%20Qatar!5e0!3m2!1sen!2sus!4v1710861547975!5m2!1sen!2sus"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            title="Intralink Office Location"
          ></iframe> */}
          {/* <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d57713.595469296!2d51.5328719!3d25.3008536!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e45dba6cabb7869%3A0xf9b595ecebabb1e8!2sINTRALINK%20MANPOWER!5e0!3m2!1sen!2sin!4v1746531038057!5m2!1sen!2sin"
            width="600"
            height="450"
            style={{border:0}}
            allowFullScreen={true}
            loading="lazy"
             title="Intralink Office Location"
          ></iframe> */}

          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.3278530959087!2d51.45819399999999!3d25.3267773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e45dba6cabb7869%3A0xf9b595ecebabb1e8!2sINTRALINK%20MANPOWER!5e0!3m2!1sen!2sin!4v1747294048382!5m2!1sen!2sin" 
          width="600" 
          height="450" 
          style={{border:0 }}
          allowFullScreen={true}
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How long does the recruitment process take?</h3>
              <p>
                The timeline varies depending on the position and requirements.
                Typically, domestic staff recruitment takes 4-6 weeks from
                initial consultation to placement, while skilled worker
                recruitment may take 6-8 weeks due to additional verifications
                and visa processing.
              </p>
            </div>

            <div className="faq-item">
              <h3>Do you handle visa and immigration requirements?</h3>
              <p>
                Yes, we provide full support for visa applications and
                immigration requirements. Our team has extensive experience
                navigating the immigration processes for various countries.
              </p>
            </div>

            <div className="faq-item">
              <h3>
                What happens if the placed worker doesn't meet expectations?
              </h3>
              <p>
                We offer a replacement guarantee period (typically 3 months)
                during which we will find a suitable replacement if the original
                placement doesn't work out, subject to our terms and conditions.
              </p>
            </div>

            <div className="faq-item">
              <h3>What countries do you recruit from?</h3>
              <p>
                We primarily recruit from the Philippines, Uganda, Ghana, Kenya,
                Indonesia, Sri Lanka, Ethiopia, India, Bangladesh, and Burundi,
                but can source from other countries based on specific
                requirements.
              </p>
            </div>

            <div className="faq-item">
              <h3>What verification processes do you use?</h3>
              <p>
                Our verification process includes background checks, skills
                assessment, reference verification, health screening, and where
                applicable, certification validation to ensure candidates meet
                our quality standards.
              </p>
            </div>

            <div className="faq-item">
              <h3>Can you provide temporary or project-based staffing?</h3>
              <p>
                Yes, in addition to permanent placements, we offer temporary and
                project-based staffing solutions to meet seasonal or short-term
                needs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
