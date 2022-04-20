const selectTags = document.querySelectorAll("select");
const translateBtn = document.querySelector('#translate');
const fromText = document.querySelector('.from-text');
const toText = document.querySelector('.to-text');
const exchangeIcon = document.querySelector('.exchange');
const icons =document.querySelectorAll('.row i')

selectTags.forEach((selectTag, id) => {
    for (var countryCode in countries) {
        let selected = '';
        
        if (id == 0 && countryCode == 'en-GB') {
            selected = "selected";
        } else if (id == 1 && countryCode == 'vi-VN') {
            selected = "selected";
        }
        let option = `<option value="${countryCode}" ${selected}>${countries[countryCode]}</option>`;
        selectTag.insertAdjacentHTML("beforeend", option);
    }
})

translateBtn.addEventListener('click', () => {
    let text = fromText.value;
    let translateFrom = selectTags[0].value;
    let translateTo = selectTags[1].value;
    if (!text) return;
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    console.log(apiUrl)
    toText.setAttribute('placeholder', 'Translating');
    fetch(apiUrl).then(res => res.json())
        .then(data => {
            console.log(data);
            toText.value = data.responseData.translatedText;
        })
})

exchangeIcon.addEventListener('click', () => {
    let tempText = fromText.value;
    let tempLang = selectTags[0].value;
    fromText.value = toText.value;
    toText.value = tempText;
    selectTags[0].value = selectTags[1].value;
    selectTags[1].value = tempLang;
})

icons.forEach(icon => {
    icon.addEventListener('click', ({target}) => {
        if (target.classList.contains("bx-volume-full")) {
            let utterance;
            if (target.id == "volume-from-icon") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTags[0].value;
            }
            else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTags[1].value;
            }
            
            speechSynthesis.speak(utterance)
        }
        else {
            if (target.id == "copy-from-icon") {
                navigator.clipboard.writeText(fromText.value);
            }
            else {
                navigator.clipboard.writeText(toText.value);
            }
            showSuccessToast();
        }
    })
})

function showSuccessToast() {
    toast({
        title: "Success!",
        message: "Copy to clipboard successfully",
        type: "success",
        duration: 5000
    });
}

// Toast function
function toast({ title = "", message = "", type = "info", duration = 3000 }) {
    const main = document.getElementById("toast");
    if (main) {
        const toast = document.createElement("div");

        // Auto remove toast
        const autoRemoveId = setTimeout(function () {
            main.removeChild(toast);
        }, duration + 1000);

        // Remove toast when clicked
        toast.onclick = function (e) {
            if (e.target.closest(".toast__close")) {
                main.removeChild(toast);
                clearTimeout(autoRemoveId);
            }
        };

        const icons = {
            success: "fas fa-check-circle",
            info: "fas fa-info-circle",
            warning: "fas fa-exclamation-circle",
            error: "fas fa-exclamation-circle"
        };

        const icon = icons[type];
        const delay = (duration / 1000).toFixed(2);

        toast.classList.add("toast", `toast--${type}`);
        toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;

        toast.innerHTML = `
            <div class="toast__icon">
                <i class="${icon}"></i>
            </div>
            <div class="toast__body">
                <h3 class="toast__title">${title}</h3>
                <p class="toast__msg">${message}</p>
            </div>
            <div class="toast__close">
                <i class="fas fa-times"></i>
            </div>
        `;
        main.appendChild(toast);
    }
}
