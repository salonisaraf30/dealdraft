import React from 'react';

function parseInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let last = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    parts.push(<strong key={key++}>{match[1]}</strong>);
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    parts.push(text.slice(last));
  }

  return parts;
}

function parseTable(lines: string[]): React.ReactNode {
  const rows = lines.map((l) =>
    l
      .trim()
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((c) => c.trim())
  );

  const header = rows[0];
  // rows[1] is the separator — skip it
  const body = rows.slice(2);

  return (
    <table key="table">
      <thead>
        <tr>
          {header.map((cell, i) => (
            <th key={i}>{parseInline(cell)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {body.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{parseInline(cell)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function renderMarkdown(content: string): React.ReactNode {
  const lines = content.split('\n');
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Heading h3
    if (line.startsWith('### ')) {
      nodes.push(<h3 key={key++}>{parseInline(line.slice(4))}</h3>);
      i++;
      continue;
    }

    // Table (starts with |)
    if (line.trim().startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      nodes.push(<React.Fragment key={key++}>{parseTable(tableLines)}</React.Fragment>);
      continue;
    }

    // Bullet list
    if (line.match(/^[-*] /)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^[-*] /)) {
        items.push(lines[i].slice(2));
        i++;
      }
      nodes.push(
        <ul key={key++}>
          {items.map((item, idx) => (
            <li key={idx}>{parseInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Paragraph — collect until blank line or list/table/heading
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].match(/^[-*] /) &&
      !lines[i].trim().startsWith('|') &&
      !lines[i].startsWith('### ')
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      nodes.push(<p key={key++}>{parseInline(paraLines.join(' '))}</p>);
    }
  }

  return <>{nodes}</>;
}
