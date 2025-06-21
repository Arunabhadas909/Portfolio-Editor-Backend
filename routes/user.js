const {Router} = require('express');
const {Users} = require('../db/user');
const JSDOM = require('jsdom');


const routes = Router();



routes.post('/addUser', async (req, res)=>{

    const userName = req.body.userName;
    const email = req.body.email;
    const message = req.body.message;

    const userFound = await Users.findOne({
        email:email,

    })

    try
    {

        if(userFound)
            {

                // const user = 
                await Users.updateOne({
                    // userName:userName,
                    email:email,
                    // message:message,
                },
                {
                    '$push': {
                        userNames:userName,
                        newMessages: message,
                    },

                    '$set':{
                        userName:userName,
                    },

                //    '$push': {
                //         // userName:userName,
                //         newMessages: message,
                //     }
                }
            )
                res.json({

                    msg:"User Updated Successfully"
                })

        }

        else
        {

            await Users.create({

                userName: userName,
                email: email,
                message:message,

            })

            res.json({

                msg:"User added Successfully",
            })
        }
    }
    catch(err){

        res.status(500).json({

            error:err.message,
        })
    } 
})


module.exports= routes;