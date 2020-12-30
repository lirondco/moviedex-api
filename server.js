require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const movies = require('./movies.json');
const { ieNoOpen } = require('helmet');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorised request!' })
    }
    next();
})

app.get('/movie', function handleGetMovie(req, res){
    const { genre, country, avg_vote } = req.query;
    let response = [...movies];
    if(genre) {
        response = response.filter(movie =>
            movie.genre.toLowerCase().includes(genre.toLowerCase())
            )
            if (response.length===0) {
                return res.status(400).json({ message: 'Sorry, we do not have that genre in our database. Please try another one.'})
            }
    }

    if(country) {
        response = response.filter(movie => 
            movie.country.toLowerCase().includes(country.toLowerCase()));
            if (response.length===0) {
                return res.status(400).json({message: 'Sorry, we do not have movies from that country in our database. Please try another one.'})
            }
    }

    if(avg_vote) {
        let searchAvgVote = Number(avg_vote);
        if (Number.isNaN(searchAvgVote)) {
            return res.status(400).json({message: 'avg_vote needs to be a valid number'});
        }
        response = response.filter(movie => 
            Number(movie.avg_vote) >= searchAvgVote
            )
        if (response.length === 0) {
            return res.status(400).json({message: 'Sorry, we do not have movies with that rating. Please try again with another one.'})
        }
    }

    res.status(200).json({response})
});

PORT = 8080;

app.listen(PORT, () =>{
    console.log(`Server is listening at http://localhost:${PORT}`);
})