const timestamp = 1718045838896;
const date = new Date(timestamp);

// Extracting date components
const year = date.getFullYear();
const month = date.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month index
const day = date.getDate();

// Extracting time components
const hours = date.getHours();
const minutes = date.getMinutes();
const seconds = date.getSeconds();

// Saving date and time into variables
const formattedDate = `${year}-${month}-${day}`;
const formattedTime = `${hours}:${minutes}:${seconds}`;

// Printing the separated date and time
console.log(`Date: ${formattedDate}`);
console.log(`Time: ${formattedTime}`);
