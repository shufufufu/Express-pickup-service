const DTOKEN_KEY = "dynamic_token_key";
const DTOKEN_TIMESTAMP = "dynamic_token_timestamp";
const DTOKEN_EXPIRE_TIME = 3600000; // 1小时(毫秒)

export function setDynamicToken(token) {
  localStorage.setItem(DTOKEN_KEY, token);
  localStorage.setItem(DTOKEN_TIMESTAMP, Date.now().toString());
}

export function getDynamicToken() {
  const token = localStorage.getItem(DTOKEN_KEY);
  const timestamp = localStorage.getItem(DTOKEN_TIMESTAMP);

  if (!token || !timestamp) return null;

  const now = Date.now();
  const tokenAge = now - parseInt(timestamp);

  if (tokenAge > DTOKEN_EXPIRE_TIME) {
    clearDynamicToken();
    return null;
  }

  return token;
}

export function clearDynamicToken() {
  localStorage.removeItem(DTOKEN_KEY);
  localStorage.removeItem(DTOKEN_TIMESTAMP);
}

export function canRequestNewDynamicToken() {
  const timestamp = localStorage.getItem(DTOKEN_TIMESTAMP);
  if (!timestamp) return true;

  const now = Date.now();
  const tokenAge = now - parseInt(timestamp);
  return tokenAge > DTOKEN_EXPIRE_TIME;
}
