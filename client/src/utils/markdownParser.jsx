import React from 'react';

export function parseMarkdown(markdown) {
  if (typeof markdown !== 'string') return null;

  const lines = markdown.split('\n');
  const elements = [];
  let listItems = [];
  let inList = false;
  let inOrderedList = false;
  let inCodeBlock = false;
  let codeLines = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Start or end of multi-line code block
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${index}`} style={{
            background: '#111827',
            color: '#ffffff',
            padding: '1rem',
            borderRadius: '8px',
            overflowX: 'auto',
            fontSize: '0.875rem'
          }}>
            <code>{codeLines.join('\n')}</code>
          </pre>
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    // Close lists on empty line
    if (trimmed === '') {
      if (inList) {
        elements.push(<ul key={`ul-${index}`}>{listItems}</ul>);
        listItems = [];
        inList = false;
      } else if (inOrderedList) {
        elements.push(<ol key={`ol-${index}`}>{listItems}</ol>);
        listItems = [];
        inOrderedList = false;
      }
      return;
    }

    // Headings
    const headingMatch = /^(#{1,3})\s+(.*)$/.exec(trimmed);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const Tag = `h${level}`;
      elements.push(<Tag key={`h-${index}`}>{inlineMarkdown(text)}</Tag>);
      return;
    }

    // Unordered List
    if (trimmed.startsWith('- ')) {
      listItems.push(<li key={`li-${index}`}>{inlineMarkdown(trimmed.slice(2))}</li>);
      inList = true;
      return;
    }

    // Ordered List
    const orderedMatch = /^\d+\.\s+(.*)/.exec(trimmed);
    if (orderedMatch) {
      listItems.push(<li key={`oli-${index}`}>{inlineMarkdown(orderedMatch[1])}</li>);
      inOrderedList = true;
      return;
    }

    // Close lists before paragraph
    if (inList) {
      elements.push(<ul key={`ul-${index}`}>{listItems}</ul>);
      listItems = [];
      inList = false;
    }
    if (inOrderedList) {
      elements.push(<ol key={`ol-${index}`}>{listItems}</ol>);
      listItems = [];
      inOrderedList = false;
    }

    // Paragraph
    elements.push(<p key={`p-${index}`}>{inlineMarkdown(trimmed)}</p>);
  });

  // Close any open list at the end
  if (inList) elements.push(<ul key="ul-last">{listItems}</ul>);
  if (inOrderedList) elements.push(<ol key="ol-last">{listItems}</ol>);

  return elements;
}

function inlineMarkdown(text) {
  const parts = [];
  let lastIndex = 0;
  let key = 0;

  const regex = /!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`/g;

  let match;
  while ((match = regex.exec(text)) !== null) {
    const before = text.slice(lastIndex, match.index);
    if (before) parts.push(<span key={key++}>{before}</span>);

    if (match[1] && match[2]) {
      // Image
      parts.push(
        <img
          key={key++}
          src={match[2].replace(/ /g, '%20')}
          alt={match[1]}
          style={{ maxWidth: '100%', maxHeight: '300px' }}
        />
      );
    } else if (match[3] && match[4]) {
      // Link
      parts.push(
        <a
          key={key++}
          href={match[4]}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#2563eb', textDecoration: 'underline' }}
        >
          {match[3]}
        </a>
      );
    } else if (match[5]) {
      // Bold
      parts.push(<strong key={key++}>{match[5]}</strong>);
    } else if (match[6]) {
      // Italic
      parts.push(<em key={key++}>{match[6]}</em>);
    } else if (match[7]) {
      // Inline code
      parts.push(
        <code
          key={key++}
          style={{
            background: '#f3f4f6',
            padding: '2px 4px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '0.9em',
          }}
        >
          {match[7]}
        </code>
      );
    }

    lastIndex = regex.lastIndex;
  }

  const rest = text.slice(lastIndex);
  if (rest) parts.push(<span key={key++}>{rest}</span>);

  return parts;
}
