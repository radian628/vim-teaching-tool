// adapted from https://github.com/Ckandyckainz/WebPageQuiz/blob/main/code.js
// async function randomWikipediaArticle(): Promise<string | undefined> {
//   return (
//     await (
//       await fetch(
//         "https://en.wikipedia.org/w/api.php?action=query&prop=info&list=random&formatversion=2&origin=*&format=json&rnnamespace=0"
//       )
//     ).json()
//   )?.query?.random?.[0];
// }

// export async function randomWikipediaSummary() {
//   const json = await (
//     await fetch("https://en.wikipedia.org/api/rest_v1/page/random/summary")
//   ).json();
//   console.log(json);
//   return json.extract
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "") as string;
// }

function splitAtNChars(str: string, n: number) {
  const splitStr = str.split(" ");

  let outstr = "";
  let chars = 0;
  for (const str of splitStr) {
    outstr += str + " ";
    chars += str.length;
    if (chars > n) {
      chars = 0;
      outstr += "\n";
    }
  }
  return outstr.slice(0, -1);
}

// export async function randomWikipediaSummarySplit() {
//   return splitAtNChars(await randomWikipediaSummary(), 60);
// }

export async function fetchRandomWikipediaArticleText() {
  return (
    Object.values(
      (
        await (
          await fetch(
            "https://en.wikipedia.org/w/api.php?origin=*&action=query&generator=random&format=json&grnnamespace=0&prop=extracts&explaintext",
            {
              headers: {
                "Api-User-Agent":
                  "VimTeachingTool/0 (https://github.com/radian628/vim-teaching-tool)",
              },
            }
          )
        ).json()
      ).query.pages
    )[0] as { extract: string }
  ).extract;
}

class RandomWikipediaSource {
  count: number;

  cache: Map<number, string> = new Map();

  constructor(count: number) {
    this.count = count;
  }

  async get(chars: number, bucket?: number): Promise<string> {
    if (chars === 0) return "";

    bucket = bucket ?? Math.floor(Math.random() * this.count);

    const cacheEntry = this.cache.get(bucket);

    if (!cacheEntry) {
      this.cache.set(bucket, await fetchRandomWikipediaArticleText());
      return await this.get(chars, bucket);
    }

    const text = cacheEntry.slice(0, chars);
    const remaining = cacheEntry.slice(chars);
    this.cache.set(bucket, remaining);
    return text + (await this.get(chars - text.length));
  }
}

const wikipediaRand = new RandomWikipediaSource(10);

async function getRandomWikipediaText(chars: number) {
  return await wikipediaRand.get(chars);
}

export async function getRandomFormattedWikipediaText(chars: number) {
  return splitAtNChars(await getRandomWikipediaText(chars), 60);
}
