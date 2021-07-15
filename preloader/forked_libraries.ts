namespace TextureWorker {

    export interface ITextureSource {
        path: string;
        name: string;
    }

    export interface IOverlay extends ITextureSource {
        color?: [r: number, g: number, b: number];
    }

    export interface IBitmap {
        width: number;
        height: number;
        config?: android.graphics.Bitmap.Config;
    }

    function changeBitmapColor(bitmap: android.graphics.Bitmap, color: [number, number, number]): android.graphics.Bitmap {
        const newbmp = android.graphics.Bitmap.createBitmap(bitmap.getWidth(), bitmap.getHeight(), android.graphics.Bitmap.Config.ARGB_8888);
        const canvas = new android.graphics.Canvas(newbmp);
        const paint = new android.graphics.Paint();
        paint.setColorFilter(new android.graphics.PorterDuffColorFilter(android.graphics.Color.rgb(color[0], color[1], color[2]), android.graphics.PorterDuff.Mode.MULTIPLY));
        canvas.drawBitmap(bitmap, 0, 0, paint);
        return newbmp;
    }

    function fromModDir(textureSource: ITextureSource | IOverlay): ITextureSource | IOverlay {
        if(textureSource.path.startsWith(__dir__)) return textureSource;
        return { name: textureSource.name, path: `${__dir__}/${textureSource.path}`, color: (textureSource as IOverlay).color };
    }

    function createTextureWithOverlays(args: {bitmap: IBitmap, overlays: IOverlay[], result: ITextureSource}, fallback?: boolean): android.graphics.Bitmap | void {
        if(FileTools.isExists(`${args.result.path}${args.result.name}.png`)) return;
        const bmp = android.graphics.Bitmap.createBitmap(args.bitmap.width, args.bitmap.height, args.bitmap.config ?? android.graphics.Bitmap.Config.ARGB_8888);
        const cvs = new android.graphics.Canvas(bmp);
        for(let i in args.overlays){
            const over = args.overlays[i];
            const tex = FileTools.ReadImage(`${over.path}${over.name}.png`);
            cvs.drawBitmap(over.color ? changeBitmapColor(tex, over.color) : tex, 0, 0, null);
        }
        FileTools.WriteImage(`${args.result.path}${args.result.name}.png`, bmp);
        if(fallback) return bmp;
    }

    export function createTextureWithOverlaysModDir(args: {bitmap: IBitmap, overlays: IOverlay[], result: ITextureSource}, fallback?: boolean): android.graphics.Bitmap | void {
        args.result = fromModDir(args.result);
        for(let i in args.overlays) args.overlays[i] = fromModDir(args.overlays[i]);
        return createTextureWithOverlays(args, fallback);
    }

}

namespace IAHelper {

    export function convertTexture(srcPath: string, srcName: string, resultPath: string, resultName: string): void {
        if(FileTools.isExists(`${__dir__}/${resultPath}${resultName}_0.png`)) return;
        const anim = FileTools.ReadImage(`${__dir__}/${srcPath}${srcName}.png`);
        if(anim.getHeight() % anim.getWidth() !== 0) throw new java.lang.IllegalStateException();
        for(let i=0; i < anim.getHeight() / anim.getWidth(); i++){
            const bmp = android.graphics.Bitmap.createBitmap(anim.getWidth(), anim.getWidth(), android.graphics.Bitmap.Config.ARGB_8888);
            for(let x=0; x<anim.getWidth(); x++)
                for(let y=0; y<anim.getWidth(); y++)
                    bmp.setPixel(x, y, anim.getPixel(x, y + anim.getWidth() * i));
            FileTools.WriteImage(`${__dir__}/${resultPath}${resultName}_${i}.png`, bmp);
        }
    }

}