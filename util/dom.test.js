// happy-dom is a DOM-supporting JavaScript environment for testing and server-side rendering. Adding it to our package.json test command allows us run our tests in an environment that simulates a browser, which is necessary for testing DOM manipulation and interactions.

import fs from 'fs';
import path from 'path';

import { it, vi } from 'vitest';
import { Window } from 'happy-dom';

import { showError } from './dom';

const htmlDocPath = path.join(process.cwd(), 'index.html');
const htmlDocumentContent = fs.readFileSync(htmlDocPath).toString();

const window = new Window();
const document = window.document;
document.write(htmlDocumentContent);

vi.stubGlobal('document', document);
// Now we've set up our virtual DOM

it('first test', () => {
  showError('test');
});
