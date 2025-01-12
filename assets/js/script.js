"use strict";

const saveTheDate = "Mar 10, 2022 10:00:00";

const SECONDS_PER_DAY = 86400;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_MINUTE = 60;

const $ = id => document.getElementById(id);
const padding = num => String(num).padStart(2, '0');

const anniversaryChecker = (date) => {
    const anniversaryDate = new Date(date);
    const now = new Date();
    if (anniversaryDate.getTime() < now.getTime()) {
        anniversaryDate.setFullYear(now.getFullYear());
        if (anniversaryDate.getTime() < now.getTime()) {
            anniversaryDate.setFullYear(now.getFullYear() + 1);
        }
    }
    return new Date(anniversaryDate.getTime() - anniversaryDate.getTimezoneOffset() * 60000).toUTCString().slice(4, -4);
};

const countDown = (date) => {
    date = new Date(date).getTime();
    const now = new Date().getTime();
    const remaining = (date - now) / 1000;
    if (remaining < 0) return false;
    return {
        day: ~~(remaining / SECONDS_PER_DAY),
        hour: padding(~~((remaining % SECONDS_PER_DAY) / SECONDS_PER_HOUR)),
        minute: padding(~~((remaining % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE)),
        second: padding(~~(remaining % SECONDS_PER_MINUTE))
    };
};

// Title Bar
const emoji = Object.fromEntries(Object.entries({
    bride: "128112,127995,8205,9792,65039",
    groom: "129333,127995,8205,9794,65039",
    heart: "129293",
    envelope_heart: "128140",
    envelope: "9993,65039"
}).map(([key, value]) => [key, String.fromCodePoint(...value.split(","))]));

const titleBar = [`${emoji.bride}${emoji.envelope}${emoji.groom}`, `${emoji.bride}${emoji.envelope_heart}${emoji.groom}`];

// Mail Parsing
const emlParser = encoded => {
    let decEml = '';
    const keyInHex = encoded.substr(0, 2);
    const key = parseInt(keyInHex, 16);
    for (let n = 2; n < encoded.length; n += 2) {
        const charInHex = encoded.substr(n, 2);
        const char = parseInt(charInHex, 16);
        const output = char ^ key;
        decEml += String.fromCharCode(output);
    }
    return decEml;
};

const content = $('content');
const button = $('button');
const media = $('player');
const correo = $('correo');
const time = $("time");

button.addEventListener("click", (event) => {
    media.play();
    contador(anniversaryChecker(saveTheDate));
    const sakura = new Sakura('body');
    button.style.display = "none";
    $('hero').className = 'hero';
    content.style.display = "contents";
    flipBar();
});


correo.onclick = (evt) => {
    evt.preventDefault();
    const url = "mailto:" + emlParser(evt.target.dataset.encoded) + "?subject=Felicidades por tu Casamiento&body=Confirmo mi asistencia";
    window.open(url, '_blank').focus();
};

const contador = (date) => {
    const fecha = countDown(date);
    let msj = "<b>¡Estamos Celebrando!</b>";
    if (fecha) {
        if (fecha.day == 365) clearInterval(contador);
        else {
            msj = `<p><br>Celebramos en</p>`;
            if (fecha.day > 0) {
                const plural = (fecha.day > 1);
                msj += `<p><br><b>${fecha.day}</b></p><p><br>d&iacute;a${(plural) ? "s" : ""}</p>`;
            } else {
                msj += `<p id="contador" class="hora">${fecha.hour}<span class="separator">:</span>${fecha.minute}<span class="separator">:</span>${fecha.second}</p>`;
            }
            setTimeout(contador, 900, date);
        }
    }
    time.innerHTML = msj;
};

const flipBar = (flip = 1) => {
    window.top.document.title = titleBar[flip];
    setTimeout(flipBar, 1000, flip ^= 1);
}

// Sakura Updated
const Sakura = function Sakura(selector, options) {
    if (typeof selector === 'undefined') {
        throw new Error('Selector missing, define an element.');
    }

    this.el = document.querySelector(selector);
    const defaults = {
        className: 'sakura',
        fallSpeed: 1,
        maxSize: 14,
        minSize: 10,
        delay: 200,
    };

    const extend = (originalObj, newObj) => {
        Object.keys(originalObj).forEach(function (key) {
            if (newObj && Object.prototype.hasOwnProperty.call(newObj, key)) {
                originalObj[key] = newObj[key];
            }
        });
        return originalObj;
    };

    this.settings = extend(defaults, options);
    this.el.style.overflowX = 'hidden';

    const randomArrayElem = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const prefixes = ['webkit', 'moz', 'MS', 'o', ''];
    const PrefixedEvent = (element, type, callback) => {
        for (let p = 0; p < prefixes.length; p += 1) {
            const animType = prefixes[p] ? type : type.toLowerCase();
            element.addEventListener(prefixes[p] + animType, callback, false);
        }
    };

    const elementInViewport = (el) => {
        const rect = el.getBoundingClientRect();
        return (rect.top > -1 && rect.left > -1 &&
            (window.innerHeight || document.documentElement.clientHeight) > rect.bottom &&
            (window.innerWidth || document.documentElement.clientWidth) > rect.right);
    };

    this.createPetal = () => {
        if (this.el.dataset.sakuraAnimId) {
            setTimeout(() => {
                window.requestAnimationFrame(this.createPetal);
            }, this.settings.delay);
        }

        const animationNames = {
            blowAnimations: ['blow-soft-left', 'blow-medium-left', 'blow-soft-right', 'blow-medium-right'],
            swayAnimations: ['sway-0', 'sway-1', 'sway-2', 'sway-3', 'sway-4', 'sway-5', 'sway-6', 'sway-7', 'sway-8']
        };

        const blowAnimation = randomArrayElem(animationNames.blowAnimations);
        const swayAnimation = randomArrayElem(animationNames.swayAnimations);
        const fallTime = (document.documentElement.clientHeight * 0.007 + Math.round(Math.random() * 5)) * this.settings.fallSpeed;

        const animationsArr = [
            `fall ${fallTime}s linear 0s 1`,
            `${blowAnimation} ${Math.max(fallTime - 20 + randomInt(0, 20), 30)}s linear 0s infinite`,
            `${swayAnimation} ${randomInt(2, 4)}s linear 0s infinite`
        ];
        const animations = animationsArr.join(', ');
        const petal = document.createElement('div');
        petal.classList.add(this.settings.className);
        const height = randomInt(this.settings.minSize, this.settings.maxSize);
        const width = height - Math.floor(randomInt(0, this.settings.minSize) / 3);

        petal.style.background = "#674ea7";
        petal.style.animation = animations;
        petal.style.borderRadius = `${randomInt(this.settings.maxSize, this.settings.maxSize + Math.floor(Math.random() * 10))}px ${randomInt(1, Math.floor(width / 4))}px`;
        petal.style.height = `${height}px`;
        petal.style.left = `${Math.random() * document.documentElement.clientWidth - 100}px`;
        petal.style.marginTop = `${-(Math.floor(Math.random() * 20) + 15)}px`;
        petal.style.width = `${width}px`;

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

        this.el.appendChild(petal);
    };

    this.el.setAttribute('data-sakura-anim-id', window.requestAnimationFrame(this.createPetal));
};

Sakura.prototype.start = function () {
    const animId = this.el.dataset.sakuraAnimId;
    if (!animId) {
        this.el.setAttribute('data-sakura-anim-id', window.requestAnimationFrame(this.createPetal));
    } else {
        throw new Error('Sakura is already running.');
    }
};

Sakura.prototype.stop = function (graceful = false) {
    const animId = this.el.dataset.sakuraAnimId;
    if (animId) {
        window.cancelAnimationFrame(animId);
        this.el.setAttribute('data-sakura-anim-id', '');
    }
    if (!graceful) {
        setTimeout(() => {
            let petals = document.getElementsByClassName(this.settings.className);
            while (petals.length > 0) {
                petals[0].parentNode.removeChild(petals[0]);
            }
        }, this.settings.delay + 50);
    }
};
