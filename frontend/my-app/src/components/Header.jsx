import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Top Contact Bar */}
      <div className="bg-[#004428] text-white montserrat">
        <section className="flex flex-wrap gap-2 sm:gap-4 md:gap-6 p-2 px-3 sm:px-4 max-w-[1600px] mx-auto text-center sm:text-left justify-center sm:justify-start text-[8px] sm:text-[10px] md:text-[11px]">
          <div className="flex items-center">
            <img
              className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] mr-1.5"
              src="/images/phone-call-logo.png"
              alt="Phone Logo"
            />
            <p>(045) 961-28-42</p>
          </div>
          <div className="flex items-center">
            <img
              className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] mr-1.5"
              src="/images/email-logo.png"
              alt="Email Logo"
            />
            <a href="mailto:immfi1991@gmail.com">immfi1991@gmail.com</a>
          </div>
          <div className="flex items-center">
            <img
              className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] mr-1.5"
              src="/images/facebook-logo.png"
              alt="Facebook Logo"
            />
            <a
              href="https://www.facebook.com/profile.php?id=100083166347487"
              target="_blank"
            >
              Inocencio Magtoto Memorial Foundation Inc.
            </a>
          </div>
        </section>
      </div>

      {/* Main Header */}
      <section className="w-full bg-white rounded-b-[20px] shadow-md py-0.5 sticky top-0 z-50">
        <header className="px-4 sm:px-6 h-[80px] sm:h-[100px] lg:h-[122px] w-full flex justify-between items-center max-w-[1600px] mx-auto">
          <Link to="/" className="flex items-center gap-2">
            {/* Logo */}
            <div>
              <h1 className="montserrat text-[22px] sm:text-[26px] lg:text-[30px] font-bold text-[#2E7D32] -mb-1">
                IMMFI
              </h1>
              <p className="lato text-[9px] sm:text-[10px]">
                Linking Communities for Equal Opportunities
              </p>
            </div>
          </Link>
          {/* Desktop Nav - Changed breakpoint from md to lg */}
          <nav className="hidden lg:flex flex-1 justify-center">
            <div className="flex gap-8 lg:gap-20 montserrat text-[12px] font-semibold">
              <Link to="/">Home</Link>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact Us</Link>
              <Link to="/gallery">Gallery</Link>
              <Link to="/services">Services</Link>
              <Link to="/developers">Developers</Link>
            </div>
          </nav>

          {/* Donate Button - Changed visibility breakpoint from sm to lg */}
          <div className="hidden lg:flex">
            <Link
              to="/donate"
              className="font-semibold text-[12px] text-white mr-1.5 bg-[#EDA30C] rounded-[20px] w-[140px] sm:w-[168px] h-[32px] sm:h-[37px] flex items-center justify-center gap-2 sm:gap-4"
            >
              Donate Now
              <img
                src="/images/heart.png"
                alt="Donate Icon"
                className="w-[14px] sm:w-[16px] h-[14px] sm:h-[16px]"
              />
            </Link>
          </div>

          {/* Hamburger Icon - Changed breakpoint from md to lg */}
          <button
            className="lg:hidden flex items-center"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </header>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white shadow-lg rounded-b-[20px] p-8 flex flex-col gap-6 montserrat font-semibold text-[16px] absolute w-full z-[9999] -mt-4">
            <Link to="/" onClick={() => setMenuOpen(false)} className="py-1">
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setMenuOpen(false)}
              className="py-1"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="py-1"
            >
              Contact Us
            </Link>
            <Link
              to="/gallery"
              onClick={() => setMenuOpen(false)}
              className="py-1"
            >
              Gallery
            </Link>
            <Link
              to="/services"
              onClick={() => setMenuOpen(false)}
              className="py-1"
            >
              Services
            </Link>
            <Link
              to="/developers"
              onClick={() => setMenuOpen(false)}
              className="py-1"
            >
              Developers
            </Link>
            <Link
              to="/donate"
              onClick={() => setMenuOpen(false)}
              className="font-semibold text-white bg-[#EDA30C] rounded-[20px] w-full h-[45px] flex items-center justify-center gap-3 mt-2"
            >
              Donate Now
              <img
                src="/images/heart.png"
                alt="Donate Icon"
                className="w-[16px] h-[16px]"
              />
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
