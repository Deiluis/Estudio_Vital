const navBars = document.querySelector('.nav__bars');
const navList = document.querySelector('.nav__list');

navBars.addEventListener("click", () => {
    navBars.classList.toggle('fa-xmark');
    navBars.style.transition = "transform 0.4s";

    if (!navList.classList.contains('nav__list--show')) {
        navBars.style.transform = "rotate(90deg)";
    } else {
        navBars.style.transform = "rotate(0)";
    }

    navList.classList.toggle('nav__list--show');
});