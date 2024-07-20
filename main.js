//Explore button
let exploreBtn = document.querySelector('.title .btn'),
    HadithSection = document.querySelector('.hadith');
exploreBtn.addEventListener('click', () => {
    HadithSection.scrollIntoView({
        behavior: "smooth"
    })
})
let fixedNav = document.querySelector('.header'),
    ScrollBtn = document.querySelector('.ScrollBtn');
window.addEventListener("scroll",()=> {
    window.scrollY > 100 ? fixedNav.classList.add('active') : fixedNav.classList.remove('active');
    window.scrollY > 500 ? ScrollBtn.classList.add('active') : ScrollBtn.classList.remove('active');

})
ScrollBtn.addEventListener('click', ()=>{
    window.scrollTo({
        top : 0,
        behavior : "smooth"
    })
})
window.addEventListener("scroll", () => {
    window.scrollY > 100 ? fixedNav.classList.add('active') : fixedNav.classList.remove('active');
})
//Hadith changer
let hadithContainer = document.querySelector('.hadithContainer'),
    next = document.querySelector('.buttons .next'),
    prev = document.querySelector('.buttons .prev'),
    number = document.querySelector('.buttons .number');
let hadithIndex = 0;
HadithChanger();
function HadithChanger() {
    fetch("https://api.hadith.gading.dev/books/muslim?range=1-300")
        .then(response => response.json())
        .then(data => {
            let Hadiths = data.data.hadiths;
            changeHadith();
            next.addEventListener('click', () => {
                hadithIndex == 299 ? hadithIndex = 0 : hadithIndex++;
                changeHadith()
            })
            prev.addEventListener('click', () => {
                hadithIndex == 0 ? hadithIndex = 299 : hadithIndex--;
                changeHadith()
            })
            function changeHadith() {
                hadithContainer.innerText = Hadiths[hadithIndex].arab;
                number.innerText = `300 - ${hadithIndex + 1}`
            }
        })
}

// link sections
let sections = document.querySelectorAll("section"),
    links = document.querySelectorAll('.header ul li');
links.forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.header ul li.active').classList.remove('active');
        link.classList.add('active');
        let target = link.dataset.filter;
        sections.forEach(section => {
            if (section.classList.contains(target)) {
                section.scrollIntoView({
                    behavior: "smooth"
                })
            }
        })
    })
})
//surah Api
let SurahContainer = document.querySelector('.surahContainer')
getSurahs()
function getSurahs() {
    fetch("https://api.alquran.cloud/v1/meta")
        .then(response => response.json())
        .then(data => {
            let surahs = data.data.surahs.references;
            let numberOfSurahs = 114;
            SurahContainer.innerHTML = ""
            for (let i = 0; i < numberOfSurahs; i++) {
                SurahContainer.innerHTML += `
                <div class="surah">
                    <p>${surahs[i].name}</p>
                    <p>${surahs[i].englishName} </p>
                </div>`
            }
            for (let j = 0; j < 3; j++) {
                SurahContainer.innerHTML += `
                <div class="surah hidden">
                    <p></p>
                    <p></p>
                </div>`
            }
            let SurahsTitels = document.querySelectorAll('.surah');
            let popup = document.querySelector('.surah-popup'),
                AyatContainer = document.querySelector('.ayat');
            SurahsTitels.forEach((title,index)=>{
                title.addEventListener('click', ()=>{
                    fetch(`https://api.alquran.cloud/v1/surah/${index + 1}`)
                        .then(response => response.json())
                        .then(data => {
                            AyatContainer.innerHTML = "";
                            let Ayat = data.data.ayahs;
                            Ayat.forEach(aya=>{
                                popup.classList.add('active');
                                if (index + 1 !== 9 && aya.text.includes("بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ")) {
                                    AyatContainer.innerHTML += `<div class="basmala">بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ</div>`;
                                    let remainingText = aya.text.replace("بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ", "");
                                    if (remainingText.trim().length > 0) {
                                        AyatContainer.innerHTML += `<p>(${aya.numberInSurah}) - ${remainingText}</p>`;
                                    }
                                } else {
                                    AyatContainer.innerHTML += `<p>${aya.text}  {${aya.numberInSurah}}</p>`;
                                }
                            })                  
                        })
                })
            })
            let closePopup = document.querySelector('.close-popup');

            closePopup.addEventListener('click',()=>{
                popup.classList.remove('active');
            })

        })
}

// praytime Api
let cards = document.querySelector('.cards');
getPrayTimes();
function getPrayTimes()
{
    // const  = new Map();
    let arabicPrayers = {
        "Fajr": "الفجر",
        "Sunrise": "الشروق",
        "Dhuhr": "الظهر",
        "Asr": "العصر",
        "Sunset": "الغروب",
        "Maghrib": "المغرب",
        "Isha": "العشاء",
        "Imsak": "الإمساك",
        "Midnight": "منتصف الليل",
        "Firstthird": "الثلث الأول",
        "Lastthird": "الثلث الثالث",
    }
    fetch(" https://api.aladhan.com/v1/timingsByCity?city=mansoura&country=egypt&method=8")
    .then(response => response.json())
    .then(data => {
        let times = data.data.timings
        cards.innerHTML ="";
        for (let time in times)
        {
            if(time === "Sunset" || time === "Imsak" || time === "Midnight" || time === "Firstthird" || time === "Lastthird") continue;
            const timeArr = times[time].split(":");
            cards.innerHTML +=
            `
            <div class="card">
                    <div class="circle">
                        <svg>
                            <circle cx="100" cy="100" r="100"></circle>
                        </svg>
                        <div class="praytime"> 
                            ${timeArr[0]>12
                            ?timeArr[0]-12+":"+timeArr[1]+"<sub>PM</sub>"
                            :timeArr[0]-0+":"+timeArr[1]+"<sub>AM</sub>"}
                        </div>
                    </div>
                    <p>${arabicPrayers[time]}</p>
                </div>

            `

        }
    })
}
let bars = document.querySelector('.bars'),
    sideBar = document.querySelector('.header ul');
bars.addEventListener('click',()=>{
    sideBar.classList.toggle("active");
})

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
        document.documentElement.style.setProperty('--popup-color', '#111');
        document.documentElement.style.setProperty('--general-text', '#fffc');
        document.documentElement.style.setProperty('--section-color', '#111e');
        document.documentElement.style.setProperty('--sharp-text', '#fff');
        document.documentElement.style.setProperty('--select-color', '#00172b');
    } else {
        document.documentElement.style.setProperty('--popup-color', '#fff');
        document.documentElement.style.setProperty('--general-text', '#232323');
        document.documentElement.style.setProperty('--section-color', '#fffe');
        document.documentElement.style.setProperty('--sharp-text', '#111');
        document.documentElement.style.setProperty('--select-color', '#38d1ff');
    }
}

input.addEventListener("input", () => {
    theme();
    updateLocalStorage();
});

function updateLocalStorage() {
    localStorage.setItem("mode", JSON.stringify(input.checked));
}
