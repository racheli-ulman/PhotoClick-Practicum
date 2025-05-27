export class Album {
    constructor(
        public id: number,
        public userId: number|null,
        public albumName: string,
        public description:string,
        public photosCount: number

        // public images: string[]; // מערך של כתובות URL לתמונות
    ){}

}