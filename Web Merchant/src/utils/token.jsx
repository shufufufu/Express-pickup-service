const TOKENKEY = "token_key";

export function setToken(token) {
  return localStorage.setItem(TOKENKEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKENKEY);
}

export function clearToken() {
  return localStorage.removeItem(TOKENKEY);
}
