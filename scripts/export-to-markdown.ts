import 'dotenv/config';
import { createClient } from 'newt-client-js';
import { type Article } from '../src/lib/newt';
import TurndownService from 'turndown';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Node.js環境用のNEWTクライアント
const newtClient = createClient({
  spaceUid: process.env.NEWT_SPACE_UID,
  token: process.env.NEWT_CDN_API_TOKEN,
  apiType: "cdn",
});

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

interface ExportOptions {
  outputDir?: string;
  includeImages?: boolean;
  batchSize?: number;
}

export class NewtMarkdownExporter {
  private turndown: TurndownService;
  private outputDir: string;

  constructor(options: ExportOptions = {}) {
    this.turndown = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    });
    this.outputDir = options.outputDir || './content/exported';
    
    // Ensure output directory exists
    if (!existsSync(this.outputDir)) {
      mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Convert HTML content to Markdown
   */
  private htmlToMarkdown(html: string): string {
    return this.turndown.turndown(html);
  }

  /**
   * Generate frontmatter for the article
   */
  private generateFrontmatter(article: Article): string {
    const frontmatter = {
      title: article.title,
      slug: article.slug,
      description: article.meta?.description || '',
      author: article.author || '',
      publishedAt: article.pDate,
      tags: article.tags?.map(tag => tag.name) || [],
      categories: article.categories || [],
      emoji: article.emoji?.value || '',
      thumbnail: article.thumbnail?.src || '',
      ogImage: article.meta?.ogImage?.src || '',
      url: article.url || '', // External URL if exists
    };

    const yamlFrontmatter = Object.entries(frontmatter)
      .filter(([_, value]) => value !== '' && value !== undefined && value !== null)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}: [${value.map(v => `"${v}"`).join(', ')}]`;
        }
        return `${key}: "${value}"`;
      })
      .join('\n');

    return `---\n${yamlFrontmatter}\n---\n\n`;
  }

  /**
   * Convert single article to Markdown file
   */
  private async convertArticleToMarkdown(article: Article): Promise<void> {
    // スラッグの検証とサニタイズ
    if (!article.slug || article.slug.trim() === '') {
      console.log(`⚠️ Skipping article with empty slug: ${article.title}`);
      return;
    }

    // ファイル名として不正な文字を除去
    const sanitizedSlug = article.slug.replace(/[<>:"/\\|?*]/g, '-');
    
    const frontmatter = this.generateFrontmatter(article);
    const markdownContent = this.htmlToMarkdown(article.body || '');
    const fullContent = frontmatter + markdownContent;

    const fileName = `${sanitizedSlug}.md`;
    const filePath = join(this.outputDir, fileName);

    try {
      writeFileSync(filePath, fullContent, 'utf-8');
      console.log(`✓ Exported: ${fileName}`);
    } catch (error) {
      console.error(`✗ Failed to export ${fileName}:`, error);
    }
  }

  /**
   * Fetch all articles from NEWT and convert to Markdown
   */
  async exportAllArticles(): Promise<void> {
    try {
      console.log('Fetching articles from NEWT...');
      
      const response = await newtClient.getContents({
        appUid: 'meBlog',
        modelUid: 'article',
        query: {
          select: [
            'title', 'slug', 'body', 'emoji', 'pDate', 'url', 'thumbnail', 'tags', 'meta', 'author', 'categories'
          ],
          order: ['-pDate'],
          limit: 1000, // Adjust as needed
        },
      });

      const articles = response.items as Article[];
      console.log(`Found ${articles.length} articles to export`);

      for (const article of articles) {
        await this.convertArticleToMarkdown(article);
      }

      console.log(`\n🎉 Successfully exported ${articles.length} articles to ${this.outputDir}`);
    } catch (error) {
      console.error('Error exporting articles:', error);
      throw error;
    }
  }

  /**
   * Export specific article by slug
   */
  async exportArticleBySlug(slug: string): Promise<void> {
    try {
      console.log(`Fetching article: ${slug}`);
      
      const response = await newtClient.getContents({
        appUid: 'meBlog',
        modelUid: 'article',
        query: {
          select: [
            'title', 'slug', 'body', 'emoji', 'pDate', 'url', 'thumbnail', 'tags', 'meta', 'author', 'categories'
          ],
          slug: slug,
        },
      });

      const articles = response.items as Article[];
      
      if (articles.length === 0) {
        console.log(`Article with slug "${slug}" not found`);
        return;
      }

      await this.convertArticleToMarkdown(articles[0]);
      console.log(`✓ Exported article: ${slug}`);
    } catch (error) {
      console.error(`Error exporting article ${slug}:`, error);
      throw error;
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const slug = args[1];

  const exporter = new NewtMarkdownExporter({
    outputDir: './content/exported',
  });

  try {
    switch (command) {
      case 'all':
        await exporter.exportAllArticles();
        break;
      case 'single':
        if (!slug) {
          console.error('Please provide a slug: npm run export-md single <slug>');
          process.exit(1);
        }
        await exporter.exportArticleBySlug(slug);
        break;
      default:
        console.log('Usage:');
        console.log('  npm run export-md all        # Export all articles');
        console.log('  npm run export-md single <slug>  # Export specific article');
        process.exit(1);
    }
  } catch (error) {
    console.error('Export failed:', error);
    process.exit(1);
  }
}

// ESモジュール環境でのmain実行
main();