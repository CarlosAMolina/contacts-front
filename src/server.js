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
        ${formatImage(contact)}
        <div class="data">
          ${formatNicknames(contact)}
          ${formatPhones(contact)}
          ${formatCategories(contact)}
          ${formatAddresses(contact)}
          ${formatEmails(contact)}
          ${formatUrls(contact)}
          ${formatSocialNetwork(contact)}
          ${formatNote(contact)}
          ${formatId(contact)}
        </div>
      </div>
    `
    }).join('\n')
}

const formatAddresses = (contact) => {
    const config = {
        values: contact.addresses,
        tag: "addresses",
        title: "Dirección",
    }
    return formatArray(config);
}

// config = {
//     values: [],
//     tag: "",
//     title: "",
// }
const formatArray = (config) => {
    if (typeof config.values === "undefined") {
        return "";
    }
    const result = config.values.map(value => `<li>${value}</li>`).join('\n');
    return `
        <div class=${config.tag}>
          <h3>${config.title}</h3>
          <ul>
            ${result}
          </ul>
        </div>
        `
}

const formatCategories = (contact) => {
    const config = {
        values: contact.categories,
        tag: "categories",
        title: "Categoría",
    }
    return formatArray(config);
}

const formatDiscord = (contact) => {
    if (typeof contact.socialNetwork.discordAccounts === "undefined") {
        return "";
    }
    const result = contact.socialNetwork.discordAccounts.map(discord =>
        `
        <div class="discord">
        <ul>
          ${typeof discord.alias === "undefined" ? "" : `<li>Alias: ${discord.alias}</li>`}
          ${typeof discord.discriminator === "undefined" ? "" : `<li>Discriminator: ${discord.discriminator}</li>`}
          ${typeof discord.globalName === "undefined" ? "" : `<li>Global name: ${discord.globalName}</li>`}
          ${typeof discord.legacyUserName === "undefined" ? "" : `<li>Legacy user name: ${discord.legacyUserName}</li>`}
          <li>User name: ${discord.userName}</li>
        </ul>
        </div>
        `
    ).join('');
    return `
        <div class="discord-accounts">
          <h3>Discord</h3>
          ${result}
        </div>
        `
}

const formatEmails = (contact) => {
    const config = {
        values: contact.emails,
        tag: "emails",
        title: "Email",
    }
    return formatArray(config);
}

const formatFacebook = (contact) => {
    const config = {
        values: contact.socialNetwork.facebookAccounts,
        tag: "facebook-accounts",
        title: "Facebook",
    }
    return formatArray(config);
}

const formatGithub = (contact) => {
    const config = {
        values: contact.socialNetwork.githubAccounts,
        tag: "github-accounts",
        title: "GitHub",
    }
    return formatArray(config);
}

const formatId = (contact) => {
    return `
        <div class="id">
          <span class="title">ID</span>: <span>${contact.id}</span>
        </div>
        `
}

const formatImage = (contact) => {
    const imageName = `${contact.id} ${getNameAndSurname(contact).toLowerCase()}`.replace(/\s+/g, "-");
    return `
        <div class="image">
          <img src="./images/${imageName}.jpg" width="200" height="200"/>
        </div>
        `
}

const formatInstagram = (contact) => {
    const config = {
        values: contact.socialNetwork.instagramAccounts,
        tag: "instagram-accounts",
        title: "Instagram",
    }
    return formatArray(config);
}

const formatLinkedin = (contact) => {
    const config = {
        values: contact.socialNetwork.linkedinAccounts,
        tag: "linkedin-accounts",
        title: "Linkedin",
    }
    return formatArray(config);
}

const formatName = (contact) => {
    return `<h2>${getNameAndSurname(contact)}</h2>`;
}

const formatNicknames = (contact) => {
    const config = {
        values: contact.nicknames,
        tag: "nicknames",
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
          <h3>Nota</h3>
          <p>${contact.note}</p>
        </div>
        `
}

const formatPhones = (contact) => {
    if (typeof contact.phones === "undefined") {
        return '';
    }
    const result = contact.phones.map(phone =>
        typeof phone.description === "undefined" ? `<li>${phone.number}</li>` : `<li>${phone.description}: ${phone.number}</li>`
    ).join('');
    return `
        <div class="phones">
          <h3>Teléfono</h3>
          <ul>
            ${result}
          </ul>
        </div>
    `
}

const formatSocialNetwork = (contact) => {
    if (typeof contact.socialNetwork === "undefined") {
        return '';
    }
    return `
        <div class="social-network">
          ${formatDiscord(contact)}
          ${formatFacebook(contact)}
          ${formatGithub(contact)}
          ${formatInstagram(contact)}
          ${formatLinkedin(contact)}
          ${formatTelegram(contact)}
          ${formatTiktok(contact)}
          ${formatTwitter(contact)}
          ${formatWallapop(contact)}
        </div>
    `
}

const formatTelegram = (contact) => {
    const config = {
        values: contact.socialNetwork.telegramAccounts,
        tag: "telegram-accounts",
        title: "Telegram",
    }
    return formatArray(config);
}

const formatTiktok = (contact) => {
    const config = {
        values: contact.socialNetwork.tiktokAccounts,
        tag: "tiktok-accounts",
        title: "Tiktok",
    }
    return formatArray(config);
}

const formatTwitter = (contact) => {
    const config = {
        values: contact.socialNetwork.twitterAccounts,
        tag: "twitter-accounts",
        title: "Twitter",
    }
    return formatArray(config);
}

const formatUrls = (contact) => {
    const config = {
        values: contact.urls,
        tag: "urls",
        title: "Url",
    }
    return formatArray(config);
}

const formatValue = (value, tag) => {
    return `<div class="${tag}"><p>${value}</p></div>`;
}

const formatWallapop = (contact) => {
    if (typeof contact.socialNetwork.wallapopAccounts === "undefined") {
        return "";
    }
    const result = contact.socialNetwork.wallapopAccounts.map(wallapop =>
        `
        <div class="wallapop">
        <p>URL</p>${formatValue(wallapop.url, "wallapop-url")}
        ${typeof wallapop.note === "undefined" ? "" : `<p>Nota</p>${formatValue(wallapop.note, "wallapop-note")}`}
        </div>
        `
    ).join('<br>');
    return `
        <div class="wallapop-accounts">
          <h3>Wallapop</h3>
          ${result}
        </div>
        `
}

const getNameAndSurname = (contact) => {
    return typeof contact.surname === "undefined" ? contact.name : `${contact.name} ${contact.surname}`;
}
