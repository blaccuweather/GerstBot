var http = require('http');
var irc = require('irc')
var api_request = function(call, callback) {
	http.get({
		host: 'www.giantbomb.com',
		port: 80,
		path: call
	}, function(response) {
		var data = '';
		response.on('data', function(chunk) {
			data += chunk;
		});
		response.on('error', function(e) {
			console.log('ERROR: ' + e.message);
			// error handling would be the responsible thing to do here but whatever
		});
		response.on('end', function() {
			callback(JSON.parse(data));
			console.log('API call complete!');
		});
	});
};

var bot = new irc.Client('irc.freenode.net', 'GerstBot', {
    debug: true,
    channels: ['#derpyhooves'],
});

var auth = function(to, pass) {
	bot.say(to, pass);
	bot.join('#Fillydelphia');
};

var commands = [
	{
		command: /^\.gb/i,
		action: function(from, to, message) {
			var query = message.substr(4);
			api_request('/api/search/?api_key=c694d7e345cf14edc0715605f66e19d83317760d&limit=1&query=' + encodeURIComponent(query) + '&format=json', function(data) {
				if ( data.number_of_total_results > 0 ) {
					bot.say(to, from + ': ' + data.results[0].name + ' ' + data.results[0].site_detail_url);
				}
				else {
					bot.say(to, from +': ' + query + '?  The fuck is that?');
				}
			});
		}
	},
	{
		command: /^\.concept/i,
		action: function(from, to, message) {
			var query = message.substr(9);
			api_request('/api/search/?api_key=c694d7e345cf14edc0715605f66e19d83317760d&limit=1&resources=game&query=' + encodeURIComponent(query) + '&format=json', function(data) {
				if ( data.number_of_total_results > 0 ) {
					bot.say(to, from + ': ' + data.results[0].name + ' ' + data.results[0].site_detail_url);
				}
				else {
					bot.say(to, from +': ' + query + '?  The fuck is that?');
				}
			});
		}
	},
	{
		command: /^\.game/i,
		action: function(from, to, message) {
			var query = message.substr(6);
			api_request('/api/search/?api_key=c694d7e345cf14edc0715605f66e19d83317760d&limit=1&resources=game&query=' + encodeURIComponent(query) + '&format=json', function(data) {
				if ( data.number_of_total_results > 0 ) {
					bot.say(to, from + ': ' + data.results[0].name + ' ' + data.results[0].site_detail_url);
				}
				else {
					bot.say(to, from +': ' + query + '?  The fuck is that?');
				}
			});
		}
	},
	{
		command: /^\.vid/i,
		action: function(from, to, message) {
			var query = message.substr(5);
			api_request('/api/search/?api_key=c694d7e345cf14edc0715605f66e19d83317760d&limit=1&resources=video&query=' + encodeURIComponent(query) + '&format=json', function(data) {
				if ( data.number_of_total_results > 0 ) {
					bot.say(to, from + ': ' + data.results[0].name + ' ' + data.results[0].site_detail_url);
				}
				else {
					bot.say(to, from +': ' + query + '?  The fuck is that?');
				}
			});
		}
	}
];
	
bot.addListener('error', function(message) {
    console.error('ERROR: %s: %s', message.command, message.args.join(' '));
});

bot.addListener('message#blah', function (from, message) {
    console.log('<%s> %s', from, message);
});

bot.addListener('message', function (from, to, message) {
    console.log('%s => %s: %s', from, to, message);
	
	commands.forEach(function(cmd) {
		if (message.match(cmd.command)) {
			cmd.action(from, to, message);
		}
	});
});

bot.addListener('pm', function(nick, message) {
    console.log('Got private message from %s: %s', nick, message);
});
bot.addListener('join', function(channel, who) {
    console.log('%s has joined %s', who, channel);
});
bot.addListener('part', function(channel, who, reason) {
    console.log('%s has left %s: %s', who, channel, reason);
});
bot.addListener('kick', function(channel, who, by, reason) {
    console.log('%s was kicked from %s by %s: %s', who, channel, by, reason);
});

setTimeout(function() { auth('NickServ', 'identify ' + process.env.GERSTBOT_PASSWORD) } , 2000);
