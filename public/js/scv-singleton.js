(function(exports) {
    const DEFAULT_VOICES = [{
        name: 'Amy',
        value: 'recite',
        label: 'Amy (slower)',
    },{
        name: 'Russell',
        value: 'recite',
        label: 'Russell for general listening and high-frequency hearing loss (medium)',
    },{
        name: 'Raveena',
        value: 'review',
        label: 'Raveena (faster)',
    }];

    const IPS_CHOICES = [{
        url: '',
        label: "Launch Sutta Player without sound",
        value: 0,
    },{
        url: '/audio/rainforest-ambience-glory-sunz-public-domain.mp3',
        label: "Play Rainforest Ambience Glory Sunz (Public Domain)",
        volume: 0.1,
        value: 1,
    },{
        url: '/audio/indian-bell-flemur-sampling-plus-1.0.mp3',
        label: "Play Indian Bell by Flemur (Sampling Plus 1.0)",
        volume: 0.1,
        value: 2,
    },{
        url: '/audio/tibetan-singing-bowl-horst-cc0.mp3',
        label: "Play Tibetan Singing Bowl by Horst (CC0)",
        volume: 0.3,
        value: 3,
    },{
        url: '/audio/jetrye-bell-meditation-cleaned-CC0.mp3',
        label: "Play Bell Meditation Cleaned by JetRye (CC0)",
        volume: 0.1,
        value: 4,
    },{
        url: '/audio/STE-004-Coemgenu.mp3',
        label: "Play Mid-range Singing Bell by Coemgenu (Public Domain)",
        volume: 0.5,
        value: 5,
    }];

    const EXPIRES = {
        expires: "100Y",
    };

    class ScvSingleton { 
        constructor(g) {
            this.showId = false;
            this.iVoice = 0;
            this.scid = null;
            this.showLang = 0;
            this.search = null;
            this.maxResults = 5;
            this.ips = 4;
            this.lang = 'en';
            if (g == null) {
                throw new Error(`g is required`);
            }
            Object.defineProperty(this, "_user", {
                writable: true,
                value: {
                    username: null,
                    isAdmin: false,
                    token: null,
                },
            });
            Object.defineProperty(this, "vueRoot", {
                writable: true,
                value: null,
            });
            Object.defineProperty(this, "g", {
                value: g,
            });
            Object.defineProperty(this, "title", {
                writable: true,
                value: "no title",
            });
        }

        get user() {
            return this._user;
        }

        set user(value) {
            var g = this.g;
            g.Vue.set(this._user, "username", value.username);
            g.Vue.set(this._user, "token", value.token);
            g.Vue.set(this._user, "isAdmin", value.isAdmin);
        }

        get ipsChoices() {
            return IPS_CHOICES;
        }

        get voices() {
            return DEFAULT_VOICES;
        }

        get useCookies() {
            var g = this.g;
            return this.vueRoot 
                ? this.vueRoot.$cookie.get("useCookies") === 'true'
                : false;
        }

        get showPali( ){
            return this.showLang === 0 || this.showLang === 1;
        }

        get showTrans(){
            return this.showLang === 0 || this.showLang === 2;
        }

        set useCookies(value) {
            if (value) {
                this.vueRoot.$cookie.set("useCookies", value, EXPIRES);
            } else {
                this.vueRoot.$cookie.delete("useCookies");
            }
        }

        deleteCookies() {
            this.vueRoot.$cookie.delete('useCookies');
            Object.keys(this).forEach(key => {
                this.vueRoot.$cookie.delete(key);
            });
            console.log('cookies deleted');
        }

        loadCookie(prop) {
            var g = this.g;
            var v = this.vueRoot.$cookie.get(prop);
            if (v === 'false') {
                g.Vue.set(this, prop, false);
            } else if (v === 'true') {
                g.Vue.set(this, prop, true);
            } else if (v != null) {
                var vnum = Number(v);
                g.Vue.set(this, prop, `${vnum}`===v ? vnum : v);
            }
        }

        changed(prop) {
            var cookie = this.vueRoot.$cookie;
            var v = this[prop];
            if (v != null && this.vueRoot) {
                if (this.useCookies) {
                    cookie.set(prop, v, EXPIRES);
                    console.log(`setting cookie (${prop}):${v}`,
                        `${this.vueRoot.$cookie.get(prop)}`, 
                        typeof this.vueRoot.$cookie.get(prop));
                }
                if (prop === 'useCookies') {
                    if (v) {
                        cookie.set( "showId", this.showId, EXPIRES);
                        cookie.set( "iVoice", this.iVoice, EXPIRES);
                        cookie.set( "maxResults", this.maxResults, EXPIRES);
                        cookie.set( "showLang", this.showLang, EXPIRES);
                        cookie.set( "ips", this.ips, EXPIRES);
                        cookie.set( "useCookies", this.useCookies, EXPIRES);
                        console.log(`saved settings to cookies`, cookie);
                    } else {
                        Object.keys(this).forEach(key => {
                            cookie.delete(key);
                        });
                    }
                }
            }
        }

        hash(opts={}) {
            var state = Object.assign({}, this, opts);
            var hash = '';
            if (this.useCookies) {
                var search = state.search || '';
                hash = `#/?search=${search}`;
            } else {
                hash = Object.keys(state).sort().reduce((acc,key) => {
                    var val = state[key];
                    if (val != null) {
                        if (acc == null) {
                            acc = `#/?`;
                        } else {
                            acc = acc + '&';
                        }
                        acc += `${key}=${state[key]}`;
                    }
                    return acc;
                }, null);
            }
            return `${hash}`;
        }

        url(opts={}) {
            var g = this.g;
            var hash = this.hash(opts);
            var loc = g.window.location;
            var r = Math.random();
            return `${loc.origin}${loc.pathname}?r=${r}${hash}`;
        }

        reload(opts={}) {
            var g = this.g;
            Object.assign(this, opts);
            var url = this.url();
            console.debug("main.scvState.reload()", url);
            g.window.location.href = url;
            return;
        }

        mounted(vueRoot) {
            this.vueRoot = vueRoot;
            if (this.useCookies) {
                Object.keys(this).forEach(key => {
                    this.loadCookie(key);
                });
            }
        }

        duration(nSegments){
            const DN33_PACE = (2*3600 + 0*60 + 27)/(1158);
            var secondsPerSegment =
                (this.showPali ? DN33_PACE * 1.8 : 0) +
                (this.showTrans ? DN33_PACE : 0);
            var totalSeconds = Math.trunc(nSegments * secondsPerSegment);
            var seconds = totalSeconds;
            var hours = Math.trunc(seconds / 3600);
            seconds -= hours * 3600;
            var minutes = hours 
                ? Math.ceil(seconds / 60)
                : Math.trunc(seconds / 60);
            seconds = hours ? 0 : seconds - minutes * 60;
            if (hours) {
                var display =  `${hours}h ${minutes}m`; 
                var aria = `${hours} hours and ${minutes} minutes`;
            } else if (minutes) {
                var display =  `${minutes}m ${seconds}s`;
                var aria = `${minutes} minutes and ${seconds} seconds`;
            } else if (seconds) {
                var display =  `${seconds}s`;
                var aria = `${seconds} seconds`;
            } else {
                var display = `--`;
                var aria = `0 seconds`;
            }
            return {
                totalSeconds,
                hours,
                minutes,
                seconds,
                display,
                aria,
            }
        }
    }

    module.exports = exports.ScvSingleton = ScvSingleton;
})(typeof exports === "object" ? exports : (exports = {}));

