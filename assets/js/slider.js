const slider = document.querySelector(".slider__container");
let sliderSection = document.querySelectorAll(".slider__section");
let sliderSectionLast = sliderSection[sliderSection.length -1];

const buttonLeft = document.querySelector(".slider__button--left");
const buttonRight = document.querySelector(".slider__button--right");

let intervalo;
let delaySiguiente = 500;
let delayAnterior = 500;

let isAnimating = false;

//Inserta la ultima foto del slider, como primera.
slider.insertAdjacentElement('afterbegin', sliderSectionLast);

const siguiente = () => {
    if (!isAnimating)
        isAnimating = true;

    //Obtiene la primera foto del slider y la mueve a la izquierda con el margin-left.
    let sliderSectionFirst = document.querySelectorAll(".slider__section")[0];
    slider.style.marginLeft = "-200%";
    slider.style.transition = "margin-left 1s ease-in-out";

    //Establece el tiempo que toma cada imagen en moverse a la izquierda.
    setTimeout(() => {
        slider.style.transition = "none";

        //Inserta la primera foto del slider, como ultima.
        slider.insertAdjacentElement('beforeend', sliderSectionFirst);
        slider.style.marginLeft = "-100%";

        isAnimating = false;
    }, 1000);
}

const anterior = () => {
    if (!isAnimating)
        isAnimating = true;

    //Obtiene la ultima foto del slider y la mueve a la derecha con el margin-left.
    let sliderSection = document.querySelectorAll(".slider__section");
    let sliderSectionLast = sliderSection[sliderSection.length -1];
    slider.style.marginLeft = "0";
    slider.style.transition = "margin-left 1s ease-in-out";

    //Establece el tiempo que toma cada imagen en moverse a la dercha.
    setTimeout(()=> {
        slider.style.transition = "none";

        //Inserta la ultima foto del slider, como primera.
        slider.insertAdjacentElement('afterbegin', sliderSectionLast);
        slider.style.marginLeft = "-100%";

        isAnimating = false;
    }, 1000);
}

/*
    Establece un intervalo de cada cuanto tiempo se puede volver a hacer click.
    Esto se hace para evitar que el usuario clickee reiteradas veces y se produzcan cambios bruscos en las fotos.
*/
setInterval(() => {

    buttonRight.addEventListener('click', () => {
        if (!isAnimating)
            siguiente();
        //Reinicia el intervalo de tiempo para evitar bugs en las fotos.
        clearInterval(intervalo);
        iniciarIntervalo();
        delaySiguiente = 1500;
    });

    delaySiguiente = 1000;

}, delaySiguiente);


setInterval(() => {

    buttonLeft.addEventListener('click', () => {
        if (!isAnimating)
            anterior();
        clearInterval(intervalo);
        iniciarIntervalo();
        delayAnterior = 1500;
    });

    delayAnterior = 1000;

}, delayAnterior);

//Indica cuanto tardara en avanzar el slider a la siguiente foto.
const iniciarIntervalo = () => {
    intervalo = setInterval(() => {
        if (!isAnimating)
            siguiente();
    }, 6500);
}

//Inicia por defecto el movimiento automático de las fotos.
iniciarIntervalo();