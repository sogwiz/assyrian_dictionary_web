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

export const CHECKOUT_URL = 'https://sargonsays.memberful.com/checkout?plan=146420';

// Call in componentDidMount of any page that has a checkout link,
// so Memberful re-scans after React Router client-side navigation.
export const setupMemberful = () => {
    if (window.MemberfulEmbedded) {
        window.MemberfulEmbedded.setup();
    }
};
