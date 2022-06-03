//getting elemnts from the html to js/dom
const details = document.querySelector("#brewry-details");
const randomBtn = document.querySelector("#random-brewery-button");
const zipForm = document.querySelector("#form-by-zip");
const dropDownZip = document.querySelector("#brew-drop-down");
const faveDropDown = document.querySelector("#favorites-drop-menu");
const removeBtn = document.querySelector("#remove-button");

//converting brew name into a fetable one
const converetedValue = (spesificDropDown) => {
  const dropValueSplit = spesificDropDown.value.split(" ");
  const dropValueWithDashes = dropValueSplit.join("_");
  return dropValueWithDashes;
};

//path for the zip fetch
let zipCode = "";

//fetching brews to the zip dropdown
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

//creates option element and populates them with the brewery names
function renderBrewToDropDownZip(brewery, dropMenu) {
  const brewOptions = document.createElement("option");

  brewOptions.textContent = brewery.name;
  brewOptions.value = brewery.name;
  brewOptions.id = brewery.id;
  dropMenu.append(brewOptions);
}

//search input for zip
zipForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const zipInput = document.querySelector("#zip-code");
  zipCode = zipInput.value;
  dropDownZip.replaceChildren();

  fetchZipBrew();
  zipForm.reset();
});

function fetchRandomBrewery() {
const randomURL = ["https://api.openbrewerydb.org/breweries/random",{ cache: "no-store" }]
fetchSpesificBewByName(randomURL)
}

randomBtn.addEventListener("click", () => {
  fetchRandomBrewery();
});

//creating elemnts, assging values and appending them to details section
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

  !brewery.street
    ? (breweryStreet.textContent = "Street: Unknown")
    : (breweryStreet.textContent = "Street: " + brewery.street);

  //function regex for phone formating a string into a presentable phone number
  function formatPhoneNumber(phoneNumberString) {
    let cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? "(" + match[1] + ") " + match[2] + "-" + match[3] : "Unkown";
  }

  breweryCity.textContent = "City: " + brewery.city;
  breweryState.textContent = "State: " + brewery.state;
  breweryZipCode.textContent = "Zip: " + brewery.postal_code;
  breweryPhone.textContent =
    "Phone Number: " + formatPhoneNumber(brewery.phone);

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
      faveDropDown.replaceChildren();
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
  const favoriteUrl =[ `https://api.openbrewerydb.org/breweries?by_name=${converetedValue(
    faveDropDown
  )}&per_page=3`]
  fetchSpesificBewByName(favoriteUrl);
});

function likeBtnEventListener(likeButton, brewery) {
  likeButton.addEventListener("click", () => {
    fetch("http://localhost:3000/favorites", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: brewery.name,
        zip: brewery.postal_code,
        id: brewery.id,
      }),
    })
      .then((response) => response.json())
      .then((favorite) => renderBrewToDropDownZip(favorite, faveDropDown));
  });
}

function fetchSpesificBewByName(urlPath) {
  
  fetch(...urlPath)
    .then((response) => response.json())
    .then((brewery) => {
      details.replaceChildren();
      renderBreweryDetails(brewery[0]);
    });
}

//event listener for the drop down change- another fetch request to popualte the details section
dropDownZip.addEventListener("change", () => {
  const breweryNameAndZipPath = [`https://api.openbrewerydb.org/breweries?by_name=${converetedValue(
    dropDownZip
  )}&by_postal=${zipCode}&per_page=3`]
  fetchSpesificBewByName(breweryNameAndZipPath);
});

removeBtn.addEventListener("click", () => {
  if (faveDropDown.value) {
    const favoriteValueId = faveDropDown.options[faveDropDown.selectedIndex].id;
    fetch(`http://localhost:3000/favorites/${favoriteValueId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        const cardDetailsSpot = document.querySelector("#card-details-brew");
        cardDetailsSpot.remove();
        fetchFavorites();
      });
  }
});
