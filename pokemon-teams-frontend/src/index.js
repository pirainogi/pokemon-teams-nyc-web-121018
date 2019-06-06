const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
//TRAINERS_URL is just a concatenation of the base url and the /trainers route
const POKEMONS_URL = `${BASE_URL}/pokemons`
// POKEMONS_URL is just a concatenation of the base url and the /pokemons route



// we're going to add an event listened after the DOM has loaded
// so that all of our functionality is loaded after the initial DOM
window.addEventListener('DOMContentLoaded', (event) => {

// ** LOCAL VARIABLES ** //

   let trainers = []
   // trainers is an array of all of the trainers
   // that we will fetch from the API
   const trainerContainer = document.querySelector("main")
   // this is an element on the DOM that we will add all of our trainers to
   // i.e. the CONTAINER for all the trainers (++ good variable name)

// ** END OF LOCAL VARIABLES ** //


// ** FETCH REQUESTS ** //

  // LET'S MAKE A GET FETCH TO GRAB OUR TRAINERS AND THEIR TEAMS //
  // we're creating a function expression here!!
  const request = fetch(TRAINERS_URL, {method: "GET"}
  )
  // we're going to send a GET request to API, hitting the TRAINERS path
  .then(response => response.json())
  // THEN (hint, hint, THEN) we will return the promise and parse into JSON
  .then(trainerData => {
    // console.log('these are my trainers', trainers);
    trainers = trainerData
    // THEN (hint, hint) we will set the returned trainers from the API
    // equivalent to our trainers array (LOCAL VARIABLE)
    displayTrainers(trainers)
    // here we are calling our DISPLAYTRAINERS function and passing in the
    // local trainers variable (the ARRAY) that we just updated
  })

  // LET'S POST A FETCH TO ADD A POKEMON TO A TRAINER'S TEAM //
  // we're creating a function declaration here //
  function addAPokemonFetch(trainerID) {
    // we're initially passing in the trainer ID so that the POST request
    // knows which trainer team to add the pokemon to //
    fetch(POKEMONS_URL, {
      method: "POST",
      // POST should be written in ALL CAPS!!!! //
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // your headers need to be written exactly as above //
      // if you're not sure how to write these perfectly LOOK THEM UP //
      body: JSON.stringify({
        trainer_id: trainerID
      })
      // the body of your fetch should tell the request exactly //
      // what you're sending, so here, we need to tell our API //
      // the trainer ID because the CREATE METHOD IN OUR POKEMON CONTROLLER //
      // requires the trainer ID //
    })
    .then(response => response.json())
    // THEN (hint, hint, THEN) we will return the promise and parse into JSON //
    .then(pokemon => {
    // THEN (hint, hint) we need to add the NEW pokemon that is RETURNED FROM THE API //
    // to the DOM //
      let trainerList = document.getElementById(`trainer ${trainerID}`)
      trainerList.innerHTML += `<li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`
      // first, find the trainer's card's <ul> element on the DOM //
      // we did this by creating an id in the HTML below //
      // second, add the <li> with the pokemon's interpolted info to the DOM //
      // by adding it to the innerHTML of the <ul> that we just found //
    })
  }

  // LET'S SEND A FETCH TO DELETE A POKEMON FROM A TRAINER'S TEAM //
  // we're creating a function declaration here //
  function deletePokemonFetch(pokemonID) {
    // we're initially passing in the pokemon ID so that the DELETE request //
    // knows WHICH pokemon to delete //
    fetch(`${POKEMONS_URL}/${pokemonID}`, {
      // we're sending a request to the DELETE path //
      // by interpolating the pokemon ID into the route //
      method: "DELETE"
      // THIS SHOULD BE WRITTEN IN ALL CAPS! //
    })
    .then(response => response.json())
    // THEN (hint, hint, THEN) we will return the promise and parse into JSON //
    .then(pokemon => {
    // THEN (hint, hint) the promise will return the pokemon //
    // that we deleted from the API //
      // console.log(pokemon);
      document.getElementById(`pokemon ${pokemon.id}`).remove()
      // first, find the specific pokemon's <li> element on the DOM //
      // we did this by creating an id in the HTML below //
      // second, remove it from the DOM //
    })
  }

// ** END OF FETCH REQUESTS ** //


// ** EVENT LISTENERS ** //

  // LET'S ADD AN EVENT LISTENER TO THE TRAINER CONTAINER //
  // we're adding the event listener FURTHER up than either of the buttons //
  // so that the container can listened to ALL of the clicks //
  // for either ADD or RELEASE //
  // ** BUBBLING MAKES THIS WORK ** //
  trainerContainer.addEventListener("click", e => {
    // we're adding a click listener //
    e.preventDefault()
    // we're adding preventDefault() so that the default action doesn't fire //
    // console.log('click', e.target.dataset.trainerId);
    if(e.target.className === "add-btn") {
      // if the event's target's classname is equivalent to "add-btn" //
      // then do the action below //
      // console.log('clicked the right thing');
      addAPokemonFetch(e.target.dataset.trainerId)
      // call the addAPokemonFetch function and feed it the trainer ID //
      // that we added to the button's HTML below //
    }
    else if(e.target.className === "release"){
      // if the event's target's classname is equivalent to "release" //
      //then do the action below //
      // console.log('clicked the release button', e.target);
      deletePokemonFetch(e.target.dataset.pokemonId)
      // call the deletePokemonFetch function and feed it the pokemon ID //
      // that we can access via the data-pokemon-id in the HTML below //
    }
  })

// ** END OF THE EVENT LISTENERS ** //


// ** UPDATE THE DOM ** //

  // LET'S RENDER SOME TRAINERS AND THEIR POKEMON TEAMS ON THE DOM //
  // we can do this by giving the function all of the trainers //
  // and mapping over each trainer, passing in their info //
  // to the pure functions below that create HTML //
  // and update the inner HTML of the entire trainer container //
  function displayTrainers(trainers) {
    // the argument that we're passing in when we call this function above //
    // in the REQUEST function //
    // are the trainers we're getting back from the API //
    let trainerHTML = trainers.map(trainer => renderTrainer(trainer))
    // for each trainer, pass in the info to the renderTrainer function below //
    // and save it to the variable trainerHTML
    // console.log(trainerHTML);
    trainerContainer.innerHTML = trainerHTML.join('')
    // set the innerHTML of the trainerContainer to be equivalent to the trainerHTML //
    // HTML that we just created above //
    // and join every string together //
    // the browser is smart enough to create HTML based on the string //
  }

// ** END OF UPDATING THE DOM ** //


// ** PURE FUNCTIONS ** //

  // LET'S CREATE SOME HTML FOR EVERY POKEMON ON A TRAINER'S TEAM //
  // we are passing in an array of pokemons (PLURAL) from the API data //
  // that we set equal to the local variable 'trainers' //
  // and returning a string //
  function displayTrainersPokemon(pokemons) {
    let pokeHTML = pokemons.map(pokemon => {
      // for every pokemon in the pokemon array //
      // map over each pokemon and set it equal to the local variable pokeHTML //
      return `
        <li id="pokemon ${pokemon.id}">${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>
      `
      // return the string of HTML with the interpolated pokemon data //
      // for each pokemon in the array that we've mapped over
    })
    // console.log('HTML', pokeHTML);
    return pokeHTML.join('')
    // return a joined string of HTML
  }

  // LET'S CREATE SOME HTML FOR EVERY TRAINER //
  // WE NEED TO GET ASK THE ABOVE FUNCTION FOR THE POKEMON //
  // WE CANNOT HARDCODE THE POKEMON BECAUSE WE DON'T KNOW //
  // HOW MANY POKEMON EACH TRAINER HAS //
  function renderTrainer(trainer) {
    // return the below string with the trainer info interpolated //
    // we call the displayTrainersPokemon function below so that it creates //
    // the individual pokemon's <li> element within the trainer's HTML //
    return `
      <div class="card" data-id="${trainer.id}"><p>${trainer.name}</p>
        <button class="add-btn" data-trainer-id="${trainer.id}">Add Pokemon</button>
        <ul id="trainer ${trainer.id}">
          ${displayTrainersPokemon(trainer.pokemons)}
        </ul>
      </div>
    `
  }

 // ** END OF PURE FUNCTIONS ** //


}); // end of DOM CONTENT LOADED //
