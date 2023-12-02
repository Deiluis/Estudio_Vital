const slider = document.querySelector(".slider__container");
let sliderSection = document.querySelectorAll(".slider__section");
let sliderSectionLast = sliderSection[sliderSection.length -1];

const buttonLeft = document.querySelector(".slider__button--left");
const buttonRight = document.querySelector(".slider__button--right");

let intervalo;
let delaySiguiente = 500;
let delayAnterior = 500;

//Inserta la ultima foto del slider, como primera.
slider.insertAdjacentElement('afterbegin', sliderSectionLast);

const siguiente = () => {

    //Obtiene la primera foto del slider y la mueve a la izquierda con el margin-left.
    let sliderSectionFirst = document.querySelectorAll(".slider__section")[0];
    slider.style.marginLeft = "-200%";
    slider.style.transition = "margin-left 1s";

    //Establece el tiempo que toma cada imagen en moverse a la izquierda.
    setTimeout(() => {
        slider.style.transition = "none";

        //Inserta la primera foto del slider, como ultima.
        slider.insertAdjacentElement('beforeend', sliderSectionFirst);
        slider.style.marginLeft = "-100%";
    }, 1000);
}

const anterior = () => {

    //Obtiene la ultima foto del slider y la mueve a la derecha con el margin-left.
    let sliderSection = document.querySelectorAll(".slider__section");
    let sliderSectionLast = sliderSection[sliderSection.length -1];
    slider.style.marginLeft = "0";
    slider.style.transition = "margin-left 1s";

    //Establece el tiempo que toma cada imagen en moverse a la dercha.
    setTimeout(()=>{
        slider.style.transition = "none";

        //Inserta la ultima foto del slider, como primera.
        slider.insertAdjacentElement('afterbegin', sliderSectionLast);
        slider.style.marginLeft = "-100%";
    }, 1000);
}

/*
    Establece un intervalo de cada cuanto tiempo se puede volver a hacer click.
    Esto se hace para evitar que el usuario clickee reiteradas veces y se produzcan cambios bruscos en las fotos.
*/
setInterval(() => {

    buttonRight.addEventListener('click', () => {
        siguiente();
        //Reinicia el intervalo de tiempo para evitar bugs en las fotos.
        clearInterval(intervalo);
        iniciarIntervalo();
        delaySiguiente = 1000;
    });

    delaySiguiente = 500;

}, delaySiguiente);


setInterval(() => {

    buttonLeft.addEventListener('click', () => {
        anterior();
        clearInterval(intervalo);
        iniciarIntervalo();
        delayAnterior = 1000;
    });

    delayAnterior = 500;

}, delayAnterior);

//Indica cuanto tardara en avanzar el slider a la siguiente foto.
const iniciarIntervalo = () => {
    intervalo = setInterval(() => {
        siguiente();
    }, 6500);
}

//Inicia por defecto el movimiento automático de las fotos.
iniciarIntervalo();