# Architecture

This document outlines the detailed architecture of Codecrawl. It explains the responsibilities of each component and how they interact to achieve efficient code processing.

---

## 1. Overview

Codecrawl is designed to traverse code repositories, extract code segments using language-specific parsing techniques, and package the results into a configurable output format. Its modular architecture makes it easy to extend and maintain, with clear separations between the API layer, the core crawling and parsing functionalities, and the auxiliary services like database interaction and background processing.

---

## 2. Environment & Project Structure

### 2.1. Apps & Environment
- **Location:** [`/apps/api`](apps/api)
- **Purpose:** Houses the primary API server which acts as the entry point for all client interactions.
- **Environment Setup:**
  - Environment variables are managed via `.env` files.
  - Build configuration is handled in files such as `tsconfig.json` and `drizzle.config.ts`.

### 2.2. Package Management & Build Tools
- **Tools Used:** PNPM for package management, facilitating workspaces.
- **Configuration Files:**
  - `pnpm-lock.yaml` and `pnpm-workspace.yaml` ensure consistent dependency management.
  - Various configuration files control TypeScript and build settings.

---

## 3. API Server

### 3.1. Technology Stack
- **Core Technologies:** Node.js, Express, and WebSockets.
- **Responsibilities:**
  - Receive HTTP requests and WebSocket connections.
  - Validate incoming data using middleware.
  - Route requests to appropriate internal modules (e.g., crawler, parser, database handler).

### 3.2. Key Entry Points
- **Main Entry:** `apps/api/src/index.ts` initializes the server.
- **Routing:** Request routing is defined using Express, with integration of error-handling and logging middleware.

---

## 4. Core Crawling & Processing

### 4.1. Crawler Engine
- **Purpose:** Recursively traverse directories to locate and read source files for processing.
- **Configuration:** 
  - Users can configure file inclusion/exclusion patterns.
  - The crawler adapts based on runtime configurations, merging inputs from command-line arguments and environment variables.

### 4.2. Parsing & Packaging
- **Language Parsing:** 
  - Supported languages are parsed using tree-sitter integrated through WebAssembly modules.
  - **File Mapping:** 
    - Extensions are mapped to specific languages (e.g., `.js`, `.ts`, `.py`, `.go`).
    - The file `apps/api/src/core/treeSitter/ext2Lang.ts` handles these mappings.
- **Parsing Strategies:**
  - Each language has a dedicated parse strategy implementing the common interface.
  - **Examples:**
    - `TypescriptStrategy.ts` for TypeScript files.
    - `PythonParseStrategy.ts` for Python files.
    - A default strategy in `DefaultParseStrategy.ts` for unsupported file types.
- **Packaging Output:**
  - Processed code segments are merged into a final output file.
  - Supported formats include Markdown, XML, and plain text.
  - Specific styling is applied depending on the output style, managed by files in `apps/api/src/core/output/outputStyles/`.

---

## 5. Tree-sitter Integration

### 5.1. Dynamic Language Loading
- **Mechanism:** Languages are loaded dynamically using WebAssembly modules.
- **File Involved:** `apps/api/src/core/treeSitter/loadLanguage.ts`.
- **Benefit:** Allows for high-performance parsing and the possibility to add new languages quickly.

### 5.2. Query Files & Parsing Logic
- **Queries:**  
  - Each supported language has associated query files defining syntax patterns.
  - Located in `apps/api/src/core/treeSitter/queries/`.
- **Strategy Mapping:**  
  - Mapping files (`ext2Lang.ts` and `lang2Query.ts`) determine the parsing logic based on file type and language.


## 8. Background Services & Workers

### 8.1. Asynchronous Task Processing
- **Usage:**  
  - For heavy or long-running tasks (e.g., processing large repositories), tasks are offloaded to background workers.
- **Service Files:**  
  - Worker logic is implemented in dedicated files (`apps/api/src/services/queue-worker.js`).

### 8.2. Queue Management
- **Purpose:**  
  - Ensures reliability and prevents request timeouts by decoupling the heavy processing logic from the main API response cycle.
