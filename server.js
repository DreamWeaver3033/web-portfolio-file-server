const express = require('express');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs').promises; // Use promises for fs operations
const basicAuth = require('express-basic-auth'); // Import express-basic-auth
const dotenv = require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const port = 8080;

const nocache = require('nocache');

app.use(nocache());
app.use(express.static('public'));
app.set('trust proxy', true)

app.get('//', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/about', (req, res) => {
  
  res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/drive', (req, res) => {
  const redirectUrl = 'https://drive.google.com/drive/folders/1nhfLJkRZf0ypTjaxNRATrmxgW_rjYm51?usp=sharing';
  
  res.redirect(redirectUrl);
});

const users = {
  [process.env.MYUSER]: process.env.MYPASS
};

const megaLink = process.env.MEGA;
const googleLink = process.env.GOOGLE;

app.use('/mega', basicAuth({
  users,
  challenge: true,
  unauthorizedResponse: 'Unauthorized access'
}));

app.get('/mega', async (req,res) => {
  
  console.log(req.ip);
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
          <li><a class="dropdown-item" style="color: #0dcaf0;" href="/shared">Public File List</a></li>
        </ul>
    </div>
  </head>
  <body>
  
    <a  class="glow">
    mCloud
    </a>
    <ul>
      <li>
        <a href=${megaLink} class="btn btn-outline-info border-2" type="submit" style="margin-bottom:6px;">Mega Link</a>
      </li>
      <li>
        <a href=${googleLink} class="btn btn-outline-info border-2" type="submit" style="margin-bottom:6px;">Google Link</a> 
      </li>
    </ul>
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
          <li><a class="dropdown-item" style="color: #0dcaf0;" href="/mega">File Browser</a></li>
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

app.get('/sharedf*', async (req, res) => {
  
  const fileUrl = req.path.replace('/sharedf', '');
  const decodedUrl = decodeURI(fileUrl);
  const root = path.resolve(__dirname, 'shared');
  const fullPath = path.join(root, decodedUrl);
  res.download(fullPath);
});

app.get('/full*', async (req, res) => {
  
  fileUrlPath = req.path.replace('/full/', '')
  let listItems = '';
    listItems += `<a href="/gallery"><img src="/gallery/${fileUrlPath}"></a>`;
    res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://mylesweaver.net/index.css">
  </head>
  <body>
    <div class="image-full">
        ${listItems}  
    </div>
  </body>
  </html>
`);
});

app.get('/gallery*', async (req, res) => {
  
  const fileUrl = req.path.replace('/gallery', '');
  const decodedUrl = decodeURI(fileUrl);
  const root = path.resolve(__dirname, 'gal');
  const fullPath = path.join(root, decodedUrl);
  res.download(fullPath);
});

app.get('/gallery', async (req, res) => {
  
  const root = path.resolve(__dirname, 'gal');
  
  // Get current browse path
  // Get current browse path
  const queryPath = req.query.path || ''; 
  const fullPath = path.join(root, queryPath);

  const files = await fs.readdir(fullPath, { withFileTypes: true });
  let listItems = '<li>';
  let listItems2 = '<li>'
  
  const filesLength = files.length;
  for (let i = 0; i < filesLength-1; i++) {
    const file = files[i];
    const file2 = files[i+1]
    const fileUrlPath = path.join(queryPath, file.name);
    const fileUrlPath2 = path.join(queryPath, file2.name);
    
    listItems += `
        <div class="image-wrapper">
          <a href="/full/${fileUrlPath}"><img src="/gallery/${fileUrlPath}"></a>  
        </div>
    `;
    listItems2 += `
      <div class="image-wrapper">
        <a href="/full/${fileUrlPath2}"><img src="/gallery/${fileUrlPath2}"></a>  
      </div>`
    i=i+1;
  }
  listItems+=`</li>`
  listItems2+=`</li>`

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
      height: 100%;
    }
    ul{
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 10px;
    }
      .image-wrapper {
        max-width: 400px; 
      }
    </style>
    <div class="dropdown">
        <button class="btn btn-outline-info dropdown-toggle border-2" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" style="color: #0dcaf0;" href="/">Home</a></li>
          <li><a class="dropdown-item" style="color: #0dcaf0;" href="/mega">File Browser</a></li>
        </ul>
    </div>
  </head>
  <body>
    <ul>
      ${listItems} 
      ${listItems2} 
    </ul>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"></script>
  </body>
  </html>
`);

});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
