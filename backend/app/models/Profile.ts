
export class Profile{
  private _name:string;
  private _lastname:string;
  private _birthday:Date;
  private _monthly_income:number;
  private _profession:string;
  private _gender: string;
  private _email:string;

  constructor(name:string, lastname:string,birthday:Date,monthly_income:number,profession:string,gender:string,email:string){
    this._name = name
    this._lastname = lastname
    this._birthday = birthday
    this._monthly_income = monthly_income
    this._profession = profession
    this._gender = gender
    this._email = email
  }

  
  public get name() : string {
    return this._name
  }

  
  public get lastname() : string {
    return this._lastname
  }
  
  public get birthday(): Date{
    return this._birthday
  }
  
  public get monthly_income(): number{
    return this._monthly_income
  }

  public get profession(): string{
    return this._profession
  }

  public get gender():string{
    return this._gender
  }

  public get email():string{
    return this._email
  }

  public set name(name:string){
    this._name = name
  }

  public set lastname(lastname:string){
    this._lastname = lastname
  }

  public set birthday(birthday:Date){
    this._birthday = birthday
  }

  public set monthly_income(monthly_income:number){
    this._monthly_income = monthly_income
  }

  public set profession(profession:string){
    this._profession = profession
  }

  public set gender(gender:string){
    this._gender = gender
  }

  public set email(email:string){
    this._email = email
  }





}