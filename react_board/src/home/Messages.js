import React, { useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import MessageInput from './MessageInput';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './styles.css';

//each entry of message should follow this format
const Message = ({ message }) => (
  <div className="message-container">
    <p className="message-body">{message.message_body}</p>
    <small className="timestamp">{new Date(message.created_at).toLocaleString()}</small>
  </div>
);


function Messages() {
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const messagesPerPage = 10;

  //filter to get the data from the desired date selected by user
  const fetchData = useCallback(async () => {
    try {
      let url = 'http://localhost:8001/getData';
  
      if (selectedDate) {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        url += `/${formattedDate}`; 
      }
      
      //send the API request for the messages
      const response = await axios.get(url);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error.message);
    }
  }, [selectedDate]);

  //call fetch data whenever the selected date changes
  useEffect(() => {
    fetchData();
  }, [fetchData, selectedDate]); 

  //retrieve all data again when the a new message is submitted
  const handleNewMessage = async () => {
    try {
      const response = await axios.get('http://localhost:8001/getData');
      setMessages(response.data); 
    } catch (error) {
      console.error('Error fetching messages:', error.message);
    }
  };

  //calculates the pages 
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);
  const totalPages = Math.max(1, Math.ceil(messages.length / messagesPerPage));

  //make each of the messages
  const renderMessages = () => {
    return currentMessages.map((message, index) => (
      <Message key={index} message={message} />
    ));
  };

  //handles when user clicks to the next or previous page to update the screen
  const paginate = (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    } else if (direction === 'next' && indexOfLastMessage < messages.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div>
      <MessageInput onMessageSubmit={handleNewMessage} />
      <div style={{ margin: '16px 0', display: 'flex', flexDirection: 'column' }}>
        <div>
          {renderMessages()}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <button
              onClick={() => paginate('prev')}
              disabled={currentPage === 1}
              className="pagination-button" 
            >
              Prev
            </button>
            <button
              onClick={() => paginate('next')}
              disabled={indexOfLastMessage >= messages.length}
              className="pagination-button" 
            >
              Next
            </button>
            <span style={{ margin: '0 4px', fontSize: '15px' }}>{`Page ${currentPage} of ${totalPages}`}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select a date"
              style={{ width: '100px', height: '100px' }}
            />
            <button onClick={() => setSelectedDate(null)} className="reset-button">
              Reset
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;

