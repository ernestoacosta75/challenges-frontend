const LastAttemptsComponent = ({ lastAttempts }) => {
    return (
        <div className="w-full">
            <table className="w-full table-fixed border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2 px-4 text-left w-1/4">Challenge</th>
                        <th className="py-2 px-4 text-left w-1/4">Your guess</th>
                        <th className="py-2 px-4 text-left w-1/2">Result</th>
                    </tr>
                </thead>
                <tbody>
                    {lastAttempts.map((a, index) => (
                        <tr 
                            key={a.id || index} 
                            className={`border-b ${a.correct ? 'bg-green-50' : 'bg-red-50'}`}
                        >
                            <td className="py-2 px-4">
                                <span className={a.correct ? 'text-green-700' : 'text-red-700'}>
                                    {a.factorA} x {a.factorB}
                                </span>
                            </td>
                            <td className="py-2 px-4">
                                <span className={a.correct ? 'text-green-700' : 'text-red-700'}>
                                    {a.resultAttempt}
                                </span>
                            </td>
                            <td className="py-2 px-4">
                                <span 
                                    className={`${a.correct ? 'text-green-700' : 'text-red-700'} inline-block w-full`}
                                    title={!a.correct ? `Incorrect (Correct answer: ${a.factorA * a.factorB})` : ''}
                                >
                                    {a.correct 
                                        ? "Correct" 
                                        : `Incorrect (Correct answer: ${a.factorA * a.factorB})`
                                    }
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}; 

export default LastAttemptsComponent;
