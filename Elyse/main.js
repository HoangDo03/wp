document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initParallax();
});

function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
       
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null,
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
}

// function initParallax() {
//   const heroImg = document.querySelector('.hero-img');
  
//   window.addEventListener('scroll', () => {
//     const scrollPos = window.pageYOffset;
//     if (heroImg) {
     
//       heroImg.style.transform = `translateY(${scrollPos * 0.3}px)`;
//     }
//   });
// }

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});