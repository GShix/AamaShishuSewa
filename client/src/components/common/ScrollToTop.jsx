import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // This resets the scroll position to the very top-left of the window
    window.scrollTo(0, 0);
  }, [pathname]); // This effect runs every time the path changes

  return null; // This component doesn't render anything visible
};

export default ScrollToTop;