import Carousel from "../components/Carousel";
import Footer from "../components/Footer";
import AnimatedSection from "../components/AnimatedSection"; 

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="w-full lg:h-[985px] md:h-[760px] sm:h-[640px] h-auto bg-[url('/images/homepage-background.png')] bg-cover bg-center bg-no-repeat flex flex-col items-center font-black lg:pt-40 md:pt-28 sm:pt-24 pt-20 lg:px-10 md:px-8 sm:px-6 px-4 lg:leading-[85px] md:leading-[64px] sm:leading-[48px] leading-normal relative">
        <AnimatedSection variant="fadeDown">
          <h2 className="merriweather text-[28px] sm:text-[36px] md:text-[48px] lg:text-[65px] text-[#2E7D32] tracking-[0.05em] text-center">
            Linking Communities <br />
            For Equal Opportunities
          </h2>
        </AnimatedSection>

        <AnimatedSection variant="fadeUp">
          <p className="lato text-center text-[13px] sm:text-[15px] md:text-[16px] max-w-[900px] leading-relaxed mt-4 sm:mt-6">
            Inspired by a dream of equal rights and opportunities in life—especially <br />
            for the poor, deprived, and underprivileged.
          </p>
        </AnimatedSection>

        <AnimatedSection variant="zoomIn">
          <section className="-mt-12 sm:-mt-24">
            <img
              className="w-full lg:max-w-[1140px] md:max-w-[900px] sm:max-w-[700px] h-auto mx-auto"
              src="/images/hero-image-homepage.png"
              alt="Hero"
            />
          </section>
        </AnimatedSection>
      </section>

      {/* Mission Section */}
      <section className="bg-white relative z-10 flex flex-col justify-center items-center pt-12 sm:pt-16 pb-10 sm:pb-20 px-4 sm:px-10">
        <section className="text-center flex flex-col mt-[25px] lg:flex-row justify-center items-center gap-6 lg:gap-12 mb-12 w-full max-w-[1400px]">
          <AnimatedSection variant="fadeLeft">
            <h1 className="montserrat font-medium text-black lg:text-left text-center tracking-[0.05em] mr-0 lg:mr-6 text-[18px] sm:text-[20px] md:text-[28px]">
              <span className="text-[18px] sm:text-[20px] md:text-[28px] leading-[1.05]">Rooted in the belief</span> <br />
              <span className="text-[16px] sm:text-[18px] md:text-[24px] leading-[1.05]">in equal opportunities</span> <br />
              <span className="text-[18px] sm:text-[20px] md:text-[28px] leading-[1.05]">
                <span className="font-bold text-[#2E7D32]">IMMFI</span> commits to:
              </span>
            </h1>
          </AnimatedSection>

          <AnimatedSection variant="fadeRight">
            <ul className="text-left sm:text-left text-center leading-[1.6] text-[14px] sm:text-[16px] md:text-[16px] max-w-[600px]">
              <li>
                <span className="text-[#0C9569] font-medium lg:pl-0">Strengthen</span> and broaden partnership among disability stakeholders.
              </li>
              <li>
                <span className="text-[#0C9569] font-medium lg:pl-4">Advocate</span> positive attitude towards PWDs.
              </li>
              <li>
                <span className="text-[#0C9569] font-medium lg:pl-8">Serve</span> as a resource and training center on disability.
              </li>
              <li>
                <span className="text-[#0C9569] font-medium lg:pl-4">Support</span> existing disabled persons organizations.
              </li>
              <li>
                <span className="text-[#0C9569] font-medium lg:pl-0">Empower</span> families of children with disability to form self-help groups.
              </li>
            </ul>
          </AnimatedSection>
        </section>

        <section className="flex justify-center w-full mt-28 sm:mt-36 md:mt-40">
          <AnimatedSection variant="fadeUp">
            <div className="w-full px-0 sm:px-4 md:px-6 mx-auto max-w-[92vw] sm:max-w-[700px] md:max-w-[900px] lg:max-w-[1100px] box-border">
              <h1 className="px-0 sm:px-4 text-[16px] sm:text-[20px] md:text-[32px] lg:text-[40px] text-center sm:text-left font-bold montserrat text-[#2E7D32] mb-6 leading-tight break-words max-w-[92vw] sm:max-w-full mx-auto">
                Programs & Services
              </h1>
 
               {/* carousel wrapper: ensure no horizontal overflow on phones, center single-card slides */}
               <div className="w-full overflow-hidden px-2 sm:px-4">
                 <div className="w-full max-w-full mx-auto">
                   <Carousel className="w-full max-w-full mx-auto" />
                 </div>
               </div>
             </div>
           </AnimatedSection>
         </section>
      </section>

      {/* About Us Section */}
      <section className="w-full bg-[url('/images/homepage-background2.png')] bg-cover bg-center bg-no-repeat flex flex-col lg:flex-row gap-6 lg:gap-20 items-center justify-center font-black pt-12 sm:pt-20 px-4 sm:px-10 pb-12 md:pb-24 relative">
        <section className="relative w-full lg:w-auto flex justify-center lg:justify-start">
          <AnimatedSection variant="fadeLeft">
            <img
              className="w-full lg:max-w-[435px] md:max-w-[380px] sm:max-w-[320px] h-auto object-cover rounded-lg shadow-md z-0"
              src="/images/about-us2-hm.jpg"
              alt="About Us"
            />
          </AnimatedSection>
          <AnimatedSection variant="fadeRight">
            <img
              className="w-[220px] sm:w-[260px] md:w-[300px] lg:w-[337px] h-auto object-cover rounded-lg absolute lg:bottom-[-60px] md:bottom-[-50px] sm:bottom-[-40px] bottom-[-30px] right-[-10px] sm:right-[-20px] md:right-[-40px] lg:right-[-50px] z-10"
              src="/images/about-us-hm.jpg"
              alt="About Us"
            />
          </AnimatedSection>
        </section>

        <AnimatedSection variant="fadeUp">
          <section className="max-w-[640px] px-2 sm:px-4">
            <h1 className="mb-4 sm:mb-6 text-[20px] sm:text-[24px] md:text-[32px] montserrat text-[#0C9569] text-center lg:text-left">About Us</h1>
            {/* About short intro */}
            <h1 className="mb-6 sm:mb-12 text-[16px] sm:text-[20px] md:text-[28px] font-medium w-full lg:max-w-[28rem] text-center lg:text-left">
              We’re non-profit advocating 
              for equal opportunities for 
              the underprivileged and
              NGO Organization.
            </h1>

            <ul className="space-y-4 sm:space-y-7 mb-6 sm:mb-12">
              <li className="flex items-center gap-3 lato font-medium text-[14px] sm:text-[15px]">
                <img src="/images/check.png" className="w-auto h-[20px] sm:h-[22px]" />
                <p>Founded in 1991 by the family of Inocencio Magtoto</p>
              </li>
              <li className="flex items-center gap-3 lato font-medium text-[14px] sm:text-[15px]">
                <img src="/images/check.png" className="w-auto h-[20px] sm:h-[22px]" />
                <p>Focus: Supporting children with disabilities in Pampanga</p>
              </li>
              <li className="flex items-center gap-3 lato font-medium text-[14px] sm:text-[15px]">
                <img src="/images/check.png" className="w-auto h-[20px] sm:h-[22px]" />
                <p>SEC-registered and licensed by DSWD since 1997</p>
              </li>
              <li className="flex items-center gap-3 lato font-medium text-[14px] sm:text-[15px]">
                <img src="/images/check.png" className="w-auto h-[20px] sm:h-[22px]" />
                <p>Accredited nonprofit partnered with local and national organizations</p>
              </li>
            </ul>

            <p className="lato text-[13px] sm:text-[14px] md:text-[14px] leading-[1.6] font-light italic text-center lg:text-left">
              Inocencio Magtoto Memorial Foundation, Inc. (IMMFI) is a non-profit <br />
              organization based in Pampanga that advocates for children with disabilities. <br />
              Founded in 1991, IMMFI carries forward the vision of equal rights and <br />
              opportunities for the poor and underprivileged.
            </p>
          </section>
        </AnimatedSection>
      </section>

      <Footer />
    </div>
  );
}
