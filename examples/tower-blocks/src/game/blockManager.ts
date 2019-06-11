// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Signal from '@core/signal';
import Block, { BlockState } from './block';
import IsoCube from './isoCube';

export default class BlockManager {
    private static _blockIdCounter: number = 0;

    public targetBlock?: Block;
    public topBlock!: Block;
    public readonly onBlockCreated: Signal = new Signal();
    public readonly onBlockDestroyed: Signal = new Signal();

    private _blocks: Block[] = [];


    private _baseBlock!: Block;
    private _placedBlocks: Set<Block> = new Set<Block>();
    private _discardBlocks: Set<Block> = new Set<Block>();


    initialize(data: {color: ColorRawData; pos: Vec3d; size: {width: number; height: number; depth: number}}) {
        if (this._baseBlock) return;
        this.topBlock = this._baseBlock = this.createBlock(data);
        this._baseBlock.state = BlockState.PLACED;
    }

    newTargetBlock(data: {color: ColorRawData; pos: Vec3d; size: {width: number; height: number; depth: number}}) {
        this.targetBlock = this.createBlock(data);
        return this.targetBlock;
    }

    newDiscardBlock(data: {color: ColorRawData; pos: Vec3d; size: {width: number; height: number; depth: number}}) {
        let b = this.createBlock(data);
        b.state = BlockState.DISCARD;
        this._discardBlocks.add(b);
        return b;
    }

    placeTargetBlock() {
        if (this.targetBlock) {
            this.targetBlock.state = BlockState.PLACED;
            this._placedBlocks.add(this.targetBlock);
            this.topBlock = this.targetBlock;
        }
        this.targetBlock = undefined;
        return this._placedBlocks.size;
    }

    discardTargetBlock() {
        if (this.targetBlock) {
            this._discardBlocks.add(this.targetBlock);
            this.targetBlock.state = BlockState.DISCARD;
        }
        this.targetBlock = undefined;
    }

    destroyDiscardBlock(block: Block) {
        this._discardBlocks.delete(block);
        this.destroyBlock(block);
    }

    destroyPlacedBlock(block: Block) {
        this._placedBlocks.delete(block);
        this.destroyBlock(block);
    }

    reset() {
        this.topBlock = this._baseBlock;
        this.targetBlock = undefined;
    }


    createBlock(data: {color: ColorRawData; pos: Vec3d; size: {width: number; height: number; depth: number}}) {
        let block: Block = {
            id: BlockManager._blockIdCounter++,
            opacity: 1,
            state: BlockState.FREE,
            rotation: [0, 0, 0, 0],
            scale: 1,
            rotationSpeed: 0,
            pos: [0, 0, 0],
            view: new IsoCube(), ...data
        };
        this._blocks.push(block);
        this.onBlockCreated.emit(block);
        return block;
    }

    destroyBlock(b: Block) {
        let index = this._blocks.indexOf(b);
        if (index > -1) {
            this._blocks.splice(index, 1);
            this.onBlockDestroyed.emit(b);
        }
    }

    get blocks() {
        return this._blocks;
    }

    get placedBlocks() {
        return this._placedBlocks;
    }

    get discardBlocks() {
        return this._discardBlocks;
    }
}