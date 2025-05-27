export class Photo {
    constructor(
        // Id: number,
       public UserId: number,
       public PhotoName: string,
       public AlbumId: number,
       public PhotoPath: string,
       public photoSize: number,
       // UploadedAt?:Date
       public tagId: string,
        // photoSize?: number

    ) { }

}