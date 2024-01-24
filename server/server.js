require("dotenv").config();
const express = require("express");
const socketIo = require("socket.io");
const Document = require("./model/Document");
require("./db/conn");
const cors = require("cors");
const router = require("./router/LogInSignUpRouter");
const app = express();

const io = require("socket.io")(4001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const defaultValue = "";

io.on("connection", (socket) => {
  socket.on("get-document", async ({ documentId }) => {
    const document = await findOrCreateDocument(documentId);

    if (!document) {
      console.error("Document not found or created");
      return;
    }

    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async ({ content }) => {
      try {
        await Document.findByIdAndUpdate(documentId, { data: content });
      } catch (error) {
        console.error("Error saving document:", error.message);
      }
    });
  });
});

async function findOrCreateDocument(id) {
  if (id == null) return;

  const document = await Document.findById(id);
  if (document) return document;

  return await Document.create({ _id: id, data: defaultValue });
}

app.use(cors());
app.use(express.json());
app.use(router);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
