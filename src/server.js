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
          ${formatCategories(contact)}
          ${formatAddresses(contact)}
          ${formatEmails(contact)}
          ${formatSocialNetwork(contact)}
          ${formatNote(contact)}
          ${formatId(contact)}
        </div>
      </div>
      <hr/>
    `
    }).join('\n')
}

const formatAddresses = (contact) => {
    if (typeof contact.addresses === "undefined") {
        return "";
    }
    const result = contact.addresses.map(address => `<div class="address"><p>${address}</p></div>`).join('');
    return `
        <div class="addresses">
          <h2>Dirección</h2>
          ${result}
        </div>
        `
}

const formatCategories = (contact) => {
    if (typeof contact.categories === "undefined") {
        return "";
    }
    const result = contact.categories.map(category => `<div class="category"><p>${category}</p></div>`).join('');
    return `
        <div class="categories">
          <h2>Categoría</h2>
          ${result}
        </div>
        `
}

const formatDiscord = (contact) => {
    if (typeof contact.socialNetwork.discordAccounts === "undefined") {
        return "";
    }
    console.log(contact.socialNetwork.discordAccounts)
    const result = contact.socialNetwork.discordAccounts.map(discord =>
        `
        <div class="discord">
        ${typeof discord.alias === "undefined" ? "" : `<p>Alias</p>${formatValue(discord.alias, "alias")}`}
        ${typeof discord.discriminator === "undefined" ? "" : `<p>Discriminator</p>${formatValue(discord.discriminator, "discriminator")}`}
        ${typeof discord.globalName === "undefined" ? "" : `<p>Global name</p>${formatValue(discord.globalName, "global_name")}`}
        ${typeof discord.legacyUserName === "undefined" ? "" : `<p>Legacy user name</p>${formatValue(discord.legacyUserName, "legacy_user_name")}`}
        <p>User name</p>
        ${formatValue(discord.userName, "user_name")}
        </div>
        `
    ).join('<br>');
    console.log(result)
    return `
        <div class="discord_accounts">
          <h2>Discord</h2>
          ${result}
        </div>
        `
}

const formatEmails = (contact) => {
    if (typeof contact.emails === "undefined") {
        return "";
    }
    const result = contact.emails.map(email => formatValue(email, "email")).join('');
    return `
        <div class="emails">
          <h2>Email</h2>
          ${result}
        </div>
        `
}

const formatId = (contact) => {
    return `
        <div class="id">
          <h2>ID</h2>
          <p>${contact.id}</p>
        </div>
        `
}

const formatName = (contact) => {
    return typeof contact.surname === "undefined" ? `<h1>${contact.name}</h1>` : `<h1>${contact.name} ${contact.surname}</h1>`;
}

const formatNicknames = (contact) => {
    if (typeof contact.nicknames === "undefined") {
        return "";
    }
    const result = contact.nicknames.map(nickname => formatValue(nickname, "nickname")).join('');
    return `
        <div class="nicknames">
          <h2>Mote</h2>
          ${result}
        </div>
        `
}

const formatNote = (contact) => {
    if (typeof contact.note === "undefined") {
        return '';
    }
    return `
        <div class="note">
          <h2>Nota</h2>
          <p>${contact.note}</p>
        </div>
        `
}

const formatPhones = (contact) => {
    if (typeof contact.phones === "undefined") {
        return '';
    }
    const result = contact.phones.map(phone =>
        typeof phone.description === "undefined" ? formatValue(phone.number, "phone") : formatValue(`${phone.number} ${phone.description}`, "phone")
    ).join('');
    return `
        <div class="phones">
          <h2>Teléfono</h2>
          ${result}
        </div>
    `
}

const formatSocialNetwork = (contact) => {
    if (typeof contact.socialNetwork === "undefined") {
        return '';
    }
    return `
        <div class="social_network">
          ${formatDiscord(contact)}
        </div>
    `
}

const formatValue = (value, tag) => {
    return `<div class="${tag}"><p>${value}</p></div>`;
}
