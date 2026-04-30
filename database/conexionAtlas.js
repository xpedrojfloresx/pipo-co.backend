import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

const clientOptions = {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    },  
}

async function connectAtlas() {
    try {
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log('Atlas connected successfully');
    } catch (error) {
        console.error('Atlas connection error:', error);
    }
}

export { connectAtlas };
