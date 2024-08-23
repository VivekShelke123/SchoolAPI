require('dotenv').config();

import express = require('express');
import bodyParser = require('body-parser');
import mysql = require('mysql2/promise');

//Defining Pool For My SQl

const pool = mysql.createPool({
    host:process.env.host,
    user:process.env.user,
    password:process.env.password,
    database:process.env.database,
})
console.log(process.env.host,process.env.user);
//defining APP And middleware function

export const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

//definning home action 

app.get('/', (req: express.Request, res: express.Response) => {
    res.render('index.ejs');
});

//definning  /addSchool 

app.post('/addSchool', async (req:express.Request , res:express.Response)=>{
    console.log(req.body);
    const { name , address , latitude , longitude } = req.body;
    const latitude1 = parseInt(latitude);
    const longitude1 = parseInt(longitude);

    if (!name || !address || typeof latitude1 !== 'number' || typeof longitude1 !== 'number') {
        return res.status(400).json({ 
            success : false,
            error: 'Invalid input data' 
        });
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO schoollist (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
            [name , address , latitude1 , longitude1]
        );
        res.status(201).json({ 
            success : true,
            message: 'School added successfully',
        });
    } catch (error) {
        res.status(500).json({ 
            success : false,
            error: 'Database error',
        });
        console.log(error);
    }
});

app.get('/addSchool',(req:express.Request , res:express.Response)=>{
    res.redirect('/');
    
})

//Function to Calculate the Distance from Latitude and Longitude

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const earth_radius = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earth_radius * c;
}

// Defining get method for /SchoolList

app.get('/listSchools', async (req:express.Request,res:express.Response)=>{
    const userLatitude = parseFloat(req.query.latitude as string);
    const userLongitude = parseFloat(req.query.longitude as string);

    if (isNaN(userLatitude) || isNaN(userLongitude)) {
        return res.status(400).json({ 
            success:false,
            message:'Invalid latitude or longitude'
        });
    }

    try {
        const [schools]: any[] = await pool.execute('SELECT * FROM schoollist');

        if(!schools){
            res.send("<h1> No School Added Yet </h1>");
            res.status(200).json({
                success: true,
                message:'No School Added Yet',
            });
        }

        const sortedSchools = schools.sort((a: any, b: any) => {
            const distanceA = calculateDistance(userLatitude, userLongitude, a.latitude, a.longitude);
            const distanceB = calculateDistance(userLatitude, userLongitude, b.latitude, b.longitude);
            return distanceA - distanceB;
        });
        res.status(200).json({
            success: true,
            message:'Here Are the List of Schools',
            SchoolList:sortedSchools
        });
    } catch (error) {
        res.status(500).json({ 
            success:false,
            message:'DataBase Error'
        });
        console.log(error);
    }
})