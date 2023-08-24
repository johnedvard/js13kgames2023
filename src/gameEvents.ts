export type EventType = 'tick' | 'split';

const tickEvent = new CustomEvent('tick');
const splitEvent = new CustomEvent('split', { detail: { data: {} } });

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
  }
}
