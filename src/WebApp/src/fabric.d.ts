import 'fabric';

declare module 'fabric' {
    namespace fabric {
        interface Canvas {
            isDragging: boolean;
            lastPosX: number;
            lastPosY: number;
        }
    }
}
