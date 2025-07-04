const express= require('express');
// const { string } = require('mathjs');
// import { Skills } from '.db/admin';

const {skills} = require('./admin');
const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const bodyParser = require('')

// mongoose.connect("mongodb+srv://arunabha909:Arunabhadas%40909@cluster0.io3lfs7.mongodb.net/portfolio");

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

mongoose.connect(process.env.MONGO_URI);



const DataSelected = new mongoose.Schema({
    username:String,
    designation:String,
    previewUrl: { type: Buffer,  default: null},
    textEntered: String,
    mimeType:String,
    skills:[{ name:String, img:String,} ],


    // skills:[{
    //             type: mongoose.Schema.Types.ObjectId,
    //             ref: 'Skills'
    
    //         }],
    projects:[{title: String, description:String, img:String, url:String } ],
    coverLettertextEntered: String,


    newData:[

        {
                username:String,
                designation:String,
                previewUrl: { type: Buffer,  default: null},
                mimeType:String,
                textEntered: String,
                skills:[{ name:String, img:String,} ],


            //      skills:[{
            //     type: mongoose.Schema.Types.ObjectId,
            //     ref: 'Skills'
    
            // }],

                projects:[{title: String, description:String, img:String, url:String } ],
                coverLettertextEntered: String,
                createdAt: { type: Date, default: Date.now },

        }
    ]
    })

    const Data = new mongoose.model('Data', DataSelected);
    

    module.exports = {
        Data,
    }