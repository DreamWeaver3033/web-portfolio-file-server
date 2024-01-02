const express = require('express');
const path = require('path');
const fs = require('fs').promises; // Use promises for fs operations
const basicAuth = require('express-basic-auth'); // Import express-basic-auth
const dotenv = require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const port = 8080;


app.use(express.static('public'));
app.set('trust proxy', true)

app.get('//', (req, res) => {
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

app.use('/mega', basicAuth({
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
    
    const parentPath = path.dirname(queryPath);
    let listItems = ``;
    if(queryPath!=='' && queryPath !== '.'){
       listItems = `<a href="/browse?path=${parentPath}" class="btn btn-outline-info border-2" style="margin-bottom:6px;">&larr; Back</a>`;
    }

    for (let file of files) {

    const fileUrlPath = path.join(queryPath, file.name);

    listItems += `
    <li>
    ${file.isDirectory() ? 
        `<form action="/browse" method="get" >
            <input type="hidden" name="path" value="${fileUrlPath}" >
            <button class="btn btn-outline-info border-2" type="submit" style="margin-bottom:6px;">${file.name}/</button>
        </form>` :
        `
            <a href="/files/${fileUrlPath}" class="btn btn-outline-info border-2" type="submit" style="margin-bottom:6px;">${file.name}</a>
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
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
      <link rel="stylesheet" href="index.css">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body{
          font-family:  sans-serif;
        }

        ul {
          list-style-type: none; /* Remove bullets from the list */
          padding: 0; /* Remove default padding for the list */
          display: flex; /* Use flexbox */
          flex-direction: column; /* Arrange items in a column */
          align-items: center; /* Center items vertically */
        }

        ul li {
          flex: 1;
          margin: 0;
          width: 100%;
        }
        .btn {
          width: 100%;
        }
        button {
          width: 100%;
        }
      </style>

      <div class="dropdown">
        <button class="btn btn-outline-info dropdown-toggle border-2" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" style="color: #0dcaf0;" href="/">Home</a></li>
          <li><a class="dropdown-item" style="color: #0dcaf0;" href="/about">About Me</a></li>
          <li><a class="dropdown-item" style="color: #0dcaf0;" href="/browse">File Browser</a></li>
          <li><a class="dropdown-item" style="color: #0dcaf0;" href="/shared">Public File List</a></li>
        </ul>
    </div>
    </head>
    <body>
      <a href="/browse?path=" class="glow">
      mCloud
      </a>
      <ul>
        ${listItems}  
      </ul>

      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"></script>
    </body>
    </html>
  `);
});

app.get('/mega', async (req,res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="stylesheet" href="index.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      ul {
        list-style-type: none; /* Remove bullets from the list */
        padding: 0; /* Remove default padding for the list */
        display: flex; /* Use flexbox */
        flex-direction: column; /* Arrange items in a column */
        align-items: center; /* Center items vertically */
      }

      ul li {
        flex: 1;
        margin: 0;
        width: 100%;
      }
      .btn {
        width: 100%;
      }
      button {
        width: 100%;
      }
    </style>

    <div class="dropdown">
        <button class="btn btn-outline-info dropdown-toggle border-2" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" style="color: #0dcaf0;" href="/">Home</a></li>
          <li><a class="dropdown-item" style="color: #0dcaf0;" href="/about">About Me</a></li>
          <li><a class="dropdown-item" style="color: #0dcaf0;" href="/browse">File Browser</a></li>
          <li><a class="dropdown-item" style="color: #0dcaf0;" href="/shared">Public File List</a></li>
        </ul>
    </div>
  </head>
  <body>
  
    <a  class="glow">
    mCloud
    </a>
    <a href="https://mega.nz/folder/gV9lBAKZ#0W9mCLOuMr8b6ZU6A-90tQ" class="btn btn-outline-info border-2 w-25" type="submit" style="margin-bottom:6px;">Mega Link</a>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"></script>
  </body>
  </html>
`);
});

app.get('/shared', async (req, res) => {

  // Root folder to start from 
  const root = path.resolve(__dirname, 'shared');
  
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
      `<form action="/shared" method="get">
          <input type="hidden" name="path" value="${fileUrlPath}">
          <button class="btn btn-outline-info border-2" type="submit" style="margin-bottom:6px;">${file.name}/</button>
      </form>` :
      `
          <a href="/sharedf/${fileUrlPath}" class="btn btn-outline-info border-2" type="submit" style="margin-bottom:6px;">${file.name}</a>
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
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="stylesheet" href="index.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      ul {
        list-style-type: none; /* Remove bullets from the list */
        padding: 0; /* Remove default padding for the list */
        display: flex; /* Use flexbox */
        flex-direction: column; /* Arrange items in a column */
        align-items: center; /* Center items vertically */
      }

      ul li {
        flex: 1;
        margin: 0;
        width: 100%;
      }
      .btn {
        width: 100%;
      }
      button {
        width: 100%;
      }
    </style>

    <div class="dropdown">
        <button class="btn btn-outline-info dropdown-toggle border-2" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" style="color: #0dcaf0;" href="/">Home</a></li>
          <li><a class="dropdown-item" style="color: #0dcaf0;" href="/about">About Me</a></li>
          <li><a class="dropdown-item" style="color: #0dcaf0;" href="/browse">File Browser</a></li>
          <li><a class="dropdown-item" style="color: #0dcaf0;" href="/shared">Public File List</a></li>
        </ul>
    </div>
  </head>
  <body>
  
    <a href="/shared?path=" class="glow">
    mCloud
    </a>
    <ul>
      ${listItems}  
    </ul>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"></script>
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
    console.log(req.ip);
    res.download(fullPath);
  
  });

  app.get('/sharedf*', async (req, res) => {

    
  
    const fileUrl = req.path.replace('/sharedf', '');

    
    const decodedUrl = decodeURI(fileUrl);
    const root = path.resolve(__dirname, 'shared');
    const fullPath = path.join(root, decodedUrl);
    console.log(decodedUrl);
    res.download(fullPath);
  
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
