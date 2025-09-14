
⬆️:: [[🏡Home]]

### **General Search Criteria Cheatsheet**

| **Syntax**              | **Description**                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| `*con`                  | Searches for words ending with "con". Example: *con matches "beacon" or "recon".                 |
| `con*`                  | Searches for words starting with "con". Example: con* matches "contract" or "connect".           |
| `*con*`                 | Searches for words containing "con" anywhere. Example: _con_ matches "context" or "acronym".     |
| `^con`                  | Matches text starting with "con" (used in regex).                                                |
| `con$`                  | Matches text ending with "con" (used in regex).                                                  |
| `/con/`                 | Matches "con" as a whole word only (used in regex).                                              |
| `[abc]`                 | Matches any character in the brackets. Example: [abc] matches "cat", "bat", or "apple".          |
| `[^abc]`                | Matches any character _not_ in the brackets. Example: [^abc] matches "dog" or "fish".            |
| `(con                   | pro)`                                                                                            |
| `\bcon`                 | Matches "con" at the start of a word boundary. Example: Matches "connect" but not "reconnect".   |
| `con\b`                 | Matches "con" at the end of a word boundary. Example: Matches "recon" but not "reconnect".       |
| `\d`                    | Matches any digit (0-9).                                                                         |
| `\w`                    | Matches any word character (alphanumeric + underscore).                                          |
| `\s`                    | Matches any whitespace character (space, tab, newline).                                          |
| `.*`                    | Matches any characters (wildcard for regex). Example: "con.*" matches "connect", "contain", etc. |
| `NOT con`               | Excludes results containing "con".                                                               |
| `OR`                    | Combines terms for an OR search. Example: "cat OR dog".                                          |
| `AND`                   | Combines terms for an AND search. Example: "cat AND dog".                                        |
| `-term`                 | Excludes "term" from search. Example: -con excludes results with "con".                          |
| `file:notes`            | Searches within files named "notes". (Used in tools like Obsidian or advanced search engines.)   |
| `path:folder`           | Searches within a specific folder.                                                               |
| `tag:#important`        | Searches for items tagged with#important.                                                        |
| `is:completed`          | Filters for completed tasks (specific to task managers or tools like Obsidian).                  |
| `created:2024-12-01`    | Finds notes or files created on a specific date.                                                 |
| `modified:>=2024-12-01` | Finds notes modified on or after a specific date.                                                |

# Examples - various  

#### **Variable-Length Wildcards**

- **Usage**: Match words with specific structures or patterns.
- **Examples**:
    - `t*e` matches "time," "tree," or "the".
    - `a??le` matches "apple" or "ample" (exactly two characters between "a" and "le").

#### **Middle Substrings**

- **Usage**: Match substrings occurring anywhere in a word.
- **Examples**:
    - `*ize*` finds "realize," "size," or "visualize."


# Regex-search

### **Types of Regex-Based Tools**

1. **Text Editors and IDEs**  
    Designed for programmers and writers, these support regex for search and replace.
    
    - **Examples**:
        - **VS Code**: Search with regex enabled in the search bar.
        - **Sublime Text**: Use regex for advanced search and replace.
        - **Notepad++**: Supports regex in the "Find" and "Replace" dialogs.
2. **Command-Line Tools**  
    Popular for file and text processing in Unix/Linux environments.
    
    - **Examples**:
        - **grep**: Searches files for lines matching a pattern.  
            Example: `grep -E "pattern"`
        - **sed**: Stream editor for searching and replacing text.  
            Example: `sed 's/old/new/g' file.txt`
        - **awk**: Text-processing tool with regex capabilities for advanced formatting.  
            Example: `awk '/pattern/ {print $0}' file.txt`
3. **Programming Languages**  
    Regex is a built-in feature in many languages for string processing.
    
    - **Examples**:
        - **Python**: The `re` module provides regex support.  
            Example: `import re; re.search(r'\d+', "abc123")`
        - **JavaScript**: Regex is natively supported.  
            Example: `/\d+/.test("123")`
        - **Java**: Regex classes are part of `java.util.regex`.
4. **Data Analysis and Visualization Tools**  
    Tools for working with large datasets often use regex for filtering and transformation.
    
    - **Examples**:
        - **R**: Functions like `grep()` and `gsub()`.  
            Example: `grep("pattern", vector)`
        - **Pandas (Python)**: String methods like `.str.contains()` or `.str.extract()`.  
            Example: `df['column'].str.contains(r'pattern')`
5. **Database Query Tools**  
    Regex can be used for pattern matching in some databases.
    
    - **Examples**:
        - **PostgreSQL**: `~` operator for regex matching.  
            Example: `SELECT * FROM table WHERE column ~ 'pattern';`
        - **MongoDB**: `$regex` operator.  
            Example: `db.collection.find({ field: { $regex: "pattern" } });`
6. **Log Management and Search Platforms**  
    Regex is essential for filtering and analyzing logs.
    
    - **Examples**:
        - **Elasticsearch/Kibana**: Supports regex for query filters.  
            Example: `{ "query": { "regexp": { "field": "pattern" } } }`
        - **Splunk**: Uses regex for data parsing and searching.
7. **Web Tools and Online Regex Editors**  
    Useful for testing and building regex patterns interactively.
    
    - **Examples**:
        - [Regex101](https://regex101.com)
        - [RegExr](https://regexr.com)
8. **Automation and Scripting Tools**  
    Regex is often used in automation workflows for pattern matching.
    
    - **Examples**:
        - **Bash scripts**: Using tools like `grep`, `awk`, or `sed`.
        - **PowerShell**: Regex with `-match` operator.  
            Example: `$string -match '\d{3}'`

---

### **Common Uses of Regex-Based Tools**

- Search and replace text (e.g., reformatting dates).
- Extracting data from logs or documents.
- Validating input (e.g., email, phone numbers).
- Parsing large datasets or files.
- Cleaning and transforming data.

## Examples 

### **Regex for Structured Patterns**

#### **Exact Word Matches**

- **Usage**: Target whole words or exclude partial matches.
- **Examples**:
    - `/\bcon\b/` matches "con" as a standalone word, not "connect" or "context."

#### **Matching Numbers**

- **Usage**: Find patterns with digits.
- **Examples**:
    - `\d+` matches any number (e.g., "123," "456").
    - `202\d` matches years in the 2020s (e.g., "2021," "2023").

#### **Case Sensitivity**

- **Usage**: Match terms with specific capitalization.
- **Examples**:
    - `/TODO/` matches "TODO" but not "todo."
    - `/[A-Z]{3}/` matches sequences of three capital letters (e.g., "API," "CSS").

#### **Pattern Alternations**

- **Usage**: Match multiple patterns simultaneously.
- **Examples**:
    - `(error|warning|failure)` matches "error," "warning," or "failure."


# Types of seaches - (Non-regex)

### **1. Wildcards**

- **Usage**: Simple patterns for partial matches.
- **Examples**:
    - `*` matches any sequence of characters (e.g., `file*` matches `file1`, `file2`).
    - `?` matches a single character (e.g., `file?` matches `file1` but not `files`).

---

### **2. Boolean Operators**

- **Usage**: Combine keywords logically.
- **Examples**:
    - `AND`: Results must include both terms (e.g., `cat AND dog`).
    - `OR`: Results must include either term (e.g., `cat OR dog`).
    - `NOT`: Excludes specific terms (e.g., `cat NOT dog`).

---

### **3. Quoted Searches**

- **Usage**: Finds exact phrases.
- **Examples**:
    - `"machine learning"` matches the full phrase, not partial words.

---

### **4. Fuzzy Search**

- **Usage**: Matches similar words, accounting for typos or close variants.
- **Examples**:
    - Searching "color" might also return "colour" or "collor" depending on the tool.

---

### **5. Tag-Based Search**

- **Usage**: Filters by predefined tags or metadata.
- **Examples**:
    - `#important` to find tagged items in tools like Obsidian or Evernote.

---

### **6. Date and Time Filters**

- **Usage**: Restrict results to specific time ranges.
- **Examples**:
    - `created:2024-01-01` finds items created on this date.
    - `modified:>=2024-01-01` finds items modified on or after this date.

---

### **7. Proximity Search**

- **Usage**: Finds terms near each other.
- **Examples**:
    - `apple NEAR/5 pie` finds "apple" within 5 words of "pie".

---

### **8. Natural Language Queries**

- **Usage**: Allows for intuitive, conversational searches.
- **Examples**:
    - "Files edited last week."
    - "Documents with deadlines in December."

---

### **9. Path or File Filters**

- **Usage**: Search within specific file names or locations.
- **Examples**:
    - `file:report` finds files with "report" in their name.
    - `path:projects` searches within the "projects" folder.

---

### **10. Field-Specific Search**

- **Usage**: Limits search to specific fields or properties.
- **Examples**:
    - `title:python` searches within titles only.
    - `author:"Jane Doe"` filters by author.

---

### **11. Specialized Syntax**

- **Usage**: Tool-specific features for advanced filtering.
- **Examples**:
    - `is:completed` (task management tools) filters completed tasks.
    - `priority:high` finds high-priority items.
