import React from "react";
import { motion } from "motion/react";

const defaultContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const defaultItemVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
};

const presetVariants = {
  blur: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.07,
        },
      },
    },
    item: {
      hidden: {
        opacity: 0,
        filter: "blur(12px)",
        y: 14,
        scale: 0.96,
      },
      visible: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        scale: 1,
        transition: {
          duration: 0.68,
          ease: [0.16, 1, 0.3, 1],
        },
      },
    },
  },
  "fade-in-blur": {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.065,
        },
      },
    },
    item: {
      hidden: {
        opacity: 0,
        filter: "blur(10px)",
        y: 10,
      },
      visible: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: {
          duration: 0.62,
          ease: [0.2, 0.65, 0.3, 0.9],
        },
      },
    },
  },
  "blur-sm": {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
        },
      },
    },
    item: {
      hidden: {
        opacity: 0,
        filter: "blur(6px)",
        y: 8,
      },
      visible: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: {
          duration: 0.5,
          ease: "easeOut",
        },
      },
    },
  },
  fade: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
        },
      },
    },
    item: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: 0.5,
        },
      },
    },
  },
  slide: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.06,
        },
      },
    },
    item: {
      hidden: { opacity: 0, y: 24 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          ease: "easeOut",
        },
      },
    },
  },
  scale: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
        },
      },
    },
    item: {
      hidden: { opacity: 0, scale: 0.7 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.55,
          ease: "easeOut",
        },
      },
    },
  },
};

export function TextEffect({
  children,
  per = "word",
  as = "p",
  preset = "blur",
  variants,
  className = "",
  style = {},
  delay = 0,
  speedReveal = 1,
  speedSegment = 1,
  trigger = true,
  viewport = { once: false, amount: 0.25 },
  onAnimationComplete,
  ...props
}) {
  if (typeof children !== "string") {
    return React.createElement(as, { className, style, ...props }, children);
  }

  const activePreset = presetVariants[preset] || presetVariants.blur;
  const containerVariants = variants?.container || activePreset.container || defaultContainerVariants;
  const itemVariants = variants?.item || activePreset.item || defaultItemVariants;

  // Split text based on `per` prop
  let segments;
  if (per === "char") {
    segments = Array.from(children);
  } else if (per === "word") {
    segments = children.split(/(\s+)/);
  } else if (per === "line") {
    segments = children.split("\n");
  } else {
    segments = [children];
  }

  // Adjust container stagger timing
  const baseStagger = per === "char" ? 0.035 : per === "word" ? 0.07 : 0.18;
  const calculatedContainerVariants = {
    ...containerVariants,
    visible: {
      ...containerVariants.visible,
      transition: {
        ...(containerVariants.visible?.transition || {}),
        staggerChildren: baseStagger / speedReveal,
        delayChildren: delay,
      },
    },
  };

  const calculatedItemVariants = {
    ...itemVariants,
    visible: {
      ...itemVariants.visible,
      transition: {
        ...(itemVariants.visible?.transition || {}),
        duration: (itemVariants.visible?.transition?.duration || 0.68) / speedSegment,
      },
    },
  };

  const MotionComponent = motion[as] || motion.p;

  return (
    <MotionComponent
      className={className}
      style={{ display: "inline-block", ...style }}
      initial="hidden"
      whileInView={trigger ? "visible" : undefined}
      animate={!trigger ? "hidden" : undefined}
      viewport={viewport}
      variants={calculatedContainerVariants}
      onAnimationComplete={onAnimationComplete}
      {...props}
    >
      {segments.map((segment, index) => {
        if (per === "word" && /^\s+$/.test(segment)) {
          return <span key={index}>{segment}</span>;
        }

        return (
          <motion.span
            key={index}
            variants={calculatedItemVariants}
            style={{
              display: "inline-block",
              willChange: "transform, opacity, filter",
              whiteSpace: per === "char" && segment === " " ? "pre" : undefined,
            }}
          >
            {segment}
          </motion.span>
        );
      })}
    </MotionComponent>
  );
}

export default TextEffect;
