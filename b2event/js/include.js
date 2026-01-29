document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-include]").forEach(el => {
    const file = el.getAttribute("data-include");

    fetch(`components/${file}.html`)
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.text();
      })
      .then(html => {
        el.innerHTML = html;

        
        el.dispatchEvent(new Event("componentLoaded"));
      })
      .catch(err => console.error(`Load ${file} error`, err));
  });
});
