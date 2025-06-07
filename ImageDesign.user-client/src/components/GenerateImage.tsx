import React, { useState } from 'react';
import axios from 'axios';

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateImage = async () => {
        setLoading(true);
        setError(null);
        setImageUrl(null);

        try {
            const response = await axios.post('http://localhost:5083/api/Ai/generate', { prompt });
            setImageUrl(response.data);
        } catch (err) {
            setError('Failed to generate image. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Image Generator</h1>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here"
                rows={4}
                style={{ width: '100%' }}
            />
            <button onClick={handleGenerateImage} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Image'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {imageUrl && (
                <div>
                    <h2>Generated Image:</h2>
                    <img src={imageUrl} alt="Generated" style={{ maxWidth: '100%' }} />
                </div>
            )}
        </div>



    );
};

export default ImageGenerator;
