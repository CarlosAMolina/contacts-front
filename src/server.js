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
    const config = {
        values: contact.addresses,
        tagSection: "addresses",
        tagValue: "address",
        title: "Dirección",
    }
    return formatArray(config);
}

// config = {
//     values: [],
//     tagSection: "",
//     tagValue: "",
//     title: "",
// }
const formatArray = (config) => {
    if (typeof config.values === "undefined") {
        return "";
    }
    const result = config.values.map(value => `<div class=${config.tagValue}><p>${value}</p></div>`).join('');
    return `
        <div class=${config.tagSection}>
          <h2>${config.title}</h2>
          ${result}
        </div>
        `
}

const formatCategories = (contact) => {
    const config = {
        values: contact.categories,
        tagSection: "categories",
        tagValue: "category",
        title: "Categoría",
    }
    return formatArray(config);
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
    const config = {
        values: contact.emails,
        tagSection: "emails",
        tagValue: "email",
        title: "Email",
    }
    return formatArray(config);
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
    const config = {
        values: contact.nicknames,
        tagSection: "nicknames",
        tagValue: "nickname",
        title: "Mote",
    }
    return formatArray(config);
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
