var express=require('express');
var http=require('http');
var path=require('path');
var fs = require('fs');
var urlencoder=require('url');
var childprocess=require('child_process');
var bodyParser=require('body-parser');
var app=express();

app.set('port',process.env.POST || 2131);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());



app.get('/', function (req, res) {
    fs.readFile('index.html', function (err, data) {
        if (err) throw err;
        else
        {
        res.sendFile(path.join(__dirname+'/index.html'));
        }
    });
    
  })

  app.post('/rungcc', function (req, res) {
    console.log(req.body);

    
    var dir="./submit/"+req.body.tag+".c";
    var inputpath="./submit/"+req.body.tag+"_input.txt"
    fs.writeFile(dir,req.body.code, function(err) {
      if(err) {
          return console.log(err);
      }
      
  }); 

  fs.writeFile(inputpath,req.body.input,function(err,stdout ){

    if(err){
      res.send(err);
    }

  });


  var cmd="gcc -o "+req.body.tag+" "+dir+" && ./"+req.body.tag+"< \"./submit/"+req.body.tag+"_input.txt\" >> ./submit/"+req.body.tag+".txt";
  childprocess.exec(cmd, (err, stdout, stderr) => {  
  if (err) {  
  console.error(err);
  res.send(err);  
  return;  
  }  
  console.log(stdout); 
  
  

  var outfile="./submit/"+req.body.tag+".txt";
   
  fs.readFile(outfile,"utf8" ,function(err, contents){
    console.log(contents);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write(contents);
    res.end();

    fs.unlinkSync(dir);
fs.unlinkSync(inputpath);
fs.unlinkSync(outfile);
fs.unlinkSync(req.body.tag);
    });
  //res.send(stdout);
  }); 

  });

//deleting used files




http.createServer(app).listen(app.get('port'),function(){
    console.log('Express server listing on port '+app.get('port'));
});
