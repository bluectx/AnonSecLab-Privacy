import { describe, it, expect } from 'vitest';
import { PlainTextUrlsToHyperlinksConverter } from '@/presentation/components/Scripts/View/Tree/NodeContent/Markdown/Renderers/PlainTextUrlsToHyperlinksConverter';
import { renderMarkdownUsingRenderer } from './MarkdownRenderingTester';

describe('PlainTextUrlsToHyperlinksConverter', () => {
  describe('modify', () => {
    describe('retains original content where no conversion is required', () => {
      const testScenarios: ReadonlyArray<{
        readonly description: string;
        readonly markdownContent: string;
      }> = [
        {
          description: 'URLs within markdown link syntax',
          markdownContent: 'URL: [anonseclab.org](https://anonseclab.org).',
        },
        {
          description: 'URLs within inline code blocks',
          markdownContent: 'URL as code: `https://anonseclab.org`.',
        },
        {
          description: 'reference-style links',
          markdownContent: [
            'This content has reference-style link [1].',
            '[1]: https://anonseclab.org',
          ].join('\n'),
        },
      ];
      testScenarios.forEach(({ description, markdownContent }) => {
        it(description, () => {
          // arrange
          const expectedOutput = markdownContent; // No change expected

          // act
          const convertedContent = renderMarkdownUsingRenderer(
            PlainTextUrlsToHyperlinksConverter,
            markdownContent,
          );

          // assert
          expect(convertedContent).to.equal(expectedOutput);
        });
      });
    });
    describe('converts plain URLs into hyperlinks', () => {
      const testScenarios: ReadonlyArray<{
        readonly description: string;
        readonly urlText: string;
        readonly expectedLabel: string;
      }> = [
        {
          description: 'displays only domain name for URLs without path or query',
          urlText: 'https://anonseclab.org',
          expectedLabel: 'anonseclab.org',
        },
        {
          description: 'includes subdomains in labels',
          urlText: 'https://subdomain.anonseclab.org',
          expectedLabel: 'subdomain.anonseclab.org',
        },
        {
          description: 'includes longer URL segment in label',
          urlText: 'https://anonseclab.org/LongerExpectedPart/ShorterPart',
          expectedLabel: 'anonseclab.org - LongerExpectedPart',
        },
        {
          description: 'capitalizes first letter of URL path in label',
          urlText: 'https://anonseclab.org/capitalized',
          expectedLabel: 'anonseclab.org - Capitalized',
        },
        ...['-', '%20', '+'].map((urlSegmentDelimiter) => ({
          description: `parses \`${urlSegmentDelimiter}\` as a delimiter in URL`,
          urlText: `https://anonseclab.org/privacy${urlSegmentDelimiter}scripts`,
          expectedLabel: 'anonseclab.org - Privacy Scripts',
        })),
        {
          description: 'treats multiple spaces as single in URLs',
          urlText: 'https://anonseclab.org/word--with-multiple---spaces',
          expectedLabel: 'anonseclab.org - Word With Multiple Spaces',
        },
        {
          description: 'handles query parameters in URLs correctly',
          urlText: 'https://anonseclab.org/?query=parameter',
          expectedLabel: 'anonseclab.org - Parameter',
        },
        {
          description: 'truncates long hostnames to a readable length',
          urlText: 'https://averylongwebsitedomainnamethatexceedsthetypicalthreshold.com',
          expectedLabel: '…exceedsthetypicalthreshold.com',
        },
        {
          description: 'ignores purely numeric path segments in labels',
          urlText: 'https://anonseclab.org/20230302/expected',
          expectedLabel: 'anonseclab.org - Expected',
        },
        {
          description: 'ignores non-standard ports in labels',
          urlText: 'https://anonseclab.org:8080/configure',
          expectedLabel: 'anonseclab.org - Configure',
        },
        {
          description: 'removes common file extensions from labels',
          urlText: 'https://anonseclab.org/image.png',
          expectedLabel: 'anonseclab.org - Image',
        },
        {
          description: 'handles complex queries in URLs by selecting the most descriptive part',
          urlText: 'https://anonseclab.org/?product=123&name=PrivacyTool',
          expectedLabel: 'anonseclab.org - PrivacyTool',
        },
        {
          description: 'decodes special encoded characters in URLs for labels',
          urlText: 'https://anonseclab.org/privacy%2Fscripts',
          expectedLabel: 'anonseclab.org - Privacy/scripts',
        },
      ];
      testScenarios.forEach(({
        description, urlText, expectedLabel,
      }) => {
        it(description, () => {
          // arrange
          const markdown = `Visit ${urlText} now!`;
          const expectedOutput = `Visit [${expectedLabel}](${urlText}) now!`;
          // act
          const actualOutput = renderMarkdownUsingRenderer(
            PlainTextUrlsToHyperlinksConverter,
            markdown,
          );
          // assert
          expect(actualOutput).to.equal(expectedOutput);
        });
      });
    });
  });
});
