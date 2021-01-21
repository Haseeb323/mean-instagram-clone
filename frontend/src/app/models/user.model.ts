export class User {
  constructor(
    public _id: string,
    public email: string,
    public name: string,
    public username: string,
    public image_url: string,
    public date: number
  ) {}
}
