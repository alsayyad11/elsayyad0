//Explore button
let exploreBtn = document.querySelector(".title .btn"),
  HadithSection = document.querySelector(".hadith");
exploreBtn.addEventListener("click", () => {
  HadithSection.scrollIntoView({
    behavior: "smooth",
  });
});
let fixedNav = document.querySelector(".header"),
  ScrollBtn = document.querySelector(".ScrollBtn");
window.addEventListener("scroll", () => {
  window.scrollY > 100
    ? fixedNav.classList.add("active")
    : fixedNav.classList.remove("active");
  window.scrollY > 500
    ? ScrollBtn.classList.add("active")
    : ScrollBtn.classList.remove("active");
});
ScrollBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
window.addEventListener("scroll", () => {
  window.scrollY > 100
    ? fixedNav.classList.add("active")
    : fixedNav.classList.remove("active");
});
//Hadith changer
let hadithContainer = document.querySelector(".hadithContainer"),
  next = document.querySelector(".buttons .next"),
  prev = document.querySelector(".buttons .prev"),
  number = document.querySelector(".buttons .number");
let hadithIndex = 0;
HadithChanger();
function HadithChanger() {
  fetch("https://api.hadith.gading.dev/books/muslim?range=1-300")
    .then((response) => response.json())
    .then((data) => {
      let Hadiths = data.data.hadiths;
      changeHadith();
      next.addEventListener("click", () => {
        hadithIndex == 299 ? (hadithIndex = 0) : hadithIndex++;
        changeHadith();
      });
      prev.addEventListener("click", () => {
        hadithIndex == 0 ? (hadithIndex = 299) : hadithIndex--;
        changeHadith();
      });
      function changeHadith() {
        hadithContainer.innerText = Hadiths[hadithIndex].arab;
        number.innerText = `300 - ${hadithIndex + 1}`;
      }
    });
}

// link sections
let sections = document.querySelectorAll("section"),
  links = document.querySelectorAll(".header ul li");
links.forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector(".header ul li.active").classList.remove("active");
    link.classList.add("active");
    let target = link.dataset.filter;
    sections.forEach((section) => {
      if (section.classList.contains(target)) {
        section.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });
});
//surah Api
let SurahContainer = document.querySelector(".surahContainer");
getSurahs();

function getSurahs() {
  fetch("https://api.alquran.cloud/v1/meta")
    .then((response) => response.json())
    .then((data) => {
      let surahs = data.data.surahs.references;
      let numberOfSurahs = 114;
      SurahContainer.innerHTML = "";
      for (let i = 0; i < numberOfSurahs; i++) {
        SurahContainer.innerHTML += `
                <div class="surah">
                    <p>${surahs[i].name}</p>
                    <p translate="no">${surahs[i].englishName} </p>
                </div>`;
      }
      for (let j = 0; j < 3; j++) {
        SurahContainer.innerHTML += `
                <div class="surah hidden">
                    <p></p>
                    <p></p>
                </div>`;
      }
      let SurahsTitels = document.querySelectorAll(".surah");
      let popup = document.querySelector(".surah-popup"),
        AyatContainer = document.querySelector(".ayat");
      SurahsTitels.forEach((title, index) => {
        title.addEventListener("click", () => {
          fetch(`https://api.alquran.cloud/v1/surah/${index + 1}`)
            .then((response) => response.json())
            .then((data) => {
              AyatContainer.innerHTML = "";
              let Ayat = data.data.ayahs;
              Ayat.forEach((aya) => {
                popup.classList.add("active");
                if (
                  index + 1 !== 9 &&
                  aya.text.includes("بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ")
                ) {
                  AyatContainer.innerHTML += `<div class="basmala notranslate" translate="no">بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ</div>`;
                  let remainingText = aya.text.replace(
                    "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ",
                    ""
                  );
                  if (remainingText.trim().length > 0) {
                    AyatContainer.innerHTML += `<p class="notranslate" translate="no">(${aya.numberInSurah}) - ${remainingText}</p>`;
                  }
                } else {
                  AyatContainer.innerHTML += `<p class="notranslate" translate="no">${aya.text}  {${aya.numberInSurah}}</p>`;
                }
              });
            });
        });
      });
      let closePopup = document.querySelector(".close-popup");

      closePopup.addEventListener("click", () => {
        popup.classList.remove("active");
      });
    });
}

// fetch countries and cites API
const APiConfig = {
  cUrl: "https://api.countrystatecity.in/v1/countries",
  ckey: "NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA==",
};

var selectedCountry = document.getElementById("selected_country");
var selectedState = document.getElementById("selected_state");
let string_selected_country = "";
let string_selected_state = "";
var getCountryNameByIso = {};
var getStatesNameByIso = {};

selectedCountry.addEventListener("change", function () {
  var country_id = selectedCountry.value;
  string_selected_country = getCountryNameByIso[country_id];
  loadStates(country_id);
});

selectedState.addEventListener("change", function () {
  string_selected_state = getStatesNameByIso[selectedState.value];
  getPrayTimes(string_selected_country, string_selected_state);
});

if (window.location.protocol == "https:") {
  var host = "https://thehunter00.github.io/elsayyad0/";
} else {
  var host = window.location.protocol + "//" + window.location.host + "/";
}

function loadCountries() {
  // let apiEndPoint = APiConfig.cUrl
  let apiEndPoint = host + "locale/countries.json";

  fetch(apiEndPoint, { headers: { "X-CSCAPI-KEY": APiConfig.ckey } })
    .then((Response) => Response.json())
    .then((data) => {
      data = data
        .filter((_) => _.show)
        .sort((a, b) => (a.ARName > b.ARName ? 1 : -1));
      data.forEach((country) => {
        const option = document.createElement("option");
        option.value = country.iso2;
        option.id = country.name;
        getCountryNameByIso[country.iso2] = country.name;
        option.innerHTML = `${country.emoji} ${
          country.ARName || country.name
        } | <sub>${
          country.native == country.ARName ? country.name : country.native
        }</sub>`;
        selectedCountry.appendChild(option);
      });
    })
    .catch((error) => console.error("Error loading countries:", error));
}

let selected_state;
async function setCurrentPrayTime(country_name, state, country_code) {
  var countries_options = selectedCountry.querySelectorAll("option");

  countries_options.forEach((c) => (c.selected = false));
  countries_options.forEach((co) => {
    if (co.id == country_name) {
      co.selected = true;
    }
  });

  loadStates(country_code);

  selected_state = state;
  // var states_options = selectedState.querySelectorAll('option');
  // console.log(states_options)
  // states_options.forEach(st=>{st.selected=false});
  // states_options.forEach(st=>{
  //     if (st.textContent == state){
  //         st.selected = true;
  //     }
  // })

  getPrayTimes(country_name, state);
}

function loadStates(country_code) {
  // fetch(`${APiConfig.cUrl}/${country_code}/states`, {headers: {"X-CSCAPI-KEY": APiConfig.ckey}})
  fetch(`${host}locale/states.json`, {
    headers: { "X-CSCAPI-KEY": APiConfig.ckey },
  })
    .then((response) => response.json())
    .then((data) => {
      var statesList = '<option value="#" selected>اختر المنطقة</option>';

      data[country_code].forEach((state) => {
        const option = document.createElement("option");
        option.value = state.iso2;
        getStatesNameByIso[state.iso2] = state.name;
        option.textContent = state.name;
        statesList += `<option value="${state.iso2}" id="${
          state.name
        }" selected>${state.ARName || state.name} ${
          state.ARName ? `| <sub>${state.name}</sub>` : ""
        }</option>`;
      });
      selectedState.innerHTML = statesList;
      if (selected_state) {
        var states_options = selectedState.querySelectorAll("option");
        console.log(states_options);
        states_options.forEach((st) => {
          st.selected = false;
        });
        states_options.forEach((st) => {
          if (st.id == selected_state) {
            st.selected = true;
          }
        });
      }
    })
    .catch((error) => console.error("Error loading countries:", error));
}

loadCountries();

// praytime Api
let cards = document.querySelector(".cards");
// getPrayTimes();

function getPrayTimes(country, state) {
  // const  = new Map();
  let arabicPrayers = {
    Fajr: "الفجر",
    Sunrise: "الشروق",
    Dhuhr: "الظهر",
    Asr: "العصر",
    Sunset: "الغروب",
    Maghrib: "المغرب",
    Isha: "العشاء",
    Imsak: "الإمساك",
    Midnight: "منتصف الليل",
    Firstthird: "الثلث الأول",
    Lastthird: "الثلث الثالث",
  };
  // fetch("https://api.aladhan.com/v1/timingsByCity?city=mansoura&country=egypt&method=8")
  fetch(
    `https://api.aladhan.com/v1/timingsByCity?city=${state}&country=${country}&method=8`
  )
    .then((response) => response.json())
    .then((data) => {
      let times = data.data.timings;
      cards.innerHTML = "";
      for (let time in times) {
        if (
          time === "Sunset" ||
          time === "Imsak" ||
          time === "Midnight" ||
          time === "Firstthird" ||
          time === "Lastthird"
        )
          continue;
        const timeArr = times[time].split(":");
        cards.innerHTML += `
            <div class="card">
                    <div class="circle">
                        <svg>
                            <circle cx="100" cy="100" r="100"></circle>
                        </svg>
                        <div class="praytime"> 
                            ${
                              timeArr[0] > 12
                                ? timeArr[0] -
                                  12 +
                                  ":" +
                                  timeArr[1] +
                                  "<sub>PM</sub>"
                                : timeArr[0] -
                                  0 +
                                  ":" +
                                  timeArr[1] +
                                  "<sub>AM</sub>"
                            }
                        </div>
                    </div>
                    <p>${arabicPrayers[time]}</p>
                </div>

            `;
      }
    });
}
let bars = document.querySelector(".bars"),
  sideBar = document.querySelector(".header ul");
bars.addEventListener("click", () => {
  sideBar.classList.toggle("active");
});

// Theme Switch Section
const body = document.querySelector("body");
const input = document.querySelector(".header input");
const surahCards = document.querySelectorAll(".surahContainer .surah");

const storedMode = JSON.parse(localStorage.getItem("mode"));
if (storedMode !== null) {
  input.checked = storedMode;
  theme();
} else {
  input.checked = false;
}

function theme() {
  if (input.checked) {
    document.documentElement.style.setProperty("--popup-color", "#111");
    document.documentElement.style.setProperty("--general-text", "#fffc");
    document.documentElement.style.setProperty("--section-color", "#111e");
    document.documentElement.style.setProperty("--sharp-text", "#fff");
    document.documentElement.style.setProperty("--select-color", "#00172b");
  } else {
    document.documentElement.style.setProperty("--popup-color", "#fff");
    document.documentElement.style.setProperty("--general-text", "#232323");
    document.documentElement.style.setProperty("--section-color", "#fffe");
    document.documentElement.style.setProperty("--sharp-text", "#111");
    document.documentElement.style.setProperty("--select-color", "#38d1ff");
  }
}

input.addEventListener("input", () => {
  theme();
  updateLocalStorage();
});

function updateLocalStorage() {
  localStorage.setItem("mode", JSON.stringify(input.checked));
}
