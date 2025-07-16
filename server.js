const express = require('express');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs').promises; // Use promises for fs operations
const basicAuth = require('express-basic-auth'); // Import express-basic-auth
const dotenv = require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const bodyParser = require('body-parser');

const app = express();
const port = 8080;

const nocache = require('nocache');

app.use(nocache());
app.use(express.static('public'));
app.set('trust proxy', true)

app.use(bodyParser.raw({ type: '*/*', limit: '50mb' }));

app.post('/receive', (req, res) => {
  const data = req.body;
  const fileName = 'received_data_' + Date.now() + '.txt';
  const filePath = path.join('G:\\My Drive\\', fileName);

  fs.writeFile(filePath, data, (err) => {
    if (err) {
      console.error('Error writing file:', err);
      res.status(500).send('Error writing file');
    } else {
      console.log('File written successfully:', fileName);
      res.status(200).send('File received and saved');
    }
  });
});

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
const protonLink = process.env.PROTON;
const mac = process.env.MAC;
const ip = process.env.IP;

app.use('/cloud', basicAuth({
  users,
  challenge: true,
  unauthorizedResponse: 'Unauthorized access'
}));
app.get('/wol', (req, res) => {
  console.log('sending packet');
  const { exec } = require('child_process');
  command = '.\\WolCmd.exe ' + mac + ' ' + ip + ' 255.255.0.0 7'; 
  exec(command, (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      console.log(err);
      return;
    }
  
    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });

  // Redirect to another page
  res.redirect('https://mylesweaver.net');
});


app.get('/coffee', (req, res) => {
  const redirectUrl = 'https://account.venmo.com/u/Mylesweav';
  res.redirect(redirectUrl);
});
app.get('/linkedin', (req, res) => {
  const redirectUrl = 'https://www.linkedin.com/in/myles-weaver-247403196/';
  res.redirect(redirectUrl);
});
app.get('/github', (req, res) => {
  const redirectUrl = 'https://github.com/DreamWeaver3033';
  res.redirect(redirectUrl);
});
app.get('/vsco', (req, res) => {
  const redirectUrl = 'https://vsco.co/myles-weaver/gallery';
  res.redirect(redirectUrl);
});app.get('/cloud/drive', (req, res) => {
  const redirectUrl = googleLink;
  res.redirect(redirectUrl);
});
app.get('/cloud/mega', (req, res) => {
  const redirectUrl = megaLink;
  res.redirect(redirectUrl);
});
app.get('/cloud/proton', (req, res) => {
  const redirectUrl = protonLink;
  res.redirect(redirectUrl);
});

app.get('/cloud', async (req,res) => {
  
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
        </ul>
    </div>
  </head>
  <body>
  
    <a  class="glow">
    mCloud
    </a>
    <ul>
      <li>
        <a href=${googleLink} class="btn btn-outline-info border-2" type="submit" style="margin-bottom:6px;">Google</a> 
      </li>
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
