const express = require("express");
const { Chatbot, Node, Edge } = require("../models/chatbot.model");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose")
const chatbotRouter = express.Router();


// chatbot creation  
chatbotRouter.post("/chatbot/create",async(req,res)=>{
    try {
        const {title} = req.body;
        if(!title){
            return res.status(400).send("Title is required to create chatbot")
        }
        const chatbot = new Chatbot({title});
        await chatbot.save();
        return res.status(200).send("Chatbot created successfully!")
    } catch (error) {
        console.log("[CHATBOT_CREATION_ERROR]",error);
        return res.status(500).send(error.message);
    }
});
 

chatbotRouter.post("/chatbot/create-nodes",async(req,res)=>{
    try {
       const {nodes,chatbotId} = req.body;
       if(!nodes || !chatbotId){
        return res.status(400).send("nodes and chatbotId is required!")
       } 
    
       for(let i=0;i<nodes.length;i++){
        let newNode = new Node({id:i+1,...nodes[i],chatbotId});
        await newNode.save();
        let newEdge = new Edge({id:uuidv4(), source:i+1 , target:i+2,startNode:newNode._id});
        await newEdge.save()
       }

       return res.status(200).send("Nodes created successfully!")
    } catch (error) {
        console.log("[Nodes creation error]",error);
        return res.status(500).send(error.message);
    }
});

chatbotRouter.get("/chatbot/nodes/:chatbotId",async(req,res)=>{
    try {
        const chatbotId = req.params.chatbotId;
        const nodes = await Node.find({chatbotId});
        if(!nodes.length){
            return res.status(400).send("No nodes found for this chatbot!");
        }
        let edges = []
        for(let node of nodes){
            const edge = await Edge.findOne({startNode:node._id})
            if(!edge){
                continue;
            }
            else{
                const edgeObj = {
                    id:edge?.id,
                    source:edge?.source,
                    target:edge?.target,
                }
                // console.log(edgeObj)
                edges.push(edgeObj)
            }
          
        }

        return res.status(200).send({nodes,edges})
    } catch (error) {
     console.log(error,"FAILED TO FETCH NODES");
     return res.status(500).send(error.message)   
    }
});

/// create a single node
chatbotRouter.post("/createSingleNode",async(req,res)=>{
    try {
        const {id,chatbotId,type,data,position}= req.body
        if(!id || !chatbotId || !type || !data || !position){
            return res.status(400).send("all field are required")
        }
        const newNode= new Node({...req.body})
        await newNode.save()

         return  res.status(200).send("new node created ")

    } catch (error) {
        console.log(error,"FAILED TO CREATE NEW NODES");
        return res.status(500).send(error.message) 
    }
})

// upadate a node 
chatbotRouter.put("/nodesUpdate/:id",async(req,res)=>{
    try {
  const nodeId = req.params.id
//   console.log(nodeId)
  const {content} = req.body
   // Check if the content field is present
   if (!content) {
    return res.status(400).send("Content is required for update");
   }
  // Find the node by its id
  const node = await Node.findOne({id: nodeId });
   if(!node){
    return res.status(400).send("node is not found with that id")

   }
    // Update the content field
    node.data.content = content
    await node.save()
    return res.status(200).send("Node updated successfully!");
    } catch (error) {
        console.log("[Update Node Error]", error);
        return res.status(500).send(error.message);
    }
})


// edge connectiong routes 
chatbotRouter.post("/createEdge", async (req, res) => {
    
    console.log(req.body);
    try {
        const {id,source, target,startNode } = req.body;

        // // Check if required fields are present
        if (!source || !target ||  !startNode) {
            return res.status(400).send("All fields are required");
        }
        
        //  Ensure that the provided values are valid ObjectId strings
        //  if (!mongoose.Types.ObjectId.isValid(source) || !mongoose.Types.ObjectId.isValid(target) || !mongoose.Types.ObjectId.isValid(startNode)) {
        //     return res.status(400).send("Invalid ObjectId format for source, target, or startNode");
        // }
        // Check if the nodes with source and target exist
        const sourceNode = await Node.findOne({ id: source });
        const targetNode = await Node.findOne({ id: target });
        const startNodeId = await Node.findOne({id:startNode});

        console.log(sourceNode,targetNode)

        if (!sourceNode || !targetNode) {
            return res.status(400).send("Source or target node not found");
        }
        // Create a new edge
        console.log();
        const newEdge = new Edge({
            // id,
            source: sourceNode.id,
            target: targetNode.id,
            startNode: startNodeId._id
        });

        // Save the edge to the database
        await newEdge.save();

        return res.status(200).send("Edge created successfully!");
        console.log(newEdge)

    } catch (error) {
        console.log("[Create Edge Error]", error);
        return res.status(500).send(error.message);
    }
});



module.exports = { chatbotRouter };

