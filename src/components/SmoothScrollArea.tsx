
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReactNode, useEffect, useRef } from "react";

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Handle smooth scrolling to a specific element
  useEffect(() => {
    if (smoothScrollTo) {
      const element = document.getElementById(smoothScrollTo);
      if (element) {
        // Use scrollIntoView with smooth behavior
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [smoothScrollTo]);

  // Apply smooth scrolling globally to this component
  useEffect(() => {
    const currentRef = scrollAreaRef.current;
    
    if (currentRef) {
      // Make sure all scrollable elements within this component have smooth scrolling
      const scrollableElements = currentRef.querySelectorAll('*');
      scrollableElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.scrollBehavior = 'smooth';
        }
      });
      
      // Also set on the main container
      currentRef.style.scrollBehavior = 'smooth';
    }
    
    return () => {
      // Clean up if needed
      if (currentRef) {
        const scrollableElements = currentRef.querySelectorAll('*');
        scrollableElements.forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.scrollBehavior = 'auto';
          }
        });
      }
    };
  }, []);

  return (
    <ScrollArea 
      className={className} 
      style={{ 
        maxHeight: maxHeight || "100%",
        scrollBehavior: "smooth" 
      }}
      ref={scrollAreaRef}
    >
      {children}
    </ScrollArea>
  );
};

export default SmoothScrollArea;
