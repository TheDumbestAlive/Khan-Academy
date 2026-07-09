//jshint ignore:start
try{
    //Twelfth root of 2
    const r2 = pow (2, 1 / 12);
    const notes = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
    const startingFreq = 32.7;
    const startingOctave = 1;
    
    let e = eval;
    let ctx = e('new AudioContext()');
    let vol = ctx.createGain();
    vol.gain.value = 1;
    vol.connect(ctx.destination);
    
    function setVol (num) {
        vol.gain.value = num / 100;
    }
    
    function getNote (note) {
        note = note.split('');
        let pitch = note.filter(function (x) {
            return notes.includes(x);
        })[0];
        let octave = note.filter(function (x) {
            return [1, 2, 3, 4, 5, 6, 7, 8, 9].includes(Number(x));
        })[0];
        if(!octave || !pitch) {
            return;
        }
        let isSharp = Number(note.includes('#'));
        
        pitch = notes.indexOf(pitch);
        octave = Number(octave) - startingOctave;
        
        let semitones = pitch + (12 * octave) + isSharp;
        
        return startingFreq * pow(r2, semitones);
    }
    
    function playNote (note, duration, instrument, fade) {
        fade = Number(!!fade);
        
        if(instrument === 'saw'){
            instrument = 'sawtooth';
        }
        let freq = getNote(note);
        if(!freq) {
            return;
        }
        if(typeof duration !== 'number') {
            return;
        }
        
        if(!['sine', 'triangle', 'square', 'sawtooth'].includes(instrument)){
            instrument = 'sine';
        }
        
        let osc = ctx.createOscillator();
        let gain = ctx.createGain();
        gain.gain.value = 1;
        
        gain.connect(vol);
        osc.frequency.value = freq;
        osc.type = instrument;
        osc.connect(gain);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
    
        if(fade) {
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        }
    }
    
    function mouseClicked () {
        if (ctx.state === 'suspended') {
            ctx.resume();
            debug('AudioContext resumed');
        }
        else{
            playNote('b3', 1, 'square', 1);
        }
    }
}
catch (err) {
    println(err);
}
