import React from "react";
import {
  Code2,
  Heart,
  BookOpen,
  Users,
  Handshake,
  Sparkles,
} from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";

export default function AboutDevelopers() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative">
        <div className="w-full h-56 sm:h-72 md:h-96 lg:h-[28rem] overflow-hidden">
          <img
            src="/images/developer-hero.jpg"
            alt="Developers Hero"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/60 via-green-900/40 to-green-900/60 flex flex-col items-center justify-center">
          <AnimatedSection variant="fadeDown">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center px-4">
              The Minds at Work
            </h1>
          </AnimatedSection>
        </div>
      </section>

      {/* About Code Geeks Section */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          {/* Section Header */}
          <AnimatedSection
            variant="fadeUp"
            className="text-center mb-14 md:mb-16"
          >
            <p className="text-[#2E7D32] text-sm font-semibold tracking-wide uppercase mb-2">
              The Development Team
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Meet the Developers
            </h2>
          </AnimatedSection>

          {/* Main Card */}
          <AnimatedSection variant="fadeUp">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Left - Logo Area */}
                <div className="bg-green-100 p-10 sm:p-12 lg:p-14 flex flex-col items-center justify-center text-center">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-xl p-5 shadow-md mb-6">
                    <img
                      src="/images/CG-logo.png"
                      alt="Code Geeks Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-green-700 mb-2">
                    Code Geeks
                  </h3>
                  <p className="text-green-700/80 text-sm sm:text-base leading-relaxed">
                    School of Computing
                    <br />
                    Holy Angel University
                  </p>
                </div>

                {/* Right - Content Area */}
                <div className="lg:col-span-2 p-8 sm:p-10 lg:p-14 flex flex-col justify-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 leading-snug">
                    Students Creating Meaningful Impact Through Technology
                  </h3>

                  <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p className="text-base sm:text-lg">
                      <span className="font-semibold text-gray-800">
                        Code Geeks
                      </span>{" "}
                      is a student organization from the{" "}
                      <span className="font-semibold text-gray-800">
                        School of Computing of Holy Angel University
                      </span>
                      . We bring together students who share a passion for using
                      technology to create meaningful impact in our communities.
                    </p>
                    <p className="text-base sm:text-lg">
                      As part of a continuing partnership with the{" "}
                      <span className="font-semibold text-gray-800">
                        Inocencio Magtoto Memorial Foundation Inc. (IMMFI)
                      </span>
                      , our organization created and maintains this official
                      website to help amplify its mission of providing inclusive
                      education and livelihood opportunities for persons with
                      disabilities (PWDs).
                    </p>
                  </div>

                  {/* Partnership Note */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-sm text-[#2E7D32] font-medium">
                      A continuing partnership — building bridges through code.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Purpose Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection
            variant="fadeUp"
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-block text-[#2E7D32] text-sm font-semibold tracking-widest uppercase mb-4">
              Our Purpose
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Behind the Development
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              This development reflects a simple belief—
              <span className="font-semibold block mt-2 text-xl sm:text-2xl">
                "Technology becomes more powerful when it opens doors for
                others."
              </span>
            </p>
          </AnimatedSection>

          <AnimatedSection variant="fadeUp" className="text-center mb-12">
            <p className="text-base sm:text-lg text-gray-700 font-medium">
              Through this project, the website was designed to:
            </p>
          </AnimatedSection>

          {/* Purpose Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection variant="fadeUp">
              <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full group">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center group-hover:bg-[#2E7D32] transition-colors duration-300">
                    <BookOpen
                      size={32}
                      className="text-[#2E7D32] group-hover:text-white transition-colors duration-300"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900 mb-4">
                  Accessible Information
                </h3>
                <p className="text-base text-gray-600 text-center leading-relaxed">
                  Support PWD learners and their families by making information
                  easier to access and understand.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection variant="fadeUp">
              <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full group">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center group-hover:bg-[#2E7D32] transition-colors duration-300">
                    <Users
                      size={32}
                      className="text-[#2E7D32] group-hover:text-white transition-colors duration-300"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900 mb-4">
                  Stronger Connections
                </h3>
                <p className="text-base text-gray-600 text-center leading-relaxed">
                  Strengthen IMMFI's connection with the communities and
                  individuals it serves.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection variant="fadeUp">
              <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full group">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center group-hover:bg-[#2E7D32] transition-colors duration-300">
                    <Handshake
                      size={32}
                      className="text-[#2E7D32] group-hover:text-white transition-colors duration-300"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900 mb-4">
                  Collaborative Engagement
                </h3>
                <p className="text-base text-gray-600 text-center leading-relaxed">
                  Inspire collaboration, awareness, and engagement among
                  learners, educators, parents, and partners.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection variant="zoomIn">
            <div className="relative rounded-3xl text-white py-16 md:py-20 lg:py-24 px-8 md:px-12 lg:px-16 overflow-hidden">
              <img
                src="/images/developer-bg.jpg"
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-green-800/70 to-green-900/80"></div>

              <div className="relative z-10 max-w-4xl mx-auto text-center">
                <div className="flex justify-center mb-8">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                    <Heart size={36} className="text-white" />
                  </div>
                </div>
                <blockquote className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium leading-relaxed mb-8">
                  "A small spark of code, offered with a bigger heart, is a
                  bridge for learners seeking hope, for families searching for
                  support, and for communities growing together."
                </blockquote>

                <div className="w-16 h-0.5 bg-white/40 mx-auto mb-6"></div>

                <p className="text-base sm:text-lg text-green-100">
                  Powered proudly by{" "}
                  <span className="font-bold text-white">Code Geeks</span>
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
            <AnimatedSection variant="fadeLeft">
              <div className="bg-white rounded-2xl p-8 md:p-10 text-center shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                <div className="w-24 h-24 bg-green-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Code2 size={44} className="text-[#2E7D32]" />
                </div>
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                  Developed by
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Code Geeks
                </h3>
                <div className="w-12 h-0.5 bg-[#2E7D32] mx-auto mb-4"></div>
                <p className="text-base text-gray-600">School of Computing</p>
                <p className="text-base text-gray-600">Holy Angel University</p>
              </div>
            </AnimatedSection>

            <AnimatedSection variant="fadeRight">
              <div className="bg-white rounded-2xl p-8 md:p-10 text-center shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                <div className="w-24 h-24 bg-green-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Handshake size={44} className="text-[#2E7D32]" />
                </div>
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                  In Partnership with
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">IMMFI</h3>
                <div className="w-12 h-0.5 bg-[#2E7D32] mx-auto mb-4"></div>
                <p className="text-base text-gray-600">
                  Inocencio Magtoto Memorial
                </p>
                <p className="text-base text-gray-600">Foundation Inc.</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
