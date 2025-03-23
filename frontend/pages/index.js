import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaTwitter, FaLinkedin, FaFacebook } from 'react-icons/fa'; // Import icons
import logoImage from './images/p.png';
import RImage from './images/R.jpg';
import yImage from './images/y.jpeg';
import oImage from './images/o.jpg';
import tImage from './images/t.jpg';
import wImage from './images/w.jpg';

const Index = () => {
  const [showDropdown, setShowDropdown] = useState(null);

  const handleDropdown = (item) => {
    setShowDropdown(showDropdown === item ? null : item);
  };

  return (
    <div className="homepage app-container">
      {/* Header Section */}
      <header>
        <div className="logo">
          <Image
            src={logoImage}
            alt="Company Logo"
            width={120}
            height={100}
          />
        </div>
        <nav>
          <ul className="nav-links">
            <li onClick={() => handleDropdown('about')}>
              <a>
                About <span className="dropdown-icon">▼</span>
              </a>
              {showDropdown === 'about' && (
                <div className="dropdown-content">
                  <p>
                    Ensuring quality, reliability, and seamless collaboration for your projects. Our goal is to simplify hiring and empower businesses to achieve their goals with the right talent.
                  </p>
                </div>
              )}
            </li>
            <li onClick={() => handleDropdown('feature')}>
              <a>
                Feature <span className="dropdown-icon">▼</span>
              </a>
              {showDropdown === 'feature' && (
                <div className="dropdown-content">
                  <p>
                    Discover the key features that make us stand out: easy hiring, secure payments, project tracking, 
                    and dedicated support. We streamline the process so you can focus on what matters most—your business. 
                    Experience a hassle-free way to manage projects and scale your team effortlessly.
                  </p>
                </div>
              )}
            </li>
            <li onClick={() => handleDropdown('resources')}>
              <a>
                Resources <span className="dropdown-icon">▼</span>
              </a>
              {showDropdown === 'resources' && (
                <div className="dropdown-content">
                  <p>
                    Explore our extensive pool of skilled freelancers across various industries. 
                    From designers to developers, we provide the tools and talent to bring your ideas to life. 
                    Find the perfect match for your project with our curated selection of experts.
                  </p>
                </div>
              )}
            </li>
            <li className="auth-buttons">
              <Link href="/login">
                <button className="login-btn">Login</button>
              </Link>
              <Link href="/signup">
                <button className="signup-btn">Sign Up</button>
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Team Section */}
      <section className="team-section">
        <h2>Professional Service Provider</h2>
        <pre>
          {`      Connect with top professionals ready to bring your ideas to life.
            Explore expert talents, review their work, and hire with confidence.
Find the right match and turn your vision into reality today!`}
        </pre>
      </section>

      {/* Card Group Section */}
      <CardGroup />

      {/* Content Section */}
      <section className="content-section">
        <div className="image-placeholder">
          <Image
            src={oImage}
            alt="You are Teacher"
            width={400}
            height={300}
            className="content-image"
          />
        </div>
        <div className="text-content">
          <p>
            Trusted professionals at work, providing essential repair services to meet client needs.
            A seamless connection between skilled service providers and employers who demand quality.
          </p>
          <a href="#" className="learn-more">Learn more →</a>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

// Card Component
const Card = ({ name, description, imageSrc }) => {
  return (
    <div className="card">
      <div className="image-container">
        <Image
          src={imageSrc}
          alt={name}
          width={200}
          height={150}
          className="card-image"
        />
      </div>
      <div className="card-content">
        <h2>{name}</h2>
        <p>{description}</p>
        <a href="#" className="learn-more">How we can help you →</a>
      </div>
    </div>
  );
};

// CardGroup Component
const CardGroup = () => {
  const cardsData = [
    {
      name: "Industrial Experts",
      description: "Experienced professionals deliver quality workmanship with precision. Clients can hire skilled experts for reliable industrial and repair services.",
      imageSrc: RImage,
    },
    {
      name: "Digital Solutions",
      description: "Professional collaboration drives business success. Clients can connect with experts for seamless digital solutions and strategic growth.",
      imageSrc: yImage,
    },
    {
      name: "Appliance Repair",
      description: "Skilled technicians provide top-notch repair services, ensuring appliances run smoothly. Clients can hire professionals for reliable maintenance and efficient problem-solving.",
      imageSrc: wImage,
    },
    {
      name: "Business Strategy",
      description: "Collaboration in action as professionals strategize solutions, driving business outcomes and client success in a modern work environment.",
      imageSrc: tImage,
    },
  ];

  return (
    <div className="card-group">
      {cardsData.map((card, index) => (
        <Card
          key={index}
          name={card.name}
          description={card.description}
          imageSrc={card.imageSrc}
        />
      ))}
    </div>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo"></div>
        <div className="footer-section">
          <h4>COMPANY</h4>
          <ul>
            <li>How it works</li>
            <li>Pricing</li>
            <li>Docs</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>RESOURCES</h4>
          <ul>
            <li>"Maximizing Productivity: Tools Every Freelancer Should Use"</li>
            <li>"How to Manage Remote Teams Effectively: A Beginner’s Guide"</li>
            <li>"Client-Freelancer Collaboration: Best Practices for Success"</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>ABOUT</h4>
          <ul>
            <li>Terms & Conditions</li>
            <li>Privacy policy</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Copyright © 2021 Professional Service Provider</p>
        <div className="social-icons">
          <a href="#" aria-label="Twitter">
            <FaTwitter className="icon" />
          </a>
          <a href="#" aria-label="LinkedIn">
            <FaLinkedin className="icon" />
          </a>
          <a href="#" aria-label="Facebook">
            <FaFacebook className="icon" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Index;