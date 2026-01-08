require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('URI:', process.env.MONGO_URI.replace(/:([^:@]+)@/, ':****@')); // Hide password

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('SUCCESS: Connection established!');
        console.log('Database name:', mongoose.connection.name);
        console.log('Host:', mongoose.connection.host);
        process.exit(0);
    })
    .catch(err => {
        console.error('ERROR: Connection failed!');
        console.error(err);
        process.exit(1);
    });
