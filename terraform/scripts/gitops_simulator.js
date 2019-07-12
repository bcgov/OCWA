
const express        = require('express')
const bodyParser     = require("body-parser");
const app            = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 2000

function getScenario (branch) {
    let split = branch.split('-');
    return {
        id: split[0],
        delay: Number(split[1])
    }
}

function delayedResponse (response, payload, status, delay) {
    console.log("Waiting ", delay, " seconds to return ", status);
    setTimeout(() => {
        console.log("... responded with " + JSON.stringify(payload));
        response.status(status);
        response.send(payload);
    }, delay * 1000);
}


app.post('/v1/request',function(request,response){
    const scenario = getScenario(request.body.branch);

    let resbody = scenario.id == 'happy' ? {status:'ok', location:'https://www.google.com', title:'Merge Request'} : {status:'error',message:'Error processing request'};

    // 200: JSON status="ok",location=mr.web_url,title=mr.title
    // 400: JSON status="error", message="Request rejected.  Branch already exists."
    // 400: JSON status="error", message="Project not found"
    // 400: JSON status="error", message="No changes"
    // 400: The 'direction' must be 'import' or 'export'

    if (scenario.id == "s2") {
        resbody = {status:'error', message:'SIM Request rejected.  Branch already exists.'};
    } else if (scenario.id == "s3") {
        resbody = {status:'error', message:'SIM No changes'};
    } else if (scenario.id == "s4") {
        resbody = {status:'error', message:'SIM Project repository not found'};
    } else if (scenario.id == "s5") {
        resbody = "SIM The 'direction' must be 'import' or 'export'";
    }
    delayedResponse (response, resbody, resbody.status == 'ok' ? 200:400, scenario.delay);
});

app.put('/v1/request/delete',function(request,response){
    const scenario = getScenario(request.body.branch);

    const resbody = scenario.id != 'happy' ? {status:'ok'} : {status:'error',message:'SIM Error processing request'};

    delayedResponse (response, resbody, resbody.status == 'ok' ? 200:400, scenario.delay);
});

app.put('/v1/request/close',function(request,response){
    const scenario = getScenario(request.body.branch);

    const resbody = scenario.id != 'happy' ? {status:'ok'} : {status:'error',message:'SIM Error processing request'};

    delayedResponse (response, resbody, resbody.status == 'ok' ? 200:400, scenario.delay);
});

app.put('/v1/request/merge',function(request,response){
    const scenario = getScenario(request.body.branch);

    const resbody = scenario.id == 'happy' ? {status:'ok'} : {status:'error',message:'SIM Error processing request'};

    delayedResponse (response, resbody, resbody.status == 'ok' ? 200:400, scenario.delay);
});

app.listen(port, () => console.log(`Gitops Simulator listening on port ${port}!`))
