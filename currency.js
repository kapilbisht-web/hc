const BASE_URL =
  "https://api.currencyapi.com/v3/latest?apikey=cur_live_UCuzcUscDNgI03LltOUfgFrDHg6HMN2h5uwYbkBO";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}


const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

const updateExchangeRate = async () => {
  const amountEl = document.querySelector(".amount input");
  const amtVal = parseFloat(amountEl.value) || 1;
  amountEl.value = amtVal;

  const url = `${BASE_URL}&base_currency=${fromCurr.value}&currencies=${toCurr.value}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(response.statusText);
    const json = await response.json();
    const rate = json.data[toCurr.value].value;
    const finalAmount = (amtVal * rate).toFixed(4);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (err) {
    msg.innerText = `⚠️ Error fetching rate: ${err.message}`;
  }
};

btn.addEventListener("click", e => {
  e.preventDefault();
  updateExchangeRate();
});
window.addEventListener("load", updateExchangeRate);