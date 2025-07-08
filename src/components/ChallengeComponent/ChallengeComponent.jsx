import { useEffect } from "react";
import { useState } from "react";
import ApiClient from "@services/ApiClient";

const ChallengeComponent = ({ props }) => {
    const [a, setA] = useState("");
    const [b, setB] = useState("");
    const [user, setUser] = useState("");
    const [message, setMessage] = useState("");
    const [guess, setGuess] = useState(0);

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const res = await ApiClient.challenge();

                if(res.ok) {
                    const json = await res.json();
                    setA(json.factorA);
                    setB(json.factorB);
                } else {
                    updateMessage("Can't reach the server");
                }
            } catch (error) {
                updateMessage("Error: server error or not available");
            }
        };

        fetchChallenge();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === 'guess') {
            setGuess(Number(value));
        } else {
            setUser(value);
        }
    };

    const handleSubmitResult = async (event) => {
        event.preventDefault();

        try {
            const res = await ApiClient.sendGuess(user, a, b, guess);

            if (res.ok) {
                const json = await res.json();

                if(json.correct) {
                    updateMessage("Congratulations! Your guess is correct");
                } else {
                    updateMessage(`Oops! Your guess ${json.resultAttempt} is wrong, gut keep playing!`);
                }
            } else {
                updateMessage("Error: server error or unavailable");
            }
        } catch (error) {
            updateMessage("Error: server error or unavailable");
        }
    };

    const updateMessage = (m) => {
        setMessage(m);
    };

    return (
        <div>
            <div>
                <h3>Your new challenge is:</h3>
                <h1>{a} x {b}</h1>
            </div>
            <form onSubmit={handleSubmitResult}>
                <label>
                    Your alias:
                    <input 
                        type="text"
                        maxLength="12"
                        name="user"
                        value={user}
                        onChange={handleChange} />
                </label>

                <label>
                    Your guess:
                    <input 
                        type="number"
                        min="0"
                        name="guess"
                        value={guess}
                        onChange={handleChange} />
                </label> 
                <br />
                <input type="submit" value="Submit"/>               
            </form>
            <h4>{message}</h4>
        </div>
    );
};

export default ChallengeComponent;