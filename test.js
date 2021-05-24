const chai = require("chai")
const chaiHttp = require("chai-http")
chai.use(chaiHttp);
const expect = chai.expect;
const forever = require("forever-monitor")
var io = require("socket.io-client")
var mysql = require("mysql")




var socketurl = "http://localhost:3000"

var options = {
    transports: ["websocket"],
    "force new connection": true
}

var room = "test"



const child = new (forever.Monitor)('app.js', { max: 1, silent: true });

child.on('start', () => console.log('Starting app.js up'));

child.on('error', () => console.log('Error from server.js'));

child.on('exit', () => console.log('Shutting server.js down again'));

before(done => { child.start(); setTimeout(done, 300) })

after(() => { if (child.running) child.stop() });



describe('Does the routes respond with html?', () => {

    it('GET /', () =>
        chai.request('http://localhost:3000')
            .get('/')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            })
            .catch(err => { throw err; })
    );

    it('GET /post', () =>
        chai.request('http://localhost:3000')
            .get('/post')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            })
            .catch(err => { throw err; })
    );

    it('GET /chat', () =>
        chai.request('http://localhost:3000')
            .get('/chat')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            })
            .catch(err => { throw err; })
    );
})

describe('Chat system tests', () => {
    var client1, client2, client3

    it('User should be able to send a message', function (done) {

        client1 = io.connect(socketurl, options);

        client1.on('chat message', (data) => {
            expect(data.data.value).to.equal('test');

            client1.disconnect();
            client2.disconnect();
            done();
        });

        client1.on('connect', function () {
            client1.emit('join room', { username: "Lukas", roomName: room });

            client2 = io.connect(socketurl, options);

            client2.on('connect', function () {

                client2.emit('join room', { username: "Mads", roomName: room });
                client2.emit('chat message', { value: "test", user: "Mads", });
            });

        });
    });

    it('Messages should only be displayed to users in the same room', function (done) {
        client2CallCount = 0;
        client3CallCount = 0;

        client1 = io.connect(socketurl, options);

        client1.on('connect', function () {
            client1.emit('join room', { username: "Lukas", roomName: room });

            client2 = io.connect(socketurl, options);
            client2.emit('join room', { username: "Mads", roomName: room });

            client2.on('connect', function () {

                client3 = io.connect(socketurl, options);
                client3.emit('join room', { username: "Jacob", roomName: "other room" });

                client3.on('connect', function () {
                    client1.emit('chat message', { value: "test", user: "Lukas", });
                });

                client3.on('chat message', function () {
                    client3CallCount++;
                });
            });

            client2.on('chat message', function () {
                client2CallCount++;
            });
        });

        setTimeout(function () {
            expect(client2CallCount).to.equal(1);
            expect(client3CallCount).to.equal(0);
            client1.disconnect();
            client2.disconnect();
            client3.disconnect();
            done();
        }, 25);
    });
})

describe('Database tests', () => {
    it('Access to database with correct credentials', function (done) {
        var c1
        var con = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'admin',
            database: 'acalinum'
        })
        c1 = io.connect(socketurl, options);
        c1.on('connect', function () {
            c1.emit('post', {
                value: "test",
                user: "Lukas",
                id: 999
              
              })
              c1.disconnect()

        })
        con.connect(done)
        con.end()

    })

    it('Posts are saved to the database', function (done) {

        var con = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'admin',
            database: 'acalinum'
        })
        con.connect()

        con.query("SELECT * FROM posts WHERE id=999", function (err, result, fields) {
            if (err) throw err;
            var json = JSON.parse(JSON.stringify(result))
            expect(json[0].message).to.equal('test')
          })

          
          con.query("DELETE FROM posts WHERE id=999", function (err, result, fields) {
            if (err) throw err;
          })

        con.end()
        done()
    })

})
