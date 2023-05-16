// Import the necessary libraries
import requests
import json

// Get the query from the user
query = "animals that live in water"

// Generate embeddings for the query using OpenAI
embeddingResult = requests.get(
  "https://api.openai.com/v1/engines/text-embedding-ada-002/embeddings",
  params={"text": query},
)

// Get the embedding vector for the query
vector = embeddingResult.json()["embedding"]

// Query Pinecone DB using the embeddings
response = requests.post(
  "https://api.pineconedb.com/v1/indexes/deckl/query",
  json={
    "namespace": "deckl",
    "vector": vector,
    "topK": 5,
    "includeMetadata": true,
    "includeValues": false,
  },
  headers={"Authorization": "Bearer YOUR_API_KEY"},
)

// Check the response status code
if response.status_code != 200:
  raise Exception("Could not query Pinecone DB")

// Get the matches from the response
matches = response.json()["matches"]

// Output the matches
console.log(matches)
