// ==UserScript==
// @name     Vaccine Aarhus N
// @version  1
// @grant    none
// @include *auh.dk/om-auh/tilbud-om-covid-vaccination-ved-brug-af-restvacciner*
// ==/UserScript==

const getCookieValue = (name) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
)


if (location.href === "https://www.auh.dk/om-auh/tilbud-om-covid-vaccination-ved-brug-af-restvacciner/?aarhusN"){
    const labels = Array.from(document.querySelectorAll('label').values());

    const nameLabel = labels.find(label => label.innerText === "Navn");
    nameLabel.control.value = "Gustav Jacobsen Wengel"

    const ageLabel = labels.find(label => label.innerText === "Alder");
    ageLabel.control.value = "27"

    const emailLabel = labels.find(label => label.innerText === "Email");
    emailLabel.control.value = "gustavwengel@gmail.com"

    const phoneLabel = labels.find(label => label.innerText === "Telefonnummer");
    phoneLabel.control.value = "25361407"

    const AarhusNLabel = labels.find(label => label.innerText.includes("Vaccination Aarhus NORD, Paludan-Müllers Vej 110, 8200 Aarhus N"));
    AarhusNLabel.control.checked = true;

    console.log("GreaseMonkey filled out form for Aarhus N")
}
else if (location.href === "https://www.auh.dk/om-auh/tilbud-om-covid-vaccination-ved-brug-af-restvacciner/?aarhusC"){
    const labels = Array.from(document.querySelectorAll('label').values());

    const nameLabel = labels.find(label => label.innerText === "Navn");
    nameLabel.control.value = "Gustav Jacobsen Wengel"

    const ageLabel = labels.find(label => label.innerText === "Alder");
    ageLabel.control.value = "27"

    const emailLabel = labels.find(label => label.innerText === "Email");
    emailLabel.control.value = "gustavwengel@gmail.com"

    const phoneLabel = labels.find(label => label.innerText === "Telefonnummer");
    phoneLabel.control.value = "25361407"

    const AarhusNLabel = labels.find(label => label.innerText.includes("Vaccination Aarhus Ø, Hveens gade 4, 8000 Aarhus C"));
    AarhusNLabel.control.checked = true;

    console.log("GreaseMonkey filled out form for Aarhus C")
}
else {
    alert("Add ?aarhusC or ?aarhusN to get autoFillout")
}

window.scrollTo(0,document.body.scrollHeight);


const submitButton = document.querySelector("button[type='submit']");
submitButton.addEventListener('click', () => {
    document.cookie = 'lastSubmitted=' + new Date().toString() + '; expires=Thu, 18 Dec 2025 12:00:00 UTC';
})

const cookieValue = getCookieValue("lastSubmitted") || "(No submission found)";

submitButton.insertAdjacentHTML('beforebegin', 'last submitted: <br>' + cookieValue + '<br>');
