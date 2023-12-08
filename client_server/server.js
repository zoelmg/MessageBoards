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

   //Wasn't able to use equal because .eq requires time to be exactly the same
   // So manually created the day before and after for range
   // Calculate the day before and the day after
   const dayBefore = new Date(date);
   dayBefore.setDate(dayBefore.getDate() - 1);
   const dayAfter = new Date(date);
   dayAfter.setDate(dayAfter.getDate() + 1);

   // Format the dates as strings
   const dayBeforeString = dayBefore.toISOString().split('T')[0];
   const dayAfterString = dayAfter.toISOString().split('T')[0];

    let query = supabase
      .from('Messages')
      .select('message_body, created_at')
      .order('created_at', { ascending: false })
      .gt('created_at', dayBeforeString)
      .lt('created_at', dayAfterString);

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
