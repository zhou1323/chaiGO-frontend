const TOKEN_KEY = 'token_key';
const IS_SERVER = typeof window === 'undefined';

const setToken = (token: string) => {
  if (IS_SERVER) return;
  localStorage.setItem(TOKEN_KEY, token);
};

const getToken = (): string | null => {
  if (IS_SERVER) return null;
  return localStorage.getItem(TOKEN_KEY);
};

const removeToken = () => {
  if (IS_SERVER) return;
  localStorage.removeItem(TOKEN_KEY);
};

export { getToken, removeToken, setToken };
