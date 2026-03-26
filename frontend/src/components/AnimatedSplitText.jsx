import { motion } from "framer-motion";

const AnimatedSplitText = ({
  text,
  as: Tag = "h1",
  className = "",
  delay = 0,
  wordClassName = "",
}) => {
  const words = text.split(" ");

  return (
    <Tag className={className}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="mr-[0.22em] inline-flex overflow-hidden">
          <motion.span
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 0.85,
              delay: delay + index * 0.055,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`inline-block ${wordClassName}`}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};

export default AnimatedSplitText;
