'use strict';

const input = document.querySelector('.input');
const btn = document.querySelector('.btn');
const results = document.querySelector('.results');
const temps = document.querySelector('.temps')
const celsius = document.querySelector('.celsius')
const cards = document.querySelector('.cards');
const container = document.querySelector('.container')
const message = document.querySelector('.message');
const logo = document.querySelector('.logo');


logo.addEventListener('click',()=> {
  container.style.display = 'flex';
  cards.style.display = 'none';
})



// Creation d'une function pout la meteo
const meteoFun = function(city){
  cards.innerHTML = "";
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2521e64289208e681d392934a06cd2cd`, {
    method: "POST",
    body: JSON.stringify({ query: input.value, hitsPerPage: '0'}) })
    .then(response => {
      if(response.status < 200 || response.status >300){
        throw Error("Desole, on n'a pas trouvé de ville, tappez sur le logo pour continuer")
      }
      return response.json();
    })
    .then((meteo) => {
    let weather = meteo.weather[0].description[0].toUpperCase() + meteo.weather[0].description.slice(1);
    let icons = meteo.weather[0].description;
    let temperatureMax = meteo.main.temp_max;
    let temperatureMin = meteo.main.temp_min;
    let vitesse = meteo.wind.speed;
      // ajouter des elements dans un div
      cards.insertAdjacentHTML("beforeend",
      `<article class="card">
      <div class="block">
      <p class="temps">Température</p>
      </div>
      <div class="images">
      <img src="img/temperature.svg" alt="temperature">
      <p class="celsius">max ${Math.trunc(temperatureMax - 273,15)}°</p>
      <p class="celsius">min ${Math.trunc(temperatureMin - 273,15)}°</p>
      </div>
      </article>
      <article class="card">
      <div class="block">
      <p class="temps">${weather}</p>
      </div>
      <div class="images">
      <img src="http://openweathermap.org/img/wn/${meteo.weather[0].icon}@2x.png" alt="${meteo.weather.icon}">
      <p class="celsius">${meteo.main.temp - 273,15}°</p>
      </div>
      </article>
      <article class="card">
      <div class="block">
      <p class="temps">Vent</p>
      </div>
      <div class="images">
      <img src="img/wind.svg" alt="wind">
      <p class="celsius">${Math.trunc(vitesse)} km/h</p>
      </div>
      </article>
      `);
  }).catch(err => alert(err));
};

///// Autocompletion
function autoCompletion(letter){
  results.innerHTML = "";
  fetch("https://places-dsn.algolia.net/1/places/query", {
  method: "POST",
  body: JSON.stringify({ query: input.value, hitsPerPage: '3' })
  })
  .then(response => {
    return response.json();
    })
    .then((data) => {
      data.hits.forEach((elem) => {
      let city = (elem.locale_names.default[0]);
      results.insertAdjacentHTML("beforeend",
        `<button class="elementOfListCity">${city ?? elem.locale_names.district}</button>`);
      });
      // creation des constantes pour les utileser à l'avenir 
    const listCity = document.querySelectorAll(".elementOfListCity")
    for (let i = 0; i < listCity.length; i++) {
      const elementCity = listCity[i];
      elementCity.addEventListener("click", (event)=>{
      // demande un function de la meteo
      input.value = elementCity.textContent;
      meteoFun(input.value);
      container.style.display = 'none';
      cards.style.display = 'flex';
      })
    }
  }).catch(err => console.warn(err));
};
input.addEventListener('keyup',()=> {
  autoCompletion(input.value);
});