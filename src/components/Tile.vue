<template>
    <div class="tile" :style="getTileStyle()" draggable="true" @dragstart="handleDragStart($event)" @dragover.prevent
        @dragend="handleDragEnd()">
        <header class="tile-header">
            <h4 class="tile-title">Tile {{ data.id }}</h4>
            <button class="tile-button" @click="$emit('delete')">delete</button>
        </header>
        <div class="tile-resize-handle" @mousedown="initResize($event)"></div>
    </div>
</template>

<script>
import { minTileWidth, minTileHeight, tileIncrement } from '@/utils/constants';

export default {
    data() {
        return {
            resizeXStartPos: 0,
            resizeYStartPos: 0,
            startTileHeight: 0,
            startTileWidth: 0,
            isResizing: false

        };
    },
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    methods: {
        getTileStyle() {
            return {
                left: `${this.data.x}px`,
                top: `${this.data.y}px`,
                width: `${this.data.width}px`,
                height: `${this.data.height}px`,
                zIndex: this.data.zIndex
            };
        },
        valueStickedToGrid(value) {
            return Math.round(value / tileIncrement) * tileIncrement;
        },
        handleDragStart(event) {
            if (this.isResizing) {
                event.preventDefault();
                return;
            };
            this.$emit('drag-start', event);
        },
        handleDragEnd() {
            this.$emit('drag-end');
        },
        initResize(event) {
            this.isResizing = true;
            this.resizeXStartPos = event.clientX;
            this.resizeYStartPos = event.clientY;
            this.startTileHeight = this.data.height;
            this.startTileWidth = this.data.width;

            window.addEventListener('mousemove', this.handleResize);
            window.addEventListener('mouseup', this.stopResize);
        },
        handleResize(event) {
            const deltaWidth = event.clientX - this.resizeXStartPos;
            const deltaHeight = event.clientY - this.resizeYStartPos;
            const newWidth = Math.max(minTileWidth, this.startTileWidth + deltaWidth);
            const newHeight = Math.max(minTileHeight, this.startTileHeight + deltaHeight);
            this.data.width = this.valueStickedToGrid(newWidth);
            this.data.height = this.valueStickedToGrid(newHeight)

        },
        stopResize() {
            window.removeEventListener('mousemove', this.handleResize);
            window.removeEventListener('mouseup', this.stopResize);
            this.isResizing = false;
            this.$emit('stop-resize');
        },
    }
}
</script>

<style lang="scss">
.tile {
    position: absolute;
    background-color: #f3f3f3;
    padding: 0;

    .tile-header {
        display: flex;
        padding: 4px;
        justify-content: space-between;
        background-color: lightblue;

        .tile-title {
            margin: 0;
            padding: 4px;
            color: white;
        }

        .tile-button {
            background-color: #294d87;
            color: white;
            outline: none;
            border:none;
            cursor:pointer;
            border-radius: 4px;
        }
    }

    .tile-resize-handle {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 15px;
        height: 15px;
        background-color: #294d87;
        cursor: se-resize;
    }
}
</style>