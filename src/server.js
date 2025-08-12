import fs from 'node:fs/promises'
import http from 'node:http'

export const start = () => {
  const port = typeof process.env.FRONT_PORT === 'undefined' ? 5000 : process.env.FRONT_PORT;
  const server = createServer()
  server.listen(port, () => {
    const address = `http://localhost:${port}`
    console.log(`server on ${address}`);
  });
}

const createServer = (notes) => {
  return http.createServer(async (req, res) => {
    const HTML_PATH = new URL('./template.html', import.meta.url).pathname
    const template = await fs.readFile(HTML_PATH, 'utf-8')
    // TODO rm
    notes = [
      {
        "tags": [
          "work",
          "serious"
        ],
        "id": 1755026040571,
        "content": "clean my room"
      }
    ]
    const html = interpolate(template, {notes: formatNotes(notes)});
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
  });
}

const interpolate = (html, data) => {
  return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, placeholder) => {
    return data[placeholder] || '';
  });
}

const formatNotes = (notes) => {
  return notes.map(note => {
    return `
      <div class="note">
        <p>${note.content}</p>
        <div class="tags">
          ${note.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </div>
    `
  }).join('\n')
}
