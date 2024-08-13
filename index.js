const express = require('express');
const app = express();
const port = 3000;
const path = require("path")
const fs = require("fs")

app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));


// POST endpoint to fetch directory and files
app.get('/public*', (req, res) => {

});


// POST endpoint to create folder
app.post('/createFolder', (req, res) => {

});


// POST endpoint to rename folder
app.post('/renameFolder', (req, res) => {

});




// POST endpoint to rename file 
app.post('/renameFile', (req, res) => {

});





// POST endpoint to upload files
app.post('/uploadFile', async (req, res) => {

});



// Delete endpoint to delete file and folder
app.delete('/deleteItem', async (req, res) => {


});




// Start the server
app.listen(5000, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


module.exports = app