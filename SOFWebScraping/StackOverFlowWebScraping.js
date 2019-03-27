// Web scraping in Node using cheerio
const rp = require('request-promise');
const cheerio = require('cheerio');
const Table = require('cli-table');

var questions,votes,answers,views;

let table = new Table({
	head: ['Questions with the most views, answers, and votes this week from Stack Overflow:', 'Votes', 'Answers','Views'],
	colWidths: [100, 10, 10, 10]
})

const options = {
    uri: `https://stackoverflow.com/?tab=week`,
    transform: function (body) {
      return cheerio.load(body);
    }
  };

rp(options)
	.then(($) => {

		    questions = $('.question-hyperlink').closest('h3').map(function(){
            return $(this).text(); 
          }).get();

        votes = $('.votes').map(function(){
            return $(this).text();
          }).get();
          
        answers = $('.status.answered-accepted,.status.answered').map(function(){
            return $(this).text(); 
          }).get();
          
        views = $('.views').map(function(){
            return $(this).text(); 
          }).get();
          printData();
        
	})
	.catch((err) => {
    // REQUEST FAILED: 
		console.log(err);
	});

    function printData() {

        for (i = 0; i < questions.length; i++) { 
            table.push([questions[i],modifyString(votes[i]),modifyString(answers[i]),modifyString(views[i])]);
        }

        console.log(table.toString());
   
    }

    function modifyString(string){
        return(string.trim().replace(/\r?\n|\r/, "").split(" ")[0]);
    }
    

