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
