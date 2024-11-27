const { exec } = require('child_process');

const DATABASE_NAME = "chinook"; // Nome del database
const DUMP_PATH = "/dump/chinook"; // Percorso relativo al dump

console.log("Starting MongoDB restore process...");

// Esegui il comando mongorestore
const command = `mongorestore --host localhost:27017 --db ${DATABASE_NAME} --drop ${DUMP_PATH}`;

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error during mongorestore: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Standard error: ${stderr}`);
        return;
    }
    console.log(`mongorestore output: ${stdout}`);
    console.log("MongoDB restore process completed successfully.");
});
