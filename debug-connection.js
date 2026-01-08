require('dotenv').config();
const mongoose = require('mongoose');

const uriTemplate = "mongodb+srv://02fe23bcs115_db_user:PASSWORD@cluster0.97ekzcp.mongodb.net/?appName=Cluster0";

const passwordsToCheck = [
    "Shivachandra123%40", // Encoded @
    "Shivachandra123",    // No @
    "Shivachandra123@",   // Raw @ (might fail parsing)
    "<Shivachandra123@>", // Literal with brackets
];

async function testConnection(password) {
    const uri = uriTemplate.replace("PASSWORD", password);
    console.log(`Testing with password: ${password}`);
    try {
        await mongoose.connect(uri);
        console.log("SUCCESS");
        await mongoose.disconnect();
        return true;
    } catch (err) {
        console.log("FAILED:", err.message);
        return false;
    }
}

async function run() {
    for (const password of passwordsToCheck) {
        if (await testConnection(password)) {
            console.log(`\nVerified correct password: ${password}`);
            process.exit(0);
        }
    }
    console.log("\nAll attempts failed.");
    process.exit(1);
}

run();
