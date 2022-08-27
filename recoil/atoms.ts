import { atom, AtomEffect } from "recoil";

// ref. https://recoiljs.org/docs/guides/atom-effects#local-storage-persistence
const localStorageEffect = (key: string): AtomEffect<string | null> => {
  return ({ setSelf, onSet, getPromise }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(savedValue);
    }

    onSet((newValue, _, isReset) => {
      isReset ? localStorage.removeItem(key) : localStorage.setItem(key, newValue ?? "");
    });
  };
};

export const nicknameState = atom<string | null>({
  key: "nicknameState",
  default: null,
  effects: [localStorageEffect("nickname")],
});
