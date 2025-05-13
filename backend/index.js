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

app.get('/appartments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM biens_immobiliers WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Bien immobilier non trouvé' });
        }

        res.json(result.rows[0]);
    }
    catch(error) {
        console.error('Erreur lors de la récupération du bien immobilier:', error.message);
        res.status(500).json({ error: error.message});
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));