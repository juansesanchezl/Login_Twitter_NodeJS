var router = require('express').Router();
var axios = require("axios").default;
var request = require("request");

const { requiresAuth } = require('express-openid-connect');
const { json } = require('express/lib/response');

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Auth0 Webapp sample Nodejs',
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

router.get('/profile', requiresAuth(), function (req, res, next) {
  var options = { 
    method: 'POST',
    url: 'https://dev-om1yl9xu.us.auth0.com/oauth/token',
    headers: { 'content-type': 'application/json' },
    body: '{"client_id":"CLIENT_ID","client_secret":"CLIENT_SECRET","audience":"https://dev-om1yl9xu.us.auth0.com/api/v2/","grant_type":"client_credentials"}' 
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    //console.log(response)
    //console.log(body)
    //console.log(JSON.parse(body));
    var body_json = JSON.parse(body);
    //console.log(body_json.access_token);
    //get_users_data(body_json.access_token);
    var access_token = body_json.access_token;
    var nickname = req.oidc.user.nickname;
      var autoriz = 'Bearer ' + access_token;
      var options2 = {
          method: 'GET',
          url: 'https://dev-om1yl9xu.us.auth0.com/api/v2/users',
          params: {q: 'nickname:"'+nickname+'"', search_engine: 'v3'},
          headers: {authorization: autoriz}
        };
      axios.request(options2).then(function (response) {
          //console.log(response);
          console.log(response.data);
          response.data.forEach(element => console.log(element));
          res.render('profile', {
            userData: JSON.stringify(response.data, null, 2),
            userProfile: JSON.stringify(req.oidc.user, null, 2),
            title: 'Profile page'
          });
        }).catch(function (error) {
          console.error(error);
      });
  });

  
});

module.exports = router;
