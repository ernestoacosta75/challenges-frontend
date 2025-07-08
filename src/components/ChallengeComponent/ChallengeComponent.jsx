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
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
            <div className="mb-4">
                <h3 className="text-lg font-semibold">Your new challenge is:</h3>
                <h1 className="text-2xl font-bold text-center">{a} x {b}</h1>
            </div>
            <form className="space-y-4" onSubmit={handleSubmitResult}>
                <label className="block text-sm font-medium text-gray-700">
                    Your alias:
                    <input 
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
                        type="text"
                        maxLength="12"
                        name="user"
                        value={user}
                        onChange={handleChange} />
                </label>

                <label className="block text-sm font-medium text-gray-700">
                    Your guess:
                    <input 
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
                        type="number"
                        min="0"
                        name="guess"
                        value={guess}
                        onChange={handleChange} />
                </label> 
                <input 
                    className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
                    type="submit" value="Submit"/>               
            </form>
            {message && <h4 className="mt-4 text-center text-red-500">{message}</h4>}
        </div>
    );
};

export default ChallengeComponent;