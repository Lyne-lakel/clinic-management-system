const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        // Regex to match git conflict markers and keep the HEAD portion.
        const conflictRegex = /<<<<<<< HEAD\r?\n([\s\S]*?)=======\r?\n[\s\S]*?>>>>>>> [0-9a-f]+\r?\n/g;
        
        if (conflictRegex.test(content)) {
            console.log("Fixing " + filePath);
            content = content.replace(conflictRegex, '$1');
            fs.writeFileSync(filePath, content, 'utf8');
        }
    } catch (e) {
        console.error("Failed to process " + filePath, e);
    }
}

function walk(dir) {
    let list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.resolve(dir, file);
        let stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('.next')) {
                walk(file);
            }
        } else {
            if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.json') || file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.css')) {
                processFile(file);
            }
        }
    });
}

walk(path.join(__dirname, 'frontend'));
