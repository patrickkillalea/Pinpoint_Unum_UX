var sql = require('mssql');
var http = require('http');
var dispatcher = require('httpdispatcher');

var config = {
    user: 'Pat',
    password: 'pat12345',
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance 
    //database: 'PinPoint', 
    options: {
        //instance:  "\SQL2008", 
        //trustconnection: true,
        encrypt: false, // Use this if you're on Windows Azure 
        //tdsVersion: '7_1'
    }
}

//Lets define a port we want to listen to
const PORT = 8080;

//We need a function which handles requests and send response
function handleRequest(request, response) {
    try {
        //log the request on console
        console.log(request.url);
        //Disptach
        dispatcher.dispatch(request, response);
    } catch (err) {
        console.log(err);
    }
}

dispatcher.onGet("/getStuff", function(req, res) { 
   res.writeHead(200, { 'Content-Type': 'text/plain',
   "Access-Control-Allow-Origin":"*" });
   console.log("GET DATA");
   sql.connect(config).then(function() {
        // Query 

        var request = new sql.Request();
        request.query("SELECT top 10 Account_Name AS 'Account Name',Colonial_Employer_Number AS 'Harmony Account Number',Account_ID AS 'Account Id' FROM HarmonyAccounts.dbo.Harmony_Account").then(function(recordset) {
            var jsonResults = JSON.stringify({ result: recordset });
            res.end(jsonResults);
        }).catch(function(err) {
            console.log(err);
        });

        // Stored Procedure 

        /*var request = new sql.Request();
        request.input('input_parameter', sql.Int, value);
        request.output('output_parameter', sql.VarChar(50));
        request.execute('procedure_name').then(function(recordsets) {
                    console.dir(recordsets);
        }).catch(function(err) {
                    console.log(err);
                });*/

}).catch(function(err) {
    console.log("Could not connect", err);
});
});

//http://localhost:8080/callProcedure?storedProc=

dispatcher.onGet("/callProcedure", function(req, res) {

    console.log("CALL PROC"); 
    res.writeHead(200, { 'Content-Type': 'text/plain',
    "Access-Control-Allow-Origin":"*" });
    sql.connect(config).then(function() {
        // Query 
        //Stored Procedure 
        var index = 0;
        var request = new sql.Request();
        for (var i in req.params) {
            if (index != 0) {
                console.log(i);
                request.input(i, sql.VarChar(100), req.params[i]);
            }
            index++;
        };
        //request.input('input_parameter', sql.Int, value); 
        console.log(req.params.storedProc);
        request.execute(req.params.storedProc).then(function(recordsets) {
            // request.execute('V13_L_Harmony.dbo.usp_UDT_GetHarmonyAccounts').then(function(recordsets) {
                var jsonResults = JSON.stringify({ result: recordsets });
                res.end(jsonResults);
            }).catch(function(err) {
                console.log(err);
            });

        }).catch(function(err) {
            console.log("Could not connect", err);
        });
    });

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, '0.0.0.0', function() {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
