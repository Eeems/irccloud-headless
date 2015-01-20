var page = require('webpage').create(),
	server = require('webserver').create(),
	config = require('./config.json'),
	loggedin = false;
page.onLoadStarted = function(){
	console.log('onloadstart event');
};
page.onUrlChanged = function(url){
	console.log('urlchange event ('+url+')');
	if(loggedin){
		page.screenshot();
	}
};
page.onError = function(msg,trace){
	console.error(msg);
	console.log(trace);
};
page.getURL = function(){
	return page.evaluate(function() {
		return window.location.href;
	});
};
page.screenshot = function(){
	var path = 'screenshots/'+Date.now()+'.png';
	page.render(path);
	console.log('Saved Screenshot to '+path);
};
page.open('https://irccloud.com/',function(){
	console.log('onloadendevent ('+page.getURL()+')');
	page.screenshot();
	if(!loggedin){
		console.log('Running login hook');
		page.evaluate(function(config){
			var form = $('form.signin');
			form.find('input[name=email]').val(config.email);
			form.find('input[name=password]').val(config.password);
			form.submit();
		},config);
		loggedin = true;
	}
});
server.listen(9006,function(req,res){
	switch(req.url){
		case '/image':
			res.statusCode = 200;
			res.setHeader('Content-Type','plain/text');
			res.write("data:image/png;base64,"+page.renderBase64('PNG'));
		break;
		case '/':
			res.statusCode = 200;
			res.setHeader('Content-Type','text/html');
			res.write("<html><head><script src=\"//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js\"></script><script>$(function(){var get=function(){$.get('image',function(d){$('img').attr('src',d);setTimeout(get,1000);});};get();});</script></head><body><img src=\"data:image/png;base64,"+page.renderBase64('PNG')+"\" als=\"Page\"></body></html>");
		break;
		default:
			res.statusCode = 404;
			res.setHeader('Content-Type','text/plain');
			res.write('Page not found.');
	}
	res.close();
});