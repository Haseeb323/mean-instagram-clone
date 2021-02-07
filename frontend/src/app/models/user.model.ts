export class User {
  constructor(
    public _id: string = '',
    public name: string = '',
    public username: string = '',
    public followers: [] = [],
    public followings: [] = [],
    public email: string = '',
    public image_url: string = '',
    public date: any,
    public isFollowing: boolean
  ) {}
}
