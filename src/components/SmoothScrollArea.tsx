
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReactNode, useEffect } from "react";

interface SmoothScrollAreaProps {
  children: ReactNode;
  className?: string;
  maxHeight?: string | number;
  smoothScrollTo?: string; // ID of element to scroll to
}

const SmoothScrollArea = ({ 
  children, 
  className, 
  maxHeight,
  smoothScrollTo
}: SmoothScrollAreaProps) => {
  
  // Handle smooth scrolling to a specific element
  useEffect(() => {
    if (smoothScrollTo) {
      const element = document.getElementById(smoothScrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [smoothScrollTo]);

  return (
    <ScrollArea 
      className={className} 
      style={{ 
        maxHeight: maxHeight || "100%",
        scrollBehavior: "smooth" 
      }}
    >
      {children}
    </ScrollArea>
  );
};

export default SmoothScrollArea;
