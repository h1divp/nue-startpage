const config = {
    name: "Internet User",
    detectKeyPress: true,
    useTodMessage: true,
    useDefaultMessage: true,
    useTheme: "default",
    defaultMessage: "Want to go somewhere?",
    themes: {
        default: {
            "bgColor": "#FFF",
            "groupColor": "#ffe5d9",
            "textColor": "#000",
            "textHoverColor": "#C14600"
        },
        dark: {
            "timeOfDay": true,
            // Time interval (24hr) that the theme will be turned on.
            "themeBegin": 15,
            "themeEnd": 8,

            "bgColor": "#121212",
            "groupColor": "#1D1D1D",
            "textColor": "#FFF",
            "textHoverColor": "#ffe5d9"
        },
        mint: {
            "bgColor": "#cfffef",
            "groupColor": "#b7e4c7",
            "textColor": "#1b4332",
            "textHoverColor": "#2d6a4f"
        }
    }
}

const bookmarks = {
// Group names must be different. Link must also be full URLs.

    "Study": {
        d: {
            name: "Google Drive",
            url: "#"
        },
        c: {
            name: "Canvas",
            url: "#"
        },
    },
    "Work": {
        1: {
            name: "Gmail",
            url: "#"
        },
        2: {
            name: "Outlook",
            url: "#"
        }
    },
    "Leisure": {
        y: {
            name: "Youtube",
            url: "#"
        },
        h: {
            name: "Hacker News",
            url: "#"
        }
    },
    "Music": {
        2: {
            name: "Spotify",
            url: "#"
        },
        s: {
            name: "Soundcloud",
            url: "#"

        }

    },
    "Productivity": {
        t: {
            name: "Toggl Track",
            url: "#"
        },
        C: {
            name: "Calendar",
            url: "#"
        }
    },
    "Programming": {
        g: {
            name: "Github",
            url: "#"
        },
        S: {
            name: "Slack",
            url: "#"
        },
        C: {
            name: "C++ style guide",
            url: "#"
        },
        v: {
            name: "Vim keyboard shortcuts",
            url: "#"
        }
    },
    "Social": {
        D: {
            name: "Discord",
            url: "#"
        },
        i: {
            name: "Instagram",
            url: "#"
        },
        r: {
            name: "Reddit",
            url: "#"
        }
    },
    "Misc": {
        A: {
            name: "Internet Archive",
            url: "#"
        },  
        w: {
            name: "Weather",
            url: "#"
        }
    }
}

const headerMessage = () => {
    const date = new Date();
    const hour = date.getHours();
    let message = "";

    if (config.useDefaultMessage) {
        message = config.defaultMessage;
    }
    if (!config.useTodMessage) {
        return message;
    }

    if ((hour => 0) && (hour < 5)) {
        message = `You're up pretty late, ${config.name}.`;
    }
    else if ((hour >=5) && (hour < 8)) {
        message = `Getting an early start ${config.name}?`;
    }
    else if ((hour => 8) && (hour < 11)) {
        message = `Good morning, ${config.name}.`;
    }
    else if ((hour => 11) && (hour < 17)) {
        message = `Time to get stuff done, ${config.name}.`;
    }
    else if ((hour => 17) && (hour < 20)) {
        message = `Good evening, ${config.name}.`;
    }
    else if ((hour => 20) && (hour < 24)) {
        message = `Time to wrap things up, ${config.name}.`;
    }

    return message;
}

const clock = () => {
    const date = new Date();
    const hour = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();

    console.log(hour, min, sec);
}

const setTheme = (theme) => {
    if (!config.themes.hasOwnProperty(theme)) {
        window.alert(`Error: theme "${theme}" does not exist.`);
    }

    if (!config.themes[theme].timeOfDay) {
        injectColors(theme);
    }

    const date = new Date();
    const hour = date.getHours();
    const begin = config.themes[theme].themeBegin;
    const end = config.themes[theme].themeEnd;

    if ((begin || end) > 24) {
        return window.alert("Error: theme begin/end values are not 0-24.");
    }

    if (begin < end) {
        // if between specified times, use selected theme.
        if ((hour >= begin) && (hour <= end)) injectColors(theme);
    } else {
        // if between begin-24 or 0-end, use selected theme.
        if ((hour >= begin) || (hour <= end)) injectColors(theme);
    }
}

const injectColors = (theme) => {
    const root = document.documentElement;
    root.style.setProperty("--bg-color", config.themes[theme].bgColor);
    root.style.setProperty("--group-color", config.themes[theme].groupColor);
    root.style.setProperty("--text-color", config.themes[theme].textColor);
    root.style.setProperty("--text-hover-color", config.themes[theme].textHoverColor);
}

const detectKeyPress = (bookmarks, config) => {
    addEventListener("keypress", (e) => {
        for (const [key, val] of Object.entries(bookmarks)) {
            for (const [bkKey, bkVal] of Object.entries(val)) {
                if (!bkVal.name || !bkVal.url) continue;
                if (e.key === bkKey) {
                    window.location.href = bkVal.url;
                }
            }
        }
    });
}

const populateBookmarks = () => {
    class Bookmarks extends HTMLElement {
        constructor() {
            super();
            this.renderBookmarks();
        }

        renderBookmarks() {
            const groupTemplate = document.querySelector("#bookmark-group-template")
            const bookmarkTemplate = document.querySelector("#bookmark-template");

            for (const [key, val] of Object.entries(bookmarks)) {
                const groupclone = groupTemplate.content.cloneNode(true);
                groupclone.querySelector(".group-header").innerText = key;

                for (const [bkKey, bkVal] of Object.entries(val) ) {
                    if(!bkVal.name || !bkVal.url) continue;

                    const clone = bookmarkTemplate.content.cloneNode(true);
                    const bookmark = clone.querySelector(".bookmark");

                    bookmark.href = bkVal.url;
                    clone.querySelector(".shortcut").innerText = bkKey;
                    clone.querySelector(".name").innerText = bkVal.name;
                    groupclone.querySelector(".group").appendChild(clone);
                    
                }

                // Who said we needed a shadow root? lmao
                const row = document.querySelector(".row");
                row.appendChild(groupclone);
            }

        }
    }
    customElements.define('bookmarks-component', Bookmarks);
}

document.addEventListener("DOMContentLoaded", function(event) { 
    document.querySelector("#headerMessage").innerHTML = headerMessage();
    populateBookmarks();
    if (config.useTheme) setTheme(config.useTheme);
    if (config.detectKeyPress) detectKeyPress(bookmarks, config);
});    

