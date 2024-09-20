import app from "./app";

app
  .listen(3000, () => {
    console.log("Server is running on port 3000");
  })
  .on("error", (err) => {
    console.error(err);
    console.log("Failed to start server");
  });
