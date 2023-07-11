const fs = require('fs');

// This function will now run for every request that reaches the server
// The request object is the object nodejs generated for us with all the data of these incoming request when we visit the localhost:3000
const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    // process.exit(); to quit the event loop --> no more work to do

    if (url === '/'){
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><form action="/message" method="POST" ><input type="text" name="message"><button type="submit">Send</button></form ></body>');
        res.write('</html>');
        return res.end(); // not excute the later line
    }

    if (url === '/message' && method === 'POST') {
        const body = [];
        // on method allows us to listen to certain events
        // the first argument is event and the second argument is callback to handle this event 
        req.on('data', (chunk) => {
            // console.log(chunk);
            body.push(chunk); // const là const object nên có thể được push.
        })

        req.on('end', () => {
            // Giả sử input nhập vào là vankha
            const parsedBody = Buffer.concat(body).toString(); // message=vankha (message là lấy từ thuộc tính name của input)
            // console.log(parsedBody.split('=')); // ['message', 'vankha']
            const message = parsedBody.split('=')[1]; // get vankha
            fs.writeFileSync('message.txt', message);
            res.statusCode = 302; // chuyển hướng URL
            res.setHeader('Location', '/'); // redirect to localhost:3000/
            return res.end(); // not excute the later line
        })
    }

    // allow to set a new header. It will attach a header to our response where we pass some meta information --> saying that the type of the content which will also be part of the response is html.
    res.setHeader('Content-Type', 'text/html');

    // allow to write some data to the response
    res.write('<html><head><title>Vankha </title></head></html>'); // In response of dev tool (F12), we see this string passed
    res.end(); // end writing. if we continue to write, we will get error
}

// module.exports = requestHandler; // export one thing
// export some things
module.exports = {
    handler : requestHandler,
    someText : 'vankha'
}