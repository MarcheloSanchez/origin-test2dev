---
related:
  - "[[My PKM Queries]]"
  - "[[Dataview Practicesheet]]"
  - "[[MODULAR dataview syntax]]"
created: 2024-12-11
tags:
  - 💯cheatsheet
---
⬆️:: [[🏡Home]]


NEGATIVE? 
# TEMPLATE

```
```dataview
```

```
LIST field1  / TABLE field1, field2, field3
FROM //source""/#
WHERE //if condition
FLATTEN field AS F //Metadata manipulation
WHERE //if condition the flattened array
GROUP BY //Grouping
SORT //Sorting
```

# Queries cheat sheet 

WHERE file.mtime >= date(today) - dur(1 week)
sort file.name asc
file.link as "Note", 

## Negative 
WHERE !author
WHERE !contains(file.tags, "#type/")

### Example 
Situation in template: *genres: -*

WHERE !genres OR (length(genres) = 1 AND contains(genres, null))

# Syntax
### **Dataview Query Types**

- `list`
- `table`
- `task`
- `calendar`
---
### **Fields**

- `file.name`
- `file.path`
- `file.link`
- `file.folder`
- `file.cday`
- `file.mday`
- `file.etag`
- `file.tasks`
- `file.size`
- `file.ext`
- `file.tags`
---
### **Filters and Conditions**

- `from`
- `where`
- `contains`
- `regexmatch`
- `startswith`
- `endswith`
- `!contains`
- `!regexmatch`
- `and`
- `or`
- `not`
- `in`
---
### **Sorting**
- `sort`
- `asc`
- `desc`
#### Example
sort file.name asc

---
### **Grouping**
- `group by`
---
### **Formatting and Aggregations**
- `limit`
- `flatten`
- `map`
- `reduce`
- `length`
- `sum`
- `count`
- `average`
- `min`
- `max`
- `join`
- `filter`
---
### **Date Functions**
- `date(today)`
- `date(tomorrow)`
- `date(yesterday)`
- `date(now)`
- `date(week)`
- `date(month)`
- `date(year)`
- `dateadd`
- `datefrom`
- `dateto`
---
### **Operators**
- =
- `!=`
- `<`
- `>`
- `<=`
- `>=`
---
### **Dynamic Values**
- `rows`
- `this.file`
- `this.file.link`
- `this.file.tags`
---
### **Tags and Metadata**
- `tags`
- `metadata`


# Front-matter
[Frontmatter Overview - Dataview Example Vault](https://s-blu.github.io/obsidian_dataview_example_vault/20%20Dataview%20Queries/Frontmatter%20Overview/)

# Data commands
[Data Commands - Dataview](https://blacksmithgu.github.io/obsidian-dataview/queries/data-commands/)

## FROM
---
- **Tags**: To select from a tag (and all its subtags), use `FROM [[tag]]`.
- **Folders**: To select from a folder (and all its subfolders), use `FROM "folder"`.
- **Single Files**: To select from a single file, use `FROM "path/to/file"`.
- **Links**: You can either select links TO a file, or all links FROM a file.
- To obtain all pages which link TO `[[note]]`, use `FROM [[note]]`.
- To obtain all pages which link FROM `[[note]]` (i.e., all the links in that file), use `FROM outgoing([[note]])`.
## WHERE
---
Filter pages that evaluates to *true*.
```
WHERE <clause>
```

1. Obtain all files which were modified in the last 24 hours:
    
    `LIST WHERE file.mtime >= date(today) - dur(1 day)`
    
2. Find all projects which are not marked complete and are more than a month old:
    
    `LIST FROM [[projects]] WHERE !completed AND file.ctime <= date(today) - dur(1 month)`

3. **Using `WHERE` Clauses**: You can use the `WHERE` clause to filter out notes based on certain conditions. For example, you can exclude notes that contain specific tags or keywords.
    
4. **`!contains` Function**: Use the `!contains` function to exclude notes that contain certain elements. For instance, `!contains(file.tags, "#tag")` would exclude notes with the specified tag.
    
5. **`NOT` Operator**: The `NOT` operator can be used to negate conditions. For example, `WHERE NOT file.name = "Example"` would exclude notes with the name "Example".
    
6. **Combining Conditions**: You can combine multiple conditions using logical operators like `AND` and `OR` to refine your exclusions. For example, `WHERE !contains(file.tags, "#tag1") AND !contains(file.tags, "#tag2")`.
    
7. **Excluding by Path**: You can exclude notes from specific folders or paths using conditions like `WHERE !contains(file.path, "FolderName")`.

## SORT
---
SORT date [ASCENDING/DESCENDING/ASC/DESC]
## GROUP BY 
---
```
GROUP BY field
GROUP BY (computed_field) AS name
```

In order to make working with the `rows` array easier, Dataview supports field "swizzling". If you want the field `test` from every object in the `rows` array, then `rows.test` will automatically fetch the `test` field from every object in `rows`, yielding a new array. You can then apply aggregation operators like `sum()` or `flat()` over the resulting array.
## FLATTEN
---
Flatten an array in every row, yielding one result row per entry in the array.

`FLATTEN field FLATTEN (computed_field) AS name`

For example, flatten the `authors` field in each literature note to give one row per author:

`TABLE authors FROM [[LiteratureNote]] FLATTEN authors`

A good use of this would be when there is a deeply nested list that you want to use more easily. For example, `file.lists` or `file.tasks`. Note the simpler query though the end results are slightly different (grouped vs non-grouped). You can use a `GROUP BY file.link` to achieve identical results but would need to use `rows.T.text` as described earlier.

`table T.text as "Task Text" from "Scratchpad" flatten file.tasks as T where T.text`

`table filter(file.tasks.text, (t) => t) as "Task Text" from "Scratchpad" where file.tasks.text`

`FLATTEN` makes it easier to operate on nested lists since you can then use simpler where conditions on them as opposed to using functions like `map()` or `filter()`.
