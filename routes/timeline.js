// Render Timeline
var express = require('express');
var router = express.Router();
var database = require('mongodb').MongoClient;
var mongourl = /* Your MongDB URL */

router.get('/', function(req, res, next) {
	database.connect(mongourl,function(err,db){
		if(err){
			console.log(err);
			next(err);
		}
		else{
			//	Read!
			try{
				db.collection('Pages').find({name:'timeline'}).toArray(function(err, data) {
					if(err){
						console.log(err);
						next(err);
					}
					data = data[0];
					res.locals.title = data.title;
					res.locals.description = data.description
					//	For Testing
					db.collection('Projects').find({}).sort({'date':-1}).toArray(function(err, data){
						if(err){
							console.log(err);
							next(err);
						}
						//	TODO Need performance improvement
						var raw_projects = data;
						var projects = new Object();
						for (i in data){
							year = (new Date(data[i].date)).getFullYear();
							if(projects[year]==null)
								projects[year] = new Array(data[i]);
							else
								projects[year] = projects[year].concat(new Array(data[i]))
						}
						var years = []	// Reverse timeline
						for(year in projects){
							years = years.concat(year);
						}
						years.reverse();
						res.locals.project_list = projects;	// From MongDB
						res.locals.years = years;
						res.render('timeline');
						db.close();					
					});
				});
			}
			catch(err){
				console.log(err);
				next(err);
			}
		}
	});
});
module.exports = router;
