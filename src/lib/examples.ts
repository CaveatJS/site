export type ExamplePost = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  paragraphs: string[];
};
export type PublicationExample = {
  slug: string;
  name: string;
  category: string;
  author: string;
  credit?: string;
  headline: string;
  description: string;
  design: string;
  font: string;
  background: string;
  ink: string;
  muted: string;
  surface: string;
  line: string;
  accent: string;
  posts: ExamplePost[];
};

export const publicationExamples: PublicationExample[] = [
  {
    slug: "field-notes",
    name: "Field Notes",
    category: "Personal essays",
    author: "Alex Morgan",
    headline: "Pay attention to the small things.",
    description:
      "Letters about walking slowly, noticing more, and making a little room for wonder.",
    design:
      "An unhurried journal. Newsreader, soft green paper, generous margins, and a single column of stories.",
    font: "newsreader",
    background: "#f4f6ed",
    ink: "#293e30",
    muted: "#63725d",
    surface: "#e8edd9",
    line: "#d6dfcb",
    accent: "#42613d",
    posts: [
      {
        slug: "the-long-way-home",
        title: "The long way home",
        category: "Noticing",
        excerpt:
          "A familiar street looks different when you stop trying to get somewhere.",
        paragraphs: [
          "On Tuesday I took the street behind the station. It adds ten minutes to the walk home, which is usually enough reason to avoid it. This time there was no train to catch, no call to make, and no useful excuse to hurry.",
          "Someone had put a chair outside a repair shop. A dog was asleep under it. The afternoon light caught a row of mismatched windows, and for a moment the whole street looked as though it had been waiting to be noticed.",
          "I arrived home with nothing to show for the extra ten minutes. That was rather the point. Some parts of a day can belong to you without becoming an achievement.",
        ],
      },
      {
        slug: "a-notebook-for-unfinished-things",
        title: "A notebook for unfinished things",
        category: "Keeping",
        excerpt:
          "There is something freeing about a page that does not expect a conclusion.",
        paragraphs: [
          "The first page of my new notebook contains half a sentence. For a week I wanted to cross it out. It seemed like a poor introduction to all those clean pages.",
          "Then I wrote a shopping list beneath it, followed by a line from a conversation I did not want to forget. The notebook became useful the moment it stopped trying to be impressive.",
          "I am keeping it that way: room for ideas before they know what they are. A place to return to, rather than a thing to finish.",
        ],
      },
      {
        slug: "the-hour-before-everyone-wakes",
        title: "The hour before everyone wakes",
        category: "Rituals",
        excerpt: "Tea, an open window, and a little time without a plan.",
        paragraphs: [
          "The kettle is the loudest thing in the kitchen. Beyond the window, a delivery bicycle slips down the street. The day has started, but it has not yet asked anything of me.",
          "I used to fill this hour with things I could count. Now I leave a book on the table and see how far I get. Sometimes it is three pages. Sometimes I never open it.",
          "A quiet routine is still a routine. It gives the morning somewhere to begin.",
        ],
      },
    ],
  },
  {
    slug: "signal",
    name: "Signal",
    category: "Technology & making",
    author: "Sam Okafor",
    headline: "Build things. Write down what you learn.",
    description:
      "A working journal of useful software, small experiments, and the decisions behind them.",
    design:
      "A dark studio notebook. DM Sans, an ice-blue accent, a large lead story, and a compact grid of experiments.",
    font: "dm-sans",
    background: "#142731",
    ink: "#e5eef1",
    muted: "#b0c2ca",
    surface: "#1d3541",
    line: "#36515e",
    accent: "#8ad3e8",
    posts: [
      {
        slug: "a-feature-small-enough-to-finish",
        title: "A feature small enough to finish",
        category: "Build log",
        excerpt:
          "The first useful version was a button, a receipt, and a way back.",
        paragraphs: [
          "The sketch had six panels. The first release had one. We wanted to help people find a document they had just uploaded, and most of the interface had very little to do with that job.",
          "So we kept the upload button, showed a clear receipt, and gave the document a permanent link. That left us enough time to make the error messages useful and the keyboard path predictable.",
          "The smaller version taught us more because people actually used it. The next feature came from watching where they hesitated, rather than adding another panel from the sketch.",
        ],
      },
      {
        slug: "the-boring-part-is-the-product",
        title: "The boring part is the product",
        category: "Design decisions",
        excerpt:
          "A saved draft and a helpful error message are features worth caring about.",
        paragraphs: [
          "Nobody mentioned the save indicator in the first demo. They noticed it immediately when it stopped working. There is a whole category of product work that becomes visible only through its absence.",
          "This week we spent our time on that category: keeping text after a failed request, explaining what happened, and making a retry safe. The screenshots looked almost identical.",
          "The experience was different. People could trust the page enough to stop thinking about the page. That is a result worth shipping.",
        ],
      },
      {
        slug: "leave-a-map-for-the-next-person",
        title: "Leave a map for the next person",
        category: "Practice",
        excerpt:
          "A short README can be the most useful thing you ship this afternoon.",
        paragraphs: [
          "Before closing the project, I wrote down how to start it, where the data lives, and which command checks the build. It took less time than remembering those things had taken me that morning.",
          "Documentation does not have to explain the entire system. Sometimes it only needs to get the next person to a working page, with enough context to make their first change.",
          "The next person may be you in three weeks. Leave them a friendly introduction.",
        ],
      },
    ],
  },
  {
    slug: "sunday-table",
    name: "Sunday Table",
    category: "Food & everyday life",
    author: "Mia Daniels",
    headline: "Good food. A few friends. Nothing fancy.",
    description:
      "Notes from a well-used kitchen, for people who think the best part of dinner is staying at the table.",
    design:
      "A cheerful kitchen journal. Playfair Display, butter-yellow paper, berry-red accents, and round-edged story cards.",
    font: "playfair",
    background: "#fff5cf",
    ink: "#5b2835",
    muted: "#7c5354",
    surface: "#f5e5b5",
    line: "#e6ce96",
    accent: "#9c304a",
    posts: [
      {
        slug: "set-one-more-place",
        title: "Set one more place",
        category: "Around the table",
        excerpt: "An extra plate is sometimes the only plan you need.",
        paragraphs: [
          "The table was set for four when a friend called from the corner. We found another chair, moved the flowers to the windowsill, and cut the bread into slightly thinner slices.",
          "Dinner did not become more elaborate. It became longer. Someone made tea, someone found a record, and a conversation that began over the first bowl was still going when we cleared the last plate.",
          "I am trying to remember that feeling when I worry about hosting. A generous evening can start with what is already in the kitchen.",
        ],
      },
      {
        slug: "a-love-letter-to-the-market-bag",
        title: "A love letter to the market bag",
        category: "Good ingredients",
        excerpt:
          "A bunch of herbs, a bruised tomato, and the beginning of dinner.",
        paragraphs: [
          "My market bag has a pocket that always contains a loose onion skin. I empty it every week. Every week the onion skin returns, along with the smell of whatever herbs looked good that morning.",
          "Shopping without an exact list has become a small exercise in paying attention. What smells inviting? What would make a good lunch? What can I use before it is forgotten at the back of the fridge?",
          "The bag rarely contains a perfect menu. Usually it contains enough for a beginning, and that is a pleasant thing to bring home.",
        ],
      },
      {
        slug: "the-recipes-in-the-margins",
        title: "The recipes in the margins",
        category: "Kitchen notes",
        excerpt: "The most useful line in an old cookbook was added in pencil.",
        paragraphs: [
          "Beside a carefully printed recipe, my grandmother had written: use the bigger bowl. No story, no explanation. Just a piece of practical advice that must have followed an afternoon of washing the counter.",
          "Other pages carry different instructions. Less sugar next time. Good with pears. Ask your sister about the pan. The book becomes a conversation when you read the handwriting.",
          "I have started adding my own notes. Not corrections, exactly. More like little messages from one dinner to the next.",
        ],
      },
    ],
  },
  {
    slug: "off-script",
    name: "Off Script",
    category: "Art & culture",
    author: "Leah Chen",
    headline: "Good work asks better questions.",
    description:
      "An independent notebook on exhibitions, objects, and the ideas that follow us home.",
    design:
      "A playful culture magazine. Syne, lilac paper, plum ink, oversized headlines, and an asymmetric two-column story layout.",
    font: "syne",
    background: "#eee9fa",
    ink: "#39254d",
    muted: "#655375",
    surface: "#e1d6f3",
    line: "#c5b7db",
    accent: "#7041ab",
    posts: [
      {
        slug: "the-room-between-the-works",
        title: "The room between the works",
        category: "Looking",
        excerpt:
          "Sometimes the most interesting part of an exhibition is where nothing is hanging.",
        paragraphs: [
          "I went back to the small gallery on a quiet afternoon. Without the opening-night crowd, the space between two paintings seemed much larger. It gave each work time to become something other than a photograph on a phone.",
          "The curator had left an entire wall empty. From a bench opposite, you could see a doorway, the edge of a frame, and daylight moving across the floor. It felt less like an omission than an invitation to take your time.",
          "I stayed until the light reached the bench. The visit left me thinking about what we leave out of our own work, and whether we leave enough room for someone else to enter it.",
        ],
      },
      {
        slug: "a-poster-worth-keeping",
        title: "A poster worth keeping",
        category: "Objects",
        excerpt:
          "A single sheet of paper that outlived the event it was made for.",
        paragraphs: [
          "The concert poster has moved house with me three times. I no longer remember every song from the evening, but I remember stopping in the street because of the shape of its lettering.",
          "It was printed in two colours on ordinary paper. The designer had let one enormous word run almost beyond the edge. Everything else was small enough to reward a second look.",
          "Good everyday design has a way of becoming personal. What began as an announcement is now a small record of a particular place, a particular year, and the person I was when I brought it home.",
        ],
      },
      {
        slug: "learning-to-look-again",
        title: "Learning to look again",
        category: "Studio notes",
        excerpt:
          "An afternoon drawing the same cup without trying to improve it.",
        paragraphs: [
          "Our drawing exercise was wonderfully uneventful: choose an object, draw it, turn the page, and draw it again. I chose the cup beside my notebook.",
          "By the fourth attempt, I had stopped drawing the cup I expected to see. The handle was lower. The rim was uneven. A tiny shadow did more work than the careful outline I had started with.",
          "None of the drawings needed to be framed. They were a way of finding out how much attention an ordinary object could hold.",
        ],
      },
    ],
  },
  {
    slug: "common-ground",
    name: "Common Ground",
    category: "Community & local life",
    author: "Rory Williams",
    headline: "A little closer to where we live.",
    description:
      "Stories from the streets, shared spaces, and familiar faces that make a neighbourhood.",
    design:
      "A welcoming neighbourhood bulletin. Figtree, pale aqua, deep teal, an offset introduction, and clear story rows with generous spacing.",
    font: "figtree",
    background: "#e9f5f3",
    ink: "#173b3c",
    muted: "#496c6c",
    surface: "#d3e8e3",
    line: "#accfca",
    accent: "#19625e",
    posts: [
      {
        slug: "a-bench-with-a-view",
        title: "A bench with a view",
        category: "Shared spaces",
        excerpt:
          "The smallest change to the square gave people a reason to stay.",
        paragraphs: [
          "For years, everyone crossed the little square on their way somewhere else. Then a neighbour brought a bench to the Saturday clean-up and asked if we could find it a home.",
          "We put it beneath the tree, facing the shops. By lunchtime someone was eating a sandwich there. The following week two people had brought a flask of tea.",
          "There is no grand conclusion to the story. The bench is still there, and the square has become a place where it is normal to pause. Sometimes that is what a useful improvement looks like.",
        ],
      },
      {
        slug: "the-saturday-repair-table",
        title: "The Saturday repair table",
        category: "Neighbours",
        excerpt:
          "A loose chair leg, a borrowed screwdriver, and a conversation.",
        paragraphs: [
          "The sign said bring something small enough to carry. People arrived with a lamp, a wobbly stool, a jacket with a broken zip, and very different ideas about what might be possible.",
          "Nobody at the table could fix everything. They could usually help someone work out what was wrong, and there was a surprising amount of satisfaction in simply understanding the problem.",
          "We left with two working lamps, one steadier chair, and a list of tools to bring next time. The best part may have been learning who on the street knew how to sew.",
        ],
      },
      {
        slug: "a-map-made-of-stories",
        title: "A map made of stories",
        category: "Walking",
        excerpt:
          "Ask three neighbours for directions and you will learn more than the route.",
        paragraphs: [
          "We set out to make a walking map for newcomers. The first version had street names, crossings, and the nearest bus stop. It was perfectly accurate and rather quiet.",
          "Then we asked people what they would point out on the way. A tree planted for a birthday. The bakery door that used to be blue. A stretch of pavement where someone always leaves water for dogs.",
          "We kept the practical directions and added a few of the stories. Now the map can get you to the library, with a little more to notice along the way.",
        ],
      },
    ],
  },
  {
    slug: "after-hours",
    name: "After Hours",
    category: "Music & listening",
    author: "Nina Patel",
    headline: "Put something on. Stay a while.",
    description:
      "Letters about records, late-night listening, and songs that find us at the right moment.",
    design:
      "An intimate listening journal. Cormorant Garamond, aubergine paper, a soft peach accent, a centred masthead, and a playlist-like archive.",
    font: "cormorant-garamond",
    background: "#302635",
    ink: "#f2e9ed",
    muted: "#c5b7c6",
    surface: "#403245",
    line: "#675164",
    accent: "#edb187",
    posts: [
      {
        slug: "listening-to-the-whole-side",
        title: "Listening to the whole side",
        category: "Listening notes",
        excerpt: "Letting a record choose the pace of an evening.",
        paragraphs: [
          "I had been skipping between songs all week. On Friday I put on a record, moved the phone out of reach, and let the first side play while I made dinner.",
          "A track I usually passed over became the centre of the evening. In the company of the songs around it, its slower opening made sense. I had been asking every song to introduce itself at once.",
          "When the side ended, I left the room quiet for a minute before turning it over. It was a small change in how I listened, but it made the music feel less like something happening behind the rest of my life.",
        ],
      },
      {
        slug: "the-record-shop-conversation",
        title: "The record-shop conversation",
        category: "Out in the world",
        excerpt: "A recommendation that began with a question about the drums.",
        paragraphs: [
          "The shop was playing something I did not know. I asked the person behind the counter about the drummer, and they pulled two other records from a shelf.",
          "We listened to a few minutes of each. The conversation wandered from a particular cymbal sound to a venue that had closed, then to the first concert either of us had attended alone.",
          "I bought one of the records and wrote the others down. A good recommendation gives you somewhere to begin. A good conversation makes you curious about how someone else hears.",
        ],
      },
      {
        slug: "songs-for-the-last-train",
        title: "Songs for the last train",
        category: "Small rituals",
        excerpt:
          "A familiar journey, heard through a different set of headphones.",
        paragraphs: [
          "The last train has its own rhythm: doors, an announcement, a brief acceleration, then the steady sound of the carriage. I have started choosing music that leaves room for it.",
          "Some evenings that means a piano. Other nights it is a voice I know well enough that I do not have to follow every word. The window does most of the entertaining.",
          "By the time I reach my stop, the day has usually loosened its grip. I take the headphones off for the walk home and let the street finish the journey.",
        ],
      },
    ],
  },
];

export function getExample(slug: string) {
  return publicationExamples.find((example) => example.slug === slug);
}

export type DesignBrief = {
  name?: string;
  author?: string;
  brief?: string;
  existing?: boolean;
};

export function designPrompt(
  example?: PublicationExample,
  details: DesignBrief = {},
) {
  return `Build a newsletter using Caveat${example ? `, with the visual direction of the ${example.name} example` : ", with an original design based on my brief"}.

WHAT I WANT
${details.existing ? "I already have a Caveat site. Customise that project." : "I am starting a new Caveat publication."}
${details.name?.trim() ? `Publication name: ${details.name.trim()}` : "Keep my existing publication name, or ask me for one during setup."}
${details.author?.trim() ? `Author name: ${details.author.trim()}` : "Keep my existing author name, or ask me for it during setup."}
${details.brief?.trim() ? `My design brief: ${details.brief.trim()}` : "Use the reference design as a starting point and keep the result easy to read."}

SCOPE
Customise the public website's layout, typography, colour palette, spacing, and branding. Use my supplied name and author, not the example's fictional identity. Keep the dashboard, authentication, database behaviour, and email sending intact. This is a request to build and preview code; do not deploy or send email automatically.

START WITH THE OFFICIAL INITIALIZER
Use Node.js 22.12 or newer. In a fresh workspace, run:
npm create caveat@latest my-newsletter
cd my-newsletter
npm run dev

If a Caveat project already exists here, work inside it and preserve its content. Keep Caveat as the application foundation. Before customising, check the installed version and its README. If the installed release lacks the Prisma publication dashboard described below, report the version mismatch so we can update the template release.

${example ? `Design: ${example.design}\nColours: background ${example.background}, text ${example.ink}, muted text ${example.muted}, surface ${example.surface}, borders ${example.line}, accent ${example.accent}.\nReading font: ${example.font}. Treat my design brief as changes to this reference.` : "Create a cohesive design from my brief. Suggest a readable typeface from Caveat's font catalogue, a colour palette, and a layout before implementing them. If the brief is empty, ask me about my subject and preferred visual direction."}

The Caveat publication uses Next.js App Router, React, TypeScript, Prisma Postgres, Better Auth, Resend, and plain CSS. Start with src/themes/custom.css and its public website tokens. For layout changes, edit src/components/publication.tsx, src/app/page.tsx, src/app/p/[slug]/page.tsx, src/app/archive/page.tsx, and src/app/about/page.tsx.${example ? ` If included in the installed release, the visual reference is /examples/${example.slug}; its renderer is src/components/example-publication.tsx and its styles are src/app/examples/examples.css. Use the design and colours above if the example route is unavailable.` : ""}

Preserve my posts and subscribers. Preserve Prisma data fetching, owner authentication, draft privacy, RSS, working subscription forms, and the separation between web publishing and email sending. Do not seed the example stories into my database. Keep the dashboard and email templates unchanged. Use the existing Google Fonts and scope custom CSS to .publication-site. Check keyboard navigation, 390px mobile layout, and npm run build. Show me a local preview before deployment.`;
}

export function examplePrompt(example: PublicationExample) {
  return designPrompt(example);
}

export function exampleCss(example: PublicationExample) {
  return `/* ${example.name}: colour and typography starter.
   Paste into src/themes/custom.css. Layout changes use React.
   Choose ${example.font} in Settings for the matching typeface. */
.publication-site {
  --publication-background: ${example.background};
  --publication-ink: ${example.ink};
  --publication-muted: ${example.muted};
  --publication-surface: ${example.surface};
  --publication-line: ${example.line};
  --accent: ${example.accent};
}
`;
}

export function exampleReact(example: PublicationExample) {
  return `// A presentational intro for your public homepage.
// Pass your existing publication data; keep the page's database query.
type Publication = { name: string; description: string; author: string };

export function PublicationIntro({ publication }: { publication: Publication }) {
  return (
    <section className="public-intro">
      <p className="eyebrow">Letters from {publication.author}</p>
      <h1>{publication.name}</h1>
      <p>{publication.description || ${JSON.stringify(example.description)}}</p>
    </section>
  );
}
`;
}
