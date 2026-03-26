import { motion, useMotionValue, useSpring } from "framer-motion";
import { Link } from "react-router-dom";

const MotionLink = motion.create(Link);

const MagneticButton = ({
  to,
  href,
  className = "",
  children,
  cursorLabel = "Open",
  ...props
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.5 });

  const handleMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - (bounds.left + bounds.width / 2);
    const offsetY = event.clientY - (bounds.top + bounds.height / 2);

    x.set(offsetX * 0.18);
    y.set(offsetY * 0.18);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const sharedProps = {
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    className: `${className} button-sheen`,
    "data-cursor": "large",
    "data-cursor-label": cursorLabel,
    ...props,
  };

  if (to) {
    return (
      <MotionLink to={to} style={{ x: springX, y: springY }} {...sharedProps}>
        {children}
      </MotionLink>
    );
  }

  if (href) {
    return (
      <motion.a href={href} style={{ x: springX, y: springY }} {...sharedProps}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button type="button" style={{ x: springX, y: springY }} {...sharedProps}>
      {children}
    </motion.button>
  );
};

export default MagneticButton;
