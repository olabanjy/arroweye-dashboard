import { useState, useEffect, useCallback } from "react";

export const useScrollToTop = (threshold = 300, containerId = "dashboard-scroll-container") => {
  const [isVisible, setIsVisible] = useState(false);

  const getContainer = useCallback(() => {
    if (typeof window === "undefined") return null;
    return document.getElementById(containerId) || window;
  }, [containerId]);

  const handleScroll = useCallback(() => {
    const container = getContainer();
    if (!container) return;

    let scrollTop = 0;
    if (container === window) {
      scrollTop = window.scrollY;
    } else {
      scrollTop = (container as HTMLElement).scrollTop;
    }

    setIsVisible(scrollTop > threshold);
  }, [getContainer, threshold]);

  const scrollToTop = useCallback(() => {
    const container = getContainer();
    if (!container) return;

    if (container === window) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      (container as HTMLElement).scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [getContainer]);

  useEffect(() => {
    const container = getContainer();
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [getContainer, handleScroll]);

  return {
    isVisible,
    scrollToTop,
  };
};
