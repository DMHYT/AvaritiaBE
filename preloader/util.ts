namespace FileUtil {

    export function isExist(path: string): boolean {
        return new java.io.File(path).exists();
    }

    export function readImage(path: string): android.graphics.Bitmap {
        const options = new android.graphics.BitmapFactory.Options();
        options.inScaled = false;
        return android.graphics.BitmapFactory.decodeFile(path, options);
    }

    export function writeImage(path: string, bitmap: android.graphics.Bitmap): void {
        bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, new java.io.FileOutputStream(path));
    }

    function readFileText(path: string): string {
        const reader = new java.io.BufferedReader(new java.io.FileReader(new java.io.File(path)));
        let text = "";
        while(true){
            const readLine = reader.readLine();
            const line = readLine;
            if(readLine != null) text += `${line}\n`;
            else {
                reader.close();
                return text;
            }
        }
    }

    export function readJSON(path: string): any {
        const textFile = readFileText(path);
        try {
            return JSON.parse(textFile) || {};
        } catch(e){ return {} }
    }

    export function getListOfFiles(path: string, extension?: string): java.io.File[] {
        const dir = new java.io.File(path);
        const list = [];
        const files = dir.listFiles();
        if(!files) return list;
        for(let i=0; i<files.length; i++){
            const file = files[i];
            if(!file.isDirectory() && (!extension || file.getName().endsWith(extension))){
                list.push(file);
            }
        }
        return list;
    }

}