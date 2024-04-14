
const express = require("express")
const users =require("./MOCK_DATA.json")
const fs =require("fs")


const app = express();
const PORT = 8000;

app.use(express.urlencoded({extended:false})); //middelware

//ROUTES

app.get('/users',(req,res)=>{
     return res.json(users)
});

/*********************ONE ROUTE********************* */

app
.route('/api/users/:id')

.get((req,res)=>{
//collect user with id
    const id = Number(req.params.id);//created our own id to check

    const user = users.find((user) => user.id === id);
    return res.json(user);

})

.patch((req,res)=>{
    //edit user with id

    const id = parseInt(req.params.id, 10); // Get the item ID from the URL
    const updates = req.body; // Get the updates from the request body

    // Read the data file
    fs.readFile('./MOCK_DATA.json', 'utf8', (err, data) => {
        // If there's an error reading the file, send a basic error response
        if (err) return res.status(500).send('Error reading data file');

        // Parse the JSON data
        const jsonData = JSON.parse(data);

        // Find the item to update
        const item = jsonData.find(item => item.id === id);

        // If the item doesn't exist, send a 404 error response
        if (!item) return res.status(404).send('Item not found');

        // Update the item with the new data
        Object.assign(item, updates);

        // Save the updated data back to the file
        fs.writeFile('./MOCK_DATA.json', JSON.stringify(jsonData, null, 2), (err) => {
            // If there's an error writing the file, send a basic error response
            if (err) return res.status(500).send('Error writing data file');

            // Respond with the updated item
            res.json(item);
        });
    });
})

.post((req,res)=>{
   
    const body =req.body; //remeeber to use middleware
    users.push({...body, id: users.length+1});
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{

        return res.json({status : "SUCCESS" ,id :users.length});
    })

})

.delete((req,res)=>{
    const id = parseInt(req.params.id);

    fs.readFile('./MOCK_DATA.json', 'utf8', (err, data) => {
        if (err) return res.status(500).json({ status: 'error', message: 'Could not read data file' });

        const jsonData = JSON.parse(data);
        const indexToDelete = jsonData.findIndex(item => item.id === id);

        if (indexToDelete === -1) return res.status(404).json({ status: 'error', message: 'Item not found' });

        jsonData.splice(indexToDelete, 1);

        fs.writeFile('./MOCK_DATA.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err)
             return res.status(500).json({ status: 'error', message: 'Could not write data file' });

            res.json({ status: 'success', message: 'Item deleted successfully' });
        });

    });

});



app.listen(PORT,()=>{
    console.log("Server Listening");
})