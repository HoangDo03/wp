document.addEventListener('DOMContentLoaded', () => {

  window.addEventListener('scroll', () => {
    document.body.classList.toggle('is-scrolled', window.scrollY > 0);
  });

  // const hiddenMenu = document.getElementById('hiddenMenu');
  // const toggleBtn = document.querySelector('.hidden-menu-toggle');
  // const closeBtn  = document.querySelector('.hidden-menu-close');
  const cursor    = document.getElementById('cursor');

  // if (toggleBtn && hiddenMenu) {
  //   toggleBtn.onclick = () => hiddenMenu.classList.add('active');
  // }

  // if (closeBtn && hiddenMenu) {
  //   closeBtn.onclick = () => hiddenMenu.classList.remove('active');
  // }

  let virtualScroll = 0;
  let easedScroll = 0;

  window.addEventListener('mousemove', (e) => {
    if (!cursor) return;
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });

  window.addEventListener('wheel', (e) => {
    virtualScroll += e.deltaY;
  }, { passive: true });

  function renderCursor() {
    easedScroll += (virtualScroll - easedScroll) * 0.06;
    const velocity = Math.abs(virtualScroll - easedScroll);

    if (cursor) {
      cursor.style.transform =
        `translate(-50%, -50%) scale(${1 + velocity * 0.015})`;
    }

    requestAnimationFrame(renderCursor);
  }

  renderCursor();
});
 const toggle = document.getElementById("mobile-menu-btn");
        const menu = document.getElementById("menu_mobile");

        toggle.addEventListener("click", () => {
            menu.classList.toggle("active");
            toggle.classList.toggle("active");

        });