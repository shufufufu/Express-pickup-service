const riderIdKEY = "riderId_key";

export function setRiderId(riderId) {
  return localStorage.setItem(riderIdKEY, riderId);
}

export function getRiderId() {
  return localStorage.getItem(riderIdKEY);
}

export function clearRiderId() {
  return localStorage.removeItem(riderIdKEY);
}
