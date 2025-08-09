import { IdeasService } from './ideas.service';

describe('IdeasService.buildDummySections', () => {
  it('returns three sections with correct keys, orders, and content', () => {
    const idea = 'awesome product';
    const sections = IdeasService.buildDummySections(idea);

    expect(sections).toHaveLength(3);

    expect(sections[0]).toMatchObject({
      key: 'hero',
      title: `Your ${idea}`,
      body: 'one-line tagline',
      order: 0,
    });

    expect(sections[1]).toMatchObject({
      key: 'about',
      title: 'About',
      body: `A short paragraph about ${idea}.`,
      order: 1,
    });

    expect(sections[2]).toMatchObject({
      key: 'contact',
      title: 'Contact',
      body: 'call-to-action line',
      order: 2,
    });
  });

  it('is deterministic for the same input', () => {
    const idea = 'same input idea';
    const a = IdeasService.buildDummySections(idea);
    const b = IdeasService.buildDummySections(idea);
    expect(a).toEqual(b);
  });
});


