//jshint ignore:start
/*
    The conversion process can be a little messy, and it involves a tiny bit of piracy. here are the steps you'll need to follow to correctly convert your musescore file. (I'll use an example score from here: 
    https://musescore.com/user/6530751/scores/1716371
    
    This process requires you to have a basic understanding of what's probably a virus or not.

    MAKE SURE YOU ALREADY HAVE TWO https://www.khanacademy.org/computer-programming/new/pjs TABS OPEN. In the first one, copy and paste this entire file. In the second one, copy and paste the contents of webAudioApiV3.js




    STEP ONE: Select your musescore file. Official scores DO NOT work with the converter I use. You may be able to find alternatives that do, if you search hard enough. I reccomend using the score listed above for the sake of demonstration.
        NOTE: Some scores simply don't work for a variety of reasons. The one I've chosen does. ALSO, make sure your score is in the format of https://musescore.com/user/[userId]/scores/[scoreId], otherwise it will not work.

    STEP TWO: Open this site: http://nanomidi.net/musescore-downloader
        NOTE: This site is almost DEFINITELY GOING TO GIVE YOU A VIRUS IF YOU'RE NOT CAREFUL! As with anything involving piracy, there is a risk involved. PLEASE DO NOT CLICK ON *ANY* SUSPICIOUS LINKS! Popups will ALWAYS 
        appear on your first click, and the site(s) they take you to is/are unsafe. If you don't want to put anything at risk, DO NOT DO THIS!

    STEP THREE: Paste your chosen musescore url into the input field.

    STEP FOUR: If no errors occur, you *should* see your file below the input box in a "downlad history" section. Click the "download MIDI" button next to your chosen file on the right.

    STEP FIVE: Open this site (safe): https://www.visipiano.com/midi-to-json-converter/

    STEP SIX: Click on the file select field, and add your MIDI file from step four.

    STEP SEVEN: Click on the field below the file select, and press CTRL-A + CTRL-C to copy the entire output

    STEP EIGHT: Open your tab with THIS PROJECT in Khan academy.

    STEP NINE: On the line after "let json;", type "json =", and then paste the output (don't worry about any code issues. There shouldn't be any if you did it right. The output is already JavaScript)

    STEP TEN... This is getting long...: Copy and paste the program's output into your tab with webAudioApiV3.js to replace the tracks variable already there.

    STEP ELEVEN: Click on the canvas, press restart, and if you did everything right, you should hear your song playing on Khan Academy!

    Side note: If you have another site in mind that has a MIDI copy of your chosen song, you can skip to step five instead.
*/


let time = millis();
let json;

if(!json) {
    println('Convert your MIDI files here: https://www.visipiano.com/midi-to-json-converter/');
    throw Error ('No JSON file added.');
}
let tracks = [];
let totalNotes = 0;
for(let i = 0; i < json.tracks.length; i++) {
    let track = json.tracks[i].notes;
    tracks[i] = [];
    for(let k = 0; k < track.length; k++) {
        tracks[i].push({
            note: track[k].name,
            time: track[k].time,
        });
    }
    totalNotes += k;
}
time = millis() - time;
let x = random(0, 3);
println('Done! (Took ' + time + 'ms to parse ' + totalNotes + ' total notes)');
println('TRACK STATS: ');
println(tracks.length + ' tracks total');
for(let i = 0 ; i < tracks.length; i++) {
    println('Track ' + i + ': ' + tracks[i].length + ' notes | ' + round(tracks[i][tracks[i].length - 1].time) + ' total seconds of playtime (from last note)');

}

function keyPressed () {
    try{
    println('let tracks = [');
    for(let i = 0; i < tracks.length; i++) {
        let trackStr = '[';
        for(let k = 0; k < tracks[i].length; k++) {
            trackStr += '{time: ' +tracks[i][k].time + ', note: "' + tracks[i][k].note + '"},';
        }
        trackStr += '],';
        println(trackStr);
    }
    println('];');
    }
    catch(err) {
        println(err);
    }
}
