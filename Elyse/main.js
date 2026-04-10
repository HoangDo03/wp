/**
 * Luxuo Longform Template - Interactivity
 * Focus: Scroll Reveal & Smooth Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initParallax();
});

/**
 * Intersection Observer for Reveal Animations
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once the element is revealed, we can stop observing it
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null, // use the viewport
    threshold: 0.15, // trigger when 15% of the element is visible
    rootMargin: '0px 0px -50px 0px' // offset to trigger slightly before/after
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
}

/**
 * Subtle Parallax for Background Image
 */
function initParallax() {
  const heroImg = document.querySelector('.hero-img');
  
  window.addEventListener('scroll', () => {
    const scrollPos = window.pageYOffset;
    if (heroImg) {
      // Move the hero image slower than the rest of the page
      heroImg.style.transform = `translateY(${scrollPos * 0.3}px)`;
    }
  });
}

/**
 * Smooth Scroll for internal links (if any)
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
