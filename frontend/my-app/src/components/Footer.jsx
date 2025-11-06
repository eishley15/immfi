import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#333333] text-white py-3 sm:py-4 md:py-5 w-full px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between items-center sm:items-center sm:gap-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/">
            <img
              className="h-8 sm:h-10 md:h-12 w-auto"
              src="/images/immfi-logo.png"
              alt="IMMFI Logo"
            />
          </Link>
        </div>

        {/* Contact Information */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 md:gap-6">
          <div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-4 md:gap-6 items-center text-xs sm:text-sm">
            <section className="flex items-center gap-2">
              <img
                className="w-3 sm:w-4 h-3 sm:h-4"
                src="/images/phone-call-logo.png"
                alt="Phone"
              />
              <span>0921 281 6420</span>
            </section>

            <section className="flex items-center gap-2">
              <img
                className="w-3 sm:w-4 h-3 sm:h-4"
                src="/images/email-logo.png"
                alt="Email"
              />
              <span>immfi1991@gmail.com</span>
            </section>

            <section className="flex items-center gap-2">
              <img
                className="w-3 sm:w-4 h-3 sm:h-4"
                src="/images/location-pin.png"
                alt="Location"
              />
              <span className="hidden sm:inline">
                1st Block, Dolores Homesite, San Fernando City, Pampanga
              </span>
              <span className="sm:hidden">San Fernando, Pampanga</span>
            </section>
          </div>
        </div>
      </div>
    </footer>
  );
}
