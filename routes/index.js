// Render index
var express = require('express');
var router = express.Router();
var database = require('mongodb').MongoClient;
var mongourl = /* Your MongDB URL */

/* GET home page. */
router.get('/', function(req, res, next) {
	database.connect(mongourl,function(err,db){
		if(err){
			console.log(err);
			next(err);
		}
		else{
			//	Read!
			try{
				//	TODO findOne?
				db.collection('Pages').find({name:'index'}).toArray(function(err, data) {
					if(err){
						console.log(err);
						next(err);
					}
					data = data[0];	// The first one
					res.locals.title = data.title;
					res.locals.description = data.description;
					res.locals.subtitle = data.subtitle;
					res.locals.subdescription = data.subdescription;
					res.locals.reasons = data.reasons;
					//	Only 6 starred projects
					db.collection('Projects').find({star:true}).limit(6).toArray(function(err, data){
						if(err){
							console.log(err);
							next(err);
						}
						res.locals.projects = data
						res.render('index');
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
