# Inspiration API

This is an API for serving categorized quotes. It includes features such as retrieving all quotes, fetching quotes by category or author, adding new quotes, updating or deleting existing ones, and a random quote generator.

## Base URL

`https://quotes-api.priyanshideshpande19.workers.dev`

## Endpoints

### 1. GET `/`

- **Purpose:** Check if the API is running.
- **Example:** `curl https://quotes-api.priyanshideshpande19.workers.dev/`

### 2. GET `/quotes`

- **Purpose:** Retrieve all quotes. Optionally filter by `category` or `author`.
- **Example:** `curl "https://quotes-api.priyanshideshpande19.workers.dev/quotes?category=motivation"`

### 3. POST `/quotes`

- **Purpose:** Add a new quote.
- **Example:**


bash curl -X POST https://quotes-api.priyanshideshpande19.workers.dev/quotes
-H "Content-Type: application/json"
-d '{"text": "The only way to do great work is to love what you do.", "author": "Steve Jobs", "category": "inspiration"}'

### 4. GET `/quotes/random`

- **Purpose:** Fetch a random quote. Optionally filter by `category`.
- **Example:** `curl "https://quotes-api.priyanshideshpande19.workers.dev/quotes/random?category=motivation"`

### 5. GET `/quotes/:id`

- **Purpose:** Retrieve a specific quote by its unique ID.
- **Example:** `curl https://quotes-api.priyanshideshpande19.workers.dev/quotes/12345`

### 6. PUT `/quotes/:id`

- **Purpose:** Update a quote by its ID.
- **Example:**


bash curl -X PUT https://quotes-api.priyanshideshpande19.workers.dev/quotes/12345
-H "Content-Type: application/json"
-d '{"text": "Updated quote text", "author": "Updated Author", "category": "Updated Category"}'

### 7. DELETE `/quotes/:id`

- **Purpose:** Delete a specific quote by its unique ID.
- **Example:** `curl -X DELETE https://quotes-api.priyanshideshpande19.workers.dev/quotes/12345`

### 8. GET `/categories`

- **Purpose:** Retrieve a list of all available categories.
- **Example:** `curl https://quotes-api.priyanshideshpande19.workers.dev/categories`

## Notes

- Ensure JSON payloads are correctly formatted for POST and PUT requests.
- Replace `12345` with the actual quote ID for specific operations.
