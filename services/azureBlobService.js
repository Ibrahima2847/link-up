const { BlobServiceClient } = require("@azure/storage-blob");
const { v4: uuidv4 } = require("uuid");

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

if (!connectionString || !containerName) {
  throw new Error("Les variables d'environnement pour Azure Blob Storage ne sont pas configurées !");
}

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

const uploadFileToAzure = async (file) => {
  try {
    const blobName = `${uuidv4()}-${file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    });

    return blockBlobClient.url; // Retourne l'URL du fichier sur Azure
  } catch (error) {
    throw new Error(`Erreur lors du téléchargement sur Azure : ${error.message}`);
  }
};

module.exports = { uploadFileToAzure };
