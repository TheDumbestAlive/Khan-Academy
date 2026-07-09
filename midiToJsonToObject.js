//jshint ignore:start
let time = millis();

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
