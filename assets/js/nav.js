const navBars = document.querySelector('.nav__bars');
const navList = document.querySelector('.nav__list');
const navLinks = document.querySelectorAll('.nav__list a');

const toggleNavBar = () => {
    navBars.classList.toggle('fa-xmark');
    navBars.style.transition = "transform 0.4s";

    if (navList.classList.contains('-ml-[100%]')) {
        navBars.style.transform = "rotate(90deg)";
    } else {
        navBars.style.transform = "rotate(0)";
    }

    navList.classList.toggle('-ml-[100%]');
};

navBars.addEventListener("click", toggleNavBar);

navLinks.forEach((navLink) => {
    navLink.addEventListener("click", toggleNavBar);
});