export class Login {
  constructor() {
    this.url = {
      login: 'https://ajax.test-danit.com/api/cards/login',
      cards: 'https://ajax.test-danit.com/api/cards',
    };
  }

  async getTokenData({ email, password }) {
    const response = await fetch(this.url.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    if (response.status === 200) {
      const data = await response.text();
      this.saveToken(data);
      return data;
    }
    if ( response.status === 401 ) {
      localStorage.removeItem('tokenData');
    }
    if ( response.status === 500 ) {
      console.error(error)
      window.alert('Server ERROR!')
    }
   
    return false;
  }

  saveToken(token) {
    localStorage.setItem('tokenData', JSON.stringify(token));
  }
}
