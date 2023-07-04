const redis = require('redis');
const client = redis.createClient();

(async () => {
    await client.connect();
})();

client.on('ready', function() {
    console.log('Connected!'); // Connected!
});


(async () => {
    await client.set('theLife', 'address');
    const value = await client.get('theLife');
    console.log("the value", value);
})();


client.on('error', (err) => {
    console.error('!', err); // Connected!
});

client.on('connect', function() {
  console.log('Connected!'); // Connected!
});

client.set('framework', 'ReactJS', function(err, reply) {
    console.log(reply); // OK
});

client.get('framework', function(err, reply) {
    console.log(reply); // ReactJS
});