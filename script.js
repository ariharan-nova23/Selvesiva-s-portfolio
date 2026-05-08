// HIDE NAVBAR ON SCROLL

let lastScroll = 0;

const navbar = document.querySelector("nav");

window.addEventListener("scroll", () => {

  let currentScroll = window.pageYOffset;

  if(currentScroll > lastScroll){

    navbar.classList.add("hide");

  } else {

    navbar.classList.remove("hide");

  }

  lastScroll = currentScroll;

});

// INTERACTIVE SKILL CARDS

const cards = document.querySelectorAll(".skill-card");

cards.forEach((card) => {

  card.addEventListener("mousemove", (e) => {

    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;

    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;

    const centerY = rect.height / 2;

    const rotateX = -(y - centerY) / 12;

    const rotateY = (x - centerX) / 12;

    card.style.transform = `
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-10px)
      scale(1.03)
    `;

  });

  card.addEventListener("mouseleave", () => {

    card.style.transform = `
      rotateX(0deg)
      rotateY(0deg)
      translateY(0px)
      scale(1)
    `;

  });

});

// PROJECT SCROLL STACK

const projectSection = document.querySelector(".projects");
const projectSlides = document.querySelectorAll("[data-project-slide]");

const updateProjectSlides = () => {

  if(!projectSection || projectSlides.length === 0){
    return;
  }

  const rect = projectSection.getBoundingClientRect();
  const scrollableDistance = projectSection.offsetHeight - window.innerHeight;
  const progress = Math.min(Math.max(-rect.top / scrollableDistance, 0), 1);
  const activeIndex = progress < 0.34 ? 0 : progress < 0.68 ? 1 : 2;

  projectSlides.forEach((slide, index) => {
    const depth = activeIndex - index;

    slide.classList.toggle("is-visible", index <= activeIndex);
    slide.classList.toggle("is-current", index === activeIndex);
    slide.classList.toggle("is-behind", index < activeIndex);
    slide.classList.toggle("is-behind-one", depth === 1);
    slide.classList.toggle("is-behind-two", depth === 2);
  });

};

window.addEventListener("scroll", updateProjectSlides);
window.addEventListener("resize", updateProjectSlides);
updateProjectSlides();
