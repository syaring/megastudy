// src/utils/cookies.ts
export const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/`;
};

export const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) return parts.pop()?.split(';').shift();

  return null;
};

export const removeCookie = (name: string) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const clearAllCookies = () => {
  const cookies = ['access_token', 'user_id', 'refresh_token', 'username'];

  cookies.forEach(cookie => removeCookie(cookie));
};
