const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = {
    client: 'sqlite3',
    connection: {
        filename: './data/userHobbies.sqlite3',
    },
    useNullAsDefault: true,
};

const db = knex(knexConfig);

const server = express();

server.use(helmet());
server.use(express.json());

server.get('/api/users', async (req, res) => {
    try {
        const users = await db('users');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

server.get('/api/users/:id', async (req, res) => {
    try {
        const user = await db('users')
            .where({ id: req.params.id })
            .first();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

server.post ('/api/users', async (req, res) => {
    try {
        const [id] = await db('users').insert(req.body);

        const user = await db('users')
            .where({ id })
            .first();

        res.status(201).json(user);
    } catch (error) {
        const message = errors[error.errno] || 'An unexpected error occurred';
        res.status(500).json({ message, error });
    }
});

server.put('/api/users/:id', async (req, res) => {
    try {
        const count = await db('users')
            .where({ id: req.params.id })
            .update(req.body);

        if (count > 0) {
            const user = await db('users')
                .where({ id: req.params.id })
                .first();
            
                res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'Records not found' });
        }
    } catch (error) {
        console.log(error);
    }
});

server.delete('/api/users/:id', async (req, res) => {
    try {
        const count = await db('users')
            .where({ id: req.params.id })
            .del();

        if (count > 0) {
            res.status(204).end();
        } else {
            res.status(404).json({ message: 'Records not found' });
        }
    } catch (error) {
        console.log(error);
    }
});

const port = process.env.PORT || 5000;

server.listen(port, () => 
    console.log(`API running on localhost:${port}`)
);