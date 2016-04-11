var _ = require('underscore');
var models = require('../models');

var Lobby = models.Lobby;

var lobbyPage = function(req, res){
    Lobby.LobbyModel.findAllLobbies(function(lobbies){
               
        res.render('app', {csrfToken: req.csrfToken(), lobbies: lobbies});
    });    
};

 var createLobby = function(req, res){
	 //console.log(req.body.score);
     if(!req.body.name || !req.body.score){
         return res.status(400).json({error: "RAWR! Lobby Name and Score are required"});
     }   
     
     var lobbyData = {
         name: req.body.name,
         score: req.body.score,
         owner: req.session.account._id         
     };
     
     var newLobby = new Lobby.LobbyModel(lobbyData);
     
     newLobby.save(function(err){
        if(err){
            console.log(err);
            return res.status(400).json({error: 'An error occured'});
        }   
        // would like to figure out how to pass the lobby info to the game page      
        res.json({redirect: '/game'});
        //res.render('playgame', { csrfToken: req.csrfToken(), lobbyData: lobbyData });
     });

     //res.render('playgame', { csrfToken: req.csrfToken(), lobbyData: lobbyData });
     
 };

var playgame = function(req,res){
    /*
    var lobbyInfo = Lobby.LobbyModel.findByOwner(req.session.account._id, function(lobbies){
        console.log(lobbies);   
        //res.render('app', {csrfToken: req.csrfToken(), lobbies: lobbies});
    });
    */  

    var lobbyData = {
         name: req.session.account.username,
         //score: req.body.score,
         owner: req.session.account._id         
     };

     //console.log(lobbyData.owner);

    res.render('playgame', { csrfToken: req.csrfToken(), lobbyData: lobbyData });  
};

 
var deleteLobby = function(req, res){
    //console.log("delete");
    Lobby.LobbyModel.remove({name: req.params.name}, function(err){
        if(err){
            res.json(err);
        }
        else{
            res.redirect('/lobbies');
        }        
    });
};

var removeCurrentLobby = function(req, res){
    //console.log(req.session.account._id);
    Lobby.LobbyModel.remove({owner: req.session.account._id}, function(err){
        if(err){
            res.json(err);
        }
        else{
            res.redirect('/lobbies');
        }        
    });
};


module.exports.lobbyPage = lobbyPage;
module.exports.create = createLobby;
module.exports.play = playgame;
module.exports.deleteLobby = deleteLobby;
module.exports.removeLobby = removeCurrentLobby;