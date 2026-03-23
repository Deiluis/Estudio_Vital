const fs = require('fs');
const projects = require('./projects/resumed.json');

const baseUrl = 'https://estudiovital.com';
const staticPages = ['', 'index.html'];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
    <url>
      <loc>${baseUrl}/${page}</loc>
      <priority>1.0</priority>
    </url>`).join('')}
  ${projects.map(project => `
    <url>
      <loc>${baseUrl}/obra/${project.name}</loc>
      <priority>0.8</priority>
    </url>`).join('')}
</urlset>`;

fs.writeFileSync('./sitemap.xml', sitemap);