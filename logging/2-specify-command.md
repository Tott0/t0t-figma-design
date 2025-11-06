/speckit.specify Build a tool used to extract information from a figma url, usually a design system and then reformat the obtained information into useful style specifications.

- Use of Claude MCP tool is expected to extract metadata and information directly from figma.

  - if not, it is also possible to directly input the obtained json downloaded from figma

- currently the tool is orientated towards generating plain html, using tailwind4 (this must be followed it is non negotiable)

## after some experiments I have defined some phases or progressive steps:

1. initial extraction from figma, obtain information related to styles/themes and then reformat in a single file with css format that tailwind4 expects (this file can then be imported agnostically to any tailwind4 using project)

  - expected theme variables should be following constants related to mainly, color, spacing, font styles, etc.
  - downloaded some information about theming from tailwindcss in @documentation/tailwindcss.txt

2. [POSTPONED OPTIONAL FOR THE FUTURE SINCE ITS A NEXTJS SPECIFIC COMMAND, ARCHIVING DO NOT PLAN FOR IT SAVE FOR FUTURE] based on the formatted (expected) perfect usable tailwind4 variables, generate common reusable components for future ui endeavors, right now the idea is to follow shadcn methodology (a series of ui components defined with some standards) but nothing is set in stone.

  - still in thinking phase will iterate over it later.
  - shadcn seems to have an mcp server
  - we can define a component variant as the sum of color size and some kind of variants (border, background, etc.) ideally mixing the existing theme variables generated in phase 1 we will be able to have a set of props to endlessly control the look of a component.
  - There's also a step to read figma design directly (for example related to buttons) that already defines all possible variants of an specific ui element (for example, rounded buttons, transparent buttons, icon buttons, etc.) the idea is to read that specific figma node knowing that it is of an specific ui component type (button, list, etc.) and then generate all variants matching the existing theme variables.

3. being able to ask the agent to generate an specific ui defined by a prompt.

  - the only constraint is that it should minimze free forming styles to absolute zero, every style should come from theme variables and reusable components.\* not using reusable components for now
  - it should directly generate ui in plain html but it is only allowed to use tailwind by default unless it is an extremely specific edge case, in which case user colaboration is required to decided if inline styles or theme upgrade is required.

4. After being able to generate individual components, another feature is to have a figma url pointing to a node that could define the design of an entire page, separate it in blocks that make semantic sense and start building it from the component foundation.

- The end result of all these steps right now is expected to be an agnostic self contained claude code command (/read-figma-and-make-theme for example, not actual name,)
- although agnostic probably these commands expect the previous command to be ran since that's the source of information, make some guardrails for that (checking if previous command was ran, if theme exists, if ui components exist, etc)
- All the commands should be iterative over themselves allowing for further refinement, for example in command 2, being able to translate theme to variants and figma designs to variants will be a continuous improvement process that can be repeated.
- Testing and unit testing expectations only affect actual generated ui components
