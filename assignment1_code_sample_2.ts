import * as readline from 'readline';
import * as mysql from 'mysql';
import { execFile } from 'child_process';
import * as https from 'https';

const dbConfig = {
    host:  process.env.DB_HOST || 'localhost',
    user:  process.env.DB_USER || 'secure_user',
    password: process.env.DB_PASS || 'secure_password',
    database: process.env.DB_NAME || 'secure_db'
};

function getUserInput(): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question('Enter your name: ', (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

function sendEmail(to: string, subject: string, body: string) {
    execFile('mail', ['-s', subject, to], { input: body }, (error) => {
        if (error) {
            console.error(`Failed to send email. Please try again later`);
        } else {
        console.log('Email sent successfully');
        }
    });
}

function getData(): Promise<string> {
    return new Promise((resolve, reject) => {
        https.get('https://insecure-api.com/get-data', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

function saveToDb(data: string) {
    const connection = mysql.createConnection(dbConfig);
    const query = `INSERT INTO mytable (column1, column2) VALUES (?, ?)`;

    connection.connect((err) => {
        if (err) {
            console.error('Database operation failed:', error.message);
            return;
        }
    connection.query(query, [data, 'Another Value'], (error, results) => {
        if (error) {
            console.error('Database operation failed', error.message);
        } else {
            console.log('Data saved');
        }
        connection.end();
    });
});

(async () => {
    const userInput = await getUserInput();
    const data = await getData();
    saveToDb(data);
    sendEmail('admin@example.com', 'User Input', userInput);

})();
