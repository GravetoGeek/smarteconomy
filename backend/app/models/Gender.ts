export class Gender{
  private _gender:string
  constructor(gender:string){
    this._gender
  }

  get gender():string{
    return this._gender
  }

  set gender(gender:string){
    this._gender = gender
  }
}