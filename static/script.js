document.addEventListener('DOMContentLoaded', () => {
    const askButton = document.getElementById('askButton');
    const contextInput = document.getElementById('context');
    const questionInput = document.getElementById('question');
    const resultDiv = document.getElementById('result');
    const answerP = document.getElementById('answer');
    const loadingDiv = document.getElementById('loading');

    askButton.addEventListener('click', async () => {
        const context = contextInput.value;
        const question = questionInput.value;

        if (!context.trim() || !question.trim()) {
            alert('Please provide both a context and a question.');
            return;
        }

        // Show loading spinner and hide previous result
        loadingDiv.classList.remove('hidden');
        resultDiv.classList.add('hidden');

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ context, question }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Display the answer
            answerP.textContent = data.answer || 'No answer found.';
            resultDiv.classList.remove('hidden');

        } catch (error) {
            console.error('Failed to get an answer:', error);
            answerP.textContent = 'Failed to get an answer. Please check the console for details.';
            resultDiv.classList.remove('hidden');
        } finally {
            // Hide loading spinner
            loadingDiv.classList.add('hidden');
        }
    });
});