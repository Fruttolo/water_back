import fs from 'fs';

const filePath = '../myapp/src/migration/';
const timestamp = Date.now();

const fileName = filePath + `${timestamp}.sql`;
const content = ` -- SQL commands go here`;

fs.writeFile(fileName, content, (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`File ${filePath} created successfully.`);
});


