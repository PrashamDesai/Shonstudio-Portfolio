import { motion } from "framer-motion";

const revealTarget = { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" };

const Reveal = ({
  children,
  className = "",
  delay = 0,
  y = 24,
  scale = 0.975,
  amount = 0.2,
  immediate = false,
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y, scale, filter: "blur(10px)" }}
    animate={immediate ? revealTarget : undefined}
    whileInView={immediate ? undefined : revealTarget}
    viewport={immediate ? undefined : { once: true, amount }}
    transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

export default Reveal;
