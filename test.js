

var request = require('request');
var cookie;
var headers = {
    'content-type': 'application/json',
    'accept': 'application/json'
};

var form = {
    'Email': '',
    'Password': ''
};

const proxy = "http://10.213.2.98";
const baseUrl = 'https://www.ariston-net.remotethermo.com';

request.post({url: baseUrl + '/Account/Login', rejectUnauthorized: false, proxy , body: JSON.stringify(form), 
	headers}, function(err, res, body){
    if(err) console.log('login error');

	var setCookie = res.headers['set-cookie'];
	headers.cookie = setCookie;
    // get cookie
	
	request.get({
		url: baseUrl,
		rejectUnauthorized: false, 
		proxy,
		headers
	},(err, res, body)=>{
		var myRegexp = /plantRefreshUrl\s=\s\'([^\']+)/g;
		var plantRefreshUrl = myRegexp.exec(body)[1];

		plantRefreshUrl = plantRefreshUrl.replace('{0}', 1)
		plantRefreshUrl = plantRefreshUrl.replace('{1}', 'si')
		plantRefreshUrl = plantRefreshUrl.replace('{2}', false)
		plantRefreshUrl = plantRefreshUrl.replace('{3}', '')
		plantRefreshUrl = plantRefreshUrl.replace('{4}', true)
		console.log('login success', setCookie, plantRefreshUrl);

		request.get({
			url:baseUrl + plantRefreshUrl ,
			rejectUnauthorized: false, 
			proxy,
			headers
		},(err, res, body)=>{
			console.log(JSON.parse(body))
		})
	});
});

