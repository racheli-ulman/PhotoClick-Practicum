export class User{
    constructor(
       public firstName: string,
       public lastName: string,
       public email: string,
       public password: string,
       public id?: number|undefined,
    ){}
}
export class AddUser{
    constructor(
        firstName: string,
        lastName: string,
        password: string,
        email: string,
        roleName: string,
        createdAt: Date,
    ){}
}

export class MonthlyRegistrationsDto {
    constructor(
        public year: number,
        public month: number,
        public count: number // הגדרת המאפיין count
    ) {}
}