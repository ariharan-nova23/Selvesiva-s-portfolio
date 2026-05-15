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

  if (window.innerWidth <= 480) {
    projectSlides.forEach((slide) => {
      slide.classList.add("is-visible", "is-current");
      slide.classList.remove("is-behind", "is-behind-one", "is-behind-two");
    });
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

// TECH STACK SCROLL REVEAL

const techGroups = document.querySelectorAll(".tech-group");

if(techGroups.length){
  const techObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if(entry.isIntersecting){
        entry.target.classList.add("in-view");
      } else {
        entry.target.classList.remove("in-view");
      }
    });
  }, { threshold:0.3 });

  techGroups.forEach((group) => techObserver.observe(group));
}

// ================= EMAILJS INTEGRATION =================

// EMAILJS PUBLIC KEY
emailjs.init({
  publicKey: "rDB2jmNGrXGptya2o",
});

const contactForm = document.getElementById("contact-form");
const submitBtn = document.getElementById("submit-btn");
const formMessage = document.getElementById("form-message");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent default form submission

    // Get form values
    const firstName = contactForm.firstName.value.trim();
    const lastName = contactForm.lastName.value.trim();
    const email = contactForm.email.value.trim();
    const mobile = contactForm.mobile.value.trim();

    // Reset message
    formMessage.textContent = "";
    formMessage.className = "form-message";

    // 1. Validate Email (Modern Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFormMessage("Please enter a valid email address.", "error");
      return;
    }

    // 2. Validate Mobile (Basic numeric and length check)
    const mobileRegex = /^[0-9]{7,15}$/;
    if (!mobileRegex.test(mobile)) {
      showFormMessage("Please enter a valid mobile number.", "error");
      return;
    }

    // Update loading state
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = "SENDING...";
    submitBtn.disabled = true;

    // EMAILJS SERVICE ID AND TEMPLATE ID
    const serviceID = "service_r815j2g";
    const templateID = "template_eztd1h9";

    // Set up template parameters EXACTLY matching the EmailJS template
    const templateParams = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      mobile: mobile
    };

    // Send via EmailJS using explicit send method
    emailjs.send(serviceID, templateID, templateParams, {
      publicKey: "yFHGGjUMi8uZdfRA6",
    })
      .then((response) => {
        // Success
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        
        console.log("EmailJS SUCCESS!", response.status, response.text);
        
        showFormMessage("Message sent successfully!", "success");
        contactForm.reset(); // Reset form fields
      })
      .catch((error) => {
        // Error
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        
        // Log detailed error for debugging
        const errorText = error && error.text ? error.text : JSON.stringify(error);
        console.error("EmailJS ERROR Response:", errorText, error);
        
        showFormMessage("Failed to send message: " + errorText, "error");
      });
  });
}

function showFormMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
}

