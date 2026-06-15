const fs = require('fs');
const path = require('path');
const os = require('os');

function isPremium() {
    try {
        const keyPath = path.join(os.homedir(), '.floatboard', 'license.key');
        if (!fs.existsSync(keyPath)) return false;
        
        const content = fs.readFileSync(keyPath, 'utf8').trim();
        let key = content;
        
        try {
            const data = JSON.parse(content);
            if (data && data.key) {
                key = data.key;
            }
        } catch (e) {
            // Fallback for old format
            if (typeof key === 'string' && key.length > 10) {
                const data = { email: '', key: key, activatedAt: new Date().toISOString() };
                fs.writeFileSync(keyPath, JSON.stringify(data, null, 2), 'utf8');
            }
        }
        
        return typeof key === 'string' && key.length > 10;
    } catch (error) {
        return false;
    }
}

function activateLicense(email, key) {
    if (!key) return false;
    try {
        const dirPath = path.join(os.homedir(), '.floatboard');
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        
        const data = {
            email: email ? email.trim() : '',
            key: key.trim(),
            activatedAt: new Date().toISOString()
        };
        
        fs.writeFileSync(path.join(dirPath, 'license.key'), JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error saving license:', error);
        return false;
    }
}

module.exports = { isPremium, activateLicense };
