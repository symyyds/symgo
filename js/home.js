(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initReveal() {
    const elements = [...document.querySelectorAll(".reveal")];
    if (reducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.04, rootMargin: "0px 0px -3% 0px" });

    elements.forEach((element) => observer.observe(element));
  }

  function initCopyEmail() {
    const button = document.querySelector("main [data-copy-email]");
    const toast = document.querySelector(".home-toast");
    if (!button || !toast) return;
    let timer;

    button.addEventListener("click", async () => {
      const email = button.dataset.copyEmail;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          const input = document.createElement("input");
          input.value = email;
          input.style.position = "fixed";
          input.style.opacity = "0";
          document.body.appendChild(input);
          input.select();
          document.execCommand("copy");
          input.remove();
        }
        toast.textContent = "邮箱已复制";
      } catch {
        toast.textContent = `复制失败，请手动复制：${email}`;
      }
      toast.classList.add("is-visible");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
    });
  }

  initReveal();
  initCopyEmail();
})();
