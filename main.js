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
document.addEventListener('DOMContentLoaded', () => {
    getSurahs();
    getPrayTimes();
});

function getSurahs() {
    fetch("http://api.alquran.cloud/v1/meta")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            let SurahContainer = document.querySelector('.surahContainer');
            let surahs = data.data.surahs.references;
            let numberOfSurahs = 114;
            SurahContainer.innerHTML = "";
            for (let i = 0; i < numberOfSurahs; i++) {
                SurahContainer.innerHTML += `
                <div class="surah">
                    <p>${surahs[i].name}</p>
                    <p>${surahs[i].englishName}</p>
                </div>`;
            }
            for (let j = 0; j < 3; j++) {
                SurahContainer.innerHTML += `
                <div class="surah hidden">
                    <p></p>
                    <p></p>
                </div>`;
            }
            let SurahTitles = document.querySelectorAll('.surah');
            let popup = document.querySelector('.surah-popup'),
                AyatContainer = document.querySelector('.ayat');
            SurahTitles.forEach((title, index) => {
                title.addEventListener('click', () => {
                    fetch(`https://api.alquran.cloud/v1/surah/${index + 1}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            AyatContainer.innerHTML = "";
                            let Ayat = data.data.ayahs;
                            Ayat.forEach(aya => {
                                popup.classList.add('active');
                                if (index + 1 !== 9 && aya.text.includes("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ")) {
                                    AyatContainer.innerHTML += `<div class="basmala">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>`;
                                    let remainingText = aya.text.replace("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "");
                                    if (remainingText.trim().length > 0) {
                                        AyatContainer.innerHTML += `<p>(${aya.numberInSurah}) - ${remainingText}</p>`;
                                    }
                                } else {
                                    AyatContainer.innerHTML += `<p>${aya.text} {${aya.numberInSurah}}</p>`;
                                }
                            });
                        })
                        .catch(error => {
                            console.error('Error fetching Surah:', error);
                        });
                });
            });
            let closePopup = document.querySelector('.close-popup');
            closePopup.addEventListener('click', () => {
                popup.classList.remove('active');
            });
        })
        .catch(error => {
            console.error('Error fetching Surahs:', error);
        });
}

function getPrayTimes() {
    fetch("http://api.aladhan.com/v1/timingsByCity?city=mansoura&country=egypt&method=8")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            let cards = document.querySelector('.cards');
            let times = data.data.timings;
            cards.innerHTML = "";
            for (let time in times) {
                cards.innerHTML += `
                <div class="card">
                    <div class="circle">
                        <svg>
                            <circle cx="100" cy="100" r="100"></circle>
                        </svg>
                        <div class="praytime">${times[time]}</div>
                    </div>
                    <p>${time}</p>
                </div>`;
            }
        })
        .catch(error => {
            console.error('Error fetching Pray Times:', error);
        });
}

let bars = document.querySelector('.bars'),
    sideBar = document.querySelector('.header ul');
bars.addEventListener('click',()=>{
    sideBar.classList.toggle("active");
})