import observable from '@core/observable';
import Size from './size';

export default class Size3d extends Size {

    @observable({ onDirty: 'onDirty' })
    depth: number = 0;
}