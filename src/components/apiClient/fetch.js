export const initRequest = req => {
  const headers = new Headers();
  headers.append('Accept', 'application/json, text/plain');
  headers.append('Content-Type', 'application/json');
  headers.append('pragma', 'no-cache');
  headers.append('Cache-control', 'no-cache, no-store');

  return Object.assign(
    {
      method: 'GET',
      headers,
      mode: 'cors',
      cache: 'no-store',
      credentials: 'same-origin'
    },
    req || {}
  );
};
