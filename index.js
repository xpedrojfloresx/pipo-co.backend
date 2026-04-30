import app from './app.js';

import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

import { connectAtlas } from './database/conexionAtlas.js';

connectAtlas();

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
