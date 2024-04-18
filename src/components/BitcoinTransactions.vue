<template>
    <h1>Transactions</h1>

    <div class="toolbar">
        <ActionButton actionType="start" @action="startSubscription" />
        <ActionButton actionType="stop" @action="stopSubscription" />
        <ActionButton actionType="reset" @action="resetTransactions" />
    </div>

    <h3>Sum: {{ totalValue.toFixed(8) }} BTC</h3>

    <TransactionsTable :transactions="transactions" />

</template>

<script>
import { bitcoinValue, websocketURL } from '@/utils/constants';
import TransactionsTable from '@/components/TransactionsTable.vue';
import ActionButton from '@/components/ActionButton.vue'
export default {
    data() {
        return {
            transactions: [],
            totalValue: 0,
            ws: null,
        };
    },
    components: {
        ActionButton,
        TransactionsTable
    },
    methods: {
        getTotalValue(outputs) {
            return outputs.reduce((sum, output) => sum + output.value, 0) / bitcoinValue;
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
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error: ', error);
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


.toolbar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 40px;
    margin-bottom: 20px;

}
</style>