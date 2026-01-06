document.addEventListener("DOMContentLoaded", () => {
  const layers = document.querySelectorAll(".layer");
  const status = document.getElementById("status");
  const blackout = document.getElementById("blackout");

  let index = 0;
  let locked = false;
  let idleTime = 0;
  let punished = false;

  const messages = [
    "INITIALIZING",
    "BUFFERING",
    "DESYNC",
    "PACKET LOSS",
    "MEMORY LEAK",
    "UNSTABLE"
  ];

  let m = 0;
  setInterval(() => {
    status.textContent = messages[m % messages.length];
    m++;
  }, 800);

  function show(i) {
    layers.forEach(l => l.classList.remove("active"));
    if (layers[i]) layers[i].classList.add("active");
  }
  show(index);

  function corrupt(el) {
    const text = el.dataset.text.split("");
    let chars = [...text];

    const int = setInterval(() => {
      const i = Math.floor(Math.random() * chars.length);
      chars[i] = Math.random() > 0.5 ? "█" : "";
      el.textContent = chars.join("");
    }, 30);

    setTimeout(() => {
      clearInterval(int);
      el.textContent = el.dataset.text;
    }, 700);
  }

  window.addEventListener("wheel", () => {
    idleTime = 0;
    if (locked) return;
    locked = true;

    if (Math.random() > 0.6) {
      blackout.style.opacity = 1;
      setTimeout(() => blackout.style.opacity = 0, 250);
    }

    if (!punished && index > 2 && Math.random() > 0.7) {
      index = 1;
      punished = true;
    } else {
      index++;
    }

    if (index >= layers.length) index = layers.length - 1;

    show(index);
    corrupt(layers[index]);

    setTimeout(() => locked = false, 700);
  });

  setInterval(() => {
    idleTime++;

    if (idleTime === 4) {
      layers.forEach(l => l.classList.remove("active"));
      document.querySelector(".hidden").classList.add("active");
    }

    if (idleTime > 6 && Math.random() > 0.7) {
      blackout.style.opacity = 1;
      setTimeout(() => {
        blackout.style.opacity = 0;
        index = 0;
        show(index);
      }, 800);
    }
  }, 1000);

  setInterval(() => {
    document.body.style.filter =
      `contrast(${1 + Math.random()}) hue-rotate(${Math.random() * 360}deg)`;

    setTimeout(() => {
      document.body.style.filter = "none";
    }, 150);
  }, 1600);
});
