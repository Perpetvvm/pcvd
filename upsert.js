# Import the necessary libraries
import json
import requests

# Get the animals from the JSON file
with open("animals.json", "r") as f:
  animals = json.load(f)

# Create an empty list to store the vectors
vectors = []

# Iterate over the animals and create a vector for each animal
for animal in animals:
  # Get the embedding for the animal
  embedding = requests.get(
    "https://api.openai.com/v1/engines/text-embedding-ada-002/embeddings",
    params={"text": animal},
  ).json()["embedding"]

  # Create a vector for the animal
  vector = {
    "id": animal,
    "metadata": {
      "name": animal,
    },
    "values": embedding,
  }

  # Add the vector to the list of vectors
  vectors.append(vector)

# Split the list of vectors into batches of 250 vectors
batches = [vectors[i:i + 250] for i in range(0, len(vectors), 250)]

# Insert the batches of vectors into Pinecone DB
for batch in batches:
  # Make an API call to Pinecone DB to insert the batch of vectors
  response = requests.post(
    "https://api.pineconedb.com/v1/indexes/deckl/vectors",
    json=batch,
    headers={"Authorization": "Bearer YOUR_API_KEY"},
  )

  # Check the response status code
  if response.status_code != 200:
    raise Exception("Could not insert vectors into Pinecone DB")

# Print the number of batches inserted
print(len(batches))

# Import the upsert.js companion
import upsert

# Upsert the vectors into Pinecone DB
upsert.upsert(vectors, "deckl")
