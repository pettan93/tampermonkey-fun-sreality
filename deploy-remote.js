#!/usr/bin/env node
'use strict';

// Deploys the bundled script to Cloudflare R2 object storage

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
    bucketName: 'tampermonkey-scripts',
    objectKey: 'sreality-enhance-remote.js',
    localFile: path.join(__dirname, 'build', 'cdn', 'sreality-enhance-remote.js'),
    contentType: 'application/javascript'
};

function deploy() {
    // Verify the file exists
    if (!fs.existsSync(config.localFile)) {
        console.error(`Error: Build file not found at ${config.localFile}`);
        console.error('Run "npm run build" first.');
        process.exit(1);
    }

    const r2Path = `${config.bucketName}/${config.objectKey}`;
    const command = [
        'npx wrangler r2 object put',
        r2Path,
        `--file=${config.localFile}`,
        `--content-type=${config.contentType}`
    ].join(' ');

    console.log(`Deploying to R2: ${r2Path}`);
    console.log(`Command: ${command}`);
    console.log('');

    try {
        execSync(command, { stdio: 'inherit' });
        console.log('');
        console.log('✓ Deployment successful!');
        console.log(`  Bucket: ${config.bucketName}`);
        console.log(`  Object: ${config.objectKey}`);
    } catch (error) {
        console.error('✗ Deployment failed');
        process.exit(1);
    }
}

deploy();

