import { it, expect, describe, beforeEach } from 'vitest';
import { extractPostData } from './posts';

/*
LOCAL MOCK FORM OBJECT

`extractPostData()` expects a form-like object that provides a `.get()` method. In a real application this would typically be a `FormData` instance.

For the test we don't need a real FormData object, so we create a simple mock object that only implements the behavior the function relies on: returning values when `get('title')` or `get('content')` is called.
*/

const testTitle = 'Test title';
const testContent = 'Test content';
let testFormData;

describe('extractPostData()', () => {
  beforeEach(() => {
    testFormData = {
      title: testTitle,
      content: testContent,
      get(identifier) {
        return this[identifier];
      },
    };
  }); // This is placed in beforeEach in case we want to add more tests later. So anthing possibly changed is reset before the next test begins

  it('should extract title and content from the provided form data', () => {
    const data = extractPostData(testFormData);

    expect(data.title).toBe(testTitle);
    expect(data.content).toBe(testContent);
  });
});
