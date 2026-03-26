import { motion } from "framer-motion";

const Reveal = ({ children, className = "", delay = 0, y = 24, scale = 0.975, amount = 0.2 }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y, scale, filter: "blur(10px)" }}
    whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
    viewport={{ once: true, amount }}
    transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

export default Reveal;
