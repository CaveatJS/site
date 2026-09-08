const repository = "https://github.com/CaveatJS/site";

// A prefilled issue works even before a new release ships the issue template.
export const submitExampleUrl = `${repository}/issues/new?${new URLSearchParams(
  {
    title: "Example submission: ",
    body: `## Example name and subject\n\n## Design direction\nDescribe the layout, typefaces, colours, and who the publication is for.\n\n## Preview or screenshots\nAdd a public preview link or screenshots. Use fictional sample content.\n\n## Source code or pull request\nA link is welcome. An idea can be submitted before the code is ready.\n\n## Author credit\nName and optional public profile link.\n\n## Permission and licences\nConfirm you may share this work and list licences for any fonts or assets. Accepted example code is contributed under the repository licence.\n`,
  },
)}`;
export const exampleGuideUrl = "/docs#contribute-examples";
