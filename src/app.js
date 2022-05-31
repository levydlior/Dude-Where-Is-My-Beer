

const details = document.querySelector('#brewry-details')
const randomBtn = document.getElementsByName('random-brewery')

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

randomBtn.addEventListener('click', () => {


})
