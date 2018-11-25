const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const axios = require('axios');

const periodSec = 15;
const url = 'http://phisix-api3.appspot.com/stocks.json';
const refreshEventName = 'refresh';
const port = 50750;

let data = {};

bindTimer();

io.on('connection', socket => {
	console.log('connection');
	socket.emit(refreshEventName, data);

	socket.on('doForcedRefresh', ()=>{
		console.log('doForcedRefresh');
		socket.emit(refreshEventName, data);
	});
});

http.listen(port, ()=>{
	console.log('listening on *:'+port);
});

function bindTimer() {
	setInterval(()=>{
		console.log('tick');
		refresh();
	}, periodSec*1000);
	refresh();
}

function refresh() {
	getData()
		.then(data => {
			io.sockets.emit(refreshEventName, data);
		})
		.catch(error => {
			console.log(error);
		});
}

async function getData() {
	const dirtyData = await getDirtyData();
	data = clearData(dirtyData);
	return data;
}

async function getDirtyData() {
	const response = await axios.get(url);
	return response.data.stock;
}

function clearData(dirtyData) {
	return dirtyData.map(row=> {
		return {
			name: row.name,
			volume: row.volume.toFixed(),
			amount: row.price.amount.toFixed(2)
		};
	});
}

