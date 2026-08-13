import React from "react";
import Icon from "@mdi/react";
import { mdiArrowUp } from "@mdi/js";
import { useScrollToTop } from "./hooks/use-scroll-to-top";

const ScrollToTopButton: React.FC = () => {
  const { isVisible, scrollToTop } = useScrollToTop();

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg transition-all duration-300 transform cursor-pointer ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-10 scale-90 pointer-events-none"
      } hover:scale-110 active:scale-95`}
    >
      <Icon path={mdiArrowUp} size={1} />
    </button>
  );
};

export default ScrollToTopButton;
