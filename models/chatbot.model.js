const mongoose = require('mongoose');
//Chatbot Schema

const chatbotSchema = mongoose.Schema({
    title: { type: String, required: true },
    nodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Node' }],
})


// Nodes Schema
const nodeSchema = new mongoose.Schema({
    id: { type: String, required: true },
    chatbotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chatbot' },
    type: { type: String, required: true },
    data: {
        label: { type: String, default: ''},
        content:{type:String , default :"enter your message"}
      },
    position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
    },

});


// Edges Schema
const edgeSchema = new mongoose.Schema({
    id: { type: String},
    source: { type: String, required: true },
    target: { type: String, required: true },
    startNode: { type: mongoose.Schema.Types.ObjectId, ref: 'Node', required: true },
});

// Create models
const Chatbot = mongoose.model("Chatbot", chatbotSchema)
const Node = mongoose.model('Node', nodeSchema);
const Edge = mongoose.model('Edge', edgeSchema);

module.exports = {
    Chatbot,
    Node,
    Edge,
};

