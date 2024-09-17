import React, { useEffect, useState } from 'react';
import './ChatBot.css';
import { cars } from '../../assets/assets.js';

const ChatBot = () => {
    const [carModel, setCarModel] = useState('');
    const [carType, setCarType] = useState('');
    const [priceRange, setPriceRange] = useState('');
    const [customizePart, setCustomizePart] = useState('');
    const [prompt, setPrompt] = useState('');
    const [image, setImage] = useState('');
    const [remark, setRemark] = useState('');
    const [filteredCars, setFilteredCars] = useState([]);


    useEffect(() => {
        filterCars();
    }, [carType, priceRange]);

    const filterCars = () => {
        console.log('Selected Car Type:', carType);
        console.log('Selected Price Range:', priceRange);

        const filtered = cars.filter((car) => {
            const price = car['Price (INR)'];

            // Check if car type matches
            const typeMatches = car['Type'] === carType;

            // Determine if the price matches the selected range
            const priceMatches = (() => {
                switch (priceRange) {
                    case 'economy':
                        return price < 1000000;
                    case 'midrange':
                        return price >= 1000000 && price <= 2000000;
                    case 'premium':
                        return price > 2000000;
                    default:
                        return false;
                }
            })();

            console.log(`Checking car: ${car.Name} - Type Matches: ${typeMatches}, Price Matches: ${priceMatches}`);

            // Both type and price need to match
            return typeMatches && priceMatches;
        });

        console.log('Filtered Cars:', filtered);
        setFilteredCars(filtered);
    };

    async function generateAiImages(data) {
        try {
            const response = await fetch(
                "http://127.0.0.1:5000/generate", // Replace with your Flask server URL
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify({ prompt: data }),
                }
            );
            if (!response.ok) {
                console.error('HTTP error', response.status, response.statusText);
                const errorText = await response.text();
                console.error('Error details:', errorText);
                return null;
            }
            console.log(response);
            const result = await response.blob();
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Construct the sentence
        const sentence = `Change ${customizePart} of ${carModel} to ${prompt}`;
        console.log(sentence);

        // Call the async function to generate images
        const result = await generateAiImages(sentence);
        console.log(result);
        if (result) {
            const objectURL = URL.createObjectURL(result);
            setImage(objectURL);
            if (customizePart == "Exterior") {
                setRemark("A customization add-on of Rs 5,000 to Rs 25,000 will apply based on your choices.");
            }
            else {
                setRemark("A customization add-on of Rs 1,00,000 to Rs 3,00,000 will apply based on your choices.");
            }
        }
    };

    return (
        <div className="chat-bot">
            <div className='container'>
                <div className="container-left">
                    <div className="image-container">
                        {image
                            ? <img src={image} alt="Preview" />
                            : <p>Preview Image</p>
                        }
                    </div>
                    {remark
                    ?<div className="remark-holder">
                        <p id="remark"><span>Remark: </span>{remark}</p>
                        <p className='statement'>** ( The final price is negotiable )</p>
                    </div>
                    :<p></p>
                    }
                </div>
                <div className="container-right">
                    <form className='input-form' onSubmit={handleSubmit}>
                        <div className="user-input">
                        <div className="dropdown">
                                <div className="car-select-menu">
                                    <label htmlFor="carTypeSelect">Choose the car type:</label>
                                    <select
                                        id="carTypeSelect"
                                        value={carType}
                                        onChange={(e) => setCarType(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>Select the car type:</option>
                                        <option value="Sedan">Sedan</option>
                                        <option value="SUV">SUV</option>
                                        <option value="Hatchback">Hatchback</option>
                                    </select>
                                </div>
                                <div className="car-select-menu">
                                    <label htmlFor="priceRangeSelect">Choose the price range:</label>
                                    <select
                                        id="priceRangeSelect"
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>Select the range:</option>
                                        <option value="economy">&lt; 1,000,000 INR</option>
                                        <option value="midrange">1,000,000 - 2,000,000 INR</option>
                                        <option value="premium">&gt; 2,000,000 INR</option>
                                    </select>
                                </div>
                                <div className="car-select-menu">
                                    <label htmlFor="carModelSelect">Choose a car model:</label>
                                    <select
                                        id="carModelSelect"
                                        value={carModel}
                                        onChange={(e)=>setCarModel(e.target.value)}
                                        disabled={!carType || !priceRange}
                                        required
                                    >
                                        <option value="" disabled>Select a car model</option>
                                        {filteredCars.map((car, index) => (
                                            <option key={index} value={car.Name}>
                                                {car.Name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="part-select-menu">
                                    <label htmlFor="partSelect">What you want to customize:</label>
                                    <select
                                        id="partSelect"
                                        value={customizePart}
                                        onChange={(e) => setCustomizePart(e.target.value)}
                                        disabled={!carType || !priceRange}
                                        required
                                    >
                                        <option value="" disabled>Select a part</option>
                                        <option value="interior">Interior</option>
                                        <option value="exterior">Exterior</option>
                                    </select>
                                </div>
                            </div>
                            <div className="prompt-input">
                                <label htmlFor="prompt">Enter customization details:</label>
                                <textarea
                                    name="user-prompt"
                                    id="prompt"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button type='submit'>Preview</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
