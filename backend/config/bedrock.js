const { BedrockChat } = require("@langchain/community/chat_models/bedrock");
require("dotenv").config();

const llm = new BedrockChat({
  model: process.env.BEDROCK_MODEL_NAME,
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = llm;
