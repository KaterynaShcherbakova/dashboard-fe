<template>
    <h1>Transactions</h1>

    <div class="toolbar">
        <button class="button-start" @click="startSubscription()">Start</button>
        <button class="button-stop" @click="stopSubscription()">Stop</button>
        <button class="button-reset" @click="resetTransactions()">Reset</button>
    </div>

    <h3>Sum: {{ totalValue.toFixed(8) }} BTC</h3>


    <table class="transactions-table">
        <thead>
            <tr>
                <th>From</th>
                <th>To</th>
                <th>Sum</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="transaction in transactions" :key="transaction.hash">
                <td>{{ getFromAddr(transaction.x) }}</td>
                <td>{{ getToAddr(transaction.x) }}</td>
                <td>{{ getValue(transaction.x) }} BTC</td>
            </tr>
        </tbody>
    </table>


</template>

<script>
import { bitcoinValue, websocketURL } from '@/utils/constants';
export default {
    data() {
        return {
            transactions: [],
            totalValue: 0,
            ws: null,
        };
    },
    methods: {
        getTotalValue(outputs) {
            return outputs.reduce((sum, output) => sum + output.value, 0) / bitcoinValue;
        },
        getValue(x) {
            return x.out.map((input) => input.value).reduce((sum, output) => sum + output, 0) / bitcoinValue;
        },

        getFromAddr(x) {
            return x.out.map((input) => input.addr).reduce((addresses, address) => addresses + '\n' + address)

        },
        getToAddr(x) {
            return x.inputs.map((input) => input.prev_out.addr).reduce((addresses, address) => addresses + '\n' + address)

        },
        startSubscription() {
            this.ws = new WebSocket(websocketURL);

            this.ws.onopen = () => {
                this.ws.send(JSON.stringify({ "op": "unconfirmed_sub" }));
            };

            this.ws.onmessage = (message) => {
                const data = JSON.parse(message.data);
                if (data.op === 'utx') {
                    this.transactions.push(data);
                    this.totalValue += this.getTotalValue(data.x.out);
                }
                console.log(data)
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket Error: ', error);
            };

            this.ws.onclose = () => {
                console.log('WebSocket connection closed');
            };
        },
        stopSubscription() {
            if (this.ws) {
                this.ws.send(JSON.stringify({ "op": "unconfirmed_unsub" }));
                this.ws.close();
            }
        },
        resetTransactions() {
            this.transactions = [];
            this.totalValue = 0;
        }
    },
    beforeDestroy() {
        this.stopSubscription();
    }
};
</script>


<style lang="scss">
.button-basic {
    outline: none;
    border: 1px solid transparent;
    padding: 12px 36px;
    border-radius: 8px;
    color: white;
    transition: all 0.3s;
    cursor: pointer;
}

.toolbar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 40px;
    margin-bottom: 20px;


    .button-start {
        @extend .button-basic;
        background-color: green;

        &:hover {
            color: green;
            border: 1px solid green;
            background-color: white
        }
    }

    .button-stop {
        @extend .button-basic;
        background-color: red;


        &:hover {
            color: red;
            border: 1px solid red;
            background-color: white
        }
    }

    .button-reset {
        @extend .button-basic;
        background-color: orange;


        &:hover {
            color: orange;
            border: 1px solid orange;
            background-color: white
        }
    }
}

.transactions-table {
    width: 100%;
    border-collapse: collapse;

    th {
        text-align: center;
    }

    th,
    td {
        border: 1px solid #ddd;
        padding: 8px;
    }
}
</style>