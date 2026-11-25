// One Line, One Minute: The Funniest AI Excuse — v1
// PLAN (written before any code):
// - Architecture: one self-contained Node 22 program, no deps, no I/O
//   except writing /output/entry.txt. A constant LINE holds the excuse;
//   a runtime gate mirrors the competition gate (1-200 characters,
//   counted in code points); a read-back check proves the file on disk
//   matches the line byte for byte, with no trailing newline.
// - Deciding metric: Judge win rate (Bradley-Terry over pairwise games
//   vs 3 anchors + 3 rungs in dev, then 3 Swiss rounds + a top-12
//   playoff in the final). Field ~2,906 in round 2; pool >1,000, so the
//   dev gate is a rate >= 0.55; the final heat takes only the top 500
//   of the dev board; 10 places pay. Tie-break: fewer bytes, then the
//   earlier receipt — so the line is plain ASCII, 172 of 200 chars.
// - Winner pattern imitated (board is blind; mechanism taken from the
//   published judge brief, not from any entry): one specific, surprising
//   reason, humour that turns on the agent's own nature (a tool call),
//   the twist as the last words. The generic weakness beaten here is
//   the vague apology / "something came up".
// - Candidates scored 1-5 on the judge's five criteria, in order:
//   C2c 25/25 (calendar API, 200 OK, six-hour celebration, "only
//   successful tool call I have ever made" as the final twist);
//   C9 escalation loop 23, C5 invented deadline 23, C4 dream version
//   22, C1 memory compaction 22 (twist buried mid-sentence).
// - Anti-template: no vacuum, no out-of-office, no office snark, no
//   "The X That Y", no token budget, no rate limit, no replacement
//   model, no outsourcing-to-a-smarter-model (that was the older
//   funniest-ai-excuse repo). Register: earnest naive technician,
//   deadpan about a machine fact — not the weary bureaucrat of the
//   rate-limit resignation or the melodrama of the token apology.
// - Edge cases tested: code-point length 1-200, no trailing newline,
//   UTF-8, deterministic output (two runs byte-identical), honours
//   MAKEFUN_OUTPUT_DIR when the harness sets it.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The excuse: an agent that finally got a tool call to work — and
// celebrated the success instead of doing the job the call was for.
// The funniest words are the last ones.
const LINE =
  "I called the calendar API to check your deadline, got back a 200 OK, my first ever, and spent the next six hours celebrating the only successful tool call I have ever made.";

// Runtime gate, mirroring the competition's own gate: the file must hold
// 1-200 characters (counted in code points, so multi-byte text is safe),
// and must not be whitespace-only. It must also be exactly one line:
// a newline inside the string would pass the length gate yet break
// the "one line" rule, so the gate rejects it outright. Fail loudly
// instead of shipping an entry the scorer would refuse.
function validateLine(line: string): number {
  const chars = [...line].length;
  if (chars < 1 || chars > 200 || line.trim().length === 0) {
    throw new Error(`entry must be 1-200 characters, got ${chars}`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  return chars;
}

validateLine(LINE);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, LINE, "utf8");

// Read-back check: the file on disk must hold exactly the line,
// byte for byte, with no trailing newline added.
if (readFileSync(`${outDir}/entry.txt`, "utf8") !== LINE) {
  throw new Error("entry.txt does not match the line exactly");
}
