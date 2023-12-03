const express = require('express');
const path = require('path');
const fs = require('fs').promises; // Use promises for fs operations
const basicAuth = require('express-basic-auth'); // Import express-basic-auth
const dotenv = require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const port = 8080;


app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

const users = {
  [process.env.MYUSER]: process.env.MYPASS
};

// Use basic authentication middleware
app.use('/browse', basicAuth({
  users,
  challenge: true,
  unauthorizedResponse: 'Unauthorized access'
}));

app.get('/browse', async (req, res) => {

    // Root folder to start from 
    const root = path.resolve(__dirname, '..');
    
    // Get current browse path
    // Get current browse path
    const queryPath = req.query.path || ''; 
    const fullPath = path.join(root, queryPath);
  
    // Read folder contents
    const files = await fs.readdir(fullPath, { withFileTypes: true });
  
    // Render HTML with files and folders
    let listItems = '';

    for (let file of files) {

    const fileUrlPath = path.join(queryPath, file.name);

    listItems += `
        <li>
        <style>
        a {
          display: block;
          margin-bottom: 2px;
        }
        </style>
        ${file.isDirectory() ? 
            `<form action="/browse" method="get">
                <input type="hidden" name="path" value="${fileUrlPath}">
                <button class="custom-button" type="submit">${file.name}/</button>
            </form>` :
            `
              <a href="/files/${fileUrlPath}" class="custom-button" type="submit">${file.name}</a>
            `

        }
        </li>
    `;

    }

    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        ul {
          list-style-type: none; /* Remove bullets from the list */
          padding: 0; /* Remove default padding for the list */
          display: flex; /* Use flexbox */
          flex-direction: column; /* Arrange items in a column */
          align-items: center; /* Center items vertically */
        }
        body {
          background-color: #333;
          color: #ccc;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
        }
        .custom-button {
          margin: 2px;
          padding: 3px 10px;
          background-color: #7902c9;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <h1 style="font-family: 'Ubuntu', sans-serif">
      Myles' File Server
      </h1>
      <ul>
        ${listItems}  
      </ul>
    </body>
    </html>
  `);
  });

  app.get('/files*', async (req, res) => {

    
  
    const fileUrl = req.path.replace('/files', '');

    
    const decodedUrl = decodeURI(fileUrl);
    const root = path.resolve(__dirname, '..');
    const fullPath = path.join(root, decodedUrl);
    console.log(decodedUrl);
    res.download(fullPath);
  
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
