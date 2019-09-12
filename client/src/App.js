import React from 'react';
import AuthChecker from './components/AuthChecker';
import Wait from './components/Wait';
import { Provider } from 'react-redux';
import store from './redux/store';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import { loadUser } from './redux/actions/authAction';

store.dispatch(loadUser());

function App() {
	return (
		<Provider store={store}>
			<div className="App">
				<Router>
					<Route path="/google-api" component={Wait} />
					<AuthChecker />
				</Router>
			</div>
		</Provider>
	);
}

export default App;
