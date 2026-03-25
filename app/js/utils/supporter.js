const SUPPORTER_KEY = 'supporter';

export const isSupporterUnlocked = () =>
    localStorage.getItem(SUPPORTER_KEY) === 'true';

export const unlockSupporter = (code) => {
    if (code && code.trim() === process.env.SUPPORTER_CODE) {
        localStorage.setItem(SUPPORTER_KEY, 'true');
        return true;
    }
    return false;
};

export const forceUnlockSupporter = () =>
    localStorage.setItem(SUPPORTER_KEY, 'true');

export const resetSupporter = () =>
    localStorage.removeItem(SUPPORTER_KEY);
