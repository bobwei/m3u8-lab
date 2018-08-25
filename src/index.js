/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import path from 'path';
import m3u8stream from 'm3u8stream';

const fn = input => {
  const promises = input.map((data, i) => {
    const { url, name = i.toString() } = data;
    return new Promise(resolve => {
      const outputPath = path.join('./dist', `${name}.mp4`);
      console.log(`loading ${url} into ${outputPath}`);
      m3u8stream(url)
        .pipe(fs.createWriteStream(outputPath))
        .on('end', () => resolve());
    });
  });
  return Promise.all(promises);
};

export default fn;

if (require.main === module) {
  const input = require('@dist/input.json');
  fn(input);
}
