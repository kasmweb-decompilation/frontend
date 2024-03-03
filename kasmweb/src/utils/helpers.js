import {Buffer} from 'buffer';

export const randomInt = (min, max) => Math.floor(Math.random()*(max-min+1)+min);

export const bytesToSize = (bytes, si=false, dp=1) => {
    const threshold = si ? 1000 : 1024

    if (Math.abs(bytes) < threshold) {
        return bytes + ' B';
    }

    const units = si 
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

    let u = -1;
    const r = 10**dp;

    do {
        bytes /= threshold;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= threshold && u < units.length - 1);

    return bytes.toFixed(dp) + ' ' + units[u];
};

export const secondsToTime = (seconds) => {

    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600*24));
    var h = Math.floor(seconds % (3600*24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    
    var dDisplay = d > 0 ? d + "d " : "";
    var hDisplay = h > 0 ? h + "h " : "";
    var mDisplay = m > 0 ? m + "m " : "";
    var sDisplay = s > 0 ? s + "s" : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;

}

export const setCookie = (name, value, exhours) => {
    var expires = "";
    if (exhours) {
        var date = new Date();
        date.setTime(date.getTime() + (exhours *60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/;" + " Secure;";
    return true;
};

export const deleteAllCookies = () => {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    return cookies;
};

// Clear all local storage items except the items we need to persist
export const clearLocalStorage = (logout_all = false) => {

    let persist = [
        'persistent_profile_mode',
        'report_delta',
        'collapseUsage',
        'collapseUser',
        'collapseAgents',
        'joined_kasms',
        'login_logo',
        'login_caption',
        'header_logo',
        'login_splash_background',
        'splash_background',
        'launcher_background_url',
        'html_title',
        'favicon_logo',
        'default_keyboard_controls_mode',
        'ime_mode',
        'themecolor',
        'openTabIn',
        'kasm_prefer_local_cursor',
        'kasm_resize_mode',
        'kasm_video_quality',
        'kasm_enable_perf_stats',
        'kasm_frame_rate',
        'kasm_forced_resolution_width',
        'kasm_forced_resolution_height',
        'kasm_webcam_device',
        'kasm_webcam_quality',
        'kasm_webcam_fps',
        'i18nextLng',
        'timezone',
        'enable_hidpi',
        'recent_search'
    ];

    let cached_values = {};

    for (let i = 0; i < persist.length; i++) {
        let t = window.localStorage.getItem(persist[i]);
        if (t) {
            cached_values[persist[i]] = t;
        }
    }

    // Launch forms need to be handled differently as the kasm_id is appended
    if (logout_all !== true) {
        for (let i = 0; i < window.localStorage.length; i++){
            if (window.localStorage.key(i).substring(0,13) == 'launch_forms_') {
                const key = window.localStorage.key(i)
                cached_values[key] = window.localStorage.getItem(key);
            }
        }
    }

    window.localStorage.clear();

    for (var x in cached_values){
        window.localStorage.setItem(x, cached_values[x]);
    }


};

export const fuzzySearch = (filter, row) =>  {
    // Some values are null so we cast them to an empty string
    let id =  row[filter.id];
    if (id === undefined || id === null){
        id = '';
    }
    id = id.toString().toLowerCase();
    return id.includes(filter.value.toLowerCase())
};



const setLight =()=> {
    localStorage.setItem("theme", "Light");
    document.body.classList.add("light");
    // document.documentElement.setAttribute("data-theme", "light");
};
    // Set dark theme
const setDark =()=> {
    localStorage.setItem("theme", "Dark");
    document.body.classList.add("dark", "tw-dark");
};
    // Set auto browser default
const setAutoBrowserDefault =()=> {
    const currentColorScheme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (currentColorScheme) {
        localStorage.setItem("theme", "Dark");
        document.body.classList.add("dark", "tw-dark");
    } else {
        localStorage.setItem("theme", "Light");
        document.body.classList.add("light");
    }
};


export const setThemeColor = (themeColor) => {
    // removing custom theme color related classes from body
    document.body.classList.remove("light","dark","tw-dark");

    // Start :: for selected color active
    localStorage.setItem("themecolor", themeColor);
    // End :: for selected color active

    if (themeColor === 'Light') {
        setLight();
    } else if (themeColor === 'Dark') {
        setDark();
    } else {
        setAutoBrowserDefault();
    }

    // Start :: remove and add active class
    let allElements = document.querySelectorAll(".theme-color-buttons");
    for(let i=0; i < allElements.length; i++) {
        allElements[i].classList.remove("active");
    }
}

export const cyrb53 = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed,
      h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export const languages = () => {
    return [
        { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
        { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
        { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
        { code: 'az', name: 'Azerbaijani', nativeName: 'azərbaycan dili' },
        { code: 'be', name: 'Belarusian', nativeName: 'Беларуская' },
        { code: 'bg', name: 'Bulgarian', nativeName: 'български език' },
        { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
        { code: 'bs', name: 'Bosnian', nativeName: 'bosanski jezik' },
        { code: 'ca', name: 'Catalan; Valencian', nativeName: 'Català' },
        { code: 'cs', name: 'Czech', nativeName: 'česky, čeština' },
        { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg' },
        { code: 'da', name: 'Danish', nativeName: 'dansk' },
        { code: 'de', name: 'German', nativeName: 'Deutsch' },
        { code: 'el', name: 'Greek', nativeName: 'ελληνικά' },
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'es', name: 'Spanish; Castilian', nativeName: 'español, castellano' },
        { code: 'et', name: 'Estonian', nativeName: 'eesti, eesti keel' },
        { code: 'eu', name: 'Basque', nativeName: 'euskara, euskera' },
        { code: 'fa', name: 'Persian', nativeName: 'فارسی' },
        { code: 'fi', name: 'Finnish', nativeName: 'suomi, suomen kieli' },
        { code: 'fr', name: 'French', nativeName: 'français, langue française' },
        { code: 'fy', name: 'Western Frisian', nativeName: 'Frysk' },
        { code: 'ga', name: 'Irish', nativeName: 'Gaeilge' },
        { code: 'gd', name: 'Scottish Gaelic; Gaelic', nativeName: 'Gàidhlig' },
        { code: 'gl', name: 'Galician', nativeName: 'Galego' },
        { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
        { code: 'ha', name: 'Hausa', nativeName: 'Hausa, هَوُسَ' },
        { code: 'he', name: 'Hebrew (modern)', nativeName: 'עברית' },
        { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी, हिंदी' },
        { code: 'hr', name: 'Croatian', nativeName: 'hrvatski' },
        { code: 'ht', name: 'Haitian; Haitian Creole', nativeName: 'Kreyòl ayisyen' },
        { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
        { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն' },
        { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
        { code: 'ig', name: 'Igbo', nativeName: 'Asụsụ Igbo' },
        { code: 'is', name: 'Icelandic', nativeName: 'Íslenska' },
        { code: 'it', name: 'Italian', nativeName: 'Italiano' },
        { code: 'ja', name: 'Japanese', nativeName: '日本語 (にほんご／にっぽんご)' },
        { code: 'ka', name: 'Georgian', nativeName: 'ქართული' },
        { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ тілі' },
        { code: 'km', name: 'Khmer', nativeName: 'ភាសាខ្មែរ' },
        { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
        { code: 'ko', name: 'Korean', nativeName: '한국어 (韓國語), 조선말 (朝鮮語)' },
        { code: 'ku', name: 'Kurdish', nativeName: 'Kurdî, كوردی‎' },
        { code: 'ky', name: 'Kirghiz, Kyrgyz', nativeName: 'кыргыз тили' },
        { code: 'lb', name: 'Luxembourgish, Letzeburgesch', nativeName: 'Lëtzebuergesch' },
        { code: 'lo', name: 'Lao', nativeName: 'ພາສາລາວ' },
        { code: 'lt', name: 'Lithuanian', nativeName: 'lietuvių kalba' },
        { code: 'lv', name: 'Latvian', nativeName: 'latviešu valoda' },
        { code: 'mg', name: 'Malagasy', nativeName: 'Malagasy fiteny' },
        { code: 'mi', name: 'Māori', nativeName: 'te reo Māori' },
        { code: 'mk', name: 'Macedonian', nativeName: 'македонски јазик' },
        { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
        { code: 'mn', name: 'Mongolian', nativeName: 'монгол' },
        { code: 'mr', name: 'Marathi (Marāṭhī)', nativeName: 'मराठी' },
        { code: 'ms', name: 'Malay', nativeName: 'bahasa Melayu, بهاس ملايو‎' },
        { code: 'mt', name: 'Maltese', nativeName: 'Malti' },
        { code: 'my', name: 'Burmese', nativeName: 'ဗမာစာ' },
        { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
        { code: 'no', name: 'Norwegian', nativeName: 'norsk' },
        { code: 'nl', name: 'Dutch', nativeName: 'Nederlands, Vlaams' },
        { code: 'pa', name: 'Panjabi, Punjabi', nativeName: 'ਪੰਜਾਬੀ, پنجابی‎' },
        { code: 'pl', name: 'Polish', nativeName: 'polski' },
        { code: 'ps', name: 'Pashto, Pushto', nativeName: 'پښتو' },
        { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
        { code: 'pt-BR', name: 'Portuguese, Brazillian', nativeName: 'Português' },
        { code: 'ro', name: 'Romanian, Moldavian, Moldovan', nativeName: 'română' },
        { code: 'ru', name: 'Russian', nativeName: 'русский язык' },
        { code: 'sd', name: 'Sindhi', nativeName: 'सिन्धी, سنڌي، سندھی‎' },
        { code: 'si', name: 'Sinhala, Sinhalese', nativeName: 'සිංහල' },
        { code: 'sk', name: 'Slovak', nativeName: 'slovenčina' },
        { code: 'sl', name: 'Slovene', nativeName: 'slovenščina' },
        { code: 'so', name: 'Somali', nativeName: 'Soomaaliga, af Soomaali' },
        { code: 'sq', name: 'Albanian', nativeName: 'Shqip' },
        { code: 'sr', name: 'Serbian', nativeName: 'српски језик' },
        { code: 'st', name: 'Southern Sotho', nativeName: 'Sesotho' },
        { code: 'sv', name: 'Swedish', nativeName: 'svenska' },
        { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
        { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
        { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
        { code: 'tg', name: 'Tajik', nativeName: 'тоҷикӣ, toğikī, تاجیکی‎' },
        { code: 'th', name: 'Thai', nativeName: 'ไทย' },
        { code: 'tl', name: 'Tagalog', nativeName: 'Wikang Tagalog, ᜏᜒᜃᜅ᜔ ᜆᜄᜎᜓᜄ᜔' },
        { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
        { code: 'tt', name: 'Tatar', nativeName: 'татарча, tatarça, تاتارچا‎' },
        { code: 'uk', name: 'Ukrainian', nativeName: 'українська' },
        { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
        { code: 'uz', name: 'Uzbek', nativeName: 'zbek, Ўзбек, أۇزبېك‎' },
        { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
        { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa' },
        { code: 'yi', name: 'Yiddish', nativeName: 'ייִדיש' },
        { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá' },
        { code: 'zh-CN', name: 'Chinese Simplified', nativeName: '中文' },
        { code: 'zh-TW', name: 'Chinese Traditional', nativeName: '文言' },
        { code: 'zu', name: 'Zulu', nativeName: 'Zulu' }
    ]
}

export const arrayToArrayBuffer = (string) => {
    let enc = new TextEncoder();
    return enc.encode(string);
}

// From npm fido2-helpers package
export const coerceToArrayBuffer = (buf, name) => {
    if (typeof buf === "string") {
        // base64url to base64
        buf = buf.replace(/-/g, "+").replace(/_/g, "/");
        // base64 to Buffer
        buf = Buffer.from(buf, "base64");
    }

    // Buffer or Array to Uint8Array
    if (buf instanceof Buffer || Array.isArray(buf)) {
        buf = new Uint8Array(buf);
    }

    // Uint8Array to ArrayBuffer
    if (buf instanceof Uint8Array) {
        buf = buf.buffer;
    }

    // error if none of the above worked
    if (!(buf instanceof ArrayBuffer)) {
        throw new TypeError(`could not coerce '${name}' to ArrayBuffer`);
    }

    return buf;
}

export const arrayBufferToBase64 = (buffer) => {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

export const arrayBufferToString = (buffer) => {
    return new TextDecoder().decode(buffer)
}

export const getWebauthnCredential = async (data) => {
    try {
        const {authenticationOptions, loginData, requestId} = data 
        let allowed_credentials = []
        authenticationOptions.allow_credentials.forEach((credential) => allowed_credentials.push({
            id: coerceToArrayBuffer(credential.id),
            type: credential.type,
        }))
        let cred = await navigator.credentials.get({
            publicKey: {
                challenge: arrayToArrayBuffer(authenticationOptions.challenge),
                rpId: authenticationOptions.rpId,
                allowCredentials: allowed_credentials,
                timeout: authenticationOptions.timeout,
            }
        })
        return {
            webauthn_credential: {
                id: cred.id,
                rawId: arrayBufferToBase64(cred.rawId),
                response: {
                    authenticatorData: arrayBufferToBase64(cred.response.authenticatorData),
                    clientDataJSON: arrayBufferToBase64(cred.response.clientDataJSON),
                    signature: arrayBufferToBase64(cred.response.signature),
                    userHandle: arrayBufferToBase64(cred.response.userHandle),
                },
                type: cred.type,
                authenticatorAttachment: cred.authenticatorAttachment,
                clientExtensionResults: cred.clientExtensionResults
            }, 
            request_id: requestId,
            ...loginData,
        }
    } catch (e) {
        throw e 
    }
}
