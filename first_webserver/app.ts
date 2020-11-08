// @ts-ignore
import defaultServer from './dummy_respond_server.ts';

for await (const request of defaultServer) {
  if (request.method === "POST" && request.url === "/store-message" && request.contentLength) {
    const buffer = new Uint8Array(request.contentLength);
    let totalBytesRead = 0;

    while(true){
      const bytesRead = await request.body.read(buffer);
      if (bytesRead === null) {
        break;
      }
      totalBytesRead += bytesRead;
      if (totalBytesRead >= request.contentLength ) {
        break;
      }
    }

    await Deno.writeFile('form-input.txt', buffer);

    const headers = new Headers();
    headers.set('Location', '/confirm');
    request.respond({
      headers: headers,
      status: 303
    });

  } else {
    
    const headers = new Headers();
    headers.set('Content-Type', 'text/html');

    const body = `
    <h2>Welcome to Deno!</h2>
    <form action="/store-message" method="POST">
      <input type="text" name="message"/>
      <input type="submit" value="Submit" />
    </form>
    `;

    request.respond({
      body: body,
      headers: headers
    });

  };
}