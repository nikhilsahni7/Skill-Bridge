import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { initializeSocketIO } from "@/lib/socket";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  initializeSocketIO(server);

  server.listen(3000, (err?: Error) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});