import GalleryCarousel from "../components/GalleryCarousel";
import Footer from "../components/Footer";
import AnimatedSection from "../components/AnimatedSection";

export default function Activities() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow w-full flex flex-col items-center bg-[#F4F6F3] px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="w-full max-w-7xl mx-auto">
          <AnimatedSection variant="fadeDown">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] text-left font-bold montserrat text-[#2E7D32] pb-3 sm:pb-5">
              Discover Inspiration: IMMFI&apos;s Activities
            </h1>
          </AnimatedSection>

          <AnimatedSection variant="fadeUp">
            <p className="lato text-base sm:text-lg md:text-xl lg:text-[20px] font-normal pb-4 sm:pb-6 md:pb-8">
              Moments of impact, stories of hope.
            </p>
          </AnimatedSection>

          <AnimatedSection variant="zoomIn">
            <div className="w-full">
              <GalleryCarousel />
            </div>
          </AnimatedSection>
        </div>
      </div>

      <Footer />
    </div>
  );
}
