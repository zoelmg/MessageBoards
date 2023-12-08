const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const supabase = require('./db');

const app = express();
const port = 8001;

app.use(cors());
app.use(bodyParser.json());

//Setting up the backend server
app.get('/', async (req, res) => {
  res.send('Hello World! Testing backend server!');
});


// Route to fetch data from the database with no date filter
app.get('/getData', async (req, res) => {
  try {
    const { date } = req.query;
    let query= supabase
      .from('Messages')
      .select('message_body, created_at')
      .order('created_at', { ascending: false })

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching data:', error.message);
      res.status(500).send('Server Error');
      return;
    }

    res.json(data);
  } catch (error) {
    console.error('Unexpected error:', error.message);
    res.status(500).send('Server Error');
  }
});


// Route to fetch data from the database with date filter
app.get('/getData/:date', async (req, res) => {
  try {
    const { date } = req.params;
    console.log('passed in:', date);


 //There is a weird time converting bug here
 //Get request from Postman  works fine 
 //console log also reflects Postman time stamp to be correct but for some reason React 
 //converts the time into another time zone
 //Input for Postman: http://localhost:8001/getData/'2023-12-08'
 //Output Log: passed in: '2023-12-08'
            // Start of the day: 12/08/2023, 12:00:00 AM
            // End of the day: 12/08/2023, 11:59:59 PM
 //Input for React: click on the button
 //Output Log: passed in: 2023-12-08
            // Start of the day: 12/07/2023, 12:00:00 AM
            // End of the day: 12/07/2023, 11:59:59 PM
  const startdate = new Date(date);
  const endDate = new Date(date);
  startdate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  const isoStartDate = startdate.toISOString();
  const isoEndDate = endDate.toISOString();

  //Format to New York Time
const options = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZone: 'America/New_York',
};

const formattedStartDate = new Date(isoStartDate).toLocaleString('en-US', options);
const formattedEndDate = new Date(isoEndDate).toLocaleString('en-US', options);

console.log('Start of the day:', formattedStartDate);
console.log('End of the day:', formattedEndDate);

    let query = supabase
      .from('Messages')
      .select('message_body, created_at')
      .order('created_at', { ascending: false })
      .gte('created_at', formattedStartDate)
      .lte('created_at', formattedEndDate);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching data:', error.message);
      res.status(500).send('Server Error');
      return;
    }

    res.json(data);
  } catch (error) {
    console.error('Unexpected error:', error.message);
    res.status(500).send('Server Error');
  }
});


// Route to insert data into the database
app.post('/insertData', async (req, res) => {
  try {
    const { message_body } = req.body;

    //Double checking that there is a body; already checked in MessageInput.js
    if (!message_body) {
      return res.status(400).json({ error: 'Message body is required' });
    }

    // Insert the message into the database
    const { error } = await supabase
      .from('Messages')
      .insert({ message_body : message_body });

    if (error) {
      console.error('Error inserting data:', error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    
    res.send('Finished running insert, inserted: ' + message_body);
  } catch (error) {
    console.error('Unexpected error:', error.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
