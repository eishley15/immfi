import Footer from "../components/Footer";
import AnimatedSection from "../components/AnimatedSection";

export default function Services() {
  return (
    <div>
      {/* Hero Section */}
      <div className="w-full bg-[url('/images/services-background.png')] bg-cover bg-center bg-no-repeat flex flex-col items-center font-black pt-30 pb-60 px-10 mb-20 leading-[85px] relative">
        <div className="w-[1400px] text-center py-10">
          <AnimatedSection variant="fadeDown">
            <h2 className="text-[40px] montserrat font-bold text-[#2E7D32] mb-7">
              Programs and Services
            </h2>
          </AnimatedSection>
          <AnimatedSection variant="fadeUp">
            <p className="lato text-[20px] font-normal leading-[40px] tracking-[0.05em] text-[#004428] max-w-[900px] mx-auto">
              Creating opportunities and support for <br />
              children and families in need.
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Main Services */}
      <div className="flex flex-col items-center justify-center py-8 sm:py-12 gap-8 sm:gap-12 px-4 sm:px-10">
        {/* Medical and Allied Services */}
        <AnimatedSection variant="fadeLeft" className="flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-10 max-w-[1215px] w-full mx-auto mb-6 sm:mb-10">
          <div className="flex gap-4 sm:gap-6 lg:gap-10 w-full lg:w-1/2 items-center justify-center">
            <img className="object-cover h-[180px] sm:h-[260px] w-1/2 sm:w-auto" src="/images/program_services_images/medical_hero_1.png" alt="Medical Services image 1" />
            <img className="object-cover w-1/2 sm:w-auto" src="/images/program_services_images/medical_hero_2.png" alt="Medical Services image 2" />
          </div>
          <div className="max-w-full lg:w-1/2">
            <h1 className="montserrat text-[20px] sm:text-[24px] md:text-[28px] font-bold tracking-[0.05em] text-[#004428] mb-3">
              Medical and Allied Services
            </h1>
            <p className="lato text-[13px] sm:text-[15px] md:text-[17px] font-normal leading-[1.6] tracking-[0.02em] text-[#004428]">
              IMMFI provide Neurodevelopmental Assessment, Occupational,
              and Speech Assessment in this program through the budget was
              given by Local Government Unit City of San Fernando. The therapy
              of the CWD beneficiaries is provided 20 sessions only. The home
              program for these children with disability engages parents and
              families towards sustainable provision of therapeutic intervention
              for the program participants.
            </p>
          </div>
        </AnimatedSection>

        {/* Education */}
        <AnimatedSection
          variant="fadeRight"
          className="flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-10 max-w-[1215px] w-full mx-auto mb-6 sm:mb-10"
        >
          {/* Text column (h1 stays at top always) */}
          <div className="max-w-full lg:w-1/2">
            <h1 className="montserrat text-[18px] sm:text-[22px] md:text-[28px] font-bold tracking-[0.05em] text-[#004428] mb-2">
              Education
            </h1>

            {/* Mobile-only: images shown between heading and content */}
            <div className="flex gap-4 sm:gap-6 lg:gap-10 w-full items-center justify-center mb-4 lg:hidden">
              <img
                className="object-cover h-[160px] sm:h-[220px] w-1/2 sm:w-auto rounded-md"
                src="/images/program_services_images/Als_Pwd_1.png"
                alt="Education image 1"
              />
              <img
                className="object-cover h-[160px] sm:h-[220px] w-1/2 sm:w-auto rounded-md"
                src="/images/program_services_images/Als_Pwd_2.png"
                alt="Education image 2"
              />
            </div>

            <h2 className="text-[15px] sm:text-[17px] mb-2 lato font-extrabold italic text-[#2E7D32]">
              Alternative Learning System for PWDs (ALS-PWD)
            </h2>
            <p className="lato text-[13px] sm:text-[15px] md:text-[17px] font-normal leading-[1.6] tracking-[0.02em] text-[#004428]">
              IMMFI is the service provider of DepEd in Alternative Learning
              System for PWDs from Different Community Learning Centers;
              Barangay Malpitic Community learning Center, Barangay Sindalan
              Community Learning Center, Barangay Calulut Community
              Learning Center, Camp Olivas Work Center, and our center based
              Good Shepherd Resource and Training Center at Inocencio
              Magtoto Memorial Foundation Inc. (IMMFI).
            </p>
          </div>

          {/* Desktop/tablet images column (hidden on small screens) */}
          <div className="hidden lg:flex gap-4 sm:gap-6 lg:gap-10 w-full lg:w-1/2 items-center justify-center">
            <img
              className="object-cover h-[220px] sm:h-[320px] w-1/2 sm:w-auto"
              src="/images/program_services_images/Als_Pwd_1.png"
              alt="Education image 1"
            />
            <img
              className="object-cover w-1/2 sm:w-auto"
              src="/images/program_services_images/Als_Pwd_2.png"
              alt="Education image 2"
            />
          </div>
        </AnimatedSection>

        {/* PALENGKISWELA */}
        <AnimatedSection variant="zoomIn" className="flex flex-col-reverse lg:flex-row-reverse justify-center items-center gap-6 lg:gap-10 max-w-[1215px] w-full mx-auto mb-6 sm:mb-10">
          <div className="max-w-full lg:w-1/2">
            <h2 className="text-[15px] sm:text-[17px] mb-2 lato font-extrabold italic text-[#2E7D32]">
              PALENGKISWELA
            </h2>
            <p className="lato text-[13px] sm:text-[15px] md:text-[17px] font-normal leading-[1.6] tracking-[0.02em] text-[#004428]">
              As a DepEd service provider we open Palengkiswela for the
              Out of School Youth/ Adult Out of School situated at the
              City Market Plaza. Target learners are street children,
              vendors, helpers, and others. Ang Palengkiswela ay isang
              magandang halimbawa ng pagsasatuparan ng ating adhikain
              isang Inclusive Education…walang bata ang maiiwan sa larangan
              ng edukasyon. Ano man ang kalagayan sa buhay, ano man
              katangian ng bata, ano man ang lahi, ano man kakayahan,
              ang bawat bata ay mahalaga at may karapatan sa edukasyon.
            </p>
          </div>
          <div className="flex gap-4 sm:gap-6 lg:gap-10 w-full lg:w-1/2 items-center justify-center">
            <img className="object-cover h-[220px] sm:h-[320px] w-1/2 sm:w-auto" src="/images/program_services_images/palengkiswela_1.png" alt="Palengkiswela image 1" />
            <img className="object-cover w-1/2 sm:w-auto" src="/images/program_services_images/palengkiswela_2.png" alt="Palengkiswela image 2" />
          </div>
        </AnimatedSection>

        {/* Socio and Cultural Activities */}
        <AnimatedSection variant="fadeLeft" className="flex flex-col lg:flex-row-reverse justify-center items-center gap-6 lg:gap-10 max-w-[1215px] w-full mx-auto mb-6 sm:mb-10">
          <div className="flex gap-4 sm:gap-6 lg:gap-10 w-full lg:w-1/2 items-center justify-center">
            <img className="object-cover h-[180px] sm:h-[260px] w-1/2 sm:w-auto" src="/images/program_services_images/Socio_Cultural_1.png" alt="Socio and Cultural image 1" />
            <img className="object-cover w-1/2 sm:w-auto" src="/images/program_services_images/Socio_Cultural_2.png" alt="Socio and Cultural image 2" />
          </div>
          <div className="max-w-full lg:w-1/2">
            <h1 className="montserrat text-[18px] sm:text-[22px] md:text-[28px] font-bold tracking-[0.05em] text-[#004428] mb-3">
              Socio and Cultural Activities
            </h1>
            <p className="lato text-[13px] sm:text-[15px] md:text-[17px] font-normal leading-[1.6] tracking-[0.02em] text-[#004428]">
              There are lots of social opportunities for children to develop their
              social skills like dancing, exercises, playing indoor activities,
              parties swimming and fun games. All these could open the
              opportunity to mingle and provide bonding with each
              other. IMMFI conducts different celebrations involving Persons
              with Disability like: National Disability Prevention and
              Rehabilitation Week (NDPR), Children’s Month and International
              Day for Persons with Disability.
            </p>
          </div>
        </AnimatedSection>

        {/* Networking and Partnership Building */}
        <AnimatedSection variant="fadeRight" className="flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-10 max-w-[1215px] w-full mx-auto mb-6 sm:mb-10">
          <div className="flex items-center justify-center w-full lg:w-1/2">
            <img className="w-full max-w-[550px] h-auto object-cover" src="/images/program_services_images/networking_partnership_1.png" alt="Networking and Partnership Building 1" />
          </div>
          <div className="max-w-full lg:w-1/2">
            <h1 className="montserrat text-[18px] sm:text-[22px] md:text-[28px] font-bold tracking-[0.05em] text-[#004428] mb-3">
              Networking and Partnership Building
            </h1>
            <p className="lato text-[13px] sm:text-[15px] md:text-[17px] font-normal leading-[1.6] tracking-[0.02em] text-[#004428]">
              It establishes and maintains partnership with donors,
              non-governmental organizations, volunteer groups, professionals,
              students, local government units, schools, and the community.
              It also builds linkages with organizations that share the
              same vision, mission, goals, and advocacy.
            </p>
          </div>
        </AnimatedSection>

        {/* Advocacy and Community Education */}
        <AnimatedSection variant="zoomIn" className="flex flex-col lg:flex-row-reverse justify-center items-center gap-6 lg:gap-10 max-w-[1215px] w-full mx-auto mb-6 sm:mb-10">
          <div className="flex gap-4 sm:gap-6 lg:gap-10 w-full lg:w-1/2 items-center justify-center">
            <img className="object-cover h-[180px] sm:h-[260px] w-1/2 sm:w-auto" src="/images/program_services_images/advocacy_community_1.png" alt="Advocacy and Community Education 1" />
            <img className="object-cover w-1/2 sm:w-auto" src="/images/program_services_images/advocacy_community_2.png" alt="Advocacy and Community Education 2" />
          </div>
          <div className="max-w-full lg:w-1/2">
            <h1 className="montserrat text-[18px] sm:text-[22px] md:text-[28px] font-bold tracking-[0.05em] text-[#004428] mb-3">
              Advocacy and Community Education
            </h1>
            <p className="lato text-[13px] sm:text-[15px] md:text-[17px] font-normal leading-[1.6] tracking-[0.02em] text-[#004428]">
              This activity will open the door to the community, LGUs, NGOs, organizations
              to understand disability. It is composed of promoting the rights of PWDs
              and their issues and concerns. It is hoped that people can respond to their
              needs and promote their independence and become active member of the society.
            </p>
          </div>
        </AnimatedSection>

        {/* Capacity Building */}
        <AnimatedSection variant="fadeUp" className="flex flex-col max-w-[1215px] w-full mx-auto mb-6 sm:mb-10 px-2 sm:px-0">
          <div>
            <h1 className="montserrat text-[18px] sm:text-[22px] md:text-[28px] font-bold tracking-[0.05em] text-[#004428] mb-3">
              Capacity Building
            </h1>
            <p className="lato text-[13px] sm:text-[15px] md:text-[17px] font-normal leading-[1.6] tracking-[0.02em] text-[#004428]">
              IMMFI conducts trainings, seminars, workshops, and others for the improvement of the Persons
              with Disability (PWDS)/ Children with Disability (CWDs), staff, barangay officials, health
              workers, parents, volunteers, and individuals. The aim of this is to define the process of
              developing and strengthening the skills, instincts, abilities, and human resources of the
              organization and communities. This is a need to survive, adapt, and thrive in a fast-changing world.
            </p>
          </div>
        </AnimatedSection>
      </div>

      <Footer />
    </div>
  );
}
