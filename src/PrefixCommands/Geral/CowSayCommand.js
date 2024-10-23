import PrefixCommands from '../../Structure/PrefixCommands.js';

const cowAscii =
  "\\  ^__^\n \\ (oo)\\_______\n   (__)\\        )\\/\\\n       ||---w- |\n       ||     ||";

const makeSpeech = (text, cow) => {
    const cowlines = cow.split("\n");
    const length = Math.min(text.length, 25);
    let result = ` _${"_".repeat(length)}_ \n`;
    
    const lines = splitText(text, length);
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let beginChar = "|";
        let endChar = "|";
        
        if (i === 0) {
            beginChar = lines.length === 1 ? "<" : "/";
            endChar = lines.length === 1 ? ">" : "\\";
        } else if (i === lines.length - 1) {
            beginChar = "\\";
            endChar = "/";
        }
        
        const lineLength = line.length;
        const pad = length - lineLength;
        result += `${beginChar} ${line}${" ".repeat(pad)} ${endChar}\n`;
    }
    
    result += ` -${"-".repeat(length)}- \n`;
    
    for (let i = 0; i < cowlines.length; i++) {
        const line = cowlines[i];
        result += " ".repeat(length + 4) + line + "\n";
    }
    
    return result;
}

const splitText = (text, maxLength) => {
    return text.split("\n").reduce((lines, line) => {
        const sanitizedLine = line.replace(/[\0\b\t\v\r`]/g, '');
        const chunks = [];
        for (let i = 0; i < sanitizedLine.length; i += maxLength) {
            chunks.push(sanitizedLine.slice(i, i + maxLength));
        }
        return lines.concat(chunks);
    }, []);
}

export default class extends PrefixCommands {
    constructor(client) {
        super(client, {
            name: 'cowsay',
            messageDelete: true
        });
    }
    run = (message, args) => {
        const query = args.join(' ');
        if (!query) return;

        message.channel.send(`\`\`\`${makeSpeech(query, cowAscii)}\`\`\``);
    }
}
