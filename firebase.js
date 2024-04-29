import admin from 'firebase-admin'
import * as fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync('f-ai.json', 'utf8'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.STORAGE_BUCKET
}, 'f-ai')

const storage = admin.storage()
export default storage;