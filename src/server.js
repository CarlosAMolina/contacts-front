import fs from 'node:fs/promises'
import http from 'node:http'

import { contacts } from './fake.js'  // TODO not use fake values

export const start = () => {
    const port = typeof process.env.FRONT_PORT === 'undefined' ? 5000 : process.env.FRONT_PORT;
    const server = createServer();
    server.listen(port, () => {
        const address = `http://localhost:${port}`
        console.log(`server on ${address}`);
    });
}

const createServer = () => {
    return http.createServer(async (req, res) => {
        const HTML_PATH = new URL('./template.html', import.meta.url).pathname;
        const template = await fs.readFile(HTML_PATH, 'utf-8');
        const html = interpolate(template, {contacts: formatContacts(contacts)});
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(html);
    });
}

const interpolate = (html, data) => {
    return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, placeholder) => {
        return data[placeholder] || '';
    });
}

const formatContacts = (contacts) => {
    return contacts.map(contact => {
        return `
      <div class="contact">
        <h1>${contact.name}</h1>
        <div class="data">
          ${formatPhones(contact)}
        </div>
      </div>
    `
    }).join('\n')
}

const formatPhones = (contact) => {
    if (contact.phones === null) {
        return '';
    }
    const result = contact.phones.map(phone =>
        phone.description === null ? `<div class="phone"> ${phone.number} </div>` : `<div class="phone"> ${phone.number} ${phone.description} </div>`
    ).join('');
    return `
        <div class="phones">
          <h2>Teléfono</h2>
          ${result}
        </div>
    `
}
