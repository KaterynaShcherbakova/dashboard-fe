<template>
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
export default {
    props: {
        transactions: Array
    },
    methods: {
        getValue(x) {
            return x.out.map((input) => input.value).reduce((sum, output) => sum + output, 0) / 100000000;
        },
        getFromAddr(x) {
            return x.inputs.map((input) => input.prev_out.addr).join('\n');
        },
        getToAddr(x) {
            return x.out.map((output) => output.addr).join('\n');
        }
    }
};
</script>

<style lang="scss">
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