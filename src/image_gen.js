// App.js
import classes from './Image_gen.module.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UNSPLASH_KEY = "ztTcKBc2b81fJZTHkOhw-kz8JAHp33RhB0332Tq4EUI";
// console.log(process.env.REACT_APP_UNSPLASH_ACCESS_KEY);

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
            const response = await axios.get('https://api.unsplash.com/photos/random', {
                params: {
                    query: prompt,
                    client_id: UNSPLASH_KEY,
                },
            });

            setGeneratedImages([{ url: response.data.urls.regular }]);
        } catch (error) {
            console.error('Error generating images:', error);
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
                                        style={{ width: '50px',borderRadius: '8px',height:'50px' }}
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
