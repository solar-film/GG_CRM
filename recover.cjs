const fs = require('fs');
const readline = require('readline');

async function recover() {
  const fileStream = fs.createReadStream('C:\\Users\\Acer\\.gemini\\antigravity\\brain\\f1929547-185b-4afa-9b78-63661e7569b9\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lastContent = null;

  for await (const line of rl) {
    try {
      const parsed = JSON.parse(line);
      if (parsed.tool_calls) {
        for (const call of parsed.tool_calls) {
          if (call.name === 'write_to_file' || call.name === 'multi_replace_file_content') {
            const args = call.args;
            if (args.TargetFile && args.TargetFile.includes('DataForm.tsx')) {
              if (call.name === 'write_to_file' && args.CodeContent && !args.Description?.includes('43')) {
                lastContent = args.CodeContent;
              }
            }
          }
        }
      }
    } catch (e) {}
  }

  if (lastContent) {
    fs.writeFileSync('recovered_DataForm.tsx', lastContent);
    console.log('Recovered!');
  } else {
    console.log('Not found');
  }
}

recover();
