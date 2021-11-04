/* Gloabal Variables */ 

// opneWeatherLink
const opneWeatherMapLink = 'https://api.openweathermap.org/data/2.5/weather?zip='
const degreesCelsius = '&units=metric';

// Personal API Key for OpenWeatherMap API
const API_KEY = '&appid=2550c62ec56892ef3bf11c0ba456d346';


/**
 * async Functions - GET, POST Requests to the Server *
 */

// GET request to the OpenWeatherMap API.
const getWeatherData = async (baseURL, zipCode, APIKey) => {
   const openWeatherResponse = await fetch(baseURL + zipCode + degreesCelsius + APIKey);
   
   // server error status
   let errorStatus = openWeatherResponse.status, 
       ErrorStatusText = openWeatherResponse.statusText;
   
   try {
      const weatherData = await openWeatherResponse.json();
      return weatherData;
      console.log(weatherData);
   } catch(error) {
      console.log(`error fetching data from open weather server response: ${errorStatus} ${ErrorStatusText}, Error: ${error}`);
   }
}
 
// POST request to the server to add the openWeather data, as well as data entered by the user.
const postWeatherData = async (path = '' , postDataObject = {}) => {
   const serverResponse = await fetch(path, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postDataObject),
   });
   try {
      const fetchedData = await serverResponse.json();
      // console.log('this is the new data:', fetchedData);
      return fetchedData;
   } catch(error) {
      console.log('error posting new data to the server:',error);
   }
}

// Update the UI Dynamically
const updateUI = async () => {
   const serverResponse = await fetch('/GetAllData');
   try {
      const fetchedData = await serverResponse.json();
      console.log('successfully retrieved all weather data from server endpoint for UI, Data is:', fetchedData);     // Debugging
      
      // Initializing HTML Elements
      const zipInputField       = document.getElementById('zip');
      const feelingsInputField  = document.getElementById('feelings');
      const resultFeeling       = document.getElementById('content');

      // update UI with retrieved weather data 
      document.getElementById('city').innerText    = `City: ${fetchedData.city}`;
      document.getElementById('temp').innerText    = `Temperature: ${fetchedData.temperature} °C`;
      document.getElementById('date').innerText    = `Date: ${fetchedData.date}`;
      // if feelings field is empty print nice phrase to the user
      if (!feelingsInputField.value == '') {
         resultFeeling.innerText = `You're Feeling: ${fetchedData.userFeelings}`;
      } else if (feelingsInputField.value == '') {
         resultFeeling.innerText = "You're Feeling: Of Course You're Happy ;)";
      } 

      // display the result panel
      document.getElementById('glass').style.opacity = '1';

      // clear ZIP/Feelings fields
      feelingsInputField.value  = '';
      zipInputField.value       = '';
      zipInputField.placeholder = 'Enter ZIP Code';
      zipInputField.classList.remove('input-error');
      zipInputField.classList.add('input-normal');

   } catch(error) {
      console.log('could not retrieve all weather data for UI:', error);
   }
}


// Start the App. Yay!

// Event listener on the generate botton, to statr the whole application.
document.getElementById('generate').addEventListener('click', (event) => {

   /* HTML Elements Variables */
   const zipInputField = document.getElementById('zip');
   const feelingsInputField = document.getElementById('feelings');

   /* Create a new date instance dynamically with JS */
   const date = new Date();
   let newDate = date.getMonth()+'.'+ date.getDate()+'.'+ date.getFullYear();

   /* Assertion for empty Fields, GET/POST Requests, Async Functions */
   if (!zipInputField.value == '') {
      getWeatherData(opneWeatherMapLink, zipInputField.value, API_KEY)
      .then( (weatherData) => {
         // console.log(weatherData); // Debugging
         // POST req to the server's endpoint with new weather/user data
         postWeatherData('/addWeatherData', {
            city: weatherData.name,
            temp: weatherData.main.temp,
            userFeeling: feelingsInputField.value,
            date: newDate,
         });
      })
      .then(updateUI)
   } else {
      // if zip code field is empty
      zipInputField.placeholder = 'Please Enter Your ZIP Code';
      zipInputField.classList.remove('input-normal');
      zipInputField.classList.add('input-error');
   }
   
});

