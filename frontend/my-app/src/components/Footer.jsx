import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer bg-[#333333] text-white py-3 sm:py-4 md:py-5 text-center w-full px-4 sm:px-6 md:px-8">
      <div className="footer-container w-full max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-center items-center gap-4">
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
        <div className="footer-contact flex flex-col items-center gap-3 w-full sm:flex-row justify-center sm:items-center sm:gap-4 text-xs sm:text-sm">
          <section className="flex items-center gap-2 w-full sm:w-auto justify-center">
            <img
              className="w-3 sm:w-4 h-3 sm:h-4"
              src="/images/phone-call-logo.png"
              alt="Phone"
            />
            <span>0921 281 6420</span>
          </section>

          <section className="flex items-center gap-2 w-full sm:w-auto justify-center">
            <img
              className="w-3 sm:w-4 h-3 sm:h-4"
              src="/images/email-logo.png"
              alt="Email"
            />
            <span>immfi1991@gmail.com</span>
          </section>

          <section className="flex items-center gap-2 w-full sm:w-auto justify-center">
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

        {/* Donate button: visible on all viewports, stacks below on small screens, right side on larger screens */}
        <div className="footer-donate mt-3 sm:mt-0 sm:ml-4 flex-shrink-0 w-full sm:w-auto flex justify-center items-center">
          <Link
            to="/donate"
            className="font-semibold text-[12px] sm:text-[13px] text-white bg-[#EDA30C] rounded-[20px] w-[140px] sm:w-[168px] md:w-[180px] h-[36px] sm:h-[40px] flex items-center justify-center gap-2 sm:gap-3 transform origin-top transition-transform duration-200 hover:scale-105"
          >
            <span className="hidden sm:inline">Donate Now</span>
            <span className="sm:hidden">Donate</span>
            <img
              src="/images/heart.png"
              alt="Donate Icon"
              className="w-[14px] sm:w-[16px] h-[14px] sm:h-[16px] ml-2"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}

// Add a class to the document when zoom is roughly 175% or higher.
// This uses `devicePixelRatio` as a heuristic—it's not perfect across all browsers,
// but it works for common desktop browsers where DPR increases with zoom.
export function enableZoomWatcher() {
  if (typeof window === "undefined") return;
  const check = () => {
    try {
      const dpr = window.devicePixelRatio || 1;
      if (dpr >= 1.75) {
        document.documentElement.classList.add("zoom-175");
      } else {
        document.documentElement.classList.remove("zoom-175");
      }
    } catch (e) {
      document.documentElement.classList.remove("zoom-175");
    }
  };

  check();
  window.addEventListener("resize", check);
  window.matchMedia?.("(resolution: 2dppx)")?.addEventListener?.("change", check);
  return () => {
    window.removeEventListener("resize", check);
  };
}

// Initialize watcher on module import so it works globally.
if (typeof window !== "undefined") {
  enableZoomWatcher();
}
