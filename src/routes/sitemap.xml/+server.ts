export async function GET() {
	const pages = import.meta.glob('/src/routes/**/+page.svelte');
	const routes = Object.keys(pages)
		.map((x) => x.substring(11)) // remove /src/routes prefix
		.map((x) => x.substring(0, x.length - 13)) // remove /+page.svelte suffix
		.map((x) => x.replaceAll(/\/\(\w+\)/g, '')) // remove (groups)
		.filter((x) => !x.includes('[')) // filter out parameterized routes
		.sort();
	console.log(routes);
	const baseURL = 'https://emojistan.app';

	return new Response(
		`
    <?xml version="1.0" encoding="UTF-8" ?>
    <urlset
        xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="https://www.w3.org/1999/xhtml"
        xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
    >
        ${routes
					.map(
						(route) => `
        <url>
            <loc>${baseURL}${route}</loc>
            <lastmod>2023-06-14T07:48:09Z</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.8</priority>
        </url>
        `
					)
					.join('')}
    </urlset>`.trim(),
		{
			headers: {
				'Content-Type': 'application/xml',
			},
		}
	);
}
