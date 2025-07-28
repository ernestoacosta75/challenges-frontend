import { useEffect } from "react";
import { useState } from "react";
import ApiClient from "@services/ApiClient";

const ChallengeComponent = () => {
    const [challengeState, setChallengeState] = useState({
        a: '',
        b: '',
        user: '',
        message: '',
        guess: 0
    });

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const res = await ApiClient.challenge();

                if(res.ok) {
                    const json = await res.json();
                    setChallengeState(prevState => ({
                        ...prevState,
                        a: json.factorA,
                        b: json.factorB
                    }));
                } else {
                    setChallengeState(prevState => ({
                        ...prevState,
                        message: "Can't reach the server"
                    }));                    
                }
            } catch (error) {
                setChallengeState(prevState => ({
                    ...prevState,
                    message: "Error: server error or not available"
                }));                                    
            }
        };

        fetchChallenge();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setChallengeState(prevState => ({
            ...prevState,
            [name]: name === 'guess' ? Number(value) : value
        }));
    };

    const handleSubmitResult = async (event) => {
        event.preventDefault();

        try {
            const res = await ApiClient.sendGuess(challengeState.user, challengeState.a, challengeState.b, challengeState.guess);

            if (res.ok) {
                const json = await res.json();

                setChallengeState(prevState => ({
                    ...prevState,
                    message: json.correct
                        ? "Congratulations! Your guess is correct"
                        : `Oops! Your guess ${json.resultAttempt} is wrong, gut keep playing!`
                }));
            } else {
                setChallengeState(prevState => ({
                    ...prevState,
                    message: `Error: ${res.status} - Server error`
                }));
            }
        } catch (error) {
            console.error('Submission error:', error);
            setChallengeState(prevState => ({
                ...prevState,
                message: "Network error. Please try again."
            }));            
        }
    };

    const updateMessage = (m) => {
        setMessage(m);
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
            <div className="mb-4">
                <h3 className="text-lg font-semibold">Your new challenge is:</h3>
                <h1 className="text-2xl font-bold text-center">{challengeState.a} x {challengeState.b}</h1>
            </div>
            <form className="space-y-4" onSubmit={handleSubmitResult}>
                <label className="block text-sm font-medium text-gray-700">
                    Your alias:
                    <input 
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
                        type="text"
                        maxLength="12"
                        name="user"
                        value={challengeState.user}
                        onChange={handleChange} />
                </label>

                <label className="block text-sm font-medium text-gray-700">
                    Your guess:
                    <input 
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
                        type="number"
                        min="0"
                        name="guess"
                        value={challengeState.guess}
                        onChange={handleChange} />
                </label> 
                <input 
                    className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
                    type="submit" value="Submit"/>               
            </form>
            {challengeState.message && <h4 className="mt-4 text-center text-red-500">{challengeState.message}</h4>}
        </div>
    );
};

export default ChallengeComponent;