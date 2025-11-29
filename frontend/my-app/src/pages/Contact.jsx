import Footer from "../components/Footer";
import AnimatedSection from "../components/AnimatedSection";
import { useState } from "react";

export default function Contact() {
  // Add state for form fields
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("http://localhost:3001/api/send-inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message:
            "Your inquiry has been sent successfully! We'll get back to you soon.",
        });
        // Reset form
        setFormData({
          fullName: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        throw new Error(data.error || "Failed to send inquiry");
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error.message || "Failed to send inquiry. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="w-full bg-[url('/images/contact-us-bg.png')] bg-cover bg-center bg-no-repeat flex flex-col items-center font-black py-30 px-4 sm:px-6 lg:px-10 mb-15 lg:leading-[85px] md:leading-[64px] sm:leading-[48px] leading-normal relative">
        <div className="w-full max-w-[1400px] px-4 sm:px-6 mx-auto text-center py-10">
          <AnimatedSection variant="fadeDown">
            <h2 className="text-[28px] sm:text-[34px] md:text-[40px] lg:text-[40px] montserrat font-bold text-[#2E7D32] mb-7 leading-tight">
              Contact Us
            </h2>
          </AnimatedSection>

          <AnimatedSection variant="fadeUp">
            <p className="lato text-[14px] sm:text-[18px] font-normal leading-[1.6] tracking-[0.02em] text-[#004428] max-w-[900px] mx-auto">
              The Inocencio Magtoto Memorial Foundation, Inc. <br />
              (IMMFI) is here to listen, connect, and build an inclusive <br />
              community for children with disabilities. Whether you <br />
              have questions, want to know more about our programs, <br />
              or wish to partner with us, we'd love to hear from you.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Info Section */}
      <div className="flex flex-row flex-wrap sm:flex-nowrap items-start justify-center pt-4 sm:pt-10 pb-8 sm:pb-12 gap-2 sm:gap-20 px-2 sm:px-10 mb-10">
        <AnimatedSection variant="fadeLeft">
          <section className="flex flex-col items-center text-center flex-1 min-w-[88px] max-w-[160px] sm:min-w-[120px] sm:max-w-[220px]">
            <img
              src="/images/telephone_logo.png"
              className="h-[20px] sm:h-[28px] md:h-[36px] lg:h-[40px] mb-1 sm:mb-2 md:mb-3"
            />
            <h1 className="montserrat text-[12px] sm:text-[14px] md:text-[18px] font-semibold text-[#004428] mb-1">
              Call Us
            </h1>
            <p className="text-[10px] sm:text-[12px] md:text-[14px]">
              (045) 961-28-42
            </p>
          </section>
        </AnimatedSection>

        <AnimatedSection variant="zoomIn">
          <section className="flex flex-col items-center text-center flex-1 min-w-[100px] max-w-[200px] sm:min-w-[120px] sm:max-w-[260px]">
            <img
              src="/images/location_logo.png"
              className="h-[20px] sm:h-[28px] md:h-[36px] lg:h-[40px] mb-1 sm:mb-2 md:mb-3"
            />
            <h1 className="montserrat text-[12px] sm:text-[14px] md:text-[18px] font-semibold text-[#004428] mb-1">
              Visit Us
            </h1>
            <p className="text-[10px] sm:text-[12px] md:text-[14px]">
              1st Block, Dolores Homesite, <br />
              San Fernando City, Pampanga
            </p>
          </section>
        </AnimatedSection>

        <AnimatedSection variant="fadeRight">
          <section className="flex flex-col items-center text-center flex-1 min-w-[88px] max-w-[160px] sm:min-w-[120px] sm:max-w-[220px]">
            <img
              src="/images/email_abt_logo.png"
              className="h-[20px] sm:h-[28px] md:h-[36px] lg:h-[40px] mb-1 sm:mb-2 md:mb-3"
            />
            <h1 className="montserrat text-[12px] sm:text-[14px] md:text-[18px] font-semibold text-[#004428] mb-1">
              Contact Us
            </h1>
            <p className="text-[10px] sm:text-[12px] md:text-[14px]">
              immfi1991@gmail.com
            </p>
          </section>
        </AnimatedSection>
      </div>

      {/* Map Section */}
      <AnimatedSection variant="fadeUp">
        <div className="flex items-center justify-center pb-12 sm:pb-16 px-4">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3853.1343248580333!2d120.67600028941042!3d15.040684794050362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396f70fc5d49d6f%3A0xb0d012eef6bd3bc0!2sInocencio%20Magtoto%20Memorial%20Foundation%2C%20Inc.!5e0!3m2!1sen!2sph!4v1758544020062!5m2!1sen!2sph"
            className="w-full max-w-[950px] h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl shadow-lg"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </AnimatedSection>

      {/* Inquiry Form Section - REDESIGNED */}
      <div className="w-full bg-gradient-to-b from-white to-gray-50 py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Left Side - Information */}
            <AnimatedSection variant="fadeRight">
              <div className="space-y-8 lg:sticky lg:top-24">
                <div className="space-y-4">
                  <div className="inline-block">
                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                      Get in Touch
                    </span>
                  </div>
                  <h2 className="montserrat font-bold text-3xl sm:text-4xl md:text-5xl text-[#004428] leading-tight">
                    Let's Start a <br />
                    <span className="text-[#2E7D32]">Conversation</span>
                  </h2>
                  <p className="lato text-base sm:text-lg text-gray-600 leading-relaxed max-w-lg">
                    Have questions about our programs, want to inquire, or
                    explore partnership opportunities? We're here to help and
                    would love to hear from you.
                  </p>
                </div>

                {/* Additional Contact Info */}
                <div className="pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-4">
                    Prefer to reach us directly?
                  </p>
                  <div className="space-y-3">
                    <a
                      href="tel:+63459612842"
                      className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors group"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">
                        (045) 961-28-42
                      </span>
                    </a>
                    <a
                      href="mailto:immfi1991@gmail.com"
                      className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors group"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">
                        immfi1991@gmail.com
                      </span>
                    </a>
                  </div>
                </div>
                <AnimatedSection variant="fadeUp">
                  <section className="flex -mt-8">
                     <a href="/donate" className="lato animate-bounce-low inline-block px-8 py-3 rounded-xl border-2 bg-[#004428] text-white transition-all duration-300 ease-in-out font-bold text-lg my-8 sm:my-10 z-10 relative shadow-lg hover:shadow-xl hover:-translate-y-1">
                        Donate Now
                      </a>
                  </section>
                </AnimatedSection>
              </div>
            </AnimatedSection>

            {/* Right Side - Form */}
            <AnimatedSection variant="fadeLeft">
              <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Success/Error Message */}
                  {submitStatus && (
                    <div
                      className={`p-4 rounded-xl flex items-start gap-3 ${
                        submitStatus.type === "success"
                          ? "bg-green-50 border border-green-200"
                          : "bg-red-50 border border-red-200"
                      }`}
                    >
                      {submitStatus.type === "success" ? (
                        <svg
                          className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                      <p
                        className={`text-sm font-medium ${
                          submitStatus.type === "success"
                            ? "text-green-800"
                            : "text-red-800"
                        }`}
                      >
                        {submitStatus.message}
                      </p>
                    </div>
                  )}

                  {/* Form Fields */}
                  <div className="space-y-5">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all duration-200 outline-none text-gray-900 placeholder-gray-400"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email address"
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all duration-200 outline-none text-gray-900 placeholder-gray-400"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="subject"
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="What can we help you with?"
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all duration-200 outline-none text-gray-900 placeholder-gray-400"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us more about your inquiry..."
                        rows="6"
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all duration-200 outline-none resize-none text-gray-900 placeholder-gray-400"
                        required
                      ></textarea>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full px-6 py-4 rounded-xl font-semibold text-base
                        transition-all duration-300 transform
                        ${
                          isSubmitting
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] hover:from-[#1B5E20] hover:to-[#2E7D32] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                        } text-white shadow-md`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-3">
                          <svg
                            className="animate-spin h-5 w-5"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          Sending Your Message...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Send Message
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Privacy Notice */}
                  <p className="text-xs text-gray-500 text-center pt-2">
                    By submitting this form, you agree to our privacy policy. We
                    respect your privacy and will never share your information.
                  </p>
                </form>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}
