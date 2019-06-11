// Copyright (c) 2019 elgine
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Game from './game/game';
import RendererType from '@haski/renderer/rendererType';
import keyboardName from '@haski/input/keyboardName';
import './index.less';

let game: Game;
let tips: HTMLElement;
let score: HTMLElement;
let playBtn: HTMLButtonElement;

const slideDown = (dom: HTMLElement) => {
    if (dom.classList.contains('slide-up')) {
        dom.classList.remove('slide-up');
    }
    if (!dom.classList.contains('slide-down')) {
        dom.classList.add('slide-down');
    }
};

const slideUp = (dom: HTMLElement) => {
    if (dom.classList.contains('slide-down')) {
        dom.classList.remove('slide-down');
    }
    if (!dom.classList.contains('slide-up')) {
        dom.classList.add('slide-up');
    }
};

const onPlayBtnClick = () => {
    if (playBtn) {
        slideUp(playBtn);
        playBtn.blur();
    }
    tips && slideDown(tips);
    game.start();
};

const onSizeChanged = () => {
    if (game) {
        let width = document.documentElement.clientWidth;
        let height = document.documentElement.clientHeight;
        game.renderer.size.width = width;
        game.renderer.size.height = height;
        game.updateCenter();
    }
};

const onGameEnd = () => {
    tips && slideUp(tips);
    if (playBtn) {
        playBtn.innerText = 'Restart';
        slideDown(playBtn);
    }
};

const onGameScoreChanged = (level: number) => {
    if (score)score.innerText = level.toString();
};

const onGameControlChanged = (keys: number[]) => {
    if (tips) {
        let keyNames: string[] = [];
        keys.forEach((key) => {
            keyNames.push(`<strong>${keyboardName[key]}</strong>`);
        });
        tips.innerHTML = `<strong>Tap</strong> or press ${keyNames.join(', ')} place block`;
    }
};

const initializeDOM = () => {
    let pane: HTMLElement; let
        dom: HTMLElement;
    dom = document.createElement('canvas');
    if (dom) {
        dom.id = 'canvas';
        document.body.appendChild(dom);
    }

    pane = document.createElement('div');
    pane.id = 'pane';
    tips = document.createElement('p');
    if (tips) {
        tips.id = 'tips';
        slideUp(tips);
        pane.appendChild(tips);
    }
    playBtn = document.createElement('button');
    if (playBtn && playBtn instanceof HTMLButtonElement) {
        playBtn.id = 'play-btn';
        playBtn.innerText = 'Start';
        playBtn.addEventListener('click', onPlayBtnClick);
        pane.appendChild(playBtn);
    }
    document.body.appendChild(pane);
    score = document.createElement('div');
    if (score) {
        score.id = 'score';
        document.body.appendChild(score);
    }
    window.addEventListener('resize', onSizeChanged);
    onSizeChanged();
};

window.onload = function() {
    initializeDOM();
    let w = window.innerWidth;
    let h = window.innerHeight;
    game = new Game({
        renderer: {
            type: RendererType.WEBGL,
            el: document.getElementById('canvas') as HTMLCanvasElement,
            size: { width: w, height: h },
            fixResolution: true
        }
    });
    game.onEnd.on(onGameEnd);
    game.onLevelChange.on(onGameScoreChanged);
    game.onControlChange.on(onGameControlChanged);
    game.setParams({
        backgroundColor: '#D0CBC7'
    });
    game.run();
};