const express = require('express');
const router = express.Router();
const path = require('path');
const uploadModel = require('../models/uploadModel');

router.post('/json-payload', (req, res) => {
  try {
    const data = req.body;
    console.log('Received JSON payload:', data);
    res.json({ status: 'success', message: 'JSON payload received successfully' });
  } catch (error) {
    console.error('Error handling JSON payload:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

router.post('/upload', (req, res) => {
  try {
    
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
      return res.status(400).json({ status: 'error', message: 'No files were uploaded.' });
    }

    
    const files = Array.isArray(req.files.file) ? req.files.file : [req.files.file];

    files.forEach((file) => {
      
      const uniqueFileName = `${Date.now()}_${file.name}`;
      const uploadPath = path.join(__dirname, '..', 'uploads', uniqueFileName);

      
      file.mv(uploadPath, (err) => {
        if (err) {
          console.error('Error handling file upload:', err);
          return res.status(500).json({ status: 'error', message: 'Internal server error' });
        }

        console.log('File uploaded successfully:', uniqueFileName);
      });
    });

    res.json({ status: 'success', message: 'Files uploaded successfully' });
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

module.exports = router;