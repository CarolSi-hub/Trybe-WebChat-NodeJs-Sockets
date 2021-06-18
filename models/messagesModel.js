const connection = require('./connection');

const create = async ({ message, nickname, timestamp }) => {
    const newMessage = await connection()
    .then((db) => db.collection('messages')
    .insertOne({ message, nickname, timestamp }));
    return newMessage.ops[0];
};

const getAllMessages = async () => {
    const messages = await connection()
    .then((db) => db.collection('messages').find().toArray());
    return messages;
};

module.exports = { create, getAllMessages };