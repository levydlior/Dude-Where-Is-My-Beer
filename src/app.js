const details = document.querySelector("#brewry-details");
const randomBtn = document.querySelector("#random-brewery-button");

let zipCode = "";
const zipForm = document.querySelector("#form-by-zip");
const dropDown = document.querySelector("#brew-drop-down");

function fetchZipBrew() {
  fetch(
    `https://api.openbrewerydb.org/breweries?by_postal=${zipCode}&per_page=25`
  )
    .then((response) => response.json())
    .then((brewries) => {
      const emptyOption = document.createElement("option");
      dropDown.append(emptyOption);
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
  fetch("https://api.openbrewerydb.org/breweries/random")
    .then((response) => response.json())
    .then(console.log);
}

randomBtn.addEventListener("click", () => {
  fetchRandomBrewery();
  details.replaceChildren();
});

function renderBreweryDetails(brewery) {
  const cardDetails = document.createElement("div");
  const breweryName = document.createElement("h2");
  const breweryStreet = document.createElement("p");
  const breweryCity = document.createElement("p");
  const breweryState = document.createElement("p");
  const breweryZipCode = document.createElement("p");
  const breweryWebsite = document.createElement("a");

  breweryName.textContent = brewery.name;
  breweryStreet.textContet = brewery.street;
  breweryCity.textContent = brewery.city;
  breweryState.textContent = brewery.state;
  breweryZipCode.textContent = brewery.postal_code;
  breweryWebsite.href = brewery.website_url;

  cardDetails.append(
    breweryName,
    breweryStreet,
    breweryCity,
    breweryState,
    breweryZipCode,
    breweryWebsite
  );
  details.append(cardDetails);
};


dropDown.addEventListener('change', ()=> {

  const dropValueSplit = dropDown.value.split(" ")
  const dropValueWithDashes = dropValueSplit.join("_")
  
  fetch(`https://api.openbrewerydb.org/breweries?by_name=${dropValueWithDashes}&by_postal=${zipCode}&per_page=3`)
    .then(response => response.json())
    .then(brewery => {
      details.replaceChildren()
      renderBreweryDetails(brewery[0])
    })

})