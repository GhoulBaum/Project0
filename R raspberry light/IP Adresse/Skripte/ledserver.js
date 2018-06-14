const gpio = require('rpi-gpio');
const express = require('express');
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/model",express.static('unitymodel'));

var os = require('os');
var ifaces = os.networkInterfaces();
//gpio.setMode(gpio.MODE_BCM);
 

gpio.setup(11, gpio.OUT);
gpio.setup(13, gpio.OUT);
gpio.setup(15, gpio.OUT);
gpio.setup(12, gpio.OUT);

gpio.setup(16, gpio.DIR_IN, gpio.EDGE_BOTH, onerr);

/*gpio.setup(22, gpio.OUT);

gpio.setup(18, gpio.OUT);
gpio.setup(17, gpio.OUT);
gpio.setup(27, gpio.OUT);

gpio.setup(23, gpio.DIR_IN, gpio.EDGE_BOTH, onerr);
*/
 
var light = 0;
var lastLight = 0;

var pin23 = false;
var lpin23 = false;

function writeLed(val) {
	
	gpio.write(11, val);
	gpio.write(12, val);
	gpio.write(13, val);
	gpio.write(15, val);
	
}

function getLicht() {
	return light;
}
 
function onerr(err) {
	
	console.log("err: "+ err);
	
    gpio.read(4, function(err, value) {
        console.log('The value is ' + value);
        pin23 = value;
        lpin23 = value;
    });
    
    writeLed(light);           
}

gpio.on('change', function(chan, val) {
	//console.log('Channel ' + chan + ' value is now ' + val);
	if ( chan = 4 ) {
		pin23 = val;
		
		if ( pin23 != lpin23 )
		{
			if (pin23)
			{
				console.log("up");
				if ( light )
				  light = 0;
				 else
				  light = 1;
			}
			else 
			{
				//console.log("down");				
			}
            writeLed(light);
			lpin23 = pin23;
		}
	}
	
} );
/*
gpio.setup(23, gpio.DIR_IN, gpio.EDGE_FALLING);
*/


function pause() {
    setTimeout(closePins, 5000);
}
 
function closePins() {
    gpio.destroy(function() {
        console.log('All pins unexported');
    });
}

//pause();

process.on('SIGINT', function() {
    console.log('Detected ^C...exiting');
    
    gpio.destroy(function() {
        console.log('All pins unexported');
        process.exit(1);
    });
});



app.get('/', function (req, res) {
  res.send('Hier ist der Lichtserver!!!')
})

app.get('/licht', function (req, res) {
  console.log("get licht " +  getLicht() );
  res.send('licht ist ' + getLicht() );
})

app.post('/licht', function (req, res) {
  
  console.log(req.body);
  
  var data = req.body;
  
  if ( data.licht == 1 ) {
	  console.log("einschalten");
	  writeLed(1);
	  light = 1;
  } else {
	  console.log("ausschaten");
	  writeLed(0);
	  light = 0;
  }
  
  res.end("OK");
})

app.listen(3000, function () {

  //console.log("ifaces: " + JSON.stringify(ifaces) );
	
  Object.keys(ifaces).forEach(function (ifname) {
	  
	  console.log("iface: " +  ifname  + " "  + ifaces[ifname][0].address );
  });
  
  console.log('Licht Server auf port 3000')
})


