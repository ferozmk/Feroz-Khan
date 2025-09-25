// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Queue, Worker } = require('bullmq');
const Redis = require('ioredis');

// --- Configuration ---
const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
const CACHE_EXPIRATION_SECONDS = 3600; // 1 hour

// Redis connection details
const redisConnection = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null, // Required for BullMQ
});

// --- Initialization ---
const app = express();
const heavyTaskQueue = new Queue('heavy-tasks', { connection: redisConnection });

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- BullMQ Worker ---
const worker = new Worker('heavy-tasks', async (job) => {
  const { prompt } = job.data;
  console.log(`Processing heavy task for job ${job.id} with prompt: "${prompt}"`);

  // Simulate a long-running task (e.g., video processing, complex calculation)
  await new Promise(resolve => setTimeout(resolve, 5000)); // 5-second delay

  const result = `Heavy task for '${prompt}' is complete. Processed at ${new Date().toISOString()}`;
  
  // Save the result to Redis so it can be fetched by the status endpoint
  const resultKey = `job-result:${job.id}`;
  await redisConnection.set(resultKey, JSON.stringify({ status: 'done', result }));
  
  console.log(`Finished processing job ${job.id}`);
  return result;
}, { connection: redisConnection });

worker.on('completed', job => {
  console.log(`Job ${job.id} has completed successfully.`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} has failed with error: ${err.message}`);
});


// --- API Endpoints ---

/**
 * @route   POST /api/chat
 * @desc    Get a response from Gemini API, with caching.
 * @access  Public
 */
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const cacheKey = `chat:${prompt.trim().toLowerCase()}`;

  try {
    // 1. Check Redis cache first
    const cachedResult = await redisConnection.get(cacheKey);
    if (cachedResult) {
      console.log(`Cache hit for prompt: "${prompt}"`);
      return res.json({ source: 'cache', data: JSON.parse(cachedResult) });
    }
    
    console.log(`Cache miss for prompt: "${prompt}". Fetching from Gemini API...`);

    // 2. If not in cache, call Gemini API
    const geminiResponse = await axios.post(GEMINI_API_URL, {
      contents: [{
        parts: [{ text: prompt }],
      }],
    });
    
    const responseData = geminiResponse.data.candidates[0].content.parts[0].text;
    
    // 3. Store the result in Redis cache with expiration
    await redisConnection.setex(cacheKey, CACHE_EXPIRATION_SECONDS, JSON.stringify(responseData));

    res.json({ source: 'api', data: responseData });
  } catch (error) {
    console.error('Error contacting Gemini API:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch response from Gemini API.' });
  }
});

/**
 * @route   POST /api/heavy
 * @desc    Add a heavy task to the background job queue.
 * @access  Public
 */
app.post('/api/heavy', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required for the heavy task.' });
  }

  try {
    const job = await heavyTaskQueue.add('process-heavy-task', { prompt });
    console.log(`Added heavy task with prompt "${prompt}" to the queue. Job ID: ${job.id}`);
    res.status(202).json({ message: 'Task accepted for processing.', jobId: job.id });
  } catch (error) {
    console.error('Error adding job to queue:', error);
    res.status(500).json({ error: 'Could not queue the task.' });
  }
});

/**
 * @route   GET /api/heavy/:id
 * @desc    Get the status and result of a queued heavy task.
 * @access  Public
 */
app.get('/api/heavy/:id', async (req, res) => {
  const { id } = req.params;
  const resultKey = `job-result:${id}`;

  try {
    const resultJson = await redisConnection.get(resultKey);

    if (resultJson) {
      // Job is done and result is available
      return res.status(200).json(JSON.parse(resultJson));
    } else {
      // Check if the job itself exists to differentiate between "processing" and "not found"
      const job = await heavyTaskQueue.getJob(id);
      if (job) {
        return res.status(202).json({ status: 'processing', message: 'Job is still being processed.' });
      } else {
        return res.status(404).json({ status: 'not_found', message: 'Job not found.' });
      }
    }
  } catch (error) {
    console.error('Error fetching job result:', error);
    res.status(500).json({ error: 'Could not fetch job status.' });
  }
});


// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Worker is listening for heavy tasks...');
});
