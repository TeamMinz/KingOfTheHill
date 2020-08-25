const jwt = require('jsonwebtoken');

/**
 * Helper class for authentication against an EBS service.
 * Allows the storage of a token to be accessed across componenents.
 * This is not meant to be a source of truth.
 * Use only for presentational purposes.
 */
export default class Authentication {
  constructor(token, opaqueUserId) {
    this.state = {
      token,
      opaqueUserId,
      userId: false,
      isMod: false,
      role: '',
    };
  }

  isLoggedIn() {
    return this.state.opaqueUserId[0] === 'U' ? true : false;
  }

  // This does guarantee the user is a moderator-
  // this is fairly simple to bypass - so pass the JWT and verify
  // server-side that this is true. This, however,
  // allows you to render client-side UI for users
  // without holding on a
  // backend to verify the JWT.
  // Additionally, this will only show if the user
  // shared their ID, otherwise it will return false.
  isModerator() {
    return this.state.isMod;
  }

  // similar to mod status, this isn't always verifiable,
  // so have your backend verify before proceeding.
  hasSharedId() {
    return !!this.state.userId;
  }

  getUserId() {
    return this.state.userId;
  }

  getOpaqueId() {
    return this.state.opaqueUserId;
  }

  // set the token in the Authentication componenent state
  // this is naive, and will work with whatever token is returned.
  // under no circumstances should you use this logic to trust private data-
  // you should always verify the token on the backend
  // before displaying that data.
  setToken(token, opaqueUserId) {
    let isMod = false;
    let role = '';
    let userId = '';

    try {
      const decoded = jwt.decode(token);

      if (decoded.role === 'broadcaster' || decoded.role === 'moderator') {
        isMod = true;
      }

      userId = decoded.user_id;
      role = decoded.role;
    } catch (e) {
      token = '';
      opaqueUserId = '';
    }

    this.state = {
      token,
      opaqueUserId,
      isMod,
      userId,
      role,
    };
  }

  // checks to ensure there is a valid token in the state
  isAuthenticated() {
    if (this.state.token && this.state.opaqueUserId) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Makes a call against a given endpoint using a specific method.
   *
   * Returns a Promise with the Request() object per fetch documentation.
   *
   */

  makeCall(url, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
      if (this.isAuthenticated()) {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.state.token}`,
        };

        let bodyContent = null;

        if (method != 'GET' && body != null) {
          bodyContent = JSON.stringify(body);
        }

        fetch(url, {
          method,
          headers,
          body: bodyContent,
        })
            .then((response) => resolve(response))
            .catch((e) => reject(e));
      } else {
        reject(new Error('Unauthorized'));
      }
    });
  }
}
