import { expect, it, vi } from 'vitest';
import { sendDataRequest } from './http';
import { HttpError } from './errors';

// fetch is not an imported module, so we can't replace it with mocking like we have done with some previous things eg fs. Because fetch is a global function, we replace it using stubGlobal() instead. The first parameter is the global method being replaced, and the second parameter is the replacement function. Which in this case, is a spy function.
// Note that vi.fn() with no custom code within is considered an empty spy function. When it does have implementation though like in this case, it is still a spy function, but now with mock implementation (not an empty spy)

const testResponseData = { testKey: 'testData' };

const testFetch = vi.fn((url, options) => {
  return new Promise((resolve, reject) => {
    if (typeof options.body !== 'string') {
      return reject('Not a string');
    }

    const testResponse = {
      ok: true,
      json() {
        return new Promise((resolve, reject) => {
          resolve(testResponseData);
        });
      },
    };
    resolve(testResponse);
  });
});

vi.stubGlobal('fetch', testFetch);

it('should return any available response data', async () => {
  const testData = { key: 'test' };

  // return expect(sendDataRequest(testData)).resolves.toEqual(testResponseData)

  // OR (with async)
  const result = await sendDataRequest(testData);

  expect(result).toEqual(testResponseData);
});

it('should convert the provided data to JSON before sending the request', async () => {
  const testData = { key: 'test' };
  let errorMessage;

  try {
    await sendDataRequest(testData);
  } catch (error) {
    errorMessage = error;
  }

  expect(errorMessage).not.toBe('Not a string');
});

it('should throw an HttpError in case of non-ok responses', () => {
  // Inside testFetch, we set ok to true. however for this specific test, we want it to be false. We can do that as so

  testFetch.mockImplementationOnce((url, options) => {
    return new Promise((resolve, reject) => {
      const testResponse = {
        ok: false,
        json() {
          return new Promise((resolve, reject) => {
            resolve(testResponseData);
          });
        },
      };
      resolve(testResponse);
    });
  });
  // We removed the 'if (typeof options.body....) part too because its not necessary for this test'

  const testData = { key: 'test' };

  return expect(sendDataRequest(testData)).rejects.toBeInstanceOf(HttpError);
});
