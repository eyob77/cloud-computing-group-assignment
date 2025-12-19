import { useEffect, useState } from "react";

const Article=()=>{
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
      const handleScroll = () => {
        const totalScroll = document.documentElement.scrollTop;
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scroll = `${(totalScroll / windowHeight) * 100}%`;
        setScrollProgress(scroll);
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  return (
    <div>Article Page</div>
  )
}

export default Article;