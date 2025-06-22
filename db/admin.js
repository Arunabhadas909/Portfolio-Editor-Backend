
const express= require('express');
const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const bodyParser = require('')

// mongoose.connect("mongodb+srv://arunabha909:Arunabhadas%40909@cluster0.io3lfs7.mongodb.net/portfolio");

mongoose.connect(process.env.MONGO_URI);


const SkillsSchema = new mongoose.Schema({

    name:String,
    img:String,

    })

const ProjectsSchema = new mongoose.Schema({
    projectLink:String,
    projectDescription:String,

    newProjectLink:[String],
    newProjectDescription:[String],
})

    const Skills = new mongoose.model('Skills', SkillsSchema);
    const Projects = new mongoose.model('Projects', ProjectsSchema);


    module.exports= {
        Skills,
        Projects,
    };