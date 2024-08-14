const express = require('express');
const app = express();
const port = 3000;
const path = require("path")
const fs = require("fs")


app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));


// POST endpoint to fetch directory and files
app.get('/public*', (req, res) => {
    const prms = req.params[0];
    console.log(prms)
    const fullPath = path.join(__dirname, 'public', prms);
    if (fs.existsSync(fullPath)) {
        const files = fs.readdirSync(fullPath);
        if (prms.includes('.')) {
            const data = fs.readFileSync(prms, { encoding: 'utf-8' });
            res.send(data)
        }
        const response = files.map((data) => {
            return {
                "name": data,
                "url": `public${prms}${data}`,
                "isDirectory": data.includes('.') ? false : true
            }
        })
        res.send(response);
    } else {
        res.status(404).send('Not Found');
    }

});


// POST endpoint to create folder
app.post('/createFolder', (req, res) => {
    const folderPath = path.join(__dirname, req.body.path);
    try {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
            res.status(201).send('Folder created');
        } else {
            res.status(400).send('Folder already exists');
        }
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


// POST endpoint to rename folder
app.post('/renameFolder', (req, res) => {
    const { path: currentPath, name: newName } = req.body;
    const oldFullPath = path.join(__dirname, currentPath);
    const newFullPath = path.join(__dirname, path.dirname(currentPath), newName);

    if (!currentPath || !newName) {
        return res.status(400).send('Both current path and new name are required');
    }


    if (!oldFullPath.startsWith(path.join(__dirname, 'public'))) {
        return res.status(400).send('Invalid folder path');
    }

    fs.rename(oldFullPath, newFullPath, (err) => {
        if (err) {
            return res.status(500).send('Failed to rename folder');
        }
        res.send('Folder renamed successfully');
    });

});




// POST endpoint to rename file 
app.post('/renameFile', (req, res) => {
    const { path: currentPath, name: newName } = req.body;
    const oldFullPath = path.join(__dirname, currentPath);
    const newFullPath = path.join(__dirname, path.dirname(currentPath), newName);

    if (!currentPath || !newName) {
        return res.status(400).send('Both current path and new name are required');
    }


    if (!oldFullPath.startsWith(path.join(__dirname, 'public'))) {
        return res.status(400).send('Invalid file path');
    }

    try {
        if (fs.existsSync(oldFullPath)) {
            fs.renameSync(oldFullPath, newFullPath);
            res.send('File renamed');
        } else {
            res.status(404).send('File not found');
        }
    } catch (err) {
        res.status(500).send('Server Error');
    }
});





// POST endpoint to upload files
app.post('/uploadFile', async (req, res) => {
    const filePath = req.body.path;
    const fileName = req.body.name;
    const fileData = req.body.data;

    if (!filePath || !fileName || !fileData) {
        return res.status(400).send('Path, name, and data are required');
    }

    const absolutePath = path.join(__dirname, filePath);
    if (!absolutePath.startsWith(path.join(__dirname, 'public'))) {
        return res.status(400).send('Invalid file path');
    }

    const fileAbsolutePath = path.join(absolutePath, fileName);

    try {
    
        if (!fs.existsSync(absolutePath)) {
            fs.mkdirSync(absolutePath, { recursive: true });
        }


        fs.writeFile(fileAbsolutePath, fileData, (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).send('Failed to upload file');
            }
            res.send('File uploaded successfully');
        });
    } catch (err) {
        console.error('Error uploading file:', err);
        res.status(500).send('Failed to upload file');
    }
});



// Delete endpoint to delete file and folder
app.delete('/deleteItem', async (req, res) => {
    const itemPath = req.body.path;
    if (!itemPath) {
        return res.status(400).send('Path is required');
    }

    const absolutePath = path.join(__dirname, itemPath);
    if (!absolutePath.startsWith(path.join(__dirname, 'public'))) {
        return res.status(400).send('Invalid path');
    }

    try {
        const stats = fs.statSync(absolutePath);
        if (stats.isDirectory()) {
            fs.rmdir(absolutePath, { recursive: true }, (err) => { });
            res.send('Folder deleted successfully');
        } else {
            fs.unlink(absolutePath, (err) => {
                if (err) {
                    console.log(err)
                    res.send("error")
                }
            })
            res.send('File deleted successfully');
        }
    } catch (err) {
        console.error(err);
    }

});




// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


module.exports = app