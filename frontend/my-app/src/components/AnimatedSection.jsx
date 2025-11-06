import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function AnimatedSection({ children, className, variant = "fadeUp" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.3, triggerOnce: true });

  const variants = {
    fadeUp: { hidden: { opacity: 0, y: 80 }, visible: { opacity: 1, y: 0 } },
    fadeDown: { hidden: { opacity: 0, y: -80 }, visible: { opacity: 1, y: 0 } },
    fadeLeft: { hidden: { opacity: 0, x: -80 }, visible: { opacity: 1, x: 0 } },
    fadeRight: { hidden: { opacity: 0, x: 80 }, visible: { opacity: 1, x: 0 } },
    zoomIn: { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants[variant]}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}