
const socket = io('http://:50750', {
	transports: ['websocket']
});

const vueApp = new Vue({
	el: '#app',
	data: {
		data: {},
	},
	template: `
		<div class="container">
			<div class="row">
			    <div class="col-10">
					
					<table class="table table-striped dataTable">
						<thead>
							<tr>
								<th scope="col">название валюты</th>
								<th scope="col" class="dataTable__head__volume">цена</th>
								<th scope="col" class="dataTable__head__amount">количество</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="row in data" class="dataTable__row">
								<td v-text="row.name" class="dataTable__row__name"></td>
								<td v-text="row.volume" class="dataTable__row__volume"></td>
								<td v-text="row.amount" class="dataTable__row__amount"></td>
							</tr>
						</tbody>
					</table>
					
			    </div>
			    <div class="col-2">
			        
			        <button type="button" class="btn btn-primary" v-on:click="doForcedRefresh">Обновить</button>
			        
			    </div>
			</div>
		</div>
	`,
	computed: {},
	watch: {},
	methods: {
		doForcedRefresh() {
			socket.emit('doForcedRefresh');
		},
		refresh(data) {
			this.data = data;
		},
	},
});

socket.on('refresh', data => {
	console.log(data);
	vueApp.refresh(data);
});
