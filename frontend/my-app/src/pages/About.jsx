import Footer from "../components/Footer";
import AnimatedSection from "../components/AnimatedSection";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="bg-[#F4F6F3]">
      <div className="flex flex-col justify-center items-center py-12 sm:py-16 px-4 sm:px-10">
        <div className="w-full max-w-[1400px] px-2 sm:px-4">
          {/* Title */}
          <AnimatedSection variant="fadeUp">
            <h2 className="text-[28px] sm:text-[36px] md:text-[40px] montserrat font-bold text-[#2E7D32] mb-6 sm:mb-8 mt-6">
              About IMMFI
            </h2>
          </AnimatedSection>

          {/* Hero Image */}
          <AnimatedSection variant="fadeUp">
            <img
              src="/images/hero-about.png"
              alt="About us cover Image"
              className="w-full h-auto object-cover mb-6 sm:mb-12"
            />
          </AnimatedSection>

          {/* Three-column About text */}
          <AnimatedSection variant="fadeUp">
            <section className="flex flex-col lg:flex-row gap-6 lg:gap-20 leading-[1.6] lato mb-8 sm:mb-20">
              <div className="w-full lg:w-1/3">
                <p className="text-[14px] sm:text-[16px]">
                  The Inocencio Magtoto Memorial Foundation, Inc. (IMMFI) is a
                  non-stock, nonprofit institution dedicated to addressing
                  childhood disability concerns in Pampanga. It was established
                  on November 16, 1991, by the family of the late Inocencio
                  Magtoto to carry out his dream of equal rights and
                  opportunities in life, especially for the poor, deprived, and
                  underprivileged.
                </p>
              </div>
              <div className="w-full lg:w-1/3">
                <p className="text-[14px] sm:text-[16px]">
                  That same year, IMMFI was duly registered with the Securities
                  and Exchange Commission and later recognized as a donee
                  institution by the Bureau of Internal Revenue. In 1997, it was
                  granted a license by the Department of Social Welfare and
                  Development, further solidifying its credibility and
                  commitment to service.
                </p>
              </div>
              <div className="w-full lg:w-1/3">
                <p className="text-[14px] sm:text-[16px]">
                  Today, IMMFI is accredited by local government units as a
                  developmental NGO and actively responds to disability
                  concerns. It is a founding member of local and regional NGO
                  networks, a partner in national civil society groups, and an
                  accredited collaborator with various government agencies.
                </p>
              </div>
            </section>
          </AnimatedSection>

          {/* Stats Section */}
          <AnimatedSection variant="fadeUp">
            <section className="flex flex-row flex-nowrap justify-between items-start py-4 sm:py-8 gap-4 sm:gap-8 w-full">
              <div className="flex flex-col justify-start items-center text-center flex-1 min-w-0 px-1">
                <img src="/images/book-logo.png" alt="Book Logo" className="w-[20px] h-[20px] sm:w-[28px] sm:h-[28px] md:w-[40px] md:h-[40px] mb-1" />
                <h1 className="montserrat font-semibold text-[14px] sm:text-[18px] md:text-[28px] leading-tight mb-1 text-[#004428]">500+</h1>
                <p className="montserrat text-[11px] sm:text-[12px] md:text-[16px] tracking-[0.04em]">children supported <br className="hidden sm:block" />in education</p>
              </div>

              <div className="flex flex-col justify-start items-center text-center flex-1 min-w-0 px-1">
                <img src="/images/school-logo.png" alt="School Logo" className="w-[20px] h-[20px] sm:w-[28px] sm:h-[28px] md:w-[40px] md:h-[40px] mb-1" />
                <h1 className="montserrat font-semibold text-[14px] sm:text-[18px] md:text-[28px] leading-tight mb-1 text-[#004428]">25+</h1>
                <p className="montserrat text-[11px] sm:text-[12px] md:text-[16px] tracking-[0.04em]">school &amp; NGO <br className="hidden sm:block" />partners</p>
              </div>

              <div className="flex flex-col justify-start items-center text-center flex-1 min-w-0 px-1">
                <img src="/images/family-logo.png" alt="Family Logo" className="w-[20px] h-[20px] sm:w-[28px] sm:h-[28px] md:w-[40px] md:h-[40px] mb-1" />
                <h1 className="montserrat font-semibold text-[14px] sm:text-[18px] md:text-[28px] leading-tight mb-1 text-[#004428]">300+</h1>
                <p className="montserrat text-[11px] sm:text-[12px] md:text-[16px] tracking-[0.04em]">
                  families provided
                  <br className="hidden md:block" />
                  medical &amp; therapy
                  <br className="hidden md:block" />
                  assistance
                </p>
              </div>

              <div className="flex flex-col justify-start items-center text-center flex-1 min-w-0 px-1">
                <img src="/images/time-logo.png" alt="Time Logo" className="w-[20px] h-[20px] sm:w-[28px] sm:h-[28px] md:w-[40px] md:h-[40px] mb-1" />
                <h1 className="montserrat font-semibold text-[14px] sm:text-[18px] md:text-[28px] leading-tight mb-1 text-[#004428]">30+</h1>
                <p className="montserrat text-[11px] sm:text-[12px] md:text-[16px] tracking-[0.04em]">years serving the <br className="hidden sm:block" />community</p>
              </div>
            </section>
          </AnimatedSection>
        </div>
      </div>

      {/* Mission / Vision */}
      <AnimatedSection variant="fadeUp">
        <div className="w-full py-12 sm:py-20 bg-[url('/images/about-us-bg.png')] bg-cover bg-center bg-no-repeat flex flex-col lg:flex-col justify-center items-center gap-8 lg:gap-20 font-black px-4 sm:px-10 mb-5 relative">
          <section className="text-center w-full max-w-[420px] mb-5">
            <h1 className="montserrat text-[22px] sm:text-[24px] md:text-[32px] tracking-[0.05em] text-[#004428]">Mission</h1>
            <p className="lato text-[14px] sm:text-[16px] leading-[1.5] font-normal">
              Driven by compassion, integrity, and inclusivity, IMMFI upholds the rights and dignity of children and youth with disabilities through the provision of programs and services on prevention, early detection, intervention, and rehabilitation, thus empowering families and communities.
            </p>
          </section>
          <section className="text-center w-full max-w-[420px] mb-5">
            <h1 className="montserrat text-[22px] sm:text-[24px] md:text-[32px] tracking-[0.05em] text-[#004428]">Vision</h1>
            <p className="lato text-[14px] sm:text-[16px] leading-[1.5] font-normal">
              An inclusive society where persons with disability <br /> enjoy equal rights and opportunities.
            </p>
          </section>
        </div>
      </AnimatedSection>

      {/* Board of Trustees */}
      <div className="flex flex-col justify-center items-center py-8 sm:py-12 px-4 sm:px-10">
        <AnimatedSection variant="fadeUp">
          <section className="flex flex-col justify-center items-center mb-6 sm:mb-10">
            <h1 className="montserrat text-[22px] sm:text-[28px] md:text-[40px] font-bold text-[#004428]">Board of Trustees</h1>
            <p className="text-[14px] sm:text-[16px]">Meet the people who uphold our mission and values</p>
          </section>
        </AnimatedSection>

        {/* First Row */}
        <motion.div
          className="flex flex-col lg:flex-row gap-6 lg:gap-20 mb-6 sm:mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ staggerChildren: 0.3 }}
        >
          <AnimatedSection variant="fadeUp">
            <section className="flex flex-col items-center">
              <img src="/images/board_images/Ruben_Sy.png" alt="Ruben Sy" className="w-full max-w-[300px] h-auto" />
              <div className="bg-[#004428] rounded-tr-[20px] rounded-bl-[20px] py-3 px-4 w-full max-w-[250px] text-center mt-3">
                <h1 className="montserrat text-[12px] sm:text-[14px] font-bold text-white">Chairman of the Board</h1>
                <p className="lato text-[12px] sm:text-[15px] font-medium italic text-white">Engr. Ruben A. Sy</p>
              </div>
            </section>
          </AnimatedSection>

          <AnimatedSection variant="fadeUp">
            <section className="flex flex-col items-center">
              <img src="/images/board_images/Clarita_Magtoto.png" alt="Clarity Magtoto" className="w-full max-w-[300px] h-auto" />
              <div className="bg-[#004428] rounded-tr-[20px] rounded-bl-[20px] py-3 px-4 w-full max-w-[250px] text-center mt-3">
                <h1 className="montserrat text-[12px] sm:text-[14px] font-bold text-white">President/CEO</h1>
                <p className="lato text-[12px] sm:text-[15px] font-medium italic text-white">Ms. Clarita L. Magtoto</p>
              </div>
            </section>
          </AnimatedSection>
        </motion.div>

        {/* Second Row */}
        <motion.div
          className="flex flex-wrap gap-6 sm:gap-8 justify-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ staggerChildren: 0.3 }}
        >
          {[
            {
              name: "Engr Arnel Sicat",
              position: "Vice President",
              link: "/images/board_images/Engr_Arnel_Sicat.png",
            },
            {
              name: "Melissa Sanchez",
              position: "Secretary",
              link: "/images/board_images/Melissa_Sanchez.png",
            },
            {
              name: "Maria Ninette",
              position: "Treasurer",
              link: "/images/board_images/Maria_Ninette.png",
            },
            {
              name: "Elanor Mangahas",
              position: "Auditor",
              link: "/images/board_images/Elanor_Mangahas.png",
            },
          ].map((member, i) => (
            <AnimatedSection key={i} variant="fadeUp">
              <section className="flex flex-col items-center">
                <img
                  src={member.link}
                  alt={member.name}
                  className="w-full max-w-[280px] h-[320px] object-cover rounded-[12px]"
                />
                <div className="bg-[#004428] rounded-tr-[20px] rounded-bl-[20px] py-3 px-4 w-full max-w-[230px] text-center mt-3">
                  <h1 className="montserrat text-[12px] sm:text-[13px] font-bold text-white">
                    {member.position}
                  </h1>
                  <p className="lato text-[12px] sm:text-[14px] font-medium italic text-white">
                    {member.name}
                  </p>
                </div>
              </section>
            </AnimatedSection>
          ))}
        </motion.div>


        {/* Members */}
        <AnimatedSection variant="fadeUp" className="mt-20">
          <section className="flex flex-col justify-center items-center mb-6 sm:mb-10">
            <h1 className="montserrat text-[22px] sm:text-[28px] md:text-[40px] font-bold text-[#004428]">Members</h1>
          </section>
        </AnimatedSection>

        {/* Third Row */}
        <motion.div
          className="flex flex-wrap gap-6 sm:gap-8 justify-center mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ staggerChildren: 0.3 }}
        >
          {[
            {
              name: "Ms. Myrna C. Bituin",
              link: "/images/board_images/myrna_bituin.png",
            },
            {
              name: "Rev. Ronnie D. Cao",
              link: "/images/board_images/ronnie_cao.png",
            },
            {
              name: "Mr. Lord M. David",
              link: "/images/board_images/Lord_david.png",
            }
          ].map((member, i) => (
            <AnimatedSection key={i} variant="fadeUp">
              <section className="flex flex-col items-center">
                <img
                  src={member.link}
                  alt={member.name}
                  className="w-full max-w-[280px] h-[320px] object-cover rounded-[12px]"
                />
                <div className="bg-[#004428] rounded-tr-[20px] rounded-bl-[20px] py-3 px-4 w-full max-w-[230px] text-center mt-3">
                  <p className="lato text-[12px] sm:text-[14px] font-medium italic text-white">
                    {member.name}
                  </p>
                </div>
              </section>
            </AnimatedSection>
          ))}
        </motion.div>

        {/* Fourth Row */}
        <motion.div
          className="flex flex-wrap gap-6 sm:gap-8 justify-center mb-25"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ staggerChildren: 0.3 }}
        >
          {[
            {
              name: "Dr. Kristine A. Roa",
              link: "/images/board_images/kristine_roa.png",
            },
            {
              name: "Dr. Vincent M. Roa",
              link: "/images/board_images/vincent_roa.png",
            },
            {
              name: "Ms. Teresita M. Sanchez",
              link: "/images/board_images/teresita_sanchez.png",
            },
          ].map((member, i) => (
            <AnimatedSection key={i} variant="fadeUp">
              <section className="flex flex-col items-center">
                <img
                  src={member.link}
                  alt={member.name}
                  className="w-full max-w-[280px] h-[320px] object-cover rounded-[12px]"
                />
                <div className="bg-[#004428] rounded-tr-[20px] rounded-bl-[20px] py-3 px-4 w-full max-w-[230px] text-center mt-3">
                  <p className="lato text-[12px] sm:text-[14px] font-medium italic text-white">
                    {member.name}
                  </p>
                </div>
              </section>
            </AnimatedSection>
          ))}
        </motion.div>

      </div>

      <Footer />
    </div>
  );
}
