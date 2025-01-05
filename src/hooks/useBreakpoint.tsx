import { useState, useEffect } from 'react';


export const useBreakpoint = () => {
     // Define Tailwind-style breakpoints
     const BREAKPOINTS: Record<string, number> = {
          xs: 0,
          sm: 640,
          md: 768,
          lg: 1024,
          xl: 1280,
          '2xl': 1536,
     };

     const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

     useEffect(() => {
          const handleResize = () => {
               setViewportWidth(window.innerWidth);
          };

          // Set up resize event listener
          window.addEventListener('resize', handleResize);

          // Initial check for viewport width
          handleResize();

          // Clean up event listener on unmount
          return () => window.removeEventListener('resize', handleResize);
     }, []);

     // Return a function to check if the viewport matches a specific breakpoint or larger
     const breakpoint = (size: string) => {
          const minWidth = BREAKPOINTS[size];
          if (minWidth === undefined) {
               throw new Error(`Invalid breakpoint: ${size}. Use one of ${Object.keys(BREAKPOINTS).join(', ')}`);
          }
          return viewportWidth >= minWidth;
     };

     return { breakpoint, viewportWidth };
};