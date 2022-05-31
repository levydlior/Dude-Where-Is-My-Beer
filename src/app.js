
const details = document.querySelector('#brewry-details')
const randomBtn = document.querySelector('#random-brewery-button')

const renderBreweryDetails = brewery => {

    const cardDetails = document.createElement('div')
    const breweryName = document.createElement('h1')
    const breweryStreet = document.createElement('h2')
    const breweryCity = document.createElement('h3')
    const breweryState = document.createElement('h4')
    const breweryZipCode = document.createElement('h5')
    const breweryWebsite = document.createElement('h6')

    breweryName.textContent = brewery.name
    breweryStreet.textContet = brewery.street
    breweryCity.textContent = brewery.city
    breweryState.textContent = brewery.state
    breweryZipCode.textContent = brewery.postal_code
    breweryWebsite.textContent = brewery.website_url

    cardDetails.append(breweryName, breweryStreet, breweryCity, breweryState, breweryZipCode, breweryWebsite)
    details.append(cardDetails)
}

let zipCode = "";
const zipForm = document.querySelector("#form-by-zip");
const dropDown = document.querySelector("#brew-drop-down");

function fetchZipBrew() {
  fetch(
    `https://api.openbrewerydb.org/breweries?by_postal=${zipCode}&per_page=25`
  )
    .then((response) => response.json())
    .then((brewries) => {
      brewries.forEach((brewery) => {
        renderBrewToDropDown(brewery);
      });
    });
}

function renderBrewToDropDown(brewery) {
  const brewOptions = document.createElement("option");
  brewOptions.textContent = brewery.name;
  brewOptions.value = brewery.name;
  dropDown.append(brewOptions);
}

zipForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const zipInput = document.querySelector("#zip-code");
  zipCode = zipInput.value;
  dropDown.replaceChildren();

  fetchZipBrew();
  zipForm.reset();
});


function fetchRandomBrewery() {
    fetch(
      'https://api.openbrewerydb.org/breweries/random'
    )
      .then((response) => response.json())
      .then((brewries) => {
        brewries.forEach((brewery) => {
          renderBreweryDetails(brewery);
        })
      })
  }

  randomBtn.addEventListener('click', () => {

    fetchRandomBrewery()

  })
