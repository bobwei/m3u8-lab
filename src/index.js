/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import path from 'path';
import m3u8stream from 'm3u8stream';
import ora from 'ora';
import bytes from 'bytes';

const fn = input => {
  const spinner = ora('Loading...').start();
  let totalDataLength = 0;
  const promises = input.map((data, i) => {
    const { url, name = i.toString() } = data;
    return new Promise(resolve => {
      const outputPath = path.join('./dist', `${name}.mp4`);
      console.log(`loading ${url} into ${outputPath}`);
      m3u8stream(url)
        .on('data', chunk => {
          totalDataLength += chunk.length;
          const displayBytes = bytes(totalDataLength);
          spinner.text = `${displayBytes} loaded.`;
        })
        .pipe(fs.createWriteStream(outputPath))
        .on('end', () => resolve());
    });
  });
  return Promise.all(promises).then(() => spinner.succeed());
};

export default fn;

if (require.main === module) {
  const input = require('@dist/input.json');
  fn(input);
}
