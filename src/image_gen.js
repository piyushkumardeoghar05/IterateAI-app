// App.js
import classes from './Image_gen.module.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OPENAI_API_KEY = process.env.REACT_APP_OPEN_AI_KEY;

function App() {
    const [prompt, setPrompt] = useState('A cute baby sea otter');
    const [generatedImages, setGeneratedImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            generateImages();
        }, 1000);

        return () => clearTimeout(delayDebounceFn);
    }, [prompt]);

    async function generateImages() {
        setIsLoading(true);
        setIsError(false);

        try {
            const requestData = {
                prompt: prompt,
                n: 1,
                size: '256x256', // Set the desired image size here
            };

            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            };

            const response = await axios.post('https://api.openai.com/v1/images/generations', requestData, {
                headers: headers,
            });

            setGeneratedImages(response.data.data);
        } catch (error) {
            console.error('Error generating images:', error);
            if(prompt!='')
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className={classes.inputContainer}>
                <div className={classes.promptContainer}>
                    <label className={classes.promptstat} htmlFor="prompt">Enter a Prompt: </label>
                </div>
                <div className={classes.img_input}>
                    <input
                        type="text"
                        className={classes.inputfield}
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                    
                </div>
                {generatedImages.length > 0 && (
                        <div className={classes.allimgContainer}>
                            {generatedImages.map((image, index) => (
                                <div key={index} className={classes.imgContainer}>
                                    <img
                                        className={classes.image}
                                        src={image.url}
                                        style={{ width: '50px',borderRadius: '8px' }}
                                        alt={`Generated Image ${index}`}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
            </div>

            {isLoading ? (
                <div className={classes.loading}>Loading...</div>
            ) : (
                isError && (
                    <div className={classes.errorstat}>Some error occurred. Try searching something different.</div>
                )
            )}
        </div>
    );
}

export default App;
