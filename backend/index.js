const express = require('express');
const cors  = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Tester la connexion
pool.connect((err, client, release) => {
    if (err) {
        console.error('Erreur de connexion:', err.message);
        return;
    }
    console.log('Connecté à PostgreSQL avec succès!');
    release();
});

app.get('/appartments', async (req, res) => {
    const result = await pool.query('SELECT * FROM biens_immobiliers');
    res.json(result.rows);
    console.log(result.rows);
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));