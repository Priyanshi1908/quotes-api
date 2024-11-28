import { Hono } from 'hono';

// Initialize the Hono app
const app = new Hono();

// Sample route to check if Hono is working
app.get('/', (c) => {
  console.log('Root endpoint hit');
  return c.text('Hello, World! Your API is running.');
});

// Endpoint to retrieve all quotes
app.get('/quotes', async (c) => {
  console.log('Fetching all quotes...');
  const category = c.req.query('category');
  const author = c.req.query('author');
  console.log('Received query parameters:', { category, author });

  let quotes = [];
  try {
    console.log('Fetching keys from KV store...');
    const keys = await c.env.QUOTES_KV.list();
    console.log('Keys retrieved:', keys.keys);

    for (const key of keys.keys) {
      console.log('Fetching quote with key:', key.name);
      const quote = await c.env.QUOTES_KV.get(key.name);
      if (quote) {
        console.log('Quote found:', quote);
        const parsedQuote = JSON.parse(quote);
        if (
          (!category || parsedQuote.category === category) &&
          (!author || parsedQuote.author === author)
        ) {
          quotes.push(parsedQuote);
        }
      } else {
        console.log('No quote found for key:', key.name);
      }
    }
  } catch (error) {
    console.error('Error fetching quotes from KV:', error);
    return c.json({ error: 'Failed to fetch quotes' }, 500);
  }

  console.log('Quotes retrieved:', quotes);
  return c.json({ quotes });
});

// Endpoint to add a new quote
app.post('/quotes', async (c) => {
  console.log('Adding a new quote...');
  const body = await c.req.json();
  console.log('Request body:', body);

  if (!body.text || !body.author || !body.category) {
    console.log('Missing required fields in request body');
    return c.json({ error: 'Missing required fields: text, author, category' }, 400);
  }

  const id = Date.now().toString();
  const newQuote = {
    id,
    text: body.text,
    author: body.author,
    category: body.category,
  };

  console.log('New quote to be stored:', newQuote);

  try {
    console.log('Storing the new quote in KV store...');
    await c.env.QUOTES_KV.put(id, JSON.stringify(newQuote));
    console.log('Quote stored successfully');
  } catch (error) {
    console.error('Error saving the quote to KV:', error);
    return c.json({ error: 'Failed to save the quote' }, 500);
  }

  return c.json({ message: 'Quote added successfully', quote: newQuote }, 201);
});

// Endpoint to get a random quote
app.get('/quotes/random', async (c) => {
	console.log('Fetching a random quote...');
	const category = c.req.query('category');
	console.log('Received category query parameter:', category);
  
	let quotes = [];
	try {
	  console.log('Fetching keys from KV store...');
	  const keys = await c.env.QUOTES_KV.list();
	  console.log('Keys retrieved:', keys.keys);
  
	  for (const key of keys.keys) {
		console.log('Fetching quote with key:', key.name);
		const quote = await c.env.QUOTES_KV.get(key.name);
		if (quote) {
		  console.log('Quote found:', quote);
		  const parsedQuote = JSON.parse(quote);
		  if (!category || parsedQuote.category === category) {
			quotes.push(parsedQuote);
		  }
		}
	  }
	} catch (error) {
	  console.error('Error fetching quotes from KV:', error);
	  return c.json({ error: 'Failed to fetch quotes' }, 500);
	}
  
	if (quotes.length === 0) {
	  console.log('No quotes found');
	  return c.json({ error: 'No quotes found' }, 404);
	}
  
	const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
	console.log('Random quote selected:', randomQuote);
	return c.json({ quote: randomQuote });
  });

// Endpoint to retrieve a specific quote by ID
app.get('/quotes/:id', async (c) => {
  const id = c.req.param('id');
  console.log('Fetching quote with ID:', id);

  try {
    const quote = await c.env.QUOTES_KV.get(id);
    if (!quote) {
      console.log('Quote not found for ID:', id);
      return c.json({ error: 'Quote not found' }, 404);
    }
    console.log('Quote found:', quote);
    return c.json({ quote: JSON.parse(quote) });
  } catch (error) {
    console.error('Error fetching the quote from KV:', error);
    return c.json({ error: 'Failed to fetch the quote' }, 500);
  }
});

// Endpoint to update a quote by ID
app.put('/quotes/:id', async (c) => {
  const id = c.req.param('id');
  console.log('Updating quote with ID:', id);

  const body = await c.req.json();
  console.log('Request body:', body);

  if (!body.text || !body.author || !body.category) {
    console.log('Missing required fields in request body');
    return c.json({ error: 'Missing required fields: text, author, category' }, 400);
  }

  try {
    const updatedQuote = {
      id,
      text: body.text,
      author: body.author,
      category: body.category,
    };

    console.log('Updated quote:', updatedQuote);

    await c.env.QUOTES_KV.put(id, JSON.stringify(updatedQuote));
    console.log('Quote updated successfully');
    return c.json({ message: 'Quote updated successfully', quote: updatedQuote });
  } catch (error) {
    console.error('Error updating the quote in KV:', error);
    return c.json({ error: 'Failed to update the quote' }, 500);
  }
});

// Endpoint to delete a quote by ID
app.delete('/quotes/:id', async (c) => {
  const id = c.req.param('id');
  console.log('Deleting quote with ID:', id);

  try {
    await c.env.QUOTES_KV.delete(id);
    console.log('Quote deleted successfully');
    return c.json({ message: 'Quote deleted successfully' });
  } catch (error) {
    console.error('Error deleting the quote from KV:', error);
    return c.json({ error: 'Failed to delete the quote' }, 500);
  }
});

// Endpoint to get all categories
app.get('/categories', async (c) => {
	console.log('Fetching all categories...');
	const categories = new Set();
	try {
	  console.log('Fetching keys from KV store...');
	  const keys = await c.env.QUOTES_KV.list();
	  console.log('Keys retrieved:', keys.keys);
  
	  for (const key of keys.keys) {
		console.log('Fetching quote with key:', key.name);
		const quote = await c.env.QUOTES_KV.get(key.name);
		if (quote) {
		  console.log('Quote found:', quote);
		  const parsedQuote = JSON.parse(quote);
		  if (parsedQuote.category) {
			categories.add(parsedQuote.category);
		  }
		} else {
		  console.log('No quote found for key:', key.name);
		}
	  }
	} catch (error) {
	  console.error('Error fetching categories from KV:', error);
	  return c.json({ error: 'Failed to fetch categories' }, 500);
	}
  
	if (categories.size === 0) {
	  console.log('No categories found');
	  return c.json({ error: 'No categories found' }, 404);
	}
  
	console.log('Categories retrieved:', Array.from(categories));
	return c.json({ categories: Array.from(categories) });
  });


export default {
  fetch: (request, env, ctx) => app.fetch(request, env, ctx),
};