var audioAesKeyBuffer = new Buffer(audioAesKey, 'binary');
var decipher = crypto.createDecipheriv('aes-128-cbc', audioAesKeyBuffer, audioAesIv);  decipher.setAutoPadding(false);
