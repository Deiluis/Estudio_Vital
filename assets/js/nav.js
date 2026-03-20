const navOpenBtn = document.querySelector('.nav__btn--open');
const navCloseBtn = document.querySelector('.nav__btn--close');
const navList = document.querySelector('.nav__list');
const navLinks = document.querySelectorAll('.nav__list a');

const toggleNavBar = () => {
    navOpenBtn.classList.toggle('rotate-90');
    navOpenBtn.classList.toggle('opacity-0');
    navOpenBtn.classList.toggle('z-[-1]');
    navCloseBtn.classList.toggle('rotate-90');
    navCloseBtn.classList.toggle('opacity-0');
    navCloseBtn.classList.toggle('z-[-1]')
    navList.classList.toggle('-ml-[100%]');
};

navOpenBtn.addEventListener("click", toggleNavBar);
navCloseBtn.addEventListener("click", toggleNavBar);

navLinks.forEach(navLink =>
    navLink.addEventListener("click", toggleNavBar)
);