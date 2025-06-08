// This is a standalone script to test ODBC connection and list tables.

const odbc    = require('odbc');
const dotenv  = require('dotenv');
const readline = require('readline');
const path = require('path');
const { writeFile } = require('fs').promises;  // <-- destructure promise-based writeFile

// Look for .env file in the parent directory (project root)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DB_CONNECTION_STRING;
if (!connectionString) {
  console.error("FATAL ERROR: DB_CONNECTION_STRING is not defined in .env file.");
  process.exit(1);
}

function escapeCsvField(field) {
  if (field == null) return '';
  const str = String(field);
  return /[,\"\n]/.test(str)
    ? `"${str.replace(/"/g, '""')}"`
    : str;
}

async function getTableSchema() {
  let connection;
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  try {
    console.log('Attempting to connect …');
    connection = await odbc.connect(connectionString);
    console.log('Successfully connected to the database.');

    const tableName = await new Promise(r => rl.question('Enter the exact table name: ', r));
    if (!tableName.trim()) return rl.close();

    const csvFileName = await new Promise(r => rl.question('Enter CSV filename (e.g., schema.csv): ', r));
    if (!csvFileName.trim()) return rl.close();

    console.log(`Fetching schema for table: ${tableName}…`);
    const columns = await connection.columns(null, null, tableName.trim(), null);
    const pks     = await connection.primaryKeys(null, null, tableName.trim());
    const pkSet   = new Set(pks.map(pk => pk.COLUMN_NAME));

    if (!columns.length) {
      console.log(`No columns found for "${tableName}".`);
      return;
    }

    const headers = ['Column Name','Primary Key','Type','Size','Nullable']
      .map(escapeCsvField).join(',');
    const rows = [headers];

    columns.forEach(col => {
      const isPk = pkSet.has(col.COLUMN_NAME);
      console.log(`  ${col.COLUMN_NAME}${isPk?' (PK)':''}, ${col.TYPE_NAME}, size ${col.COLUMN_SIZE}, nullable ${col.NULLABLE===1?'YES':'NO'}`);
      rows.push([
        col.COLUMN_NAME,
        isPk ? 'YES' : 'NO',
        col.TYPE_NAME,
        col.COLUMN_SIZE,
        col.NULLABLE === 1 ? 'YES' : 'NO'
      ].map(escapeCsvField).join(','));
    });

    // Use promise-based writeFile
    await writeFile(csvFileName.trim(), rows.join('\n'));
    console.log(`Schema successfully exported to ${csvFileName.trim()}`);

  } catch (err) {
    console.error('Error during operation:', err);
  } finally {
    rl.close();
    if (connection) await connection.close();
  }
}

getTableSchema();
