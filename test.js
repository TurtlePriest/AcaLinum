const chai = require("chai")
const chaiHttp = require("chai-http")
chai.use(chaiHttp);
const expect = chai.expect;
const forever = require("forever-monitor")


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

describe('Post system tests', () => {


})

describe('Chat system tests', () => {

    
})

describe('Database tests', () => {

    
})
