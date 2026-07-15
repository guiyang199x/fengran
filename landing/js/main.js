/*
 * FENGRAN landing page interaction layer.
 * GSAP + ScrollTrigger via CDN (no build step in this repo, matching the
 * vanilla approach used by ../ios-prototype/js/app.js).
 */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  gsap.registerPlugin(ScrollTrigger);

  /* ------------------------------------------------------------------ */
  /* Marquee: duplicate the track once so the 50% loop is seamless      */
  /* ------------------------------------------------------------------ */
  function initMarquee() {
    const track = document.getElementById("marquee-track");
    if (!track) return;
    track.innerHTML += track.innerHTML;
  }

  /* ------------------------------------------------------------------ */
  /* Generic reveal-on-scroll (fade + rise)                             */
  /* ------------------------------------------------------------------ */
  function initReveals() {
    const items = document.querySelectorAll("[data-reveal]");
    if (reduceMotion) {
      items.forEach((el) => { el.style.opacity = 1; el.style.transform = "none"; });
      return;
    }
    items.forEach((el, i) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        delay: el.closest(".hero") ? i * 0.06 : 0,
        scrollTrigger: el.closest(".hero") ? undefined : {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    });

    const heroPhone = document.querySelector("[data-reveal-scale]");
    if (heroPhone) {
      gsap.fromTo(
        heroPhone,
        { opacity: 0, scale: 0.9, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.3 }
      );
    }
  }

  /* ------------------------------------------------------------------ */
  /* Scroll Pinning + Image Scale & Fade Scroll (showcase rail)         */
  /* ------------------------------------------------------------------ */
  function initShowcase() {
    const pin = document.getElementById("showcase-pin");
    const items = document.querySelectorAll("[data-showcase-item]");
    if (!pin || !items.length || reduceMotion) {
      items.forEach((el) => { el.style.opacity = 1; el.style.transform = "none"; });
      return;
    }

    if (window.innerWidth > 900) {
      ScrollTrigger.create({
        trigger: pin.closest(".showcase"),
        start: "top 120px",
        end: "bottom bottom",
        pin,
        pinSpacing: false,
      });
    }

    items.forEach((item) => {
      gsap.fromTo(
        item,
        { opacity: 0.2, scale: 0.92 },
        {
          opacity: 1,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            start: "top 82%",
            end: "top 40%",
            scrub: true,
          },
        }
      );
      gsap.to(item, {
        opacity: 0.25,
        scale: 0.94,
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "bottom 35%",
          end: "bottom 5%",
          scrub: true,
        },
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Horizontal accordion: hover on desktop, tap on touch                */
  /* ------------------------------------------------------------------ */
  function initAccordion() {
    const slices = document.querySelectorAll("#plan-accordion [data-slice]");
    if (!slices.length) return;
    function activate(target) {
      slices.forEach((s) => s.classList.toggle("is-active", s === target));
    }
    slices.forEach((slice) => {
      slice.addEventListener("mouseenter", () => {
        if (window.matchMedia("(hover: hover)").matches) activate(slice);
      });
      slice.addEventListener("click", () => activate(slice));
    });
  }

  /* ------------------------------------------------------------------ */
  /* Testimonial carousel                                                */
  /* ------------------------------------------------------------------ */
  const TESTIMONIALS = [
    {
      quote: "以前用三个 App 记录训练，动作查一个，重量记一个，社区打卡又是另一个。锋燃把这些拼成一个界面之后，我反而更愿意每天打开看一眼。",
      name: "阿泽",
      meta: "推日 · 训练第 96 天",
      hue: 24,
    },
    {
      quote: "深蹲加重之后膝盖角度总是不对，问了一下 AI 教练，它直接指出我重心靠前的问题，比我自己瞎琢磨半小时有用。",
      name: "夏至",
      meta: "腿日 · 训练第 214 天",
      hue: 265,
    },
    {
      quote: "训练统计那页把每周的容量变化画成图之后，我才发现自己有一段时间其实一直在退步，不是感觉上的那种模糊印象。",
      name: "阿贾",
      meta: "拉日 · 训练第 152 天",
      hue: 205,
    },
    {
      quote: "社区里看到别人也在练同样的动作、遇到同样的卡点，比单纯看教学视频更有动力继续下去。",
      name: "米粒",
      meta: "有氧 · 训练第 63 天",
      hue: 340,
    },
  ];

  function initTestimonials() {
    const quoteEl = document.getElementById("testi-quote");
    const authorEl = document.getElementById("testi-author");
    const navEl = document.getElementById("testi-nav");
    const prevBtn = document.getElementById("testi-prev");
    const nextBtn = document.getElementById("testi-next");
    if (!quoteEl) return;

    let index = 0;

    function render() {
      const t = TESTIMONIALS[index];
      quoteEl.textContent = `"${t.quote}"`;
      authorEl.innerHTML = `
        <span class="testimonial__avatar" style="background:linear-gradient(135deg,hsl(${t.hue} 68% 52%),hsl(${t.hue + 24} 62% 40%))">${t.name.charAt(0)}</span>
        <span>
          <span class="testimonial__name" style="display:block;">${t.name}</span>
          <span class="testimonial__meta">${t.meta}</span>
        </span>
      `;
      navEl.querySelectorAll(".testimonial__dot").forEach((d, i) => d.classList.toggle("is-active", i === index));
      if (!reduceMotion) {
        gsap.fromTo(quoteEl, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
      }
    }

    TESTIMONIALS.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "testimonial__dot";
      dot.setAttribute("aria-label", `第 ${i + 1} 条`);
      dot.addEventListener("click", () => { index = i; render(); });
      navEl.appendChild(dot);
    });

    prevBtn.addEventListener("click", () => { index = (index - 1 + TESTIMONIALS.length) % TESTIMONIALS.length; render(); });
    nextBtn.addEventListener("click", () => { index = (index + 1) % TESTIMONIALS.length; render(); });

    render();

    let autoplay = setInterval(() => { index = (index + 1) % TESTIMONIALS.length; render(); }, 6000);
    const section = document.getElementById("voices");
    section.addEventListener("mouseenter", () => clearInterval(autoplay));
  }

  /* ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    initMarquee();
    initReveals();
    initShowcase();
    initAccordion();
    initTestimonials();
  });
})();
