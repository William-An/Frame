//	Render project page
var express = require('express');
var router = express.Router();
var database = require('mongodb').MongoClient;
//	TODO URL from app.js?
var mongourl = /* Your MongDB URL */

router.get('/', function(req, res, next) {
	res.redirect('/timeline');
});
router.get('/:name',function(req, res, next){
	database.connect(mongourl,function(err,db){
		if(err){
			console.log(err);
			next(err);
		}
		else{
			//	Read!
			try{
				db.collection('Projects').find({title:req.params.name}).toArray(function(err, data) {
					if(err){
						console.log(err);
						next(err);
					}
					data = data[0];	// The first one
					res.locals.project = data;
					//	Only 3 random projects, nearest in time
					try{
						db.collection('Projects').find({_id:{$gt:data._id}},{_id:{$lt:data._id}}).limit(3).toArray(function(err, data){
							res.locals.projects_list = data;
							res.locals.noheader = true;
							res.render('project');
							db.close();					
						});
					}
					catch(err){
						if(err.name == 'TypeError')
							next();
						console.log(err);
						next(err);
					}
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
