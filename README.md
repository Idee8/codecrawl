# 📒 Codecrawl

Empower your AI apps with clean data from any repository. Featuring advanced codebase indexing, semantic search, and data extraction capabilities.


## What is Codecrawl?

[Codecrawl](https://crawl.irere.dev?ref=github) is an API service that takes a repository URL, crawls it, and converts it into clean markdown or structured data, generate embeddings then store them in a vector database. We currently support only public codebases accessible on different codehosts like GitHub and Gitlab and give you clean data for each.

_Pst. hey, you, join our stargazers :)_

<a href="https://github.com/Idee8/codecrawl">
  <img src="https://img.shields.io/github/stars/Idee8/codecrawl.svg?style=social&label=Star&maxAge=2592000" alt="GitHub stars">
</a>

## How to use it?

We provide an easy to use API with our hosted version. You can find the playground and documentation [here](https://crawl.irere.dev/playground). You can also self host the backend if you'd like.

Check out the following resources to get started:
- [x] **API**: [Documentation](https://crawl-docs.irere.dev/api-reference/introduction)
- [x] **SDKs**: [Python](https://crawl-docs.irere.dev/sdks/python), [Node](https://crawl-docs.irere.dev/sdks/node), [Go](https://crawl-docs.irere.dev/sdks/go), [Rust](https://crawl-docs.irere.dev/sdks/rust)

To run locally, refer to guide [here](https://github.com/Idee8/codecrawl/blob/main/CONTRIBUTING.md).

### API Key

To use the API, you need to sign up on [CodeCrawl](https://crawl.irere.dev) and get an API key.

### Features

- [**Index**](#indexing): Index repository content and get clean data in multiple formats (markdown, XML, plain text)
- [**Scrape**](#scraping-readmes): Extract README content and metadata from repository URLs
- [**Map**](#filetree): Get repository file structure with search capabilities
- [**Search**](#search): Search repository content with semantic understanding
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

### Scraping READMEs

Used to scrape information from README.md URL and get its content in the specified formats.

```bash
curl -X POST https://api.irere.dev/v1/scrape \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer YOUR_API_KEY' \
    -d '{
      "url": "https://github.com/Irere123/run-lang/blob/master/README.md",
      "formats" : ["markdown", "xml"]
    }'
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
curl -X POST https://api.irere.dev/v1/map \
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

## Open Source vs Cloud Offering

Codecrawl is open source available under the AGPL-3.0 license. 

To deliver the best possible product, we will offer a hosted version of Codecrawl alongside our open-source offering. The cloud solution will allow us to continuously innovate and maintain a high-quality, sustainable service for all users.


## Contributing

We love contributions! Please read our [contributing guide](CONTRIBUTING.md) before submitting a pull request. If you'd like to self-host, refer to the [self-hosting guide](SELF_HOST.md).

_It is the sole responsibility of the end users to respect repositories' policies when indexing, searching and crawling with Codecrawl. Users are advised to adhere to the applicable privacy policies and Licenses prior to initiating any indexing activities. By default, Codecrawl respects the directives specified in the repository's .gitignore files when indexing. By utilizing Codecrawl, you expressly agree to comply with these conditions._

## Contributors

<a href="https://github.com/Idee8/codecrawl/graphs/contributors">
  <img alt="contributors" src="https://contrib.rocks/image?repo=Idee8/codecrawl"/>
</a>

## License Disclaimer

This project is primarily licensed under the GNU Affero General Public License v3.0 (AGPL-3.0), as specified in the LICENSE file in the root directory of this repository. However, certain components of this project are licensed under the MIT License. Refer to the LICENSE files in these specific directories for details.

Please note:

- The AGPL-3.0 license applies to all parts of the project unless otherwise specified.
- The SDKs and some UI components are licensed under the MIT License. Refer to the LICENSE files in these specific directories for details.
- When using or contributing to this project, ensure you comply with the appropriate license terms for the specific component you are working with.

For more details on the licensing of specific components, please refer to the LICENSE files in the respective directories or contact the project maintainers.



## Credits 

Built with inspiration and techniques from [Firecrawl](https://github.com/mendableai/firecrawl) and [Repomix](https://github.com/yamadashy/repomix). Special thanks to their contributors for pioneering web crawling and repository processing approaches.

<p align="right" style="font-size: 14px; color: #555; margin-top: 20px;">
    <a href="#readme-top" style="text-decoration: none; color: #007bff; font-weight: bold;">
        ↑ Back to Top ↑
    </a>
</p>
