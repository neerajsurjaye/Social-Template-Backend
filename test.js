let findAllClusters = require('./scripts/findAllClusters')
let { spawn } = require('child_process');
let makeReccomendation = require('./scripts/makeAllReccomendations');

console.log("start");
// findAllClusters.run();
makeReccomendation.run();
// let savePost = spawn('python', ['ml/find_cluster.py', '6259412d46c314345ae8acd9']);

// savePost.stdout.on('data', (data) => {
//     console.log(data.toString());
// })
// savePost.stderr.on('data', (data) => {
//     console.log("err", data.toString());
// })
