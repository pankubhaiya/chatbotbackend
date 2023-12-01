
const botModel = require("../models/bots.model")
const nodeModel = require("../models/chatbot.model")
const bot = async(req,res)=>{
           
      try{
            const {email,botname}= req.body
            const bot = botModel({
            email:email,
            botName:botname
           })
           await bot.save()
           res.status(200).send({message:"chatbotCreate"})

      }catch(err){
            res.status(400).send(err.message)
      }

}
const allbot = async(req,res)=>{
           
      try{
          const {email}= req.body
           const bot =  await botModel.find({email})
           res.status(200).send(bot)

      }catch(err){
            res.status(400).send(err.message)
      }

}

const Node = async(req,res)=>{
           
      try{
            const {email,botname,botid,type,content,x,y,nodeId}= req.body
           const node = await nodeModel.create({
            botid:botid,
            nodeId:nodeId,
            Type: type,
            content: content,
            position:{X:x,Y:y}
           })
           res.status(200).send({message:"nodeCreate"})

      }catch(err){
            res.status(400).send(err.message)
      }

}
const allnode = async(req,res)=>{
           
      try{
            const {botid}= req.body
            const node =  await nodeModel.find({botid})
           res.status(200).send(node)

      }catch(err){
            res.status(400).send(err.message)
      }

}
module.exports = {bot,Node,allbot,allnode}