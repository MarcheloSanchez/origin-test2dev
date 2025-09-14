<%* 
const fm = tp.frontmatter;
const today = tp.date.now("YYYY-MM-DD");
await tp.file.replace_regex("^modified:.*$", `modified: ${today}`, true, true);
-%>

