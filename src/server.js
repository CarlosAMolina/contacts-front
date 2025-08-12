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
        ${formatName(contact)}
        <div class="data">
          ${formatNicknames(contact)}
          ${formatPhones(contact)}
        </div>
      </div>
      <hr/>
    `
    }).join('\n')
}

const formatName = (contact) => {
    return typeof contact.surname === "undefined" ? `<h1>${contact.name}</h1>` : `<h1>${contact.name} ${contact.surname}</h1>`;
}

const formatNicknames = (contact) => {
    if (typeof contact.nicknames === "undefined") {
        return "";
    }
    const result = contact.nicknames.map(nickname => `<div class="nickname"><p>${nickname}</p></div>`).join('');
    return `
        <div class="nicknames">
          <h2>Mote</h2>
          ${result}
        </div>
        `
}

const formatPhones = (contact) => {
    if (typeof contact.phones === "undefined") {
        return '';
    }
    const result = contact.phones.map(phone =>
        typeof phone.description === "undefined" ? `<div class="phone">${phone.number}</div>` : `<div class="phone"><p>${phone.number} ${phone.description}</p></div>`
    ).join('');
    return `
        <div class="phones">
          <h2>Teléfono</h2>
          ${result}
        </div>
    `
}
