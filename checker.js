const whois = require('whois');
const tlds = require('./tlds.json');
const fs = require('fs');

class Checker {
    constructor({ keyword, saveAvailable }) {
        this.keyword = keyword;
        this.saveAvailable = saveAvailable;
        this.checked = {
            available: [],
            unavailable: [],
        };
    }

    check() {
        console.clear();

        let completed = 0;

        for (const tld of tlds) {
            try {
                whois.lookup(`${this.keyword}${tld}`, (err, data) => {
                    completed += 1;

                    if (completed === tlds.length) {
                        console.clear();
                        console.log(`Checking completed, there are ${this.checked.available.length} available domains.`);
                        console.log(`\nAvailable Domains:\n${this.checked.available.join('\n')}`);
                        console.log(`\nUnavailable Domains:\n${this.checked.unavailable.join('\n')}`);

                        if (this.saveAvailable) fs.writeFile('available.txt', this.checked.available.join('\n'), (err) => {
                            if (err) throw err;
                            console.log('\n+ The available domains have been saved to available.txt');
                        });

                        return;
                    }

                    if (err || !data) return;

                    const notFound = data.startsWith('Domain not found.') || data.startsWith(`No match for domain "${this.keyword.toUpperCase()}${this.keyword.toUpperCase()}"`) || data.startsWith(`Domain '${this.keyword}${tld}' not found`);

                    if (notFound) {
                        this.checked.available.push(`${this.keyword + tld} - https://www.namecheap.com/domains/registration/results/?domain=${this.keyword + tld}`);
                        console.log(`+ ${this.keyword}${tld} is available.`);
                    } else {
                        this.checked.unavailable.push(this.keyword + tld);
                        console.log(`- ${this.keyword}${tld} is NOT available.`);
                    }
                });
            } catch (err) {}
        }
    }
}

module.exports = Checker;
