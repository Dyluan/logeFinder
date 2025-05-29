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
    console.log('appartments fetched');
})

app.get('/appartments/search', async (req, res) => {
    try {
        const { maxPrice, minSurface, city, minRooms, type_location, type_bien, garage, tri } = req.query;
        // console.log(req.query.search);
        let query = 'SELECT * FROM biens_immobiliers WHERE 1=1';
        const params = [];

        if (maxPrice) {
            params.push(maxPrice);
            query += ` AND prix <= $${params.length}`
        }
        if (city) {
            const cities = city.split(',').map(c => c.trim());
            const cityConditions = cities.map((_, index) => {
                params.push(cities[index]);
                return `ville ILIKE $${params.length}`;
            });
            query += ` AND (${cityConditions.join(' OR ')})`
        }
        if (minRooms) {
            params.push(minRooms);
            query += ` AND nombre_chambres >= $${params.length}`;
        }
        if (type_location) {
            //type is either 'Location' or 'Vente'. Database type_location is in lowercase
            params.push(type_location.toLowerCase());
            query += ` AND type_annonce = $${params.length}`;
        }
        if (minSurface) {
            const temp_minSurface = parseInt(minSurface);
            params.push(temp_minSurface);
            query += ` AND surface >= $${params.length}`
        }
        if (type_bien) {
            const temp_type_bien = type_bien.toLowerCase().trim();
            params.push(temp_type_bien);
            query += ` AND type_bien ILIKE $${params.length}`;
        }
        if (garage) {
            let garageValue;
            if (garage === 'Oui') {
                garageValue = true;
            } else {
                garageValue = false;
            }
            params.push(garageValue);
            query += ` AND garage = $${params.length}`;
        }
        if (tri) {
            switch(tri) {
                case 'Prix croissant':
                    query += ' ORDER BY prix ASC';
                    break;
                case 'Prix décroissant':
                    query += ' ORDER BY prix DESC';
                    break;
                case 'Superficie croissant':
                    query += ' ORDER BY surface ASC';
                    break;
                case 'Superficie décroissant':
                    query += ' ORDER BY surface DESC';
                    break;
                case 'Nb chambres croissant':
                    query += ' ORDER BY nombre_chambres ASC';
                    break;
                case 'Nb chambres décroissant':
                    query += ' ORDER BY nombre_chambres DESC';
                    break;
                default:
                    break;
            }
        }

        const result = await pool.query(query, params);
        console.log('Query: ', query)
        console.log('Search results : ', result.rows.length);
        res.json(result.rows);
    }
    catch(error) {
        console.log('Erreur lors de la requête', error);
        res.status(500).json({ error: error.message });
    }
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