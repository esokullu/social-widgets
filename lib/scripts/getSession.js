import getUser from './getUser.js';

export default function(callback) {
	let key = (window && window.hasOwnProperty('GraphJSConfig')) ? window.GraphJSConfig.id.replace(/-/g, '') : undefined;
	let id;
	let username;
	let admin = false;
	let cookies = document.cookie.replace(/\s+/g, '').split(';');
	if (cookies.filter(
		function(item) {
	    	return item.indexOf('groudotps_' + key + '_id=') >= 0;
		}
	).length) {
		for(let cookie of cookies) {
			let data = cookie.split('=');
			if(data[0] == 'groudotps_' + key + '_id') {
				id = data[1];
			}
			else if(data[0] == 'groudotps_' + key + '_username') {
				username = data[1];
			}
			else if(data[0] == 'groudotps_' + key + '_admin') {
				admin = JSON.parse(data[1]);
			}
		}
		let response = {
			"success": true,
			"id": id,
			"username": username,
			"admin": admin
		};
		callback(response);
	} else {
		if (cookies.filter(
			function(item) {
		    	return item.indexOf('groudotps_' + key + '_session_off=') >= 0;
			}
		).length) {
			let response = {
				"success": false,
				"reason": "No active session"
			}
			callback(response);
		} else {
			getUser(function(response) {
				if(response.success) {
					let expiry = new Date();
		  			expiry.setTime(expiry.getTime() + (10 * 60 * 1000));
					document.cookie = 'groudotps_' + key + '_id=' + response.id + '; path=/; expires=' + expiry.toGMTString() + '; samesite=none; secure;';;
					document.cookie = 'groudotps_' + key + '_username=' + response.username + '; path=/; expires=' + expiry.toGMTString() + '; samesite=none; secure;';;
					document.cookie = 'groudotps_' + key + '_admin=' + (response.admin) + '; path=/; expires=' + expiry.toGMTString() + '; samesite=none; secure;';;
				} else {
					document.cookie = 'groudotps_' + key + '_session_off=true; path=/; samesite=none; secure;';
				}
				callback(response);
			});
		}
	}
};