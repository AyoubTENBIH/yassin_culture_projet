"use client";

import { useEffect, useRef, useState } from "react";

export function useScrollEffects() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [enableParallax, setEnableParallax] = useState(false);
  const heroOffsetRef = useRef(0);
  const heroBgRef = useRef<HTMLDivElement | null>(null);
  const ticking = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 769px) and (prefers-reduced-motion: no-preference)");
    const updateParallax = () => setEnableParallax(mq.matches);
    updateParallax();
    mq.addEventListener("change", updateParallax);
    return () => mq.removeEventListener("change", updateParallax);
  }, []);

  useEffect(() => {
    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 80);

      if (enableParallax && heroBgRef.current) {
        const offset = y < window.innerHeight ? y * 0.15 : 0;
        if (heroOffsetRef.current !== offset) {
          heroOffsetRef.current = offset;
          heroBgRef.current.style.transform = `scale(1.03) translateY(${offset}px)`;
        }
      }

      const sections = document.querySelectorAll<HTMLElement>("section[id]");
      let current = "";
      sections.forEach((section) => {
        if (y >= section.offsetTop - 120) current = section.id;
      });
      setActiveSection((prev) => (prev === current ? prev : current));
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, [enableParallax]);

  return { scrolled, activeSection, heroBgRef, enableParallax };
}

export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px 80px 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export function useStatCounter(skipAnimation: boolean) {
  const targets = [15, 7, 3, 5];
  const [values, setValues] = useState<number[]>(skipAnimation ? targets : [0, 0, 0, 0]);
  const animated = useRef(false);

  useEffect(() => {
    if (skipAnimation) {
      setValues(targets);
      return;
    }

    const el = document.querySelector(".stats");
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || animated.current) return;
        animated.current = true;

        targets.forEach((target, index) => {
          let current = 0;
          const step = Math.max(1, Math.floor(target / 20));
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            setValues((prev) => {
              if (prev[index] === current) return prev;
              const next = [...prev];
              next[index] = current;
              return next;
            });
            if (current >= target) clearInterval(timer);
          }, 50);
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [skipAnimation]);

  return values;
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile;
}
