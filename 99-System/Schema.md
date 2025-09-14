# Metadata Schema

| Field    | Type   | Allowed Values / Format |
|----------|--------|-------------------------|
| id       | string | 12-char UID for zettels, slug for others |
| type     | string | atomic \| area \| resource \| zettel \| note \| project \| source \| moc \| meeting \| person \| daily \| weekly \| monthly |
| status   | string | idea \| active \| paused \| done \| archived |
| area     | list   | Links to Area notes |
| project  | list   | Links to Project notes |
| priority | string | L \| M \| H |
| due      | date   | YYYY-MM-DD |
| created  | date   | YYYY-MM-DD |
| updated  | date   | YYYY-MM-DD |
| tags     | list   | `p/<project>`, `a/<area>`, `topic/<topic>`, `z/<zettel>` |
| aliases  | list   | Alternative titles |
| links    | list   | Related note links |

Ensure all templates and new notes conform to this schema.
