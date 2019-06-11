import { initRequest } from './fetch';

class ApiClient {
  parseResponse(response) {
    if (response.ok) {
      return response.json();
    } else {
      return null;
    }
  }

  get(url) {
    return fetch(
      url,
      initRequest({
        method: 'GET'
      })
    ).then(this.parseResponse);
  }

  post(url, payload) {
    return fetch(
      url,
      initRequest({
        body: JSON.stringify(payload),
        method: 'POST'
      })
    ).then(this.parseResponse);
  }

  delete(url) {
    return fetch(
      url,
      initRequest({
        method: 'DELETE'
      })
    ).then(this.parseResponse);
  }
}

export default new ApiClient();
