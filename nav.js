const button = document.querySelector('.hamburger');
const menu = document.querySelector('.menu');

button.addEventListener('click', () => {
    menu.classList.toggle('open');
    button.classList.toggle('open');

    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !expanded);
});