// src/lib/userNameUtils.js

export const concatUserName = (firstName, lastName) => {
    return `${firstName}-${lastName}`;
  }
  
  export const splitUserName = (concatenatedName) => {
    const names = concatenatedName.split('-');
    return { firstName: names[0], lastName: names[1] };
  }
  