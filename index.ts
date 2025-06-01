import WebServer from "@blockless/sdk-ts/dist/lib/web";

const server = new WebServer();

server.statics("public", "/");

server.get("/ping", (_, res) => {
    const result = { ok: true, ts: Date.now() };
    res.send(JSON.stringify(result));
});

server.post("/reason", async (req, res) => {
    const { message } = req.body;
    if (!message) return res.send("no message");
  
    try {
      const url = `https://deepseek-proxy-bapo.onrender.com/api/deepseek?message=${encodeURIComponent(message)}`;
  
      const response = await fetch(url, { method: "POST" });
      if (!response.ok) {
        throw new Error("REASONING");
      }
  
      const data = await response.json();
  
      const result = {data};
  
      res.send(JSON.stringify(data));
    } catch (err) {
      res.send(`failed: ${JSON.stringify(err)}`);
    }
  
  
    
  });

server.start();