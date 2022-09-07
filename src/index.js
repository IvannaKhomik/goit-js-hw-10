import './css/styles.css';
// Import
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountry } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('input#search-box');
const list = document.querySelector('.country-list');
const card = document.querySelector('.country-info');

input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(e) {
  const value = e.target.value.trim();
  if (input.value === '') {
    list.innerHTML = '';
    card.innerHTML = '';
    return;
  }
  fetchCountry(value)
    .then(data => {
      renderCountry(data);
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
    });
}

const renderList = data => {
  list.innerHTML = '';
  card.innerHTML = '';

  const items = data
    .map(
      ({
        flags: { svg },
        name: { official },
      }) => `<li class="country-list-item">
    <img class="country-flag" src="${svg}" alt="${official}" width="26px">
    <div class="country-name">${official}</div>
  </li>`
    )
    .join('');
  list.insertAdjacentHTML('afterbegin', items);
};

const renderCard = data => {
  list.innerHTML = '';
  card.innerHTML = '';

  const item = data
    .map(
      ({
        flags: { svg },
        name: { official },
        capital,
        population,
        languages,
      }) => `<div class="country-item">
    <img class="country-flag" src="${svg}" alt="${official}" width="26px">
    <div class="country-name">${official}</div>
  </div>
  <ul>
  <li class="country-desc"><span>Capital: </span>${capital}</li>
  <li class="country-desc"><span>Population: </span>${population}</li>
  <li class="country-desc"><span>Languages: </span>${Object.values(
    languages
  ).join(', ')}</li>
  </ul>`
    )
    .join('');

  card.insertAdjacentHTML('afterbegin', item);
};

function renderCountry(data) {
  if (data.length > 1 && data.length <= 10) {
    renderList(data);
  } else if (data.length === 1) {
    renderCard(data);
  } else if (data.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  }
}
