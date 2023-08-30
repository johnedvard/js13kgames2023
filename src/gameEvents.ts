export type EventType = 'tick' | 'split' | 'play' | 'wave' | 'web3';

const tickEvent = new CustomEvent('tick');
const playEvent = new CustomEvent('play');
const splitEvent = new CustomEvent('split', { detail: { data: {} } });
const waveEvent = new CustomEvent('wave', { detail: { data: {} } });
const web3Event = new CustomEvent('web3', { detail: { data: {} } });

export function emit(eventType: EventType, data?: any) {
  splitEvent.detail.data = data;
  window.dispatchEvent(getEvent(eventType));
}
export function on(eventType: EventType, callback) {
  window.addEventListener(eventType, callback);
}
export function off(eventType: EventType, callback) {
  window.removeEventListener(eventType, callback);
}

function getEvent(eventType: EventType) {
  switch (eventType) {
    case 'tick':
      return tickEvent;
    case 'split':
      return splitEvent;
    case 'play':
      return playEvent;
    case 'wave':
      return waveEvent;
    case 'web3':
      return web3Event;
  }
}
