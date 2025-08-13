class ApiClient {
    static SERVER_URL = "http://localhost:8080";
    static GET_CHALLENGE = "/challenges/random";
    static GET_ATTEMPTS_BY_ALIAS = "/attempts?alias=";
    static POST_RESULT = "/attempts";

    static challenge = () => {
        return fetch(ApiClient.SERVER_URL + ApiClient.GET_CHALLENGE);
    }

    static getAttempts = (userAlias) => {
        return fetch(ApiClient.SERVER_URL + ApiClient.GET_ATTEMPTS_BY_ALIAS + userAlias);
    }

    static sendGuess = (user, a, b, guess) => {
        return fetch(ApiClient.SERVER_URL + ApiClient.POST_RESULT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userAlias: user,
                factorA: a,
                factorB: b,
                guess: guess
            })
        });
    }
}

export default ApiClient;