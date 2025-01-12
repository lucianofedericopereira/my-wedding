"use strict";

let saveTheDate = "Mar 10, 2022 10:00:00"

// play button

let content = document.getElementById("content")
let button = document.getElementById("button");
let media = document.getElementById("player");


button.addEventListener("click", (event) => {
    media.play();
    const sakura = new Sakura('body');
    button.style.display = "none";
    document.getElementById('hero').className = 'hero';
    content.style.display = "contents";

    flipBar();
})

// Countdown

const countDown = (date) => {
    date = new Date(date).getTime()
    let now = new Date().getTime()
    now = (date - now) / 1000
    if (now < 0) return false
    return {
        day: ~~(now / 86400),
        hour: String(~~(now % 86400 / 3600)).padStart(2, '0'),
        minute: String(~~(now % 3600 / 60)).padStart(2, '0'),
        second: String(~~(now % 60)).padStart(2, '0')
    }
}

const anniversaryChecker = (date) => {
    date = new Date(date);
    let now = new Date();
    if (date.getTime() < now.getTime()) {
        date.setYear(now.getFullYear());
        if (date.getTime() - now.getTime() < 0) {
            date.setYear(now.getFullYear() + 1)
        }
    }
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toUTCString().slice(4, -4)
}

(function contador(date) {
    let fecha = countDown(date)
    let time = document.getElementById("time");
    let msj = "<b>¡Estamos Celebrando!</b>"
    if (fecha) {
        if (fecha.day == 365) clearInterval(contador)
        else {
            msj = `<p><br>Celebramos en</p>`
            if (fecha.day > 0) {
                let plural = (fecha.day > 1) ? true : false;
                msj += `<p><br><b>${fecha.day}</b></p><p><br>d&iacute;a${(plural) ? "s" : ""}</p>`
            } else {
                msj += `<p id="contador" class="hora">${fecha.hour}<span class="separator">:</span>${fecha.minute}<span class="separator">:</span>${fecha.second}</p>`;
            }
            setTimeout(contador, 900, date)
        }
    }
    time.innerHTML = msj;
})(anniversaryChecker(saveTheDate))

// Mail Parsing

const emlParser = (encoded) => {
    let
        decEml = '',
        keyInHex = encoded.substr(0, 2),
        key = parseInt(keyInHex, 16)
    for (let n = 2;
        n < encoded.length;
        n += 2
    ) {
        let
            charInHex = encoded.substr(n, 2),
            char = parseInt(charInHex, 16),
            output = char ^ key
        decEml += String.fromCharCode(output)
    }
    return decEml
}

document.getElementById("correo").onclick = (evt) => {
    evt.preventDefault();
    let url = "mailto:" + emlParser(evt.target.dataset.encoded) + "?subject=Felicidades por tu Casamiento&body=Confirmo mi asistencia"
    window.open(url, '_blank').focus();
}

// Title Bar

const emoji = Object.fromEntries(Object.entries({
    bride: "128112,127995,8205,9792,65039",
    groom: "129333,127995,8205,9794,65039",
    heart: "129293",
    envelope_heart: "128140",
    envelope: "9993 ,65039"
}).map(([key, value]) => [key, String.fromCodePoint(...value.split(","))]))
const titleBar = [`${emoji.bride}${emoji.envelope}${emoji.groom}`, `${emoji.bride}${emoji.envelope_heart}${emoji.groom}`];
function flipBar(flip = 1) {
    window.top.document.title = titleBar[flip]
    setTimeout(flipBar, 1000, flip ^= 1)
}

// Sakura
let Sakura = function Sakura(selector, options) {
    let _this = this;
    if (typeof selector === 'undefined') {
        throw new Error('Selector missing, define an element.');
    }
    this.el = document.querySelector(selector);
    let defaults = {
        className: 'sakura',
        fallSpeed: 1,
        maxSize: 14,
        minSize: 10,
        delay: 200,
    };
    let extend = function extend(originalObj, newObj) {
        Object.keys(originalObj).forEach(function (key) {
            if (newObj && Object.prototype.hasOwnProperty.call(newObj, key)) {
                let origin = originalObj;
                origin[key] = newObj[key];
            }
        });
        return originalObj;
    };
    this.settings = extend(defaults, options);
    this.el.style.overflowX = 'hidden';
    function randomArrayElem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    let prefixes = ['webkit', 'moz', 'MS', 'o', ''];
    function PrefixedEvent(element, type, callback) {
        for (let p = 0; p < prefixes.length; p += 1) {
            let animType = type;
            if (!prefixes[p]) {
                animType = type.toLowerCase();
            }
            element.addEventListener(prefixes[p] + animType, callback, false);
        }
    }
    function elementInViewport(el) {
        let rect = el.getBoundingClientRect();
        return -1 < rect.top && -1 < rect.left && (window.innerHeight || document.documentElement.clientHeight) > rect.bottom && (window.innerWidth || document.documentElement.clientWidth) > rect.right;
    }
    this.createPetal = function () {
        if (_this.el.dataset.sakuraAnimId) {
            setTimeout(function () {
                window.requestAnimationFrame(_this.createPetal);
            }, _this.settings.delay);
        }
        let animationNames = {
            blowAnimations: ['blow-soft-left', 'blow-medium-left', 'blow-soft-right', 'blow-medium-right'],
            swayAnimations: ['sway-0', 'sway-1', 'sway-2', 'sway-3', 'sway-4', 'sway-5', 'sway-6', 'sway-7', 'sway-8']
        };
        let blowAnimation = randomArrayElem(animationNames.blowAnimations);
        let swayAnimation = randomArrayElem(animationNames.swayAnimations);
        let fallTime = (document.documentElement.clientHeight * 0.007 + Math.round(Math.random() * 5)) * _this.settings.fallSpeed;
        let animationsArr = ["fall ".concat(fallTime, "s linear 0s 1"), "".concat(blowAnimation, " ").concat((fallTime > 30 ? fallTime : 30) - 20 + randomInt(0, 20), "s linear 0s infinite"), "".concat(swayAnimation, " ").concat(randomInt(2, 4), "s linear 0s infinite")];
        let animations = animationsArr.join(', ');
        let petal = document.createElement('div');
        petal.classList.add(_this.settings.className);
        let height = randomInt(_this.settings.minSize, _this.settings.maxSize);
        let width = height - Math.floor(randomInt(0, _this.settings.minSize) / 3);
        let color = "#674ea7"; //randomArrayElem(_this.settings.colors);
        petal.style.background = "#674ea7"; // "linear-gradient(".concat(color.gradientColorDegree, "deg, ").concat(color.gradientColorStart, ", ").concat(color.gradientColorEnd, ")");
        petal.style.animation = animations;
        petal.style.borderRadius = "".concat(randomInt(_this.settings.maxSize, _this.settings.maxSize + Math.floor(Math.random() * 10)), "px ").concat(randomInt(1, Math.floor(width / 4)), "px");
        petal.style.height = "".concat(height, "px");
        petal.style.left = "".concat(Math.random() * document.documentElement.clientWidth - 100, "px");
        petal.style.marginTop = "".concat(-(Math.floor(Math.random() * 20) + 15), "px");
        petal.style.width = "".concat(width, "px");
        PrefixedEvent(petal, 'AnimationEnd', function () {
            if (!elementInViewport(petal)) {
                petal.remove();
            }
        });
        PrefixedEvent(petal, 'AnimationIteration', function () {
            if (!elementInViewport(petal)) {
                petal.remove();
            }
        });
        _this.el.appendChild(petal);
    };
    this.el.setAttribute('data-sakura-anim-id', window.requestAnimationFrame(this.createPetal));
};
Sakura.prototype.start = function () {
    let animId = this.el.dataset.sakuraAnimId;
    if (!animId) {
        this.el.setAttribute('data-sakura-anim-id', window.requestAnimationFrame(this.createPetal));
    } else {
        throw new Error('Sakura is already running.');
    }
};
Sakura.prototype.stop = function () {
    let _this2 = this;
    let graceful = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    let animId = this.el.dataset.sakuraAnimId;
    if (animId) {
        window.cancelAnimationFrame(animId);
        this.el.setAttribute('data-sakura-anim-id', '');
    }
    if (!graceful) {
        setTimeout(function () {
            let petals = document.getElementsByClassName(_this2.settings.className);
            while (petals.length > 0) {
                petals[0].parentNode.removeChild(petals[0]);
            }
        }, this.settings.delay + 50);
    }
};
