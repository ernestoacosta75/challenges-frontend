import { useEffect } from "react";
import { useState } from "react";
import ApiClient from "@services/ApiClient";
import LastAttemptsComponent from "@components/LastAttempts/LastAttemptsComponent";

const ChallengeComponent = ({ props }) => {
    const [a, setA] = useState("");
    const [b, setB] = useState("");
    const [user, setUser] = useState("");
    const [message, setMessage] = useState("");
    const [guess, setGuess] = useState(0);
    const [lastAttempts, setLastAttempts] = useState([]);

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const res = await ApiClient.challenge();

                if (res.ok) {
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

        // Validate inputs before submission
        if (!user) {
            updateMessage("Please enter a user alias");
            return;
        }

        if (guess === 0 || guess === null) {
            updateMessage("Please enter a valid guess");
            return;
        }

        try {
            const res = await ApiClient.sendGuess(user, a, b, guess);

            console.log('Submit Result Response:', res); // Debugging log

            if (res.ok) {
                try {
                    const json = await res.json();

                    console.log('Response JSON:', json); // Debugging log

                    if (json.correct) {
                        updateMessage("Congratulations! Your guess is correct");
                    } else {
                        updateMessage(`Oops! Your guess ${json.resultAttempt} is wrong, but keep playing!`);
                    }

                    // Fetch last attempts after successful submission
                    await updateLastAttempts(user);

                    // Refresh the challenge
                    await refreshChallenge();
                } catch (parseError) {
                    console.error('JSON Parsing Error:', parseError);
                    updateMessage("Error: Unable to parse server response");
                }
            } else {
                console.error('Server Response:', res.status, res.statusText);

                // Try to get more error details from the response
                try {
                    const errorBody = await res.text();
                    console.error('Error Response Body:', errorBody);
                    updateMessage(`Server error: ${res.status} ${errorBody}`);
                } catch (readError) {
                    updateMessage(`Server error: ${res.status} ${res.statusText}`);
                }
            }
        } catch (error) {
            console.error('Submission Error:', error);
            updateMessage("Error: server error or unavailable");
        }
    };

    const updateMessage = (m) => {
        setMessage(m);
    };

    const updateLastAttempts = async (userAlias) => {
        try {
            const res = await ApiClient.getAttempts(userAlias);

            console.log('Last Attempts Response:', res); // Debugging log

            if (res.ok) {
                const data = await res.json();

                console.log('Last Attempts Data:', data); // Debugging log

                setLastAttempts(data);
            } else {
                console.error('Attempts Fetch Error:', res.status, res.statusText);
                updateMessage("Error fetching last attempts");
            }
        } catch (error) {
            console.error('Last Attempts Error:', error);
            updateMessage("Error: could not retrieve last attempts");
        }
    };

    const refreshChallenge = async () => {
        try {
            const res = await ApiClient.challenge();

            console.log('Refresh Challenge Response:', res); // Debugging log

            if (res.ok) {
                const json = await res.json();
                setA(json.factorA);
                setB(json.factorB);

                // Reset guess
                setGuess(0);
            } else {
                console.error('Refresh Challenge Error:', res.status, res.statusText);
                updateMessage("Error refreshing challenge");
            }
        } catch (error) {
            console.error('Refresh Challenge Fetch Error:', error);
            updateMessage("Error: could not fetch new challenge");
        }
    };

    return (
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-md">
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
                        type="submit" value="Submit" />
                </form>
                {message && <h4 className="mt-4 text-center text-red-500">{message}</h4>}
            </div>

            <div className="p-4 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Last Attempts</h3>
                {lastAttempts.length > 0 ? (
                    <div className="overflow-auto max-h-96">
                        <LastAttemptsComponent lastAttempts={lastAttempts} />
                    </div>
                ) : (
                    <p className="text-gray-500 text-center">No attempts yet</p>
                )}
            </div>
        </div>
    );
};

export default ChallengeComponent;