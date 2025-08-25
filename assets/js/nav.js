const header = document.querySelector('#header');
const navBars = document.querySelector('.nav__bars');
const navList = document.querySelector('.nav__list');
const navLinks = document.querySelectorAll('.nav__list a');

let inHero = true;

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

window.addEventListener("scroll", () => {
    if (inHero) {
        if (window.scrollY >= window.screen.availHeight) {
            inHero = false;
            header.classList.toggle("bg-transparent");
            header.classList.toggle("backdrop-blur-lg");
            header.classList.toggle("bg-white");

            navList.classList.toggle("bg-transparent");
            navList.classList.toggle("backdrop-blur-lg");
            navList.classList.toggle("bg-white");
        }
    } else {
        if (window.scrollY < window.screen.availHeight) {
            inHero = true;
            header.classList.toggle("bg-transparent");
            header.classList.toggle("backdrop-blur-lg");
            header.classList.toggle("bg-white");

            navList.classList.toggle("bg-transparent");
            navList.classList.toggle("backdrop-blur-lg");
            navList.classList.toggle("bg-white");
        }
    }
})