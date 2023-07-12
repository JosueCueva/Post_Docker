const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const { Pool } = require('pg');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 3000;

// Configura la conexión a la base de datos PostgreSQL para usuarios
const userPool = new Pool({
	user: 'jcueva',
	host: '172.17.0.2',
	database: 'ProyectoUsers',
	password: '2425',
	port: 5432,
});

// Configura la conexión a la base de datos PostgreSQL para publicaciones
const postPool = new Pool({
	user: 'jcueva',
	host: '172.17.0.3',
	database: 'ProyectoPosts',
	password: '2425',
	port: 5432,
});

// Ruta GET para obtener todos los usuarios
app.get('/users', async (req, res) => {
	const client = await userPool.connect();
	try {
		const result = await client.query('SELECT * FROM users');
		res.json(result.rows);
	} catch (error) {
		console.error('Error al obtener los usuarios', error);
		res.status(500).send('Error al obtener los usuarios');
	} finally {
		client.release();
	}
});

// Ruta POST para crear un nuevo usuario
app.post('/users', async (req, res) => {
	const { user, email, password } = req.body;
	const client = await userPool.connect();
	try {
		const result = await client.query(
		'INSERT INTO users (user_n, email, password) VALUES ($1, $2, $3) RETURNING *',
		[user, email, password]
		);
		res.json(result.rows[0]);
	} catch (error) {
		console.error('Error al crear el usuario', error);
		res.status(500).send('Error al crear el usuario');
	} finally {
		client.release();
	}
});

// Ruta GET para obtener todas las publicaciones
app.get('/posts', async (req, res) => {
	const client = await postPool.connect();
	try {
		const result = await client.query('SELECT * FROM posts');
		res.json(result.rows);
	} catch (error) {
		console.error('Error al obtener las publicaciones', error);
		res.status(500).send('Error al obtener las publicaciones');
	} finally {
		client.release();
	}
});

// Ruta POST para crear una nueva publicación
app.post('/posts', async (req, res) => {
	const { title, content, user_id } = req.body;
	const client = await postPool.connect();
	try {
		const result = await client.query(
		'INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *',
		[title, content, user_id]
		);
		res.json(result.rows[0]);
	} catch (error) {
		console.error('Error al crear la publicación', error);
		res.status(500).send('Error al crear la publicación');
	} finally {
		client.release();
	}
});

app.listen(port, () => {
	console.log(`Servidor iniciado en http://localhost:${port}`);
});