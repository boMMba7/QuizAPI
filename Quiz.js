
//npm init --yes
//npm i express    ---> install the express packeg, make easy to define with tipe request as bein made
//npm i joi        ---> install the joi packeg, helps to validate the request
//sudo npm i -g nodemon


const Joi = require('joi');
const express = require('express');
const quizApp = express();

quizApp.use(express.json());

const questions = [
	{id: 1, category: 'all', question: 'what is the sky color', answer: [{answer: 'red'}, {answer: 'yealow'}, {answer: 'blue'}, {answer: 'blue'} ]},
	{id: 2, category: 'all', question: 'what is the moon color', answer: [{answer: 'gray'}, {answer: 'yealow'}, {answer: 'blue'}, {answer: 'blue'} ]},
	{id: 3, category: 'math', question: '1 + 2', answer: [{answer: '43'}, {answer: 'yealow'}, {answer: '56'}, {answer: '3'} ]},
	{id: 4, category: 'math', question: '1 x 0', answer: [{answer: '1'}, {answer: '0'}, {answer: '2'}, {answer: '-1'} ]}
];

//get request to the main end Point
quizApp.get('/', (req, res) => {
	res.send('Welcome to myQuiz API');
});

// get all questions
quizApp.get('/api/questions', (req, res) => {
	res.send(questions);
});

//get the specific category
quizApp.get('/api/questions/:category', (req, res) => {
	// check if category exist, if not return imediatly
	const result = questions.filter(question => question.category === req.params.category);
	if(result.length === 0) return res.status(404).send('no question with this category');
	
	res.send(result);
});

//adding new question
quizApp.post('/api/questions', (req, res) => {
	// { error } object distroction, allow to pick just the propiete of returned object
	const { error } = validateQuestion(req.body);
	if(error) return res.status(400).send(error.details[0].message);

	const question = {
		id: questions.length + 1,
		category: req.body.category,
		question: req.body.question,
		answer: req.body.answer
	};
	questions.push(question);
	res.send(question);
});

function validateQuestion(question) {
	
	//items are string, minimocharacter 1 answer is mandatory
	const schemaAnswer = Joi.object({
		answer: Joi.string().min(1).required()
	});

	//creating rulls to validate the question
	const schemaQ = Joi.object({
		//category is String with minimo 3 characters ans is mandatory
		category: Joi.string().min(3).required(),
		question: Joi.string().min(3).required(),
		// answer is array with min 2 items and max 4 item
		answer: Joi.array().min(2).max(4).items( schemaAnswer ).required()
	});
	//validating the question, if pass all Joi condition return true
	return schemaQ.validate(question);
}


//reading the enveriment port, if dont have atribut port 3000
const port = process.env.PORT || 3000
//listening for requests
quizApp.listen(port, () => console.log(`Listening on port ${port}...`));