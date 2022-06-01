const details = document.querySelector("#brewry-details");
const randomBtn = document.querySelector("#random-brewery-button");
const zipForm = document.querySelector("#form-by-zip");
const dropDownZip = document.querySelector("#brew-drop-down");
const faveDropDown = document.querySelector("#favorites-drop-menu");
const removeBtn = document.querySelector("#remove-button");

let zipCode = "";

function fetchZipBrew() {
  fetch(
    `https://api.openbrewerydb.org/breweries?by_postal=${zipCode}&per_page=25`
  )
    .then((response) => response.json())
    .then((brewries) => {
      const emptyOption = document.createElement("option");
      dropDownZip.append(emptyOption);
      brewries.forEach((brewery) => {
        renderBrewToDropDownZip(brewery, dropDownZip);
      });
    });
}

function renderBrewToDropDownZip(brewery, dropMenu) {
  const brewOptions = document.createElement("option");

  brewOptions.textContent = brewery.name;
  brewOptions.value = brewery.name;
  brewOptions.id = brewery.id
  dropMenu.append(brewOptions);
}

zipForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const zipInput = document.querySelector("#zip-code");
  zipCode = zipInput.value;
  dropDownZip.replaceChildren();

  fetchZipBrew();
  zipForm.reset();
});

function fetchRandomBrewery() {
  fetch("https://api.openbrewerydb.org/breweries/random", { cache: "no-store" })
    .then((response) => response.json())
    .then((brewery) => {
      details.replaceChildren();
      renderBreweryDetails(brewery[0])
    });
}

randomBtn.addEventListener("click", () => {
  fetchRandomBrewery();
  
});

function renderBreweryDetails(brewery) {
  const cardDetails = document.createElement("div");
  cardDetails.id = "card-details-brew";
  const breweryName = document.createElement("a");
  const breweryType = document.createElement("h3");
  const breweryStreet = document.createElement("p");
  const breweryCity = document.createElement("p");
  const breweryState = document.createElement("p");
  const breweryZipCode = document.createElement("p");
  const breweryPhone = document.createElement("p");
  const likeButton = document.createElement("button");

  if (!brewery.website_url) {
    breweryName.innerHTML = `<h2> ${brewery.name}</h2>`;
  } else {
    breweryName.href = brewery.website_url;
    breweryName.innerHTML = `<h2> ${brewery.name}</h2>`;
    breweryName.target = "_blank";
  }

  breweryType.textContent = "Brewery Type: " + brewery.brewery_type;

  if (!brewery.street) {
    breweryStreet.textContent = "Street: Unknown";
  } else {
    breweryStreet.textContent = "Street: " + brewery.street;

  }

  breweryCity.textContent = "City: " + brewery.city;
  breweryState.textContent = "State: " + brewery.state;
  breweryZipCode.textContent = "Zip: " + brewery.postal_code;
  breweryPhone.textContent = "Phone Number: " + brewery.phone;

  likeButton.textContent = "Favorite!";
  likeButton.id = "favorite-btn";

  likeBtnEventListener(likeButton, brewery, breweryName);

  cardDetails.append(
    breweryName,
    breweryType,
    breweryStreet,
    breweryCity,
    breweryState,
    breweryZipCode,
    breweryPhone,
    likeButton
  );
  details.append(cardDetails);
}

function fetchFavorites() {
  fetch("http://localhost:3000/favorites")
    .then((response) => response.json())
    .then((favoritesArray) => {
      faveDropDown.replaceChildren()
      const emptyOption = document.createElement("option");
      emptyOption.textContent = "";
      faveDropDown.appendChild(emptyOption);
      favoritesArray.forEach((favorite) => {
        renderBrewToDropDownZip(favorite, faveDropDown);
      });
    });
}
fetchFavorites();

faveDropDown.addEventListener("change", () => {
  fetchSpesificBewByName();
});

function likeBtnEventListener(likeButton, brewery, breweryName) {
  likeButton.addEventListener("click", () => {
    fetch("http://localhost:3000/favorites", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: brewery.name,
        zip: brewery.postal_code,
        id: brewery.id
      }),
    })
      .then((response) => response.json())
      .then((favorite) => renderBrewToDropDownZip(favorite, faveDropDown));
  });
}

function fetchSpesificBewByName() {
  const dropValueSplit = faveDropDown.value.split(" ");
  const dropValueWithDashes = dropValueSplit.join("_");

  fetch(
    `https://api.openbrewerydb.org/breweries?by_name=${dropValueWithDashes}&per_page=3`)
    .then((response) => response.json())
    .then((brewery) => {
      details.replaceChildren();
      renderBreweryDetails(brewery[0]);
    });
}

dropDownZip.addEventListener("change", () => {
  const dropValueSplit = dropDownZip.value.split(" ");
  const dropValueWithDashes = dropValueSplit.join("_");

  fetch(
    `https://api.openbrewerydb.org/breweries?by_name=${dropValueWithDashes}&by_postal=${zipCode}&per_page=3`
  )
    .then((response) => response.json())
    .then((brewery) => {
      details.replaceChildren();
      renderBreweryDetails(brewery[0]);
    });
});


removeBtn.addEventListener('click', () => {
  
  if (faveDropDown.value){
const favoriteValueId = faveDropDown.options[faveDropDown.selectedIndex].id
    fetch(`http://localhost:3000/favorites/${favoriteValueId}`, {
      method: 'DELETE'
    }).then(response => response.json())
      .then(newObject => {
        const cardDetailsSpot = document.querySelector('#card-details-brew')
        cardDetailsSpot.remove()
        fetchFavorites()
      })

  }
})