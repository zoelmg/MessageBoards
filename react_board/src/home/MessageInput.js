import React, { useState } from 'react';
import Axios from 'axios';
import './styles.css';


const MessageInput = ({ onMessageSubmit }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    // Clear the error message when the user types
    setErrorMessage('');
  };


  const handleProfanityCheck = async () => {
    try {
      const apiKey = 'j8b6o0VFugEhyuv+gdpB/Q==KPP48jS9swq0cO88';
      const headers = {
        'X-Api-Key': apiKey,
      };
  
      const response = await Axios.get(`https://api.api-ninjas.com/v1/profanityfilter?text=${encodeURIComponent(inputMessage)}`, { headers });
      console.log('Profanity filter API response:', response.data);
  
      const { original, censored, has_profanity } = response.data;
  
      if (has_profanity) {
        setInputMessage('');
        return { censored, has_profanity };
      }

      return { original, has_profanity };
    } catch (error) {
      console.error('Error checking profanity:', error);
      setErrorMessage('An error occurred while checking profanity. Please try again.');
      throw new Error('Error checking profanity');
    }
  };

  const handleSubmit = async () => {
    // Check that the input message is not empty
    if (inputMessage.length < 1) {
      setErrorMessage('Cannot enter an empty message');
      return;
    }
  
    // Check that the input message is not longer than 128 characters
    if (inputMessage.length > 128) {
      setErrorMessage('Cannot be longer than 128 characters');
      return;
    }

    //check that the input is not profanity
    const { has_profanity, censored } = await handleProfanityCheck();
    //if it is, set error message and don't insert the message
    if (has_profanity) {
      setErrorMessage(`please revise your message, profanity is not allowed in this space :(`);
      return;
    }
  
    //all of the above constraints are met, try logging message
    try {
      const response = await Axios.post("http://localhost:8001/insertData", {
        message_body: censored || inputMessage // Use censored version if available, otherwise use original
      });
  
      console.log('Message submitted successfully:', response.data);
      //reset the input message to empty
      setInputMessage('');
      onMessageSubmit();
    } catch (error) {
      console.error('Failed to submit message:', error.message);
    }
  };

  return (
    <div className="message-input-container">
      <div className="input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          placeholder="Type your message here"
          className="message-input" 
        />
        <button
          onClick={handleSubmit}
          className="post-button" 
        >
          Post!
        </button>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default MessageInput;
