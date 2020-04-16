import readFile from "./read-file";

const validFiles = /(\.fasta|\.fa)$/i;

async function processFiles(files) {
  for (const file of files) {
    if (!validFiles.test(file.name)) {
      throw new Error(`File ${file.name} is not supported. Supported files are: .fasta, or .fa`);
    }
  }

  const sequences = [];

  for (const file of files) {
    const fileTextContent = await readFile(file);
    const lines = fileTextContent.replace(/\n\r/g, "\n").split("\n");
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith(";")) {
        if (trimmedLine.startsWith(">")) {
          sequences.push({ file: file.name, name: trimmedLine.slice(1), sequence: "" });
        }
        else {
          sequences[sequences.length - 1].sequence += trimmedLine;
        }
      }
    }
  }

  return sequences;
}

export default function (files) {
  return (
    Promise.resolve(files)
      .then(processFiles)
  );
}
