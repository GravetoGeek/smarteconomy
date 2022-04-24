const { get } = require("express/lib/response")

class userModel{
  #name
  #lastname
  #username
  #email
  #phone
  #password
  constructor(username,email,password,phone){
    this.#username = username
    this.#email = email
    this.#password = password
    this.#phone = phone
  }

  getName(){
    return this.#name
  }
  setName(){}
  getLastname(){}
  setLastname(){}
  getUserName(){
    return this.#username
  }
  setUserName(){}
  getEmail(){
    return this.#email
  }
  setEmail(){}
  getPassword(){
    return this.#password
  }
  setPassword(){}
  getPhone(){
    return this.#phone
  }
  setPhone(){}
  get(){
    return {
      username: this.#username,
      email: this.#email,
      password: this.#password,
      phone: this.#phone
    }
  }
}



module.exports ={
  userModel
}