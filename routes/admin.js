const { Router } = require("express");
// const fetch = require('node-fetch');
const routes = Router();
const { JSDOM } = require('jsdom'); 
const { Skills, Projects } = require("../db/admin");
const { default: mongoose } = require("mongoose");

routes.get('/project', async (req,res)=>
    {
        const projectURL = req.query.url;
    if (!projectURL) return res.status(400).json({ error: 'URL missing' });
        try
        {
            const response = await fetch(projectURL);
            const html = await response.text();
            const dom = new JSDOM(html);
            const meta = dom.window.document.querySelectorAll('meta');


            const getMeta = (property) => {
            const tag = Array.from(meta).find(m => m.getAttribute('property') === property);
            return tag ? tag.getAttribute('content') : '';
            };

        return   res.json({

                title: getMeta('og:title'),
                description: getMeta('og:description'),
                image: getMeta('og:image'),
                url: getMeta('og:url') || url,

            });
        }catch(err)
        {
          return res.status(500).json({error: err.message});
        }


    })

    routes.post('/project',async (req,res)=>{
        const projectLink = req.body.projectLink;
        const projectDescription = req.body.projectDescription;

        const projectFound = await Projects.findOne({
            projectLink:projectLink,

            // img:img,
        })

        try
        {
            if(projectFound)
            {
                const updatedProject = await Projects.updateOne({

                    projectLink:projectLink,
                    // projectDescription:projectDescription,
                },

                {
                    // '$set':
                    // {
                    //     projectDescription:projectDescription,
                    // }
                    '$push' : 
                    {
                        projectDescription:projectDescription,
                    }
                }
            )

             return   res.json({
                    msg:"Project updated",
                    skill: name,
                })
            }else
            {

                await Projects.create({
                        projectLink:projectLink,
                        projectDescription:projectDescription,
                        

                    });

           return  res.json({
                    projectLink:projectLink,
                    projectDescription:projectDescription,
                    msg:"Project Added"
                })
            }

  
        }
        catch(err)
        {
         return  res.status(500).json({
                error: err.message
            })
        }

    })

    routes.post('/skills',async (req,res)=>{


        const name = req.body.name;
        const img = req.body.img;

        const skillFound = await Skills.findOne({
            name:name,
            // img:img,
        })

        try
        {
            if(skillFound)
            {
                const updatedSkill = await Skills.updateOne({

                    name:name,
                    img:img,
                },
            
            {

                '$push':
                {
                        skills:
                        {
                            name:name,
                            img : img,
                        }
                }
            })

              return  res.json({
                    msg:"Skill updated",
                    skill: name,
                })
            }else
            {

                await Skills.create({
                        name:name,
                        img:img,

                    });

               return res.json({
                    name:name,
                    img:img,
                    msg:"Skills Added"
                })
            }

  
        }
        catch(err)
        {
         return  res.status(500).json({
                error: err.message
            })
        }
    })

    routes.get('/skills', async (req,res)=>{

        const name = req.query.name;
        // const img = req.headers.image;

        const skillFound = await Skills.findOne({
            name:name,
            // img:img,
        })
        try
        {
        if(skillFound)
        {
         
         return   res.json({
                name: name,
                img:skillFound.img,

            });
        }else
        {
        
        return    res.status(403).json({
                msg:"Skill not found",
            })
        }

        }catch(err){
         
         return   res.status(500).json({
                    error:err.message,
            })
        }
  
    })
    

    module.exports = routes;