import { useEffect, useRef, useState } from "react";

// Custom hook để theo dõi khi phần tử xuất hiện trong viewport
export function useIntersectionObserver(ref, options) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }
    
        
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return isIntersecting;
}




export function VideoInViewport({ src }) {
    const videoRef = useRef(null);
    const isInViewport = useIntersectionObserver(videoRef, { threshold: 0.5 });
  
    useEffect(() => {
      if (videoRef.current) {
        if (isInViewport) {
          videoRef.current.play().catch((err) => {
            console.warn("Autoplay failed:", err.message);
          });
        } else {
          videoRef.current.pause();
        }
      }
    }, [isInViewport]);
  
    const handleMouseEnter = () => {
      if (videoRef.current) {
        videoRef.current.muted = false; // Bật tiếng
      }
    };
  
    const handleMouseLeave = () => {
      if (videoRef.current) {
        videoRef.current.muted = true; // Tắt tiếng
      }
    };
  
    return (
      <video
        ref={videoRef}
        preload="metadata"
        src={src}
        controls
        loop
        muted={true} // Video mặc định bị tắt tiếng
        playsInline
        onMouseEnter={handleMouseEnter} // Hover để bật tiếng
        onMouseLeave={handleMouseLeave} // Rời chuột để tắt tiếng
      />
    );
  }