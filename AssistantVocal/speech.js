function ASR() {
    var self = this;
    this.tts = undefined;
    this.events = {};
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.speechRecognition = window.SpeechRecognition ? new window.SpeechRecognition() : undefined;
    this.enabled = (this.speechRecognition !== undefined);

    this.on = (event, callback) => { this.events[event] = callback }

    this.emit = (event, data) => {
        let callback = this.events[event];
        if (callback) callback(data);
    }

    this.start = (lang = 'fr-FR') => {
        console.log('starting ASR in ', lang);
        self.speechRecognition.continuous = true;
        self.speechRecognition.lang = lang;
        self.speechRecognition.interimResults = true;
        self.speechRecognition.maxAlternatives = 1;
        self.speechRecognition.onstart = (e) => onStart(e);
        self.speechRecognition.onend = (e) => onStop(e);
        self.speechRecognition.onresult = (e) => onInput(e);
        self.speechRecognition.onerror = (e) => self.stop();
        self.speechRecognition.onnomatch = (e) => self.stop();
        self.speechRecognition.onsoundstart = (e) => console.log('onSoundStart', e);
        self.speechRecognition.onsoundend = (e) => console.log('onSoundEnd', e);;
        self.speechRecognition.onaudiostart = (e) => console.log('onAudioStart', e);
        self.speechRecognition.onaudioend = (e) => console.log('onAudioEnd', e);
        self.speechRecognition.onspeechstart = (e) => console.log('onSpeechStart', e);
        self.speechRecognition.onspeechend = (e) => console.log('onSpeechEnd', e);
        //        console.log('TTS Status', this.tts.status)
        //        if(this.tts && this.tts.status === 'speaking')
        //             self.tts.on('stop', () => self.speechRecognition.start() );
        //        else self.speechRecognition.start(); 
        self.speechRecognition.start();
    }

    this.restart = (lang = 'fr-FR') => {
        self.speechRecognition.onend = (e) => self.start(lang);
        self.speechRecognition.stop()
    }

    this.stop = () => {
        self.speechRecognition.stop();
    }

    function onStart(e) {
        console.log('ASR::onStart', e);
        self.emit('start')
        self.noInputTimer = setTimeout(() => onTimeout(), 8000);
    }

    function onStop(e) {
        console.log('ASR::onStop', e);
        self.emit('stop')
    }

    function onTimeout() {
        console.log('ASR::onTimeout');
        self.emit('timeout');
        self.stop();
    }

    async function onInput(reco) {
        console.dir(self);
        if (self.noInputTimer) {
            clearTimeout(self.noInputTimer);
            self.noInputTimer = null
        }

        // console.dir(reco.results);
        let speech = getSpeech(reco.results);
        self.emit('speech', speech)
        console.log('text', speech.done);
        console.log('speech', speech)
        if (speech.speaking === '') self.stop();
        else console.log('still speaking...');

        function getSpeech(results) {
            let speech = { done: '', speaking: '' }
            for (let result of results)
                result.isFinal ? speech.done += result[0].transcript + '..' : speech.speaking += result[0].transcript + '..';
            return speech;
        }
    }

    function onNoInput(e) {
        self.stop();
    }

    function onNoMatch(e) {
        self.stop();
    }

    function nlu(text = '', model = []) {
        return new Promise(async(resolve) => {
            resolve()
        })

    }
}

function TTS() {
    var self = this;
    this.status = 'silence';
    this.events = [];
    this.voices = [];

    this.speechSynthesis = window.speechSynthesis;
    this.voices = this.speechSynthesis.getVoices() || [];
    speechSynthesis.onvoiceschanged = (() => self.voices = this.speechSynthesis.getVoices());

    this.on = (event, callback) => { this.events[event] = callback }

    this.emit = (event, data) => {
        console.log('textToSpeech.emit', event, data);
        let callback = this.events[event];
        if (callback) callback(data);
    }

    this.say = (text, lang = 'fr-FR') => {
        return new Promise(async(resolve) => {
            // console.log('tts voices', this.voices);
            console.log('TTS.Say', text);
            var voices = { 'en-US': '', 'en-GB': 'Daniel', 'fr-FR': 'Google français' };
            var request = new SpeechSynthesisUtterance(text);
            request.voice = this.voices.filter((v) => v.name === voices[lang]).pop() || this.voices.filter((v) => v.lang === lang).pop();
            request.pitch = 1.1;
            request.rate = 1.1;

            this.speechSynthesis.speak(request);

            request.onstart = ((e) => {
                console.log('tts started..');
                self.status = 'speaking';
                self.emit('start', text)
            })
            request.onend = ((e) => {
                console.log('tts stopped..');
                self.status = 'silence';
                self.emit('stop');
                resolve()
            });

        });
    }
}

window.asr = new ASR()
window.tts = new TTS()
    // console.dir(tts.voices.filter( v => v.lang==='fr-FR'))