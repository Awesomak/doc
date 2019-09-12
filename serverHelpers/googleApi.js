const { google } = require('googleapis');

/** CONFIGURATION **/

const googleConfig = {
	clientId: '232611255256-vnufshjae4tcc72mhdkmdkotk5f992m8.apps.googleusercontent.com',
	clientSecret: 'ez7LXx8_SWmZ_FJRkPSxkuQx',
	redirect: 'http://localhost:3000/google-api'
};

const defaultScope = [ 'https://www.googleapis.com/auth/gmail.readonly' ];

/** HELPERS **/

function createConnection() {
	return new google.auth.OAuth2(googleConfig.clientId, googleConfig.clientSecret, googleConfig.redirect);
}

function getConnectionUrl(auth) {
	return auth.generateAuthUrl({
		access_type: 'offline',
		prompt: 'consent',
		scope: defaultScope
	});
}

/** MAIN **/

//Create a Google URL and send to the client to log in the user.
function urlGoogle() {
	const auth = createConnection();
	const url = getConnectionUrl(auth);
	return url;
}

//Take the "code" parameter which Google gives us once when the user logs in, then get the user's email and id.
async function getGoogleAccountFromCode(code) {
	const auth = createConnection();
	const { tokens } = await auth.getToken(code);
	auth.setCredentials(tokens);
	const gmail = google.gmail({ version: 'v1', auth });
	const email = await gmail.users.getProfile({
		userId: 'me'
	});
	return { email: email.data.emailAddress };
}

module.exports = {
	getGoogleAccountFromCode,
	urlGoogle
};
