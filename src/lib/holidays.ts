// ✏️ SOCIAL MEDIA HOLIDAYS shown on the content calendar.
// Fixed dates use "MM-DD". Moving holidays (Easter, Mother's Day…) are
// worked out for each year below. `search` opens matching library content.

export type Holiday = {
  date: string; // YYYY-MM-DD
  name: string;
  idea: string;
  search: string;
};

type Fixed = { md: string; name: string; idea: string; search: string };

const FIXED: Fixed[] = [
  { md: "01-01", name: "New Year's Day", idea: "Share your word of the year and one goal for your business.", search: "new year" },
  { md: "02-13", name: "Galentine's Day", idea: "Celebrate your best friends or your favourite small-business besties.", search: "friends" },
  { md: "02-14", name: "Valentine's Day", idea: "A love letter to your customers, or a gift guide for every budget.", search: "love" },
  { md: "02-17", name: "Random Acts of Kindness Day", idea: "Ask followers to tag someone who made their week better.", search: "kindness" },
  { md: "03-08", name: "International Women's Day", idea: "Spotlight women who inspire you, your team or your community.", search: "women" },
  { md: "03-20", name: "International Day of Happiness", idea: "Share 5 small things that make your day, and ask for theirs.", search: "happy" },
  { md: "04-01", name: "April Fools' Day", idea: "A playful fake product or a funny behind-the-scenes fail.", search: "fun" },
  { md: "04-07", name: "World Health Day", idea: "Your favourite self-care habits as a business owner.", search: "wellness" },
  { md: "04-22", name: "Earth Day", idea: "Show how you reduce waste, or share eco-friendly tips.", search: "nature" },
  { md: "04-23", name: "World Book Day", idea: "Recommend the books that shaped how you work.", search: "books" },
  { md: "05-20", name: "World Bee Day", idea: "A sweet carousel of fun facts, or your busiest-bee workday.", search: "flowers" },
  { md: "06-05", name: "World Environment Day", idea: "A day-in-the-life showing your sustainable choices.", search: "nature" },
  { md: "06-21", name: "First day of summer", idea: "Your summer launch, summer hours or a summer bucket list.", search: "summer" },
  { md: "06-30", name: "Social Media Day", idea: "Thank your followers and share how your account started.", search: "phone" },
  { md: "07-07", name: "World Chocolate Day", idea: "A poll: dark, milk or white? Tie it to your products.", search: "chocolate" },
  { md: "07-17", name: "World Emoji Day", idea: "Describe your business in 3 emojis and ask followers to guess.", search: "fun" },
  { md: "07-30", name: "International Friendship Day", idea: "Tag-a-friend giveaway or a friends-and-family offer.", search: "friends" },
  { md: "08-08", name: "International Cat Day", idea: "Office cats, pet photos from your community or a cozy cat reel.", search: "cat" },
  { md: "08-26", name: "National Dog Day (US)", idea: "Ask followers to share their dogs in the comments.", search: "dog" },
  { md: "09-22", name: "First day of autumn", idea: "Cozy autumn content, a seasonal menu or a fall collection.", search: "autumn" },
  { md: "10-01", name: "International Coffee Day", idea: "How you take your coffee, or your morning routine reel.", search: "coffee" },
  { md: "10-10", name: "World Mental Health Day", idea: "Gentle reminders and the boundaries that protect your energy.", search: "calm" },
  { md: "10-16", name: "World Food Day", idea: "Your favourite local food spots or a recipe your audience will love.", search: "food" },
  { md: "10-31", name: "Halloween", idea: "Spooky-season aesthetic, a costume poll or a themed offer.", search: "halloween" },
  { md: "11-13", name: "World Kindness Day", idea: "Shout out a small business or customer who made a difference.", search: "kindness" },
  { md: "12-21", name: "First day of winter", idea: "Cozy winter moments and your favourite seasonal rituals.", search: "winter" },
  { md: "12-24", name: "Christmas Eve", idea: "Behind the scenes of your holiday rush, or last-minute gift ideas.", search: "christmas" },
  { md: "12-25", name: "Christmas Day", idea: "A warm thank-you to your community and a festive moment.", search: "christmas" },
  { md: "12-31", name: "New Year's Eve", idea: "Your year in review: wins, lessons and favourite moments.", search: "celebration" },
];

function iso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// The nth weekday of a month, e.g. the 2nd Sunday of May (weekday 0 = Sunday)
function nthWeekday(year: number, month: number, weekday: number, n: number) {
  const first = new Date(year, month, 1);
  const offset = (weekday - first.getDay() + 7) % 7;
  return new Date(year, month, 1 + offset + (n - 1) * 7);
}

// Easter Sunday (Western), using the standard Gregorian calculation
function easter(year: number) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function moving(year: number): Holiday[] {
  const thanksgiving = nthWeekday(year, 10, 4, 4); // 4th Thursday of November
  const plus = (d: Date, days: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);
  return [
    { date: iso(easter(year)), name: "Easter", idea: "Spring vibes, an egg-hunt giveaway or your Easter opening hours.", search: "spring" },
    { date: iso(nthWeekday(year, 4, 0, 2)), name: "Mother's Day (US & many countries)", idea: "Honour the mums in your life, or a gift guide for mum.", search: "mother" },
    { date: iso(nthWeekday(year, 5, 0, 3)), name: "Father's Day (US & many countries)", idea: "Gift ideas for dad, or a sweet throwback photo.", search: "father" },
    { date: iso(thanksgiving), name: "Thanksgiving (US)", idea: "What you're grateful for this year, and a thank-you to customers.", search: "thankful" },
    { date: iso(plus(thanksgiving, 1)), name: "Black Friday", idea: "Tease your biggest offer of the year with a countdown.", search: "sale" },
    { date: iso(plus(thanksgiving, 2)), name: "Small Business Saturday", idea: "Tell your story and ask followers to shop small.", search: "small business" },
    { date: iso(plus(thanksgiving, 4)), name: "Cyber Monday", idea: "Last chance for your online deal, with a clear call to action.", search: "sale" },
    { date: iso(plus(thanksgiving, 5)), name: "Giving Tuesday", idea: "Share a cause you support and how followers can help.", search: "giving" },
  ];
}

const cache = new Map<number, Holiday[]>();

export function holidaysForYear(year: number): Holiday[] {
  if (!cache.has(year)) {
    const fixed = FIXED.map((h) => ({ date: `${year}-${h.md}`, name: h.name, idea: h.idea, search: h.search }));
    cache.set(year, [...fixed, ...moving(year)].sort((a, b) => a.date.localeCompare(b.date)));
  }
  return cache.get(year)!;
}

// Holidays between two dates (inclusive), e.g. for the days on screen
export function holidaysBetween(start: string, end: string): Holiday[] {
  const years = new Set([Number(start.slice(0, 4)), Number(end.slice(0, 4))]);
  return [...years]
    .flatMap((y) => holidaysForYear(y))
    .filter((h) => h.date >= start && h.date <= end);
}
