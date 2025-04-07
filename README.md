# 📒 Codecrawl

Empower your AI apps with clean data from any repository. Featuring advanced codebase indexing, semantic search, and data extraction capabilities.


## What is Codecrawl?

[Codecrawl](https://crawl.irere.dev?ref=github) is an API service that takes a repository URL, crawls it, and converts it into clean markdown or structured data, generate embeddings then store them in a vector database. We currently support only public codebases accessible on different codehosts like GitHub and Gitlab and give you clean data for each.

_Pst. hey, you, join our stargazers :)_

<a href="https://github.com/Idee8/codecrawl">
  <img src="https://img.shields.io/github/stars/Idee8/codecrawl.svg?style=social&label=Star&maxAge=2592000" alt="GitHub stars">
</a>

### API Key

To use the API, you need to sign up on [CodeCrawl](https://crawl.irere.dev) and get an API key.

### Features

- [**Index**](#indexing): Index repository content and get clean data in multiple formats (markdown, XML, plain text)
- [**Tree**](#filetree): Get repository file structure with search capabilities
- [**Search**](#search): Search repository content with semantic understanding
- [**LLMs.txt**](#llms.txt): Generate a Llms.txt to feed directly to any model
- [**Batch**](#batch-indexing-multiple-urls): Process multiple repositories simultaneously

### Powerful Capabilities
- **Multiple Output Formats**: Convert repository content to markdown, XML, plain text
- **Structured Data**: Extract metadata like file stats, token counts, and repository info
- **Advanced Search**: Find relevant files and content with semantic search
- **Repository Analytics**: Get insights on file sizes, token counts and top files
- **Scalable Processing**: Handle large codebases with configurable limits and batch operations
- **Clean Data**: Remove comments, empty lines and get compressed output as needed


### Indexing 

Used to index a repository using its URL and get repository file tree and content. This submits a crawl job and returns a job ID to check the status of the indexing.

```bash
# the limits the number of files to index to a 100
curl -X POST https://api.irere.dev/v1/index \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer fc-YOUR_API_KEY' \
    -d '{
      "url": "https://github.com/irere123/run-lang",
      "limit": 100,
      "compress": false,
      "comments": false,
      "emptyLines": false,
      "scrapeOptions": {
        "formats": ["markdown", "xml", "plain"]
      }
    }'
```

Returns a indexing job id and the url to check the status of the index.

```json
{
  "success": true,
  "id": "123-456-789",
  "url": "https://api.irere.dev/v1/index/123-456-789"
}
```


### LLMs.txt

Generate a `llms.txt` file for a repository, optimized for feeding Language Model training. This endpoint initiates a job to create the `llms.txt` file and returns a job ID to track its progress.

```bash
curl -X POST https://api.irere.dev/v1/llmstxt \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{
    "url": "https://github.com/irere123/run-lang"
  }'
```

Returns a job ID to check the status of the `llms.txt` generation.

```json
{
  "success": true,
  "id": "123-456-789"
}
```

### Check LLMs.txt Job

Check the status and retrieve the content of a `llms.txt` generation job using the job ID.

```bash
curl -X GET https://api.irere.dev/v1/llmstxt/123-456-789 \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY'
```

Returns the status and data of the `llms.txt` generation job.

```json
{
  "success": true,
  "status": "completed",
  "data": {
    "llmstxt": "Content of the llms.txt file..."
  }
}
```


### Check Index Job

Used to check the status of a index job and get its result.

```bash
curl -X GET https://api.irere.dev/v1/index/123-456-789 \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY'
```

```json
{
  "status": "completed",
  "total": 36,
  "creditsUsed": 36,
  "expiresAt": "2024-00-00T00:00:00.000Z",
  "data": [
    {
      "markdown": "Codebase content in markdown format",
      "xml": "Codebase content in xml format",
      "plain": "Codebase content in plain text format",
      "metadata": {
        "topFiles": [
            {
                "chars": 3232, 
                "name":"src/components/landing.tsx",
                "tokens": 2123, 
                "percentage": 32
            }
        ],
        "repository": "https://github.com/irere123/run-lang",
        "totalSize": 323232, // characters
        "totalTokens": 545464, // tokens
        "totalFiles": 123, // number of files
        "statusCode": 200
      }
    }
  ]
}
```

Response:

```json
{
  "success": true,
  "data": {
    "markdown": "[Readme file content in markdown format]...",
    "xml": "[Readme file content in xml format]...",
    "metadata": {
      "title": "Run Programming Language",
      "description": "[Experimental] Object-oriented, compiled, VM-based language designed for optimal performance and portability across different environments.",
      // other structured data extracted and formated using LLMs
    }
  }
}
```

### FileTree

Used to get the file tree of the whole repository using its URL. This returns markdown, plain, or html for the file tree of the repo

```bash cURL
curl -X POST https://api.irere.dev/v1/tree \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer YOUR_API_KEY' \
    -d '{
      "url": "https://github.com/irere123/run-lang", 
      "formats: ["markdown", "plain"]
    }'
```

Response:

```json
{
  "status": "success",
  "data": [
   {
     "markdown": "File structure in markdown....", // if specified as the return type
      "html": "File structure in html", // if specified as the return type
      "plain": "File structure in plain text", // if specified as the return type
      "data": {
        "tree": "[filetree]...",
        "repository": "https://github.com/irere123/run-lang",
        "statusCode": 200
      }
   }
  ]
}
```

#### Map with search

Map with `search` param allows you to search for specific keyword inside a repository file structure.

```bash cURL
curl -X POST https://api.irere.dev/v1/map \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer YOUR_API_KEY' \
    -d '{
      "url": "https://github.com/irere123/run-lang",
      "search": "docs"
    }'
```

Response will be an ordered list from the most relevant to the least relevant.

```json
{
  "status": "success",
  "results": [
    "src/components/input.tsx",
    "src/components/main.tsx",
    "src/components/markdown.tsx",
  ]
}
```

### Batch Indexing Multiple URLs

You can now batch index multiple URLs at the same time. It is very similar to how the /index endpoint works. It submits a batch indexing job and returns a job ID to check the status of the batch index.

```bash
curl -X POST https://api.irere.dev/v1/batch/index \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer YOUR_API_KEY' \
    -d '{
      "urls": ["https://github.com/irere123/run-lang", "https://github.com/irere123/relaunch"],
      "formats" : ["markdown", "xml"]
    }'
```

### Search

The search endpoint combines web search with Codecrawl's indexing capabilities to return full repository content for any query.

Include `indexOptions` with `formats: ["markdown"]` to get complete markdown content for each search result otherwise it defaults to getting SERP results (repository, title, description).

```bash
curl -X POST https://api.irere.dev/v1/search \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer YOUR_API_KEY' \
    -d '{
        "url": "http://github.com/Idee8/codecrawl",
        "query": "What is Codecrawl?"
    }'
```

```json
{
  "success": true,
  "data": [
    {
      "repository": "https://github.com/Idee8/codecrawl",
      "title": "Codecrawl",
      "description": "Turn entire repository into LLM-ready markdown or structured data. Search, index and extract with a single API."
    }
  ]
}
```


## Contributing

We love contributions! Please read our [contributing guide](CONTRIBUTING.md) before submitting a pull request. If you'd like to self-host, refer to the [self-hosting guide](SELF_HOST.md).

_It is the sole responsibility of the end users to respect repositories' policies when indexing, searching and crawling with Codecrawl. Users are advised to adhere to the applicable privacy policies and Licenses prior to initiating any indexing activities. By default, Codecrawl respects the directives specified in the repository's .gitignore files when indexing. By utilizing Codecrawl, you expressly agree to comply with these conditions._

## Contributors

<a href="https://github.com/Idee8/codecrawl/graphs/contributors">
  <img alt="contributors" src="https://contrib.rocks/image?repo=Idee8/codecrawl"/>
</a>


## Credits 

Built with inspiration and techniques from **[Firecrawl](https://github.com/mendableai/firecrawl) and [Repomix](https://github.com/yamadashy/repomix)**. Special thanks to their contributors for pioneering web crawling and repository processing approaches.
