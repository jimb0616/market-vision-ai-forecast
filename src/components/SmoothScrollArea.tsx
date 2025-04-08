
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReactNode } from "react";

interface SmoothScrollAreaProps {
  children: ReactNode;
  className?: string;
  maxHeight?: string | number;
}

const SmoothScrollArea = ({ children, className, maxHeight }: SmoothScrollAreaProps) => {
  return (
    <ScrollArea 
      className={className} 
      style={{ maxHeight: maxHeight || "100%" }}
    >
      {children}
    </ScrollArea>
  );
};

export default SmoothScrollArea;
