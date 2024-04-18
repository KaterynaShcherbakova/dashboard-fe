<template>
    <h1>Trading desk</h1>
    <div class="trading-desk-wrapper" ref="tradingDeskWrapper">
        <div class="trading-desk" ref="tradingDesk" @dragover.prevent @drop="handleDrop($event)">
            <template v-for="tileData in tiles" :key="tileData.id">
                <template v-if="tileData.deleted">
                    <div class="return-tile-box" :style="getReturnTileBoxStyle(tileData)"
                        @click="returnTileById(tileData.id)">{{ getReturnTileBoxText(tileData) }}</div>
                </template>
                <template v-else>
                    <Tile :data="tileData" @drag-start="bringToFront(tileData); handleDragStart(tileData, $event)"
                        @drag-end="handleDragEnd(tileData)" @click="bringToFront(tileData)"
                        @delete="deleteTileById(tileData.id)" />
                </template>
            </template>
        </div>
    </div>
</template>

<script>
import { tileIncrement, defaultHeight, defaultWidth } from '@/utils/constants';
import Tile from './Tile.vue';
export default {
    components: {
        Tile
    },
    data() {
        return {
            tiles: [],
            topZIndex: 5,
            nextId: 0,
            currentTile: null,
            dragOffsetX: 0,
            dragOffsetY: 0,

        };
    },
    created() {
        this.loadTiles();
    },
    methods: {
        addNewItem(x, y) {
            const newItem = {
                id: this.nextId++,
                x: x,
                y: y,
                width: defaultWidth,
                height: defaultHeight,
                zIndex: 0,
                deleted: false
            };
            return newItem;
        },
        getReturnTileBoxStyle(tileData) {
            return {
                left: `${tileData.x}px`,
                top: `${tileData.y}px`,
                zIndex: tileData.zIndex
            };
        },
        defaultTiles() {
            return [
                this.addNewItem(10, 10),
                this.addNewItem(320, 10),
                this.addNewItem(630, 10),
                this.addNewItem(10, 120),
                this.addNewItem(320, 120),
            ];
        },

        getReturnTileBoxText(tileData) {
            return `Return tile ${ tileData.id } to trading desk`
        },
        getTradingDeskWidth() {
            const tradingDesk = this.$refs.tradingDesk;
            return tradingDesk ? tradingDesk.offsetWidth : 600;

        },
        getTradingDeskHeight() {
            const tradingDesk = this.$refs.tradingDesk;
            return tradingDesk ? tradingDesk.offsetHeight : 600;
        },

        bringToFront(tile) {
            tile.zIndex = ++this.topZIndex;
            this.saveTiles();
        },

        returnTileById(id) {
            this.tiles = this.tiles.map((tile) => {
                if (tile.id === id) {
                    tile.deleted = false;
                    tile.height = defaultHeight;
                    tile.width = defaultWidth;
                    tile.x = (this.getTradingDeskWidth() - defaultWidth) / 2
                    tile.y = (this.getTradingDeskHeight() - defaultHeight) / 2

                }
                return tile;
            })
        },
        deleteTileById(id) {
            this.tiles = this.tiles.map((tile) => {
                if (tile.id === id) {
                    tile.deleted = true;
                }
                return tile;
            })
        },

        valueStickedToGrid(value) {
            return Math.round(value / tileIncrement) * tileIncrement;
        },

        handleDrop(event) {
            if (this.currentTile) {
                const tradingDesk = this.$refs.tradingDeskWrapper;
                const x = event.clientX + tradingDesk.scrollLeft - this.dragOffsetX;
                const y = event.clientY + tradingDesk.scrollTop - this.dragOffsetY;
                this.currentTile.x = this.valueStickedToGrid(x);
                this.currentTile.y = this.valueStickedToGrid(y);
                this.saveTiles();
            }
        },
        handleDragStart(tile, event) {
            const tradingDesk = this.$refs.tradingDeskWrapper;
            this.dragOffsetX = event.clientX + tradingDesk.scrollLeft - tile.x;
            this.dragOffsetY = event.clientY + tradingDesk.scrollTop - tile.y;
            this.currentTile = tile;
        },
        handleDragEnd() {
            this.currentTile = null;
        },
        loadTiles() {
            const savedTiles = localStorage.getItem('tiles');
            const savedNextId = localStorage.getItem('next_id');
            const savedTopZIndex = localStorage.getItem('top-z-index');
            this.nextId = Number(savedNextId) || 0;
            this.topZIndex = Number(savedTopZIndex) || 6;
            this.tiles = savedTiles ? JSON.parse(savedTiles) : this.defaultTiles();
        },
        saveTiles() {
            localStorage.setItem('tiles', JSON.stringify(this.tiles));
            localStorage.setItem('next_id', this.nextId.toString());
            localStorage.setItem('top-z-index', this.topZIndex.toString());
        },
    }
}
</script>

<style lang="scss">
.trading-desk-wrapper {
    max-width: 100vw;
    overflow-x: auto;
    border: 1px solid #ccc;

    .trading-desk {
        position: relative;
        width: 3000px;
        height: 600px;

        .return-tile-box {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 50px;
            width: 300px;
            cursor: pointer;
            background-color: lightgrey;
            color: black;
        }
    }
}
</style>