// export class Sound {
//   /** Create a sound object and cache the zzfx samples for later use
//    *  @param {Array}  zzfxSound - Array of zzfx parameters, ex. [.5,.5]
//    *  @param {Number} [range=soundDefaultRange] - World space max range of sound, will not play if camera is farther away
//    *  @param {Number} [taper=soundDefaultTaper] - At what percentage of range should it start tapering off
//    */
//   constructor(zzfxSound, range = soundDefaultRange, taper = soundDefaultTaper) {
//     if (!soundEnable) return;

//     /** @property {Number} - World space max range of sound, will not play if camera is farther away */
//     this.range = range;

//     /** @property {Number} - At what percentage of range should it start tapering off */
//     this.taper = taper;

//     // get randomness from sound parameters
//     this.randomness = zzfxSound[1] || 0;
//     zzfxSound[1] = 0;

//     // generate sound now for fast playback
//     this.cachedSamples = zzfxG(...zzfxSound);
//   }

//   /** Play the sound
//    *  @param {Vector2} [pos] - World space position to play the sound, sound is not attenuated if null
//    *  @param {Number}  [volume=1] - How much to scale volume by (in addition to range fade)
//    *  @param {Number}  [pitch=1] - How much to scale pitch by (also adjusted by this.randomness)
//    *  @param {Number}  [randomnessScale=1] - How much to scale randomness
//    *  @return {AudioBufferSourceNode} - The audio, can be used to stop sound later
//    */
//   play(pos, volume = 1, pitch = 1, randomnessScale = 1) {
//     if (!soundEnable) return;

//     let pan;
//     if (pos) {
//       const range = this.range;
//       if (range) {
//         // apply range based fade
//         const lengthSquared = cameraPos.distanceSquared(pos);
//         if (lengthSquared > range * range) return; // out of range

//         // attenuate volume by distance
//         volume *= percent(lengthSquared ** 0.5, range, range * this.taper);
//       }

//       // get pan from screen space coords
//       pan = (worldToScreen(pos).x * 2) / mainCanvas.width - 1;
//     }

//     // play the sound
//     const playbackRate = pitch + pitch * this.randomness * randomnessScale * rand(-1, 1);
//     return playSamples([this.cachedSamples], volume, playbackRate, pan);
//   }

//   /** Play the sound as a note with a semitone offset
//    *  @param {Number}  semitoneOffset - How many semitones to offset pitch
//    *  @param {Vector2} [pos] - World space position to play the sound, sound is not attenuated if null
//    *  @param {Number}  [volume=1] - How much to scale volume by (in addition to range fade)
//    *  @return {AudioBufferSourceNode} - The audio, can be used to stop sound later
//    */
//   playNote(semitoneOffset, pos, volume) {
//     if (!soundEnable) return;

//     return this.play(pos, volume, 2 ** (semitoneOffset / 12), 0);
//   }
// }
