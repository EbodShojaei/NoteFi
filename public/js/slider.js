// Slider function dictates max number of statements
// create a range input element
const slider = document.createElement('input');

// set attributes for the slider
slider.type = 'range';
slider.min = '1';
slider.max = '3';
slider.value = '1';
slider.step = '1';

// add the slider to the DOM
document.getElementById('slider').appendChild(slider);
