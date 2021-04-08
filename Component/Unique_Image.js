import React from 'react';

export const Render = () =>{
    var randomNumber = Math.floor(Math.random() * 100) + 1;
    var image;
    switch(randomNumber){
        case 11:case 21:case 31:case 41:case 51:case 61:case 71:case 81:case 91:
        case 1 : return( image = require('../assets/basket.png') );
        case 12:case 22:case 32:case 42:case 52:case 62:case 72:case 82:case 92:
        case 2 :  return( image = require('../assets/basket2.png') );
        case 13:case 23:case 33:case 43:case 53:case 63:case 73:case 83:case 93:
        case 3 :  return( image = require('../assets/basket3.png') );
        case 14:case 24:case 34:case 44:case 54:case 64:case 74:case 84:case 94:
        case 4 :  return( image = require('../assets/basket4.png') );
        case 15:case 25:case 35:case 45:case 55:case 65:case 75:case 85:case 95:
        case 5 :  return( image = require('../assets/basket5.png') );
        case 16:case 26:case 36:case 46:case 56:case 66:case 76:case 86:case 96:
        case 6 :  return( image = require('../assets/basket6.png') );
        case 17: case 27: case 37: case 47: case 57: case 67: case 77: case 87:
        case 97:case 7 :  return( image = require('../assets/basket7.png') );
        case 18:case 28:case 38:case 48:case 58:case 68:case 78:case 88:case 98:
        case 8 :  return( image = require('../assets/basket8.png') );
        case 19:case 29:case 39:case 49:case 59:case 69:case 79:case 89:case 99:
        case 9 :  return( image = require('../assets/basket9.png') );
        case 20:case 30:case 40:case 50:case 60:case 70:case 80:case 90:case 100:
        case 10 :  return( image = require('../assets/basket10.png') );
    }

    return image;
}