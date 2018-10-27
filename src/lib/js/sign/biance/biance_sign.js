var crypto = require('crypto');
var config = require('./bianceconfig.js');
 
 
 var message = 'symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1499827319559';
 var secretkey = 'NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j';
 var mm = config.secretkey;
 const signature = crypto
      .createHmac('sha256', secretkey)
      .update(message)
      .digest('hex')
	  
console.log(signature)