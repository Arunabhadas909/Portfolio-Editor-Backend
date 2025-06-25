const { Router } = require("express");
const express = require("express");
const fs = require('fs');
const {Skills } =require('../db/admin')


const nodemailer = require('nodemailer');

const app = express();

const bodyParser = require('body-parser');

const multer = require('multer');
const routes = Router();
const { JSDOM } = require('jsdom'); 
const { Data } = require("../db/adminSelectedData");

// app.use(bodyParser.json({ limit: '10mb' })); // For application/json
// app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' })); // For application/x-www-form-urlencoded

// 2. Set up multer for file uploads (e.g. image upload)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 10 MB file size limit
});
// const fetch = require('node-fetch');


// const storage = multer.memoryStorage(); // stores image in memory as Buffer
// const upload = multer({ storage: storage });

routes.post('/data', upload.single('image') ,async (req,res)=>
    {
        console.log("posting data");

        let previewUrl = null;
        let mimeType = null;

        if(req.file)
            {
             previewUrl = req.file.buffer; 
            mimeType = req.file.mimetype;   
            }
            else
            {
                console.log("No image file uploaded — skipping image processing");
            }
  
    
    
    const parsedData = JSON.parse(req.body.data);
    const username = parsedData.username;
    const designation = parsedData.designation;
    const textEntered = parsedData.textEntered;
    const skills = parsedData .skills;
    const projects= parsedData .projects;
    const coverLettertextEntered = parsedData .coverLettertextEntered;



    //   try {
    // const parsedData = JSON.parse(req.body.data);

    // const {
    //   username,
    //   designation,
    //   textEntered,
    //   projects,
    //   coverLettertextEntered,
    //   skills: skillsInput
    // } = parsedData;

    // const previewUrl = req.file ? req.file.buffer : null;
    // const mimeType = req.file ? req.file.mimetype : null;

    // const skillsIds = await Promise.all(
    //   skillsInput.map(async (skill) => {
    //     let found = await Skills.findOne({ name: skill.name });

    //     if (!found) {
    //       found = await Skills.create(skill); // { name, img }
    //     }

    //     return found._id;
    //   })
    // );








         const dataFound = await Data.findOne({
            
            username:username,
            designation:designation,
            previewUrl: previewUrl,
            mimeType:mimeType,      
            textEntered: textEntered,
            // skills : skillsInput,
            skills:skills,
            projects: projects,
            coverLettertextEntered : coverLettertextEntered,
        });


         try
        {
            if(dataFound)
            {
                const updatedData = await Data.updateOne({

                    username:username,
                    designation:designation,
                        previewUrl: previewUrl,
                        mimeType:mimeType,      
                        textEntered: textEntered,
                        // skills : skills,
                        skills:skills,
                        projects: projects,
                        coverLettertextEntered : coverLettertextEntered,
                    
                },

                {
                    // '$set':
                    // {
                    //     projectDescription:projectDescription,
                    // }
                    '$push' : 
                    {
                        newData : {
                            
                            username:username,
                            designation:designation,
                            previewUrl: previewUrl,
                            mimeType:mimeType,      
                            textEntered: textEntered,
                            // skills : skillsIds,
                            skills:skills,
                            projects: projects,
                            coverLettertextEntered : coverLettertextEntered,
                        }
                    }
                }
            )

             return   res.json({
                    msg:"Data updated",
                    // skill: name,
                        username:username,
                        designation:designation,
                        previewUrl: previewUrl,
                        mimeType:mimeType,      
                        textEntered: textEntered,
                        // skills : skillsIds,
                        skills:skills,
                        projects: projects,
                        coverLettertextEntered : coverLettertextEntered,
                })
            }else
            {

                await Data.create({
                     username:username,
                        designation:designation,
                        previewUrl: previewUrl,
                        mimeType:mimeType,      
                        textEntered: textEntered,
                        // skills : skillsIds,
                        skills:skills,
                        projects: projects,
                        coverLettertextEntered : coverLettertextEntered,
                        createdAt: new Date(),
                    });

              return  res.json({
                     username:username,
                        designation:designation,
                        previewUrl: previewUrl,
                        mimeType:mimeType,      
                        textEntered: textEntered,
                        // skills : skillsIds,
                        skills:skills,
                        projects: projects,
                        coverLettertextEntered : coverLettertextEntered,
                    msg:"Data Saved"
                })

                  
            }
          
  
        }catch(err){

       return res.status(500).json({

            error:err.message,
        })
    } 



    });



    routes.get('/data', async (req,res)=>{


        try
        {



            const lastEnteredData = await Data.findOne().sort({_id: -1}).exec();
            
            // const lastEnteredData = await Data.findOne()
            // .sort({ _id: -1 })
            // .populate('skills', 'name img') // top-level skills
            // // .populate('newData.skills', 'name img')
            // .exec(); // nested skills

            // const skills = await lastEnteredData.find({}).populate('skills', 'name img');

            if(!lastEnteredData)
                {
                  return  res.status(404).json({

                        msg : "No Data Found",
                })
                }


                const base64previewUrl = lastEnteredData.previewUrl.toString('base64');

                // console.log(lastEnteredData);
            return   res.json({
                   
                    previewUrl:base64previewUrl,
                    mimeType:lastEnteredData.mimeType,
                      username:lastEnteredData.username,
                        designation:lastEnteredData.designation,
                    textEntered: lastEnteredData.textEntered,
                        skills : lastEnteredData.skills,
                        projects: lastEnteredData.projects,
                        coverLettertextEntered : lastEnteredData.coverLettertextEntered,

                })
        }

        catch(error)
        {

           return res.json({

                    error: error
                });
        }

    })





    routes.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
  });

  const mailOptions = {
    from: email,
    to: process.env.GMAIL_USER,
    subject: `Contact form submission from ${name}`,
    text: `Message:\n${message}\n\nEmail: ${email}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false });
  }
});


    // routes.get('/data', async(req,res)=>{

        
    // })

    module.exports = routes;


