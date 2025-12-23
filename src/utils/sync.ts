export const LOCAL_CHANGE_EVENT = 'lotus-local-change';

export const notifyLocalChange = (): void => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(LOCAL_CHANGE_EVENT));
};

