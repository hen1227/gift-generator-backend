import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/sendInitialMessage', (req, res) => {
    console.log(req.body.data)
    const { name, age, gender, relationship, lowerBudgetRange, upperBudgetRange, occasion, interests, disinterests, preferences, openEndedAddition } = req.body.data;

    res.status(200).send({message: `${name}, ${age}, ${gender}, ${relationship}, ${lowerBudgetRange}, ${upperBudgetRange}, ${occasion}, ${interests}, ${disinterests}, ${preferences}, ${openEndedAddition}`});
});


app.listen(3001, () => {
    console.log('Example app listening on port 3001!');
});