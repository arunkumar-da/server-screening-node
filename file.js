const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const https = require('https');
const app = express();
const port = 3011;

// Use CORS middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Multer configuration for video upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folderName = req.params.folderName || 'default'; // Use route parameter
    console.log('Received folderName:', folderName);
    const folderPath = `/root/resume/${folderName}`; // Dynamic folder based on folderName
    fs.mkdirSync(folderPath, { recursive: true }); // Ensure folder is created if not exists
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Video upload endpoint (using POST method with route parameter)
app.post('/upload/:folderName', upload.single('file'), (req, res) => {
  // Handle uploaded video here
  res.send('Video uploaded successfully');
}); 
const sslOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/www.noraasoft.com/privkey.pem'), // Path to private key
    cert: fs.readFileSync('/etc/letsencrypt/live/www.noraasoft.com/fullchain.pem') // Path to certificate
};


// Start server with HTTPS
https.createServer(sslOptions, app).listen(port, () => {
    console.log(`Server is running on https://www.noraasoft.com:${port}`);
});

