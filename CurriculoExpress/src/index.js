const express = require("express");
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
});

const app = express();

const PORT = 3000; 

app.use(express.json());

app.get('/', (req, res) => {
    console.log('olá mundo');
});

app.get('/curriculo', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM curriculo');
        return res.status(200).send(rows);
    } catch (err) {
        return res.status(400).send(err);
    }
});

app.post('/session', async (req, res) => {
    const { nome, email, telefone, graduacao } = req.body;
    try {
        let curriculo = await pool.query('SELECT * FROM curriculo WHERE nome = $1 AND email = $2 AND telefone = $3 AND graduacao = $4', [nome, email, telefone, graduacao]);
        if (curriculo.rows.length === 0) {
            // Se não houver entrada para este usuário, insira no banco de dados
            curriculo = await pool.query('INSERT INTO curriculo (nome, email, telefone, graduacao) VALUES ($1, $2, $3, $4) RETURNING *', [nome, email, telefone, graduacao]);
            return res.status(200).send(curriculo.rows[0]); 
        } else {
            return res.status(200).send(curriculo.rows[0]); 
        }
    } catch (err) {
        return res.status(400).send(err);
    }
});

app.delete('/session', async (req, res) => {
    const { nome, email, telefone, graduacao } = req.body;
    try {
        const deletedCurriculo = await pool.query('DELETE FROM curriculo WHERE nome = $1 AND email = $2 AND telefone = $3 AND graduacao = $4 RETURNING *', [nome, email, telefone, graduacao]);
        if (deletedCurriculo.rows.length === 0) {
            return res.status(404).send('Registro não encontrado');
        } else {
            return res.status(200).send('Registro removido com sucesso');
        }
    } catch (err) {
        return res.status(400).send(err);
    }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`)); 
